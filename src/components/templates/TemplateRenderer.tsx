import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { ResumeData, ResumeMeta } from '../../types/resume'
import { resolveTheme } from '../../utils/themeResolver'
import type { TemplateLayoutMode } from './templateUtils'
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
  const visibleData = useMemo(() => applySectionVisibility(data, meta), [data, meta])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(816)

  useEffect(() => {
    const node = containerRef.current
    if (!node || typeof ResizeObserver === 'undefined') return

    const updateWidth = () => {
      const nextWidth = node.getBoundingClientRect().width
      if (nextWidth > 0) {
        setContainerWidth(nextWidth)
      }
    }

    updateWidth()

    const observer = new ResizeObserver(() => {
      updateWidth()
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const layoutMode = useMemo<TemplateLayoutMode>(() => {
    if (containerWidth < 520) return 'compact'
    if (containerWidth < 720) return 'medium'
    return 'full'
  }, [containerWidth])

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
      <div ref={containerRef} data-template-layout={layoutMode} style={{ ...containerBase, ...themeStyle }}>
        <Template data={visibleData} layoutMode={layoutMode} />
      </div>
    </>
  )
}

function applySectionVisibility(data: ResumeData, meta: ResumeMeta): ResumeData {
  const isVisible = (key: string) => meta.sectionVisibility[key] ?? true

  return {
    ...data,
    basics: {
      ...data.basics,
      summary: isVisible('summary') ? data.basics.summary : undefined,
    },
    work: isVisible('work') ? data.work : [],
    education: isVisible('education') ? data.education : [],
    skills: isVisible('skills') ? data.skills : [],
    publications: isVisible('publications') ? data.publications : [],
    presentations: isVisible('presentations') ? data.presentations : [],
    projects: isVisible('projects') ? data.projects : [],
    researchThreads: isVisible('researchThreads') ? data.researchThreads : [],
    leadership: isVisible('leadership') ? data.leadership : [],
    volunteer: isVisible('volunteer') ? data.volunteer : [],
    awards: isVisible('awards') ? data.awards : [],
    interests: isVisible('interests') ? data.interests : [],
    references: isVisible('references') ? data.references : [],
    certifications: isVisible('certifications') ? data.certifications : [],
    languages: isVisible('languages') ? data.languages : [],
  }
}

const containerBase: React.CSSProperties = {
  backgroundColor: 'var(--color-bg)',
  color: 'var(--color-text)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--font-size-body)',
  lineHeight: 'var(--line-height-body)',
  width: '100%',
  minHeight: '100%',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}
