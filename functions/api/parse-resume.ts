import { ResumeDataSchema, type InferredResumeData } from '../../src/schemas/resumeSchema'

// Cloudflare Function: AI resume parsing via Workers AI structured output

export interface WorkersAIBinding {
  run: (model: string, input: WorkersAIRunInput) => Promise<unknown>
}

interface Env {
  AI?: WorkersAIBinding
  CF_AI_PARSE_MODEL?: string
  ENVIRONMENT?: string
}

interface ParseRequest {
  text: string
}

interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
}

interface WorkersAIRunInput {
  messages: AIMessage[]
  response_format?: {
    type: 'json_object' | 'json_schema'
    json_schema?: {
      name: string
      strict?: boolean
      schema: Record<string, unknown>
    }
  }
  temperature?: number
  max_tokens?: number
}

// ── CORS ──

const ALLOWED_ORIGINS = [
  'https://resumeforge.pages.dev',
  'https://resume-builder.nicholashouseholder.pages.dev',
  'https://resume-forge-b73.pages.dev',
]

const DEFAULT_PARSE_MODEL = '@cf/qwen/qwen3-30b-a3b-fp8'
const AI_RETRY_DELAYS_MS = [200, 800]
const RETRYABLE_AI_STATUS = new Set([408, 429, 500, 502, 503, 504])
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

interface ParseResponse {
  ok: boolean
  data?: InferredResumeData
  error?: string
  requestId?: string
  retryAfter?: number
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

export function getAIErrorStatus(error: unknown): number | undefined {
  if (typeof error === 'object' && error !== null) {
    if ('status' in error && typeof error.status === 'number') {
      return error.status
    }

    if ('statusCode' in error && typeof error.statusCode === 'number') {
      return error.statusCode
    }

    if ('response' in error && typeof error.response === 'object' && error.response !== null) {
      const response = error.response as { status?: unknown }
      if (typeof response.status === 'number') {
        return response.status
      }
    }
  }

  const message = getErrorMessage(error).toLowerCase()
  const statusMatch = message.match(/\b(400|401|403|404|408|409|413|422|429|500|502|503|504)\b/)
  if (statusMatch) {
    return Number(statusMatch[1])
  }

  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 429
  }

  if (
    message.includes('temporarily unavailable')
    || message.includes('service unavailable')
    || message.includes('overloaded')
    || message.includes('capacity')
    || message.includes('timeout')
    || message.includes('timed out')
  ) {
    return 503
  }

  return undefined
}

function isRetryableAIError(error: unknown): boolean {
  const status = getAIErrorStatus(error)
  if (status !== undefined) {
    return RETRYABLE_AI_STATUS.has(status)
  }

  const message = getErrorMessage(error).toLowerCase()
  return (
    message.includes('temporarily unavailable')
    || message.includes('service unavailable')
    || message.includes('overloaded')
    || message.includes('capacity')
    || message.includes('timeout')
    || message.includes('timed out')
  )
}

export async function requestWorkersAIWithRetry(
  ai: WorkersAIBinding,
  model: string,
  payload: WorkersAIRunInput,
  options?: {
    waitImpl?: (ms: number) => Promise<void>
    log?: LoggerLike
  },
): Promise<unknown> {
  const waitImpl = options?.waitImpl ?? wait
  const log = options?.log ?? console

  for (let attempt = 0; attempt <= AI_RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      return await ai.run(model, payload)
    } catch (error) {
      const status = getAIErrorStatus(error)
      const canRetry = isRetryableAIError(error) && attempt < AI_RETRY_DELAYS_MS.length

      if (!canRetry) {
        log.error('Workers AI request failed', {
          attempt: attempt + 1,
          model,
          status,
          error: getErrorMessage(error),
        })
        throw error
      }

      log.warn('Workers AI request retry scheduled', {
        attempt: attempt + 1,
        model,
        status,
        error: getErrorMessage(error),
      })

      await waitImpl(AI_RETRY_DELAYS_MS[attempt])
    }
  }

  throw new Error('Workers AI retry loop exited unexpectedly')
}

