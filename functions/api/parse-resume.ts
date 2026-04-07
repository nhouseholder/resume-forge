// Cloudflare Function: AI resume parsing via OpenAI Structured Output
// Environment variable: OPENAI_API_KEY (set in Cloudflare dashboard)

interface Env {
  OPENAI_API_KEY: string
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

// Allow localhost during development
function isLocalDev(origin: string): boolean {
  return origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')
}

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || ''
  if (isLocalDev(origin)) {
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

function jsonResponse(body: unknown, init: ResponseInit, request: Request): Response {
  const headers = new Headers(init.headers)
  for (const [k, v] of Object.entries(corsHeaders(request))) {
    headers.set(k, v)
  }
  return new Response(JSON.stringify(body), { ...init, headers })
}

// Handle CORS preflight
export const onRequestOptions: PagesFunction<Env> = async ({ request }) => {
  return new Response(null, { status: 204, headers: corsHeaders(request) })
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  // Validate API key
  if (!env.OPENAI_API_KEY) {
    return jsonResponse({ error: 'OpenAI API key not configured' }, { status: 500 }, request)
  }

  // Parse request body
  let body: ParseRequest
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, { status: 400 }, request)
  }

  if (!body.text?.trim()) {
    return jsonResponse({ error: 'Missing or empty text field' }, { status: 400 }, request)
  }

  if (body.text.length > 50000) {
    return jsonResponse({ error: 'Text too long (max 50,000 characters)' }, { status: 400 }, request)
  }

  // Call OpenAI with structured output
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
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
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return jsonResponse(
        { error: `OpenAI error: ${response.status}`, details: err },
        { status: 502 },
        request,
      )
    }

    const result = await response.json()
    const content = result.choices?.[0]?.message?.content

    if (!content) {
      return jsonResponse({ error: 'Empty response from AI' }, { status: 502 }, request)
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(content)
    } catch {
      return jsonResponse({ error: 'Invalid JSON from AI' }, { status: 502 }, request)
    }

    return jsonResponse({ data: parsed }, { status: 200 }, request)
  } catch (err) {
    console.error('Parse error:', err)
    return jsonResponse({ error: 'Internal server error' }, { status: 500 }, request)
  }
}
