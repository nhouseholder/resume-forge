import type { FieldCategory, ResumeData, ResumeMeta } from '../../src/types/resume'
import {
  buildResumeEnhancementRequest,
  hasEnhanceableContent,
  type ResumeEnhancementPatch,
} from '../../src/utils/resumeEnhancement'
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

interface EnhanceRequest {
  resume: ResumeData
  meta: ResumeMeta
  fieldCategory?: FieldCategory | null
}

interface AIEnhancementResponse {
  summary?: string
  work?: Array<{ index: number; highlights: string[] }>
  projects?: Array<{ index: number; highlights: string[] }>
}

const enhanceRateLimitStore = new Map<string, { count: number; windowStart: number }>()
const DEFAULT_ENHANCE_MODEL = '@cf/qwen/qwen3-30b-a3b-fp8'

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

function sanitizePatch(payload: AIEnhancementResponse): ResumeEnhancementPatch {
  return {
    summary: payload.summary?.trim(),
    work: (payload.work ?? [])
      .map((entry) => ({
        index: entry.index,
        highlights: entry.highlights.map((highlight) => highlight.trim()).filter(Boolean),
      }))
      .filter((entry) => entry.highlights.length > 0),
    projects: (payload.projects ?? [])
      .map((entry) => ({
        index: entry.index,
        highlights: entry.highlights.map((highlight) => highlight.trim()).filter(Boolean),
      }))
      .filter((entry) => entry.highlights.length > 0),
  }
}

function getEnhancementError(status: number): { error: string; status: number } {
  if (status === 429) {
    return {
      error: 'The resume polish assistant is temporarily busy. Please wait a moment and try again.',
      status: 503,
    }
  }

  if (status >= 500) {
    return {
      error: 'The resume polish assistant is temporarily unavailable. Please try again shortly.',
      status: 502,
    }
  }

  return {
    error: 'The resume polish request could not be completed. Please revise the content and try again.',
    status: 502,
  }
}

// Handle CORS preflight
export const onRequestOptions: PagesFunction<Env> = async ({ request, env }) => {
  return new Response(null, { status: 204, headers: corsHeaders(request, env) })
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  if (!env.AI) {
    return jsonResponse(
      { error: 'Workers AI binding not configured. Add an AI binding named AI in Cloudflare Pages and redeploy.' },
      { status: 500 },
      request,
      env,
    )
  }

  const rateLimit = checkRateLimit(getClientIdentifier(request), Date.now(), enhanceRateLimitStore)
  if (!rateLimit.allowed) {
    return jsonResponse(
      { error: 'Too many AI polish attempts. Please wait a minute and try again.' },
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

  let body: EnhanceRequest
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, { status: 400 }, request, env)
  }

  if (!body.resume || !body.meta) {
    return jsonResponse({ error: 'Missing resume or design metadata' }, { status: 400 }, request, env)
  }

  if (!hasEnhanceableContent(body.resume)) {
    return jsonResponse(
      { error: 'Add a summary or bullet highlights before requesting AI polish.' },
      { status: 400 },
      request,
      env,
    )
  }

  const enhancementRequest = buildResumeEnhancementRequest(body.resume, body.meta, body.fieldCategory ?? null)
  const model = env.CF_AI_ENHANCE_MODEL?.trim() || DEFAULT_ENHANCE_MODEL

  try {
    const result = await requestWorkersAIWithRetry(env.AI, model, {
      messages: [
        {
          role: 'system',
          content: `You are an elite resume editor.

Rules:
- Rewrite only the provided summary and bullet highlights.
- Never invent employers, titles, dates, metrics, technologies, awards, publications, or responsibilities.
- Preserve the candidate's factual claims while making the language tighter, more strategic, and more credible.
- Keep the output ATS-safe: no emojis, no special formatting, no decorative punctuation.
- Use the design context to tune tone, not to fabricate content.
- Return only valid JSON that matches the schema.`,
        },
        {
          role: 'user',
          content: JSON.stringify(enhancementRequest),
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'resume_enhancement',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              summary: { type: 'string' },
              work: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    index: { type: 'integer' },
                    highlights: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                  required: ['index', 'highlights'],
                  additionalProperties: false,
                },
              },
              projects: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    index: { type: 'integer' },
                    highlights: {
                      type: 'array',
                      items: { type: 'string' },
                    },
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
      return jsonResponse(
        { error: 'The resume polish assistant returned an empty response.' },
        { status: 502 },
        request,
        env,
      )
    }

    let parsed: AIEnhancementResponse
    try {
      parsed = JSON.parse(content) as AIEnhancementResponse
    } catch {
      return jsonResponse(
        { error: 'The resume polish assistant returned an unreadable response.' },
        { status: 502 },
        request,
        env,
      )
    }

    const data = sanitizePatch(parsed)

    return jsonResponse({ data, model }, { status: 200 }, request, env)
  } catch (error) {
    const friendlyError = getEnhancementError(getAIErrorStatus(error) ?? 502)
    return jsonResponse(
      { error: friendlyError.error },
      { status: friendlyError.status },
      request,
      env,
    )
  }
}