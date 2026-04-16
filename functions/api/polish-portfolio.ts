import type { FieldCategory, ResumeData } from '../../src/types/resume'
import {
  buildPortfolioPolishRequest,
  hasPolishableContent,
  type PortfolioPolishPatch,
} from '../../src/utils/portfolioPolish'
import {
  checkRateLimit,
  corsHeaders,
  extractAIContent,
  getAIErrorStatus,
  requestWorkersAIWithRetry,
} from './parse-resume'

interface Env {
  AI?: import('./parse-resume').WorkersAIBinding
  CF_AI_ENHANCE_MODEL?: string
  ENVIRONMENT?: string
}

interface PolishRequest {
  resume: ResumeData
  fieldCategory?: FieldCategory | null
}

interface AIPolishResponse {
  summary?: string
  projects?: Array<{ index: number; description?: string; highlights?: string[] }>
  work?: Array<{ index: number; highlights?: string[] }>
}

const polishRateLimitStore = new Map<string, { count: number; windowStart: number }>()
const DEFAULT_POLISH_MODEL = '@cf/qwen/qwen3-30b-a3b-fp8'

function jsonResponse(body: unknown, init: ResponseInit, request: Request, env: Env): Response {
  const headers = new Headers(init.headers)
  for (const [key, value] of Object.entries(corsHeaders(request, env))) {
    headers.set(key, value)
  }
  return new Response(JSON.stringify(body), { ...init, headers })
}

function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown-client'
  }
  return request.headers.get('cf-connecting-ip') ?? 'unknown-client'
}

function sanitizePatch(payload: AIPolishResponse): PortfolioPolishPatch {
  return {
    summary: payload.summary?.trim() || undefined,
    projects: (payload.projects ?? [])
      .map((entry) => ({
        index: entry.index,
        description: entry.description?.trim() || undefined,
        highlights: (entry.highlights ?? []).map((h) => h.trim()).filter(Boolean),
      }))
      .filter((entry) => entry.description || (entry.highlights?.length ?? 0) > 0),
    work: (payload.work ?? [])
      .map((entry) => ({
        index: entry.index,
        highlights: (entry.highlights ?? []).map((h) => h.trim()).filter(Boolean),
      }))
      .filter((entry) => (entry.highlights?.length ?? 0) > 0),
  }
}

export const onRequestOptions: PagesFunction<Env> = async ({ request, env }) => {
  return new Response(null, { status: 204, headers: corsHeaders(request, env) })
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  if (!env.AI) {
    return jsonResponse(
      { ok: false, error: 'Workers AI binding not configured.' },
      { status: 500 },
      request,
      env,
    )
  }

  const rateLimit = checkRateLimit(getClientIdentifier(request), Date.now(), polishRateLimitStore)
  if (!rateLimit.allowed) {
    return jsonResponse(
      { ok: false, error: 'Too many portfolio polish attempts. Please wait a minute and try again.', retryAfter: rateLimit.retryAfterSeconds },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
      request,
      env,
    )
  }

  let body: PolishRequest
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON body' }, { status: 400 }, request, env)
  }

  if (!body.resume) {
    return jsonResponse({ ok: false, error: 'Missing resume data' }, { status: 400 }, request, env)
  }

  if (!hasPolishableContent(body.resume)) {
    return jsonResponse(
      { ok: false, error: 'Add a summary, project descriptions, or bullet highlights before requesting a portfolio polish.' },
      { status: 400 },
      request,
      env,
    )
  }

  const polishRequest = buildPortfolioPolishRequest(body.resume, body.fieldCategory ?? null)
  const model = env.CF_AI_ENHANCE_MODEL?.trim() || DEFAULT_POLISH_MODEL
  const requestId = request.headers.get('cf-ray') ?? 'unknown'

  try {
    const result = await requestWorkersAIWithRetry(env.AI, model, {
      messages: [
        {
          role: 'system',
          content: `You are a portfolio copy editor specializing in developer and researcher portfolios.

Rules:
- Rewrite only what is provided. Never invent employers, projects, technologies, metrics, or facts.
- Professional summary: rewrite as a compelling first-person web copy paragraph (2-3 sentences, distinctive, specific, non-generic).
- Project descriptions: rewrite as outcome-focused mini case studies (what it does, what you built, why it matters).
- Bullet highlights: tighten for impact and clarity; favor outcome language over process language.
- Tone: warm but credible, suitable for a public portfolio website. Not ATS-optimized.
- Return only valid JSON that matches the schema.`,
        },
        {
          role: 'user',
          content: JSON.stringify(polishRequest),
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'portfolio_polish',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              summary: { type: 'string' },
              projects: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    index: { type: 'integer' },
                    description: { type: 'string' },
                    highlights: { type: 'array', items: { type: 'string' } },
                  },
                  required: ['index'],
                  additionalProperties: false,
                },
              },
              work: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    index: { type: 'integer' },
                    highlights: { type: 'array', items: { type: 'string' } },
                  },
                  required: ['index', 'highlights'],
                  additionalProperties: false,
                },
              },
            },
            required: [],
            additionalProperties: false,
          },
        },
      },
    })

    const content = extractAIContent(result)
    if (!content) {
      console.error('Workers AI portfolio polish: missing content', { requestId, model })
      return jsonResponse(
        { ok: false, error: 'The portfolio polish assistant returned an empty response.', requestId },
        { status: 502 },
        request,
        env,
      )
    }

    let parsed: AIPolishResponse
    try {
      parsed = JSON.parse(content) as AIPolishResponse
    } catch {
      console.error('Workers AI portfolio polish: invalid JSON', { requestId, model })
      return jsonResponse(
        { ok: false, error: 'The portfolio polish assistant returned an unreadable response.', requestId },
        { status: 502 },
        request,
        env,
      )
    }

    const data = sanitizePatch(parsed)
    return jsonResponse({ ok: true, data, model, requestId }, { status: 200 }, request, env)
  } catch (error) {
    const originalStatus = getAIErrorStatus(error)
    const status = originalStatus === 429 ? 503 : 502
    const message = originalStatus === 429
      ? 'The portfolio polish assistant is temporarily busy. Please wait a moment and try again.'
      : 'The portfolio polish assistant is temporarily unavailable. Please try again shortly.'
    console.error('Workers AI portfolio polish error', {
      requestId, model, status: originalStatus,
      error: error instanceof Error ? error.message : String(error),
    })
    return jsonResponse({ ok: false, error: message, requestId }, { status }, request, env)
  }
}
