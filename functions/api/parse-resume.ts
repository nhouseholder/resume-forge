// Cloudflare Function: AI resume parsing via OpenAI Structured Output
// Environment variable: OPENAI_API_KEY (set in Cloudflare dashboard)

interface Env {
  OPENAI_API_KEY: string
  ENVIRONMENT?: string
}

interface ParseRequest {
  text: string
}

// ── CORS ──

const ALLOWED_ORIGINS = [
  'https://resumeforge.pages.dev',
  'https://resume-builder.nicholashouseholder.pages.dev',
  'https://resume-forge-b73.pages.dev',
]

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_RETRY_DELAYS_MS = [200, 800]
const RETRYABLE_OPENAI_STATUS = new Set([429, 500, 502, 503, 504])
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 10
const rateLimitStore = new Map<string, { count: number; windowStart: number }>()

interface LoggerLike {
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
}

function isLocalDevOrigin(origin: string): boolean {
  return origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')
}

function isProductionEnvironment(env: Env): boolean {
  return (env.ENVIRONMENT ?? 'production').toLowerCase() === 'production'
}

export function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get('Origin') || ''
  if (origin && isLocalDevOrigin(origin) && !isProductionEnvironment(env)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    }
  }
  const allowed = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

function jsonResponse(body: unknown, init: ResponseInit, request: Request, env: Env): Response {
  const headers = new Headers(init.headers)
  for (const [k, v] of Object.entries(corsHeaders(request, env))) {
    headers.set(k, v)
  }
  return new Response(JSON.stringify(body), { ...init, headers })
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

function summarizeBody(body: string): string | undefined {
  const normalized = body.trim().replace(/\s+/g, ' ')
  return normalized ? normalized.slice(0, 240) : undefined
}

export async function requestOpenAIWithRetry(
  apiKey: string,
  payload: unknown,
  options?: {
    fetchImpl?: typeof fetch
    waitImpl?: (ms: number) => Promise<void>
    log?: LoggerLike
  },
): Promise<Response> {
  const fetchImpl = options?.fetchImpl ?? fetch
  const waitImpl = options?.waitImpl ?? wait
  const log = options?.log ?? console

  for (let attempt = 0; attempt <= OPENAI_RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      const response = await fetchImpl(OPENAI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        return response
      }

      const responseBody = summarizeBody(await response.clone().text().catch(() => ''))
      const canRetry = RETRYABLE_OPENAI_STATUS.has(response.status) && attempt < OPENAI_RETRY_DELAYS_MS.length

      if (canRetry) {
        log.warn('OpenAI request retry scheduled', {
          attempt: attempt + 1,
          status: response.status,
          responseBody,
        })
        await waitImpl(OPENAI_RETRY_DELAYS_MS[attempt])
        continue
      }

      log.error('OpenAI request failed', {
        attempt: attempt + 1,
        status: response.status,
        responseBody,
      })
      return response
    } catch (error) {
      const canRetry = attempt < OPENAI_RETRY_DELAYS_MS.length
      log.warn('OpenAI request threw an exception', {
        attempt: attempt + 1,
        canRetry,
        error: getErrorMessage(error),
      })

      if (!canRetry) {
        throw error
      }

      await waitImpl(OPENAI_RETRY_DELAYS_MS[attempt])
    }
  }

  throw new Error('OpenAI retry loop exited unexpectedly')
}

function getUserFacingOpenAIError(status: number): { error: string; status: number } {
  if (status === 429) {
    return {
      error: 'The AI parser is temporarily busy. Please wait a moment and try again.',
      status: 503,
    }
  }

  if (status >= 500) {
    return {
      error: 'The AI parsing service is temporarily unavailable. Please try again shortly.',
      status: 502,
    }
  }

  return {
    error: 'The AI parser could not process this resume. Please try again or use a simpler file.',
    status: 502,
  }
}

function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown-client'
  }

  return request.headers.get('cf-connecting-ip') ?? 'unknown-client'
}

export function checkRateLimit(
  identifier: string,
  now = Date.now(),
  store = rateLimitStore,
): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
      store.delete(key)
    }
  }

  const current = store.get(identifier)

  if (!current || now - current.windowStart >= RATE_LIMIT_WINDOW_MS) {
    store.set(identifier, { count: 1, windowStart: now })
    return { allowed: true }
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((RATE_LIMIT_WINDOW_MS - (now - current.windowStart)) / 1000)),
    }
  }

  current.count += 1
  store.set(identifier, current)
  return { allowed: true }
}

