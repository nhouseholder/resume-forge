import { describe, expect, it } from 'vitest'
import type { ResumeData, ResumeMeta } from '../src/types/resume'
import {
  applyResumeEnhancement,
  buildResumeEnhancementRequest,
  hasEnhanceableContent,
} from '../src/utils/resumeEnhancement'

const sampleResume: ResumeData = {
  basics: {
    name: 'Jane Doe',
    label: 'Senior Product Designer',
    email: 'jane@example.com',
    summary: 'Design leader focused on editorial systems and product storytelling.',
  },
  work: [
    {
      name: 'Northstar Studio',
      position: 'Lead Designer',
      startDate: '2022-01',
      summary: 'Led product design across growth and editor surfaces.',
      highlights: ['Built design system adoption program', 'Shipped onboarding refresh for 3 products'],
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
  projects: [
    {
      name: 'Editorial OS',
      description: 'Internal tooling for editorial planning and publishing workflows.',
      highlights: ['Cut publishing setup time by standardizing page patterns'],
      tech: ['React', 'TypeScript'],
    },
  ],
}

const sampleMeta: ResumeMeta = {
  templateId: 'canvas',
  palette: 'terracotta',
  fontPairing: 'creative',
  layoutDensity: 'spacious',
  darkMode: false,
  sectionVisibility: {
    work: true,
    skills: true,
    projects: true,
  },
}

describe('resume enhancement utilities', () => {
  it('builds an enhancement request with template, palette, font, and field context', () => {
    const request = buildResumeEnhancementRequest(sampleResume, sampleMeta, 'creative')

    expect(request.context.templateName).toBe('Canvas')
    expect(request.context.templateDescription).toMatch(/Creative Expression/i)
    expect(request.context.paletteName).toBe('Terracotta')
    expect(request.context.fontPairingName).toBe('Creative')
    expect(request.context.fieldCategory).toBe('creative')
    expect(request.context.fieldRationale).toMatch(/Creative resumes use the Canvas template/i)
    expect(request.source.summary).toContain('Design leader')
    expect(request.source.work).toHaveLength(1)
    expect(request.source.projects).toHaveLength(1)
  })

  it('applies enhancement patches immutably to summary and highlight arrays', () => {
    const nextResume = applyResumeEnhancement(sampleResume, {
      summary: 'Product design leader shaping editorial systems, launch narratives, and brand-forward interfaces.',
      work: [
        {
          index: 0,
          highlights: [
            'Scaled a design system adoption program across three product squads.',
            'Directed a cross-product onboarding refresh that improved first-session clarity.',
          ],
        },
      ],
      projects: [
        {
          index: 0,
          highlights: ['Standardized editorial workflow primitives to reduce setup drag for new launches.'],
        },
      ],
    })

    expect(nextResume).not.toBe(sampleResume)
    expect(nextResume.basics.summary).toMatch(/Product design leader/i)
    expect(nextResume.work[0]?.highlights?.[0]).toMatch(/Scaled a design system adoption program/i)
    expect(nextResume.projects[0]?.highlights?.[0]).toMatch(/workflow primitives/i)

    expect(sampleResume.basics.summary).toContain('Design leader focused on editorial systems')
    expect(sampleResume.work[0]?.highlights?.[0]).toBe('Built design system adoption program')
  })

  it('reports whether a resume has enough content to enhance', () => {
    expect(hasEnhanceableContent(sampleResume)).toBe(true)

    const emptyResume: ResumeData = {
      basics: { name: 'Empty Example' },
      work: [],
      education: [],
      skills: [],
      publications: [],
      presentations: [],
      projects: [],
    }

    expect(hasEnhanceableContent(emptyResume)).toBe(false)
  })
})