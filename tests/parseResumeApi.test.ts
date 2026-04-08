import { describe, expect, it, vi } from 'vitest'
import { ResumeDataSchema } from '../src/schemas/resumeSchema'
import {
  checkRateLimit,
  corsHeaders,
  extractAIContent,
  normalizeParsedResumeData,
  requestWorkersAIWithRetry,
} from '../functions/api/parse-resume'

describe('parse-resume API helpers', () => {
  it('falls back to a production origin when localhost calls the API in production', () => {
    const request = new Request('https://resume-forge-b73.pages.dev/api/parse-resume', {
      headers: {
        Origin: 'http://localhost:5173',
      },
    })

    const headers = corsHeaders(request, {
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
      ENVIRONMENT: 'development',
    })

    expect(headers['Access-Control-Allow-Origin']).toBe('http://localhost:5173')
  })

  it('retries transient Workers AI failures before succeeding', async () => {
    const ai = {
      run: vi
        .fn()
        .mockRejectedValueOnce(new Error('503 service temporarily unavailable'))
        .mockResolvedValueOnce({ response: '{"ok":true}' }),
    }

    const waitImpl = vi.fn<(_ms: number) => Promise<void>>().mockResolvedValue(undefined)
    const log = {
      warn: vi.fn(),
      error: vi.fn(),
    }

    const result = await requestWorkersAIWithRetry(ai, '@cf/qwen/qwen3-30b-a3b-fp8', {
      messages: [{ role: 'user', content: 'hello' }],
    }, {
      waitImpl,
      log,
    })

    expect(ai.run).toHaveBeenCalledTimes(2)
    expect(waitImpl).toHaveBeenCalledTimes(1)
    expect(waitImpl).toHaveBeenCalledWith(200)
    expect(result).toEqual({ response: '{"ok":true}' })
  })

  it('does not retry non-retryable Workers AI failures', async () => {
    const ai = {
      run: vi.fn().mockRejectedValue(new Error('400 invalid request payload')),
    }

    const waitImpl = vi.fn<(_ms: number) => Promise<void>>().mockResolvedValue(undefined)

    await expect(
      requestWorkersAIWithRetry(ai, '@cf/qwen/qwen3-30b-a3b-fp8', {
        messages: [{ role: 'user', content: 'hello' }],
      }, {
        waitImpl,
        log: {
          warn: vi.fn(),
          error: vi.fn(),
        },
      }),
    ).rejects.toThrow('400 invalid request payload')

    expect(ai.run).toHaveBeenCalledTimes(1)
    expect(waitImpl).not.toHaveBeenCalled()
  })

  it('extracts JSON text from Workers AI response envelopes', () => {
    expect(extractAIContent({ response: '{"hello":"world"}' })).toBe('{"hello":"world"}')
    expect(
      extractAIContent({
        choices: [{ message: { content: '{"fallback":true}' } }],
      }),
    ).toBe('{"fallback":true}')
  })

  it('normalizes common Workers AI aliases into the app resume schema', () => {
    const normalized = normalizeParsedResumeData({
      basics: {
        name: 'Jane Doe',
        title: 'Senior Product Designer',
        email: 'jane@example.com',
        location: 'Austin, TX',
      },
      work: [
        {
          company: 'Acme Corp',
          position: 'Senior Product Designer',
          startDate: '2022-01',
          endDate: 'present',
          summary: 'Led onboarding redesign.',
          highlights: ['Partnered with engineering on design system updates.'],
        },
      ],
      education: [
        {
          school: 'University of Texas',
          degree: 'B.A. Design',
        },
      ],
      skills: ['Figma', 'Design Systems'],
      presentations: [
        {
          title: 'Designing Better Onboarding',
          event: 'Config',
        },
      ],
      projects: [
        {
          name: 'Resume Forge',
          technologies: ['React', 'TypeScript'],
        },
      ],
    })

    const result = ResumeDataSchema.safeParse(normalized)

    expect(result.success).toBe(true)
    expect(normalized.basics.label).toBe('Senior Product Designer')
    expect(normalized.basics.location).toEqual({ city: 'Austin', region: 'TX' })
    expect(normalized.work[0]).toMatchObject({
      name: 'Acme Corp',
      position: 'Senior Product Designer',
    })
    expect(normalized.education[0]).toMatchObject({
      institution: 'University of Texas',
      studyType: 'B.A. Design',
    })
    expect(normalized.skills).toEqual([
      { name: 'Figma' },
      { name: 'Design Systems' },
    ])
    expect(normalized.presentations?.[0]).toMatchObject({
      name: 'Designing Better Onboarding',
      conference: 'Config',
    })
    expect(normalized.projects[0].tech).toEqual(['React', 'TypeScript'])
    expect(normalized.publications).toEqual([])
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