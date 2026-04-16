import type { PortfolioTemplateConfig } from './types'
import { FolioTemplate } from './templates/folio/folio'
import { generateFolioCss } from './templates/folio/folioStyles'
import { generateFolioJs } from './templates/folio/folioScript'

export const PORTFOLIO_TEMPLATES: PortfolioTemplateConfig[] = [
  {
    id: 'folio',
    name: 'Folio',
    description: 'Single-page scrolling portfolio with hero, numbered project cards, and section navigation.',
    component: FolioTemplate,
    generateCss: generateFolioCss,
    generateJs: generateFolioJs,
  },
]

export function getPortfolioTemplate(id: string): PortfolioTemplateConfig {
  return PORTFOLIO_TEMPLATES.find((t) => t.id === id) ?? PORTFOLIO_TEMPLATES[0]
}
