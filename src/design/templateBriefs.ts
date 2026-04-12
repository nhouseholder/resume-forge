import type { FieldCategory } from '../types/resume'

export interface TemplateBrief {
  id: string
  name: string
  description: string
  targetFields: FieldCategory[]
  enhancementVoice: string
  focusAreas: string[]
}

export const TEMPLATE_BRIEFS: TemplateBrief[] = [
  {
    id: 'archive',
    name: 'Archive',
    description: 'Academic Portfolio - Research-forward editorial hierarchy with stronger section rhythm, citation styling, and premium academic tone.',
    targetFields: ['academic', 'business'],
    enhancementVoice: 'Scholarly, high-signal, and institutionally credible. Favor measured authority, publication-aware framing, and narrative clarity over generic resume shorthand.',
    focusAreas: ['publication-led positioning', 'academic and clinical credibility', 'clear narrative hierarchy'],
  },
  {
    id: 'meridian',
    name: 'Meridian',
    description: 'Editorial Authority - Clean single-column layout with restrained accents. Best when you want a calmer, more traditional professional document.',
    targetFields: ['business'],
    enhancementVoice: 'Measured, credible, and polished. Favor clarity, authority, and institutional confidence over hype.',
    focusAreas: ['clear executive summary', 'evidence-led accomplishments', 'calm professional tone'],
  },
  {
    id: 'signal',
    name: 'Signal',
    description: 'Technical Precision — Two-column layout with extending horizontal lines. Optimized for tech, engineering, and developer resumes.',
    targetFields: ['tech'],
    enhancementVoice: 'High-signal and technically concrete. Favor specificity, ownership, and crisp execution language.',
    focusAreas: ['strong technical positioning', 'concrete shipping language', 'signal over fluff'],
  },
  {
    id: 'canvas',
    name: 'Canvas',
    description: 'Creative Expression — Asymmetric layout with bold display type, pull-quote summary, and card-style entries. Designed for creative and design fields.',
    targetFields: ['creative'],
    enhancementVoice: 'Story-led and visually literate. Favor sharp verbs, narrative confidence, and distinctive but credible language.',
    focusAreas: ['memorable point of view', 'brand-aware storytelling', 'tight, visual phrasing'],
  },
]

export const TEMPLATE_BRIEF_MAP: Record<string, TemplateBrief> = Object.fromEntries(
  TEMPLATE_BRIEFS.map((brief) => [brief.id, brief]),
)

export function getTemplateBrief(templateId: string): TemplateBrief {
  return TEMPLATE_BRIEF_MAP[templateId] ?? TEMPLATE_BRIEFS[0]
}