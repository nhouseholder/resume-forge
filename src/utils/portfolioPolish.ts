import type { FieldCategory, ResumeData } from '../types/resume'
import { getFieldDefaultsRationale } from './fieldDefaults'

// ── Patch shape ──

export interface PortfolioPolishPatch {
  summary?: string
  projects?: Array<{ index: number; description?: string; highlights?: string[] }>
  work?: Array<{ index: number; highlights?: string[] }>
}

// ── Request shape sent to the AI ──

export interface PortfolioPolishRequest {
  context: {
    fieldCategory: FieldCategory | null
    fieldRationale: string | null
  }
  source: {
    summary: string
    projects: Array<{ index: number; name: string; tech: string; description: string; highlights: string[] }>
    work: Array<{ index: number; title: string; company: string; highlights: string[] }>
  }
}

// ── Guards ──

export function hasPolishableContent(resume: ResumeData): boolean {
  return Boolean(
    resume.basics.summary?.trim() ||
      resume.projects.some(
        (p) => p.description?.trim() || cleanStrings(p.highlights).length > 0,
      ) ||
      resume.work.some((w) => cleanStrings(w.highlights).length > 0),
  )
}

// ── Builder ──

export function buildPortfolioPolishRequest(
  resume: ResumeData,
  fieldCategory: FieldCategory | null,
): PortfolioPolishRequest {
  return {
    context: {
      fieldCategory,
      fieldRationale: fieldCategory ? getFieldDefaultsRationale(fieldCategory) : null,
    },
    source: {
      summary: resume.basics.summary?.trim() ?? '',
      projects: resume.projects
        .map((p, index) => ({
          index,
          name: p.name,
          tech: p.tech?.join(', ') ?? '',
          description: p.description?.trim() ?? '',
          highlights: cleanStrings(p.highlights),
        }))
        .filter((p) => p.description || p.highlights.length > 0),
      work: resume.work
        .map((w, index) => ({
          index,
          title: w.position,
          company: w.name,
          highlights: cleanStrings(w.highlights),
        }))
        .filter((w) => w.highlights.length > 0),
    },
  }
}

// ── Applier ──

export function applyPortfolioPolish(
  resume: ResumeData,
  patch: PortfolioPolishPatch,
): ResumeData {
  const projectPatchMap = buildProjectPatchMap(patch.projects)
  const workPatchMap = buildWorkPatchMap(patch.work)

  return {
    ...resume,
    basics: patch.summary?.trim()
      ? { ...resume.basics, summary: patch.summary.trim() }
      : resume.basics,
    projects: resume.projects.map((project, index) => {
      const projectPatch = projectPatchMap.get(index)
      if (!projectPatch) return project
      return {
        ...project,
        ...(projectPatch.description ? { description: projectPatch.description } : {}),
        ...(projectPatch.highlights ? { highlights: projectPatch.highlights } : {}),
      }
    }),
    work: resume.work.map((entry, index) => {
      const highlights = workPatchMap.get(index)
      return highlights ? { ...entry, highlights } : entry
    }),
  }
}

// ── Internal helpers ──

function buildProjectPatchMap(
  patches: PortfolioPolishPatch['projects'],
): Map<number, { description?: string; highlights?: string[] }> {
  const map = new Map<number, { description?: string; highlights?: string[] }>()
  for (const patch of patches ?? []) {
    const description = patch.description?.trim() || undefined
    const highlights = cleanStrings(patch.highlights)
    if (description || highlights.length > 0) {
      map.set(patch.index, {
        ...(description ? { description } : {}),
        ...(highlights.length > 0 ? { highlights } : {}),
      })
    }
  }
  return map
}

function buildWorkPatchMap(
  patches: PortfolioPolishPatch['work'],
): Map<number, string[]> {
  const map = new Map<number, string[]>()
  for (const patch of patches ?? []) {
    const highlights = cleanStrings(patch.highlights)
    if (highlights.length > 0) map.set(patch.index, highlights)
  }
  return map
}

function cleanStrings(values?: string[]): string[] {
  return (values ?? []).map((v) => v.trim()).filter(Boolean)
}
