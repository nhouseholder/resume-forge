import { describe, expect, it, vi } from 'vitest'
import {
  checkRateLimit,
  corsHeaders,
  requestOpenAIWithRetry,
} from '../functions/api/parse-resume'

describe('parse-resume API helpers', () => {
  it('falls back to a production origin when localhost calls the API in production', () => {
    const request = new Request('https://resume-forge-b73.pages.dev/api/parse-resume', {
      headers: {
        Origin: 'http://localhost:5173',
      },
    })

    const headers = corsHeaders(request, {
      OPENAI_API_KEY: 'test-key',
      ENVIRONMENT: 'production',
    })

    expect(headers['Access-Control-Allow-Origin']).toBe('https://resumeforge.pages.dev')
  })

  it('allows localhost origins during development', () => {
    const request = new Request('http://localhost:5173/api/parse-resume', {
      headers: {
        Origin: 'http://localhost:5173',
      },
    })

    const headers = corsHeaders(request, {
      OPENAI_API_KEY: 'test-key',
      ENVIRONMENT: 'development',
    })

    expect(headers['Access-Control-Allow-Origin']).toBe('http://localhost:5173')
  })

  it('retries transient OpenAI failures before succeeding', async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'busy' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

    const waitImpl = vi.fn<(_ms: number) => Promise<void>>().mockResolvedValue(undefined)
    const log = {
      warn: vi.fn(),
      error: vi.fn(),
    }

    const response = await requestOpenAIWithRetry('test-key', { hello: 'world' }, {
      fetchImpl,
      waitImpl,
      log,
    })

    expect(fetchImpl).toHaveBeenCalledTimes(2)
    expect(waitImpl).toHaveBeenCalledTimes(1)
    expect(waitImpl).toHaveBeenCalledWith(200)
    expect(response.status).toBe(200)
  })

  it('does not retry non-retryable OpenAI failures', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ error: 'bad request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const waitImpl = vi.fn<(_ms: number) => Promise<void>>().mockResolvedValue(undefined)

    const response = await requestOpenAIWithRetry('test-key', { hello: 'world' }, {
      fetchImpl,
      waitImpl,
      log: {
        warn: vi.fn(),
        error: vi.fn(),
      },
    })

    expect(fetchImpl).toHaveBeenCalledTimes(1)
    expect(waitImpl).not.toHaveBeenCalled()
    expect(response.status).toBe(400)
  })

  it('blocks requests that exceed the in-memory parse budget within the active window', () => {
    const store = new Map<string, { count: number; windowStart: number }>()
    const now = 1_000

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const result = checkRateLimit('203.0.113.5', now, store)
      expect(result.allowed).toBe(true)
    }

    const blocked = checkRateLimit('203.0.113.5', now + 500, store)
    expect(blocked.allowed).toBe(false)
    if (blocked.allowed) {
      throw new Error('Expected rate limit to block the 11th request')
    }

    expect(blocked.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('resets the in-memory parse budget after the rate-limit window expires', () => {
    const store = new Map<string, { count: number; windowStart: number }>()
    const now = 2_000

    for (let attempt = 0; attempt < 10; attempt += 1) {
      checkRateLimit('198.51.100.8', now, store)
    }

    const afterWindow = checkRateLimit('198.51.100.8', now + 61_000, store)
    expect(afterWindow.allowed).toBe(true)
  })
})