export function extractAIContent(result: unknown): string | undefined {
  if (typeof result === 'string') {
    return result
  }

  if (typeof result !== 'object' || result === null) {
    return undefined
  }

  const envelope = result as {
    response?: unknown
    result?: unknown
    choices?: Array<{ message?: { content?: unknown }; text?: unknown }>
  }

  if (typeof envelope.response === 'string') {
    return envelope.response
  }

  if (envelope.result) {
    return extractAIContent(envelope.result)
  }

  const firstChoice = envelope.choices?.[0]
  if (typeof firstChoice?.message?.content === 'string') {
    return firstChoice.message.content
  }

  if (typeof firstChoice?.text === 'string') {
    return firstChoice.text
  }

  return undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const normalized = value.trim()
  return normalized || undefined
}

function pickString(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = asString(record[key])
    if (value) {
      return value
    }
  }

  return undefined
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined
  }

  const values = value
    .map((entry) => asString(entry))
    .filter((entry): entry is string => Boolean(entry))

  return values.length > 0 ? values : undefined
}

function normalizeLocation(value: unknown): InferredResumeData['basics']['location'] {
  if (typeof value === 'string') {
    const normalized = value.trim()
    if (!normalized) {
      return undefined
    }

    const parts = normalized.split(',').map((part) => part.trim()).filter(Boolean)
    if (parts.length === 2) {
      return {
        city: parts[0],
        region: parts[1],
      }
    }

    return { address: normalized }
  }

  if (!isRecord(value)) {
    return undefined
  }

  const location = {
    city: pickString(value, ['city', 'town']),
    region: pickString(value, ['region', 'state', 'province']),
    countryCode: pickString(value, ['countryCode', 'country']),
    address: pickString(value, ['address', 'street', 'line1']),
    postalCode: pickString(value, ['postalCode', 'zip', 'zipCode']),
  }

  return Object.values(location).some(Boolean) ? location : undefined
}

function normalizeProfile(value: unknown): InferredResumeData['basics']['profiles'] {
  if (!Array.isArray(value)) {
    return undefined
  }

  const profiles = value
    .map((entry) => {
      if (!isRecord(entry)) {
        return undefined
      }

      const network = pickString(entry, ['network', 'platform', 'name'])
      if (!network) {
        return undefined
      }

      return {
        network,
        username: pickString(entry, ['username', 'handle']),
        url: pickString(entry, ['url', 'link']),
        icon: pickString(entry, ['icon']),
      }
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))

  return profiles.length > 0 ? profiles : undefined
}

function normalizeObjectArray<T>(
  value: unknown,
  mapper: (entry: Record<string, unknown>) => T | undefined,
): T[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((entry) => (isRecord(entry) ? mapper(entry) : undefined))
    .filter((entry): entry is T => Boolean(entry))
}

function maybeArray<T>(value: T[]): T[] | undefined {
  return value.length > 0 ? value : undefined
}

function normalizeSkills(value: unknown): InferredResumeData['skills'] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((entry) => {
      if (typeof entry === 'string') {
        const name = asString(entry)
        return name ? { name } : undefined
      }

      if (!isRecord(entry)) {
        return undefined
      }

      const name = pickString(entry, ['name', 'skill'])
      if (!name) {
        return undefined
      }

      return {
        name,
        level: pickString(entry, ['level', 'proficiency']),
        keywords: asStringArray(entry.keywords),
      }
    })
    .filter((entry): entry is InferredResumeData['skills'][number] => Boolean(entry))
}

