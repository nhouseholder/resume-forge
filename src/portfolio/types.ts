import type { ResumeData, ResumeMeta, FieldCategory } from '../types/resume'

export interface PortfolioTheme {
  colors: {
    bg: string
    surface: string
    surfaceElevated: string
    text: string
    textMuted: string
    heading: string
    accent: string
    accentText: string
    accentHover: string
    primary: string
    primaryLight: string
    primaryDark: string
    border: string
  }
  fonts: {
    heading: string
    body: string
    mono: string
    headingWeight: number
    bodyWeight: number
  }
  fontUrls: string[]
}

export interface PortfolioTemplateProps {
  data: ResumeData
  theme: PortfolioTheme
  fieldCategory: FieldCategory | null
}

export interface PortfolioTemplateConfig {
  id: string
  name: string
  description: string
  component: React.ComponentType<PortfolioTemplateProps>
  generateCss: (theme: PortfolioTheme) => string
  generateJs: () => string
}

export interface PortfolioHtmlOptions {
  resume: ResumeData
  meta: ResumeMeta
  fieldCategory: FieldCategory | null
  templateId?: string
}