// Handle CORS preflight
export const onRequestOptions: PagesFunction<Env> = async ({ request, env }) => {
  return new Response(null, { status: 204, headers: corsHeaders(request, env) })
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  // Validate API key
  if (!env.OPENAI_API_KEY) {
    return jsonResponse({ error: 'OpenAI API key not configured' }, { status: 500 }, request, env)
  }

  const rateLimit = checkRateLimit(getClientIdentifier(request))
  if (!rateLimit.allowed) {
    return jsonResponse(
      { error: 'Too many parse attempts. Please wait a minute and try again.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSeconds),
        },
      },
      request,
      env,
    )
  }

  // Parse request body
  let body: ParseRequest
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, { status: 400 }, request, env)
  }

  if (!body.text?.trim()) {
    return jsonResponse({ error: 'Missing or empty text field' }, { status: 400 }, request, env)
  }

  if (body.text.length > 50000) {
    return jsonResponse({ error: 'Text too long (max 50,000 characters)' }, { status: 400 }, request, env)
  }

  // Call OpenAI with structured output
  try {
    const response = await requestOpenAIWithRetry(env.OPENAI_API_KEY, {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert resume parser. Extract structured data from resume text into JSON Resume format (extended).

Rules:
- Extract ALL sections present: basics, work, education, skills, publications, presentations, projects, volunteer, awards, certifications, languages, interests, references
- For academic resumes: extract publications (with DOI, PMID if found), presentations (type: poster or podium), research threads
- For tech resumes: extract projects with URLs, technologies, and descriptions
- Convert dates to ISO 8601 (YYYY-MM or YYYY-MM-DD). If only year is available, use YYYY-01.
- If a field is genuinely absent, omit it from the output (do not fabricate data)
- Preserve the original text as closely as possible — do not paraphrase descriptions
- Normalize skills into an array of { name, level } objects where level is one of: beginner, intermediate, advanced, expert, master
- Extract social profiles into basics.profiles[] with network and url fields`,
          },
          {
            role: 'user',
            content: body.text,
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'resume_data',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                basics: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    label: { type: 'string' },
                    email: { type: 'string' },
                    phone: { type: 'string' },
                    url: { type: 'string' },
                    summary: { type: 'string' },
                    location: {
                      type: 'object',
                      properties: {
                        city: { type: 'string' },
                        region: { type: 'string' },
                        countryCode: { type: 'string' },
                      },
                      required: [],
                    },
                    profiles: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          network: { type: 'string' },
                          username: { type: 'string' },
                          url: { type: 'string' },
                        },
                        required: ['network'],
                      },
                    },
                  },
                  required: ['name'],
                },
                work: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      position: { type: 'string' },
                      url: { type: 'string' },
                      startDate: { type: 'string' },
                      endDate: { type: 'string' },
                      summary: { type: 'string' },
                      highlights: { type: 'array', items: { type: 'string' } },
                    },
                    required: ['name', 'position'],
                  },
                },
                education: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      institution: { type: 'string' },
                      url: { type: 'string' },
                      area: { type: 'string' },
                      studyType: { type: 'string' },
                      startDate: { type: 'string' },
                      endDate: { type: 'string' },
                      score: { type: 'string' },
                    },
                    required: ['institution'],
                  },
                },
                skills: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      level: { type: 'string' },
                      keywords: { type: 'array', items: { type: 'string' } },
                    },
                    required: ['name'],
                  },
                },
                publications: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      publisher: { type: 'string' },
                      releaseDate: { type: 'string' },
                      url: { type: 'string' },
                      doi: { type: 'string' },
                      pmid: { type: 'string' },
                      summary: { type: 'string' },
                    },
                    required: ['name'],
                  },
                },
                presentations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      event: { type: 'string' },
                      date: { type: 'string' },
                      type: { type: 'string', enum: ['poster', 'podium', 'talk', 'workshop'] },
                      url: { type: 'string' },
                    },
                    required: ['title'],
                  },
                },
                projects: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      description: { type: 'string' },
                      url: { type: 'string' },
                      technologies: { type: 'array', items: { type: 'string' } },
                      startDate: { type: 'string' },
                      endDate: { type: 'string' },
                    },
                    required: ['name'],
                  },
                },
                volunteer: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      organization: { type: 'string' },
                      position: { type: 'string' },
                      url: { type: 'string' },
                      startDate: { type: 'string' },
                      endDate: { type: 'string' },
                      summary: { type: 'string' },
                    },
                    required: ['organization'],
                  },
                },
                awards: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      date: { type: 'string' },
                      awarder: { type: 'string' },
                      summary: { type: 'string' },
                    },
                    required: ['title'],
                  },
                },
                certifications: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      date: { type: 'string' },
                      url: { type: 'string' },
                      issuer: { type: 'string' },
                    },
                    required: ['name'],
                  },
                },
                languages: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      language: { type: 'string' },
                      fluency: { type: 'string' },
                    },
                    required: ['language'],
                  },
                },
                interests: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      keywords: { type: 'array', items: { type: 'string' } },
                    },
                    required: ['name'],
                  },
                },
                researchThreads: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      description: { type: 'string' },
                      publicationIndices: { type: 'array', items: { type: 'number' } },
                      presentationIndices: { type: 'array', items: { type: 'number' } },
                    },
                    required: ['name'],
                  },
                },
              },
              required: ['basics'],
              additionalProperties: false,
            },
          },
        },
        temperature: 0.1,
        max_tokens: 4000,
    })

    if (!response.ok) {
      const errorResponse = getUserFacingOpenAIError(response.status)
      return jsonResponse({ error: errorResponse.error }, { status: errorResponse.status }, request, env)
    }

    const result = await response.json()
    const content = result.choices?.[0]?.message?.content

    if (!content) {
      console.error('OpenAI response missing content', {
        requestId: request.headers.get('cf-ray') ?? 'unknown',
      })
      return jsonResponse({ error: 'The AI parser returned an empty response. Please try again.' }, { status: 502 }, request, env)
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(content)
    } catch {
      console.error('OpenAI response content was not valid JSON', {
        requestId: request.headers.get('cf-ray') ?? 'unknown',
      })
      return jsonResponse({ error: 'The AI parser returned an unreadable response. Please try again.' }, { status: 502 }, request, env)
    }

    return jsonResponse({ data: parsed }, { status: 200 }, request, env)
  } catch (err) {
    console.error('Parse error', {
      requestId: request.headers.get('cf-ray') ?? 'unknown',
      error: getErrorMessage(err),
    })
    return jsonResponse({ error: 'Internal server error' }, { status: 500 }, request, env)
  }
}
