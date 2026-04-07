import { describe, expect, it } from 'vitest'
import type { ResumeData, ResumeMeta } from '../src/types/resume'
import {
  buildSharedResumeUrl,
  decodeSharedResumePayload,
} from '../src/components/export/shareExporter'

const sampleResume: ResumeData = {
  basics: {
    name: 'Jane Doe',
    label: 'Senior Product Designer',
    email: 'jane@example.com',
    summary: 'Design leader focused on complex product systems.',
  },
  work: [
    {
      name: 'Northstar Studio',
      position: 'Lead Designer',
      startDate: '2022-01',
      summary: 'Led product design across growth and editor surfaces.',
      highlights: ['Built design system adoption program'],
    },
  ],
  education: [],
  skills: [
    {
      name: 'Product Design',
      keywords: ['Figma', 'Research', 'Design Systems'],
    },
  ],
  publications: [],
  presentations: [],
  projects: [],
}

const sampleMeta: ResumeMeta = {
  templateId: 'canvas',
  palette: 'deep-navy',
  fontPairing: 'editorial-classic',
  layoutDensity: 'balanced',
  darkMode: false,
  sectionVisibility: {
    work: true,
    skills: true,
  },
}

describe('shareExporter', () => {
  it('round-trips a shared resume payload through a URL', () => {
    const result = buildSharedResumeUrl({
      resume: sampleResume,
      meta: sampleMeta,
      origin: 'https://resume-forge-b73.pages.dev',
    })

    expect(result.ok).toBe(true)
    if (!result.ok) {
      throw new Error(`Expected share URL to build, got: ${result.error}`)
    }

    expect(result.url).toContain('/view/')

    const encoded = result.url.split('/view/')[1]
    expect(encoded).toBeTruthy()

    const decoded = decodeSharedResumePayload(encoded)
    expect(decoded.ok).toBe(true)
    if (!decoded.ok) {
      throw new Error(`Expected payload to decode, got: ${decoded.error}`)
    }

    expect(decoded.payload.resume.basics.name).toBe('Jane Doe')
    expect(decoded.payload.meta.templateId).toBe('canvas')
  })

  it('rejects corrupted share payloads', () => {
    const decoded = decodeSharedResumePayload('definitely-not-a-valid-payload')

    expect(decoded.ok).toBe(false)
    if (decoded.ok) {
      throw new Error('Expected payload decode to fail for corrupted data')
    }

    expect(decoded.error).toMatch(/invalid|read|supported/i)
  })

  it('rejects payloads that exceed the client-side URL budget', () => {
    const oversizedResume: ResumeData = {
      ...sampleResume,
      projects: Array.from({ length: 80 }, (_, index) => ({
        name: `Project ${index}`,
        description: `A very detailed case study ${index} ${'x'.repeat(140)} ${index}`,
        tech: ['React', 'TypeScript', `Library-${index}`],
        highlights: Array.from({ length: 4 }, (_, bullet) => `Highlight ${index}-${bullet} ${'y'.repeat(60)}`),
      })),
    }

    const result = buildSharedResumeUrl({
      resume: oversizedResume,
      meta: sampleMeta,
      origin: 'https://resume-forge-b73.pages.dev',
    })

    expect(result.ok).toBe(false)
    if (result.ok) {
      throw new Error('Expected oversized share URL generation to fail')
    }

    expect(result.error).toMatch(/too large|too long/i)
  })
})