export function normalizeParsedResumeData(payload: unknown): InferredResumeData {
  if (!isRecord(payload)) {
    throw new Error('The AI parser did not return an object.')
  }

  const basicsRecord = isRecord(payload.basics) ? payload.basics : {}
  const normalized = {
    basics: {
      name: pickString(basicsRecord, ['name']),
      label: pickString(basicsRecord, ['label', 'title', 'headline']),
      email: pickString(basicsRecord, ['email']),
      phone: pickString(basicsRecord, ['phone']),
      url: pickString(basicsRecord, ['url', 'website']),
      summary: pickString(basicsRecord, ['summary', 'about']),
      location: normalizeLocation(basicsRecord.location),
      profiles: normalizeProfile(basicsRecord.profiles),
      photo: pickString(basicsRecord, ['photo', 'image']),
    },
    work: normalizeObjectArray(payload.work, (entry) => {
      const name = pickString(entry, ['name', 'company', 'employer', 'organization'])
      const position = pickString(entry, ['position', 'title', 'role'])

      if (!name || !position) {
        return undefined
      }

      return {
        name,
        position,
        startDate: pickString(entry, ['startDate']),
        endDate: pickString(entry, ['endDate']),
        summary: pickString(entry, ['summary', 'description']),
        highlights: asStringArray(entry.highlights) ?? asStringArray(entry.bullets),
        url: pickString(entry, ['url', 'website']),
        location: pickString(entry, ['location']),
      }
    }),
    education: normalizeObjectArray(payload.education, (entry) => {
      const institution = pickString(entry, ['institution', 'school', 'name'])
      if (!institution) {
        return undefined
      }

      return {
        institution,
        area: pickString(entry, ['area', 'field', 'major']),
        studyType: pickString(entry, ['studyType', 'degree', 'credential']),
        startDate: pickString(entry, ['startDate']),
        endDate: pickString(entry, ['endDate']),
        score: pickString(entry, ['score', 'gpa']),
        highlights: asStringArray(entry.highlights),
        url: pickString(entry, ['url', 'website']),
      }
    }),
    skills: normalizeSkills(payload.skills),
    publications: normalizeObjectArray(payload.publications, (entry) => {
      const name = pickString(entry, ['name', 'title'])
      if (!name) {
        return undefined
      }

      return {
        name,
        publisher: pickString(entry, ['publisher', 'journal']),
        releaseDate: pickString(entry, ['releaseDate', 'date']),
        url: pickString(entry, ['url', 'link']),
        summary: pickString(entry, ['summary', 'description']),
        doi: pickString(entry, ['doi']),
        pmid: pickString(entry, ['pmid']),
        volume: pickString(entry, ['volume']),
        pages: pickString(entry, ['pages']),
        type: pickString(entry, ['type']),
      }
    }),
    presentations: normalizeObjectArray(payload.presentations, (entry) => {
      const name = pickString(entry, ['name', 'title'])
      const conference = pickString(entry, ['conference', 'event'])

      if (!name || !conference) {
        return undefined
      }

      return {
        name,
        conference,
        date: pickString(entry, ['date']),
        location: pickString(entry, ['location']),
        type: pickString(entry, ['type']),
        summary: pickString(entry, ['summary', 'description']),
        url: pickString(entry, ['url', 'link']),
      }
    }),
    projects: normalizeObjectArray(payload.projects, (entry) => {
      const name = pickString(entry, ['name', 'title'])
      if (!name) {
        return undefined
      }

      return {
        name,
        description: pickString(entry, ['description', 'summary']),
        url: pickString(entry, ['url', 'link']),
        tech: asStringArray(entry.tech) ?? asStringArray(entry.technologies),
        startDate: pickString(entry, ['startDate']),
        endDate: pickString(entry, ['endDate']),
        highlights: asStringArray(entry.highlights),
        images: asStringArray(entry.images),
      }
    }),
    researchThreads: maybeArray(
      normalizeObjectArray(payload.researchThreads, (entry) => {
        const name = pickString(entry, ['name'])
        const summary = pickString(entry, ['summary', 'description'])

        if (!name || !summary) {
          return undefined
        }

        return {
          name,
          summary,
          keywords: asStringArray(entry.keywords) ?? [],
          publications: asStringArray(entry.publications),
          presentations: asStringArray(entry.presentations),
        }
      }),
    ),
    leadership: maybeArray(
      normalizeObjectArray(payload.leadership, (entry) => {
        const organization = pickString(entry, ['organization', 'name'])
        const role = pickString(entry, ['role', 'position', 'title'])

        if (!organization || !role) {
          return undefined
        }

        return {
          organization,
          role,
          startDate: pickString(entry, ['startDate']),
          endDate: pickString(entry, ['endDate']),
          summary: pickString(entry, ['summary', 'description']),
          highlights: asStringArray(entry.highlights),
          url: pickString(entry, ['url', 'website']),
        }
      }),
    ),
    volunteer: maybeArray(
      normalizeObjectArray(payload.volunteer, (entry) => {
        const organization = pickString(entry, ['organization', 'name'])
        const position = pickString(entry, ['position', 'role', 'title'])

        if (!organization || !position) {
          return undefined
        }

        return {
          organization,
          position,
          startDate: pickString(entry, ['startDate']),
          endDate: pickString(entry, ['endDate']),
          summary: pickString(entry, ['summary', 'description']),
          highlights: asStringArray(entry.highlights),
          url: pickString(entry, ['url', 'website']),
        }
      }),
    ),
    awards: maybeArray(
      normalizeObjectArray(payload.awards, (entry) => {
        const title = pickString(entry, ['title', 'name'])
        if (!title) {
          return undefined
        }

        return {
          title,
          date: pickString(entry, ['date']),
          awarder: pickString(entry, ['awarder', 'issuer']),
          summary: pickString(entry, ['summary', 'description']),
          url: pickString(entry, ['url', 'website']),
        }
      }),
    ),
    interests: maybeArray(
      normalizeObjectArray(payload.interests, (entry) => {
        const name = pickString(entry, ['name'])
        if (!name) {
          return undefined
        }

        return {
          name,
          keywords: asStringArray(entry.keywords),
        }
      }),
    ),
    references: maybeArray(
      normalizeObjectArray(payload.references, (entry) => {
        const name = pickString(entry, ['name'])
        if (!name) {
          return undefined
        }

        return {
          name,
          reference: pickString(entry, ['reference', 'summary']),
        }
      }),
    ),
  }

  if (!normalized.basics.name) {
    throw new Error('The AI parser did not return a candidate name.')
  }

  const validation = ResumeDataSchema.safeParse(normalized)
  if (!validation.success) {
    const summary = validation.error.issues
      .slice(0, 3)
      .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
      .join('; ')
    throw new Error(`The AI parser returned an invalid resume shape. ${summary}`)
  }

  return validation.data
}

