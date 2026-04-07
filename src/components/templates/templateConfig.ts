import type { FieldCategory } from '../../types/resume'
import MeridianTemplate from './meridian/MeridianTemplate'
import SignalTemplate from './signal/SignalTemplate'
import CanvasTemplate from './canvas/CanvasTemplate'

export type TemplateComponent = React.ComponentType<{ data: import('../../types/resume').ResumeData }>

export interface TemplateConfig {
  id: string
  name: string
  description: string
  targetFields: FieldCategory[]
  component: TemplateComponent
}

/**
 * Registry of all available resume templates.
 * Used by TemplateRenderer to resolve templateId → component,
 * and by the customizer UI to display template options.
 */
export const TEMPLATE_REGISTRY: TemplateConfig[] = [
  {
    id: 'meridian',
    name: 'Meridian',
    description: 'Editorial Authority — Clean single-column layout with accent left-borders. Ideal for academic, business, and professional resumes.',
    targetFields: ['academic', 'business'],
    component: MeridianTemplate,
  },
  {
    id: 'signal',
    name: 'Signal',
    description: 'Technical Precision — Two-column layout with extending horizontal lines. Optimized for tech, engineering, and developer resumes.',
    targetFields: ['tech'],
    component: SignalTemplate,
  },
  {
    id: 'canvas',
    name: 'Canvas',
    description: 'Creative Expression — Asymmetric layout with bold display type, pull-quote summary, and card-style entries. Designed for creative and design fields.',
    targetFields: ['creative'],
    component: CanvasTemplate,
  },
]

export function getTemplateForField(field: FieldCategory): TemplateConfig {
  return TEMPLATE_REGISTRY.find((t) => t.targetFields.includes(field)) ?? TEMPLATE_REGISTRY[0]
}
