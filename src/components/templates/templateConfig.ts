import type { FieldCategory } from '../../types/resume'
import { TEMPLATE_BRIEFS } from '../../design/templateBriefs'
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

const TEMPLATE_COMPONENTS: Record<string, TemplateComponent> = {
  meridian: MeridianTemplate,
  signal: SignalTemplate,
  canvas: CanvasTemplate,
}

/**
 * Registry of all available resume templates.
 * Used by TemplateRenderer to resolve templateId → component,
 * and by the customizer UI to display template options.
 */
export const TEMPLATE_REGISTRY: TemplateConfig[] = TEMPLATE_BRIEFS.map((brief) => ({
  id: brief.id,
  name: brief.name,
  description: brief.description,
  targetFields: brief.targetFields,
  component: TEMPLATE_COMPONENTS[brief.id],
}))

export function getTemplateForField(field: FieldCategory): TemplateConfig {
  return TEMPLATE_REGISTRY.find((t) => t.targetFields.includes(field)) ?? TEMPLATE_REGISTRY[0]
}