function parseAIResumeResponse(result: unknown, requestId: string, model: string): InferredResumeData {
  const content = extractAIContent(result)

  if (!content) {
    console.error('Workers AI response missing content', {
      requestId,
      model,
    })
    throw new Error('The AI parser returned an empty response.')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    console.error('Workers AI response content was not valid JSON', {
      requestId,
      model,
      contentPreview: summarizeBody(content),
    })
    throw new Error('The AI parser returned an unreadable response.')
  }

  return normalizeParsedResumeData(parsed)
}

function buildFallbackParsePayload(text: string): WorkersAIRunInput {
  return {
    messages: [
      {
        role: 'system',
        content: `You are an expert resume parser.

Return only valid JSON.

Use this exact top-level structure when data exists:
- basics
- work
- education
- skills
- publications
- presentations
- projects
- volunteer
- awards
- certifications
- languages
- interests
- references
- researchThreads

Use these field names when possible:
- basics.name, basics.label, basics.email, basics.phone, basics.url, basics.summary
- basics.location.city, basics.location.region, basics.location.countryCode
- work[].name, work[].position, work[].startDate, work[].endDate, work[].summary, work[].highlights
- education[].institution, education[].studyType, education[].area
- skills[].name, skills[].level, skills[].keywords
- publications[].name, publications[].publisher, publications[].releaseDate
- presentations[].name, presentations[].conference, presentations[].date
- projects[].name, projects[].description, projects[].tech

Rules:
- Do not invent facts.
- Preserve the resume wording as closely as possible.
- Convert dates to YYYY-MM when possible.
- Prefer arrays for multi-item sections.
- If a section is absent, omit it or return an empty array.
- No markdown, no commentary, JSON only.`,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    response_format: {
      type: 'json_object',
    },
    temperature: 0.1,
    max_tokens: 4000,
  }
}

export function shouldFallbackParseMode(error: unknown): boolean {
  const status = getAIErrorStatus(error)
  return status === undefined || (status !== 429 && status < 500)
}

function getUserFacingAIError(status: number | undefined): { error: string; status: number } {
  if (status === 429) {
    return {
      error: 'The AI parser is temporarily busy. Please wait a moment and try again.',
      status: 503,
    }
  }

  if (status !== undefined && status >= 500) {
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
  if (!env.AI) {
    return jsonResponse(
      { ok: false, error: 'Workers AI binding not configured. Add an AI binding named AI in Cloudflare Pages and redeploy.' },
      { status: 500 },
      request,
      env,
    )
  }

  const rateLimit = checkRateLimit(getClientIdentifier(request))
  if (!rateLimit.allowed) {
    return jsonResponse(
      { ok: false, error: 'Too many parse attempts. Please wait a minute and try again.', retryAfter: rateLimit.retryAfterSeconds },
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
    return jsonResponse({ ok: false, error: 'Invalid JSON body' }, { status: 400 }, request, env)
  }

  if (!body.text?.trim()) {
    return jsonResponse({ ok: false, error: 'Missing or empty text field' }, { status: 400 }, request, env)
  }

  if (body.text.length > 50000) {
    return jsonResponse({ ok: false, error: 'Text too long (max 50,000 characters)' }, { status: 400 }, request, env)
  }

  const model = env.CF_AI_PARSE_MODEL?.trim() || DEFAULT_PARSE_MODEL
  const requestId = request.headers.get('cf-ray') ?? 'unknown'

  // Call Workers AI with structured output
  try {
    const result = await requestWorkersAIWithRetry(env.AI, model, {
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

    const normalized = parseAIResumeResponse(result, requestId, model)

    return jsonResponse({ ok: true, data: normalized, requestId }, { status: 200 }, request, env)
  } catch (err) {
    if (shouldFallbackParseMode(err)) {
      console.warn('Workers AI structured parse failed, retrying with json_object fallback', {
        requestId,
        model,
        error: getErrorMessage(err),
      })

      try {
        const fallbackResult = await requestWorkersAIWithRetry(env.AI, model, buildFallbackParsePayload(body.text))
        const normalized = parseAIResumeResponse(fallbackResult, requestId, model)

        return jsonResponse({ ok: true, data: normalized, requestId }, { status: 200 }, request, env)
      } catch (fallbackErr) {
        const fallbackResponse = getUserFacingAIError(getAIErrorStatus(fallbackErr))
        console.error('Workers AI parse fallback error', {
          requestId,
          model,
          error: getErrorMessage(fallbackErr),
        })
        return jsonResponse({ ok: false, error: fallbackResponse.error, requestId }, { status: fallbackResponse.status }, request, env)
      }
    }

    const errorResponse = getUserFacingAIError(getAIErrorStatus(err))
    console.error('Workers AI parse error', {
      requestId,
      model,
      error: getErrorMessage(err),
    })
    return jsonResponse({ ok: false, error: errorResponse.error, requestId }, { status: errorResponse.status }, request, env)
  }
}
