import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import type { PortfolioHtmlOptions, PortfolioTheme } from './types'
import type { ResumeMeta } from '../types/resume'
import { getPortfolioTemplate } from './registry'
import { resolveTheme } from '../utils/themeResolver'

/**
 * Resolve ResumeMeta into a PortfolioTheme.
 * Reuses the existing theme resolver but maps into the portfolio-specific shape.
 */
export function resolvePortfolioTheme(meta: ResumeMeta): PortfolioTheme {
  const resolved = resolveTheme(meta)
  const props = resolved.cssProperties

  return {
    colors: {
      bg: props['--color-bg'],
      surface: props['--color-surface'],
      surfaceElevated: props['--color-surface-el'],
      text: props['--color-text'],
      textMuted: props['--color-text-muted'],
      heading: props['--color-heading'],
      accent: props['--color-accent'],
      accentText: props['--color-accent-text'],
      accentHover: props['--color-accent-hover'],
      primary: props['--color-primary'],
      primaryLight: props['--color-primary-light'],
      primaryDark: props['--color-primary-dark'],
      border: props['--color-border'],
    },
    fonts: {
      heading: resolved.font.heading,
      body: resolved.font.body,
      mono: 'IBM Plex Mono',
      headingWeight: resolved.font.headingWeight,
      bodyWeight: resolved.font.bodyWeight,
    },
    fontUrls: [
      ...resolved.fontUrls,
      // Always include a monospace font for the portfolio
      `https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap`,
    ],
  }
}

function buildSchemaOrg(name: string, label?: string, summary?: string, education?: { institution: string }[]): string {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
  }
  if (label) schema.jobTitle = label
  if (summary) schema.description = summary.slice(0, 200)
  if (education?.length) {
    schema.alumniOf = education.map((e) => ({
      '@type': 'CollegeOrUniversity',
      name: e.institution,
    }))
  }
  return JSON.stringify(schema, null, 2)
}

/**
 * Build a complete, self-contained HTML document string for a portfolio.
 */
export function buildPortfolioHtml(opts: PortfolioHtmlOptions): string {
  const { resume, meta, fieldCategory, templateId = 'folio' } = opts
  const template = getPortfolioTemplate(templateId)
  const theme = resolvePortfolioTheme(meta)

  // Render the React component to static HTML
  const bodyHtml = renderToStaticMarkup(
    createElement(template.component, { data: resume, theme, fieldCategory })
  )

  // Generate CSS and JS
  const css = template.generateCss(theme)
  const js = template.generateJs()

  // Build meta tags
  const name = resume.basics?.name || 'Portfolio'
  const label = resume.basics?.label || ''
  const summary = resume.basics?.summary || ''
  const title = label ? `${name} | ${label}` : name
  const description = summary.slice(0, 160) || `${name}'s professional portfolio`

  // Font links
  const fontLinks = theme.fontUrls
    .map((url) => `<link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link href="${url}" rel="stylesheet">`)
    .join('\n  ')

  // Schema.org
  const schemaOrg = buildSchemaOrg(
    name,
    resume.basics?.label,
    summary,
    resume.education,
  )

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <meta name="theme-color" content="${theme.colors.bg}">
  ${fontLinks}
  <style>${css}</style>
  <script type="application/ld+json">${schemaOrg}</script>
</head>
<body>
${bodyHtml}
<script>${js}</script>
</body>
</html>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
