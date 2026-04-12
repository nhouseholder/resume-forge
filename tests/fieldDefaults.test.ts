import { describe, expect, it } from 'vitest'
import type { ResumeMeta } from '../src/types/resume'
import { applyFieldDefaults, getFieldDefaults, getFieldDefaultsRationale } from '../src/utils/fieldDefaults'

const baseMeta: ResumeMeta = {
  templateId: 'meridian',
  palette: 'deep-navy',
  fontPairing: 'editorial-classic',
  layoutDensity: 'balanced',
  darkMode: false,
  sectionVisibility: {
    work: true,
    education: true,
    skills: true,
  },
}

describe('field defaults', () => {
  it('promotes academic resumes to the archive treatment', () => {
    expect(getFieldDefaults('academic')).toMatchObject({
      templateId: 'archive',
      palette: 'vellum-rose',
      fontPairing: 'portfolio-editorial',
    })

    expect(getFieldDefaultsRationale('academic')).toMatch(/Archive template/i)
  })

  it('uses the same premium defaults for business resumes unless the user has customized', () => {
    const nextMeta = applyFieldDefaults(baseMeta, 'business')

    expect(nextMeta.templateId).toBe('archive')
    expect(nextMeta.palette).toBe('vellum-rose')
    expect(nextMeta.fontPairing).toBe('portfolio-editorial')

    const customizedMeta = applyFieldDefaults(baseMeta, 'business', true)
    expect(customizedMeta).toBe(baseMeta)
  })
})