import { lazy, Suspense, useState } from 'react'
import { useResumeStore } from '@/store/useResumeStore'
import { AIEnhanceButton } from './AIEnhanceButton'
import { SectionNav } from './SectionNav'
import { BasicsEditor } from './sections/BasicsEditor'
import { SkillsEditor } from './sections/SkillsEditor'
import { ListSectionEditor } from './sections/ListSectionEditor'
import { SECTION_FIELDS, SECTION_BLANKS, SECTION_TITLES } from './sections/sectionConfig'
import type { ResumeData } from '@/types/resume'
import { TEMPLATE_REGISTRY } from '@/components/templates/templateConfig'

// Lazy-load heavy panels — only needed when user switches tabs
const TemplateCustomizer = lazy(() =>
  import('@/components/customizer/TemplateCustomizer').then((m) => ({ default: m.TemplateCustomizer }))
)
const ExportPanel = lazy(() =>
  import('@/components/export/ExportPanel').then((m) => ({ default: m.ExportPanel }))
)
const TemplateRenderer = lazy(() => import('@/components/templates/TemplateRenderer'))

const SECTION_LABELS: Record<string, string> = {
  work: 'Work Experience',
  education: 'Education',
  publications: 'Publications',
  presentations: 'Presentations',
  projects: 'Projects',
  volunteer: 'Volunteer Work',
  awards: 'Awards',
  certifications: 'Certifications',
  languages: 'Languages',
  interests: 'Interests',
  references: 'References',
  researchThreads: 'Research Threads',
  leadership: 'Leadership',
}

function PanelSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-4">
      <div className="h-4 bg-neutral-200 rounded w-1/3" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 bg-neutral-100 rounded-lg" />
        ))}
      </div>
      <div className="h-4 bg-neutral-200 rounded w-1/2" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 bg-neutral-100 rounded" />
        ))}
      </div>
    </div>
  )
}

type ArraySectionKey = Exclude<keyof ResumeData, 'basics' | 'meta'>
type WorkspaceView = 'edit' | 'style' | 'publish'

const PREVIEW_SCALE: Record<'desktop' | 'tablet' | 'mobile', number> = {
  desktop: 0.6,
  tablet: 0.48,
  mobile: 0.34,
}

const VIEW_COPY: Record<WorkspaceView, { eyebrow: string; title: string; description: string }> = {
  edit: {
    eyebrow: 'Edit the document',
    title: 'Section editor',
    description: 'Work through the resume like a manuscript. On larger screens the preview stays visible; on smaller screens it remains one tap away in Publish.',
  },
  style: {
    eyebrow: 'Shape the presentation',
    title: 'Style studio',
    description: 'Choose the template voice, palette, typography, and section visibility with controls that map directly to the rendered document.',
  },
  publish: {
    eyebrow: 'Finish the artifact',
    title: 'Publish and export',
    description: 'Generate a read-only share link or open the browser print flow for a polished PDF.',
  },
}

export function ResumeEditor() {
  const resume = useResumeStore((s) => s.resume)
  const meta = useResumeStore((s) => s.meta)
  const activeSection = useResumeStore((s) => s.activeSection)
  const previewMode = useResumeStore((s) => s.previewMode)
  const setPreviewMode = useResumeStore((s) => s.setPreviewMode)
  const detectedField = useResumeStore((s) => s.detectedField)
  const [view, setView] = useState<WorkspaceView>('edit')

  if (!resume) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-on-surface-muted">Upload a resume to start editing.</p>
      </div>
    )
  }

  const renderSection = () => {
    if (activeSection === 'basics') return <BasicsEditor />
    if (activeSection === 'skills') return <SkillsEditor />

    const fields = SECTION_FIELDS[activeSection]
    const blank = SECTION_BLANKS[activeSection]
    const titleGetter = SECTION_TITLES[activeSection]

    if (fields && blank && titleGetter) {
      return (
        <ListSectionEditor
          sectionKey={activeSection as ArraySectionKey}
          title={SECTION_LABELS[activeSection] ?? activeSection}
          fields={fields}
          createBlank={blank}
          getCardTitle={titleGetter}
        />
      )
    }

    return <p className="text-on-surface-muted">Section editor not yet implemented: {activeSection}</p>
  }

  const activeTemplate = TEMPLATE_REGISTRY.find((template) => template.id === meta.templateId)
  const previewScale = PREVIEW_SCALE[previewMode]
  const previewWidth = Math.round(816 * previewScale)
  const previewHeight = Math.round(1056 * previewScale)
  const panelCopy = VIEW_COPY[view]

  const sectionTitle = view === 'edit'
    ? SECTION_LABELS[activeSection] ?? activeSection
    : panelCopy.title

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-border/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1800px] flex-col gap-4 px-4 py-4 lg:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="shell-kicker">Editing workspace</p>
              <h1 className="mt-2 text-[var(--font-size-h2)] text-on-surface">
                {resume.basics?.name || 'Untitled candidate'}
              </h1>
              <p className="mt-2 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">
                Keep the document close while you refine content, shape the presentation, and publish the final artifact.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {activeTemplate && <span className="shell-chip">{activeTemplate.name}</span>}
              {detectedField && <span className="shell-chip">{detectedField}</span>}
              <span className="shell-chip">{previewMode} preview</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {([
              { id: 'edit', label: 'Edit' },
              { id: 'style', label: 'Style' },
              { id: 'publish', label: 'Publish' },
            ] as const).map((tab) => {
              const active = view === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setView(tab.id)}
                  className={`rounded-full border px-4 py-2 text-[var(--font-size-body-sm)] font-semibold transition-all duration-[var(--duration-fast)] ${active
                    ? 'border-primary-300 bg-primary-600 text-white shadow-sm'
                    : 'border-border bg-white/70 text-on-surface-muted hover:-translate-y-0.5 hover:bg-white hover:text-on-surface'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-4 py-4 lg:px-6 lg:py-6">
        <div className="flex h-full flex-col gap-4 lg:grid lg:grid-cols-[220px_minmax(0,29rem)_minmax(0,1fr)]">
          <div className="min-h-0">
            <SectionNav />
          </div>

          <section className="shell-panel flex min-h-0 flex-col overflow-hidden">
            <div className="border-b border-border/70 px-5 py-5 sm:px-6">
              <p className="shell-kicker">{view === 'edit' ? 'Edit the document' : panelCopy.eyebrow}</p>
              <h2 className="mt-2 text-[var(--font-size-h3)] text-on-surface">{sectionTitle}</h2>
              <p className="mt-2 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">
                {view === 'edit'
                  ? 'Use the table of contents to move through the resume. Each section stays editable whether it came from parsing or you add it yourself.'
                  : panelCopy.description}
              </p>
            </div>

            <div className="min-h-0 overflow-y-auto p-5 sm:p-6" key={`${view}-${activeSection}`}>
              {view === 'edit' && (
                <div className="space-y-6">
                  <AIEnhanceButton />
                  {renderSection()}
                </div>
              )}

              {view === 'style' && (
                <Suspense fallback={<PanelSkeleton />}>
                  <TemplateCustomizer />
                </Suspense>
              )}

              {view === 'publish' && (
                <Suspense fallback={<PanelSkeleton />}>
                  <div className="space-y-6">
                    <ExportPanel />
                    <div className="shell-card p-5">
                      <p className="shell-kicker">Publish checklist</p>
                      <ul className="mt-4 space-y-3 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">
                        <li>Check the preview at desktop, tablet, and mobile before copying the link.</li>
                        <li>Use the section visibility controls to hide material that should not appear in the final resume.</li>
                        <li>Open print preview once before exporting the final PDF to confirm spacing and page breaks.</li>
                      </ul>
                    </div>
                  </div>
                </Suspense>
              )}
            </div>
          </section>

          <PreviewPane
            className="hidden lg:flex"
            meta={meta}
            previewHeight={previewHeight}
            previewMode={previewMode}
            previewScale={previewScale}
            previewWidth={previewWidth}
            resume={resume}
            setPreviewMode={setPreviewMode}
          />

          {view === 'publish' && (
            <PreviewPane
              className="flex lg:hidden"
              meta={meta}
              previewHeight={previewHeight}
              previewMode={previewMode}
              previewScale={previewScale}
              previewWidth={previewWidth}
              resume={resume}
              setPreviewMode={setPreviewMode}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function PreviewPane({
  className,
  resume,
  meta,
  previewMode,
  setPreviewMode,
  previewScale,
  previewWidth,
  previewHeight,
}: {
  className: string
  resume: ResumeData
  meta: ReturnType<typeof useResumeStore.getState>['meta']
  previewMode: 'desktop' | 'tablet' | 'mobile'
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void
  previewScale: number
  previewWidth: number
  previewHeight: number
}) {
  return (
    <section className={`workspace-stage min-h-0 flex-col overflow-hidden ${className}`}>
      <div className="flex items-center justify-between gap-4 border-b border-border/70 px-4 py-4 lg:px-5">
        <div>
          <p className="shell-kicker">Live document</p>
          <h2 className="mt-1 text-[var(--font-size-h4)] font-semibold text-on-surface">Preview stage</h2>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-border/70 bg-white/75 p-1">
          {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setPreviewMode(mode)}
              className={`rounded-full px-3 py-1.5 text-[var(--font-size-caption)] font-semibold capitalize transition-all duration-[var(--duration-fast)] ${previewMode === mode
                ? 'bg-primary-600 text-white'
                : 'text-on-surface-muted hover:bg-white hover:text-on-surface'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">
        <div className="mx-auto flex min-w-fit justify-center">
          <div className="workspace-paper shrink-0" style={{ width: `${previewWidth}px`, minHeight: `${previewHeight}px` }}>
            <div style={{ width: '816px', minHeight: '1056px', transform: `scale(${previewScale})`, transformOrigin: 'top left' }}>
              <div data-resume-preview style={{ width: '816px', minHeight: '1056px' }}>
                <Suspense fallback={<div className="flex h-[1056px] items-center justify-center"><div className="h-8 w-8 rounded-full border-[3px] border-neutral-200 border-t-primary-600 animate-spin" /></div>}>
                  <TemplateRenderer data={resume} meta={meta} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
