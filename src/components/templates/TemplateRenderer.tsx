import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import type { ResumeData, ResumeMeta } from '../../types/resume'
import { resolveTheme } from '../../utils/themeResolver'
import type { TemplateComponent } from './templateConfig'
import { TEMPLATE_REGISTRY } from './templateConfig'

interface TemplateRendererProps {
  data: ResumeData
  meta: ResumeMeta
}

/**
 * TemplateRenderer — resolves design tokens and renders the selected template.
 * Injects CSS custom properties + Google Font links into a scoped container.
 */
export default function TemplateRenderer({ data, meta }: TemplateRendererProps) {
  const theme = useMemo(() => resolveTheme(meta), [meta])

  const Template = useMemo<TemplateComponent | null>(() => {
    const entry = TEMPLATE_REGISTRY.find((t) => t.id === meta.templateId)
    return entry ? entry.component : null
  }, [meta.templateId])

  // Convert cssProperties Record<string, string> into CSSProperties for the style prop
  const themeStyle = useMemo<CSSProperties>(() => {
    const cssVars: Record<string, string> = {}
    for (const [key, val] of Object.entries(theme.cssProperties)) {
      cssVars[key] = val
    }
    return cssVars as unknown as CSSProperties
  }, [theme.cssProperties])

  if (!Template) {
    return (
      <div style={{ padding: 40, color: '#999', textAlign: 'center' }}>
        Template &quot;{meta.templateId}&quot; not found. Select a valid template.
      </div>
    )
  }

  return (
    <>
      {/* Google Font links */}
      {theme.fontUrls.map((url) => (
        <link key={url} rel="stylesheet" href={url} />
      ))}

      {/* Scoped template container with CSS custom properties */}
      <div style={{ ...containerBase, ...themeStyle }}>
        <Template data={data} />
      </div>
    </>
  )
}

const containerBase: React.CSSProperties = {
  backgroundColor: 'var(--color-bg)',
  color: 'var(--color-text)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--font-size-body)',
  lineHeight: 'var(--line-height-body)',
  minHeight: '100%',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}
