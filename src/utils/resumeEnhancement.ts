import { FONT_PAIRING_MAP, type FontPairing } from '../design/fontPairings'
import { PALETTE_MAP, type Palette } from '../design/palettes'
import { getTemplateBrief, type TemplateBrief } from '../design/templateBriefs'
import type { FieldCategory, ResumeData, ResumeMeta } from '../types/resume'
import { getFieldDefaultsRationale } from './fieldDefaults'

export interface ResumeEnhancementContext {
  templateId: string
  templateName: string
  templateDescription: string
  templateVoice: string
  templateFocusAreas: string[]
  paletteName: string
  paletteDescription: string
  fontPairingName: string
  fontPairingDescription: string
  fieldCategory: FieldCategory | null
  fieldRationale: string | null
}

export interface ResumeEnhancementSourceEntry {
  index: number
  title: string
  subtitle: string
  highlights: string[]
}

export interface ResumeEnhancementRequest {
  context: ResumeEnhancementContext
  source: {
    summary: string
    work: ResumeEnhancementSourceEntry[]
    projects: ResumeEnhancementSourceEntry[]
  }
}

export interface ResumeEnhancementPatch {
  summary?: string
  work?: Array<{ index: number; highlights: string[] }>
  projects?: Array<{ index: number; highlights: string[] }>
}

const FALLBACK_PALETTE: Palette = PALETTE_MAP['deep-navy']
const FALLBACK_FONT: FontPairing = FONT_PAIRING_MAP['editorial-classic']

export function hasEnhanceableContent(resume: ResumeData): boolean {
  return Boolean(
    resume.basics.summary?.trim() ||
      resume.work.some((entry) => hasStrings(entry.highlights)) ||
      resume.projects.some((entry) => hasStrings(entry.highlights)),
  )
}

export function buildResumeEnhancementRequest(
  resume: ResumeData,
  meta: ResumeMeta,
  fieldCategory: FieldCategory | null,
): ResumeEnhancementRequest {
  const template = getTemplateBrief(meta.templateId)
  const palette = PALETTE_MAP[meta.palette] ?? FALLBACK_PALETTE
  const fontPairing = FONT_PAIRING_MAP[meta.fontPairing] ?? FALLBACK_FONT

  return {
    context: buildEnhancementContext(template, palette, fontPairing, fieldCategory),
    source: {
      summary: resume.basics.summary?.trim() ?? '',
      work: resume.work
        .map((entry, index) => ({
          index,
          title: entry.position,
          subtitle: entry.name,
          highlights: cleanStrings(entry.highlights),
        }))
        .filter((entry) => entry.highlights.length > 0),
      projects: resume.projects
        .map((entry, index) => ({
          index,
          title: entry.name,
          subtitle: entry.tech?.join(', ') ?? '',
          highlights: cleanStrings(entry.highlights),
        }))
        .filter((entry) => entry.highlights.length > 0),
    },
  }
}

export function applyResumeEnhancement(
  resume: ResumeData,
  enhancement: ResumeEnhancementPatch,
): ResumeData {
  const nextSummary = enhancement.summary?.trim()
  const workPatchMap = buildHighlightPatchMap(enhancement.work)
  const projectPatchMap = buildHighlightPatchMap(enhancement.projects)

  return {
    ...resume,
    basics: nextSummary
      ? { ...resume.basics, summary: nextSummary }
      : resume.basics,
    work: resume.work.map((entry, index) => {
      const nextHighlights = workPatchMap.get(index)
      return nextHighlights
        ? { ...entry, highlights: nextHighlights }
        : entry
    }),
    projects: resume.projects.map((entry, index) => {
      const nextHighlights = projectPatchMap.get(index)
      return nextHighlights
        ? { ...entry, highlights: nextHighlights }
        : entry
    }),
  }
}

function buildEnhancementContext(
  template: TemplateBrief,
  palette: Palette,
  fontPairing: FontPairing,
  fieldCategory: FieldCategory | null,
): ResumeEnhancementContext {
  return {
    templateId: template.id,
    templateName: template.name,
    templateDescription: template.description,
    templateVoice: template.enhancementVoice,
    templateFocusAreas: template.focusAreas,
    paletteName: palette.name,
    paletteDescription: palette.description,
    fontPairingName: fontPairing.name,
    fontPairingDescription: fontPairing.description,
    fieldCategory,
    fieldRationale: fieldCategory ? getFieldDefaultsRationale(fieldCategory) : null,
  }
}

function buildHighlightPatchMap(
  patches: ResumeEnhancementPatch['work'] | ResumeEnhancementPatch['projects'],
): Map<number, string[]> {
  const map = new Map<number, string[]>()

  for (const patch of patches ?? []) {
    const cleanedHighlights = cleanStrings(patch.highlights)
    if (cleanedHighlights.length > 0) {
      map.set(patch.index, cleanedHighlights)
    }
  }

  return map
}

function cleanStrings(values?: string[]): string[] {
  return (values ?? []).map((value) => value.trim()).filter(Boolean)
}

function hasStrings(values?: string[]): boolean {
  return cleanStrings(values).length > 0
}