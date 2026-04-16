import { lazy, Suspense, useMemo, useState } from 'react'
import { useResumeStore } from '@/store/useResumeStore'
import { AIEnhanceButton } from './AIEnhanceButton'
import { SectionNav } from './SectionNav'
import { BasicsEditor } from './sections/BasicsEditor'
import { SkillsEditor } from './sections/SkillsEditor'
import { ListSectionEditor } from './sections/ListSectionEditor'
import { SECTION_FIELDS, SECTION_BLANKS, SECTION_TITLES } from './sections/sectionConfig'
import type { ResumeData } from '@/types/resume'
import { TEMPLATE_REGISTRY } from '@/components/templates/templateConfig'
import { buildPortfolioHtml } from '@/portfolio/buildPortfolioHtml'

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
  desktop: 0.64,
  tablet: 0.52,
  mobile: 0.38,
}

const VIEW_COPY: Record<WorkspaceView, { eyebrow: string; title: string; description: string }> = {
  edit: {
    eyebrow: 'Working leaf',
    title: 'Current section',
    description: 'Move through the dossier one leaf at a time. The document stays on the desk while you revise the active section.',
  },
  style: {
    eyebrow: 'House treatments',
    title: 'Specimen table',
    description: 'Choose the publishing treatment, palette, typography, and section visibility with controls that change the reader view directly.',
  },
  publish: {
    eyebrow: 'Dispatch desk',
    title: 'Issue and export',
    description: 'Release the reader-facing link or print a PDF from the same working page without switching contexts.',
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
      <div className="border-b border-border/60 bg-surface/94">
        <div className="mx-auto flex max-w-[1800px] flex-col gap-4 px-4 py-4 lg:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="shell-kicker">Proof room</p>
              <h1 className="mt-2 text-[var(--font-size-h2)] text-on-surface">
                {resume.basics?.name || 'Untitled candidate'}
              </h1>
              <p className="mt-2 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">
                Keep the document central while you revise the copy, choose the house treatment, and prepare the final reader version.
              </p>

              <div className="mt-4 folio-meta">
                {activeTemplate && <span>{activeTemplate.name}</span>}
                {detectedField && <span>{detectedField}</span>}
                <span>{previewMode} view</span>
              </div>
            </div>

            <div className="max-w-sm xl:text-right">
              <p className="shell-kicker">Reader standard</p>
              <p className="mt-2 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">
                The page remains visible while revisions happen around it, so the front end behaves like a working proof instead of a wizard.
              </p>
            </div>
          </div>

          <div className="dossier-tabs">
            {([
              { id: 'edit', label: 'Review' },
              { id: 'style', label: 'Treatments' },
              { id: 'publish', label: 'Dispatch' },
            ] as const).map((tab) => {
              const active = view === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setView(tab.id)}
                  className={`${active ? 'dossier-tab dossier-tab-active' : 'dossier-tab'}`}
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
              <p className="shell-kicker">{view === 'edit' ? 'Active leaf' : panelCopy.eyebrow}</p>
              <h2 className="mt-2 text-[var(--font-size-h3)] text-on-surface">{sectionTitle}</h2>
              <p className="mt-2 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">
                {view === 'edit'
                  ? 'Use the dossier index to move through the page. Every section stays editable whether it came from parsing or you add it manually.'
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
                    <div className="proof-ticket p-5">
                      <p className="shell-kicker">Dispatch checklist</p>
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
            detectedField={detectedField}
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
              detectedField={detectedField}
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
  detectedField,
  previewMode,
  setPreviewMode,
  previewScale,
  previewWidth,
  previewHeight,
}: {
  className: string
  resume: ResumeData
  meta: ReturnType<typeof useResumeStore.getState>['meta']
  detectedField: string | null
  previewMode: 'desktop' | 'tablet' | 'mobile'
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void
  previewScale: number
  previewWidth: number
  previewHeight: number
}) {
  const [previewType, setPreviewType] = useState<'resume' | 'portfolio'>('resume')

  const portfolioHtml = useMemo(
    () => buildPortfolioHtml({ resume, meta, fieldCategory: (detectedField as import('@/types/resume').FieldCategory) ?? null }),
    [resume, meta, detectedField]
  )

  return (
    <section className={`workspace-stage min-h-0 flex-col overflow-hidden ${className}`}>
      <div className="flex items-center justify-between gap-4 border-b border-border/70 px-4 py-4 lg:px-5">
        <div>
          <p className="shell-kicker">Reader preview</p>
          <h2 className="mt-1 text-[var(--font-size-h4)] font-semibold text-on-surface">Live edition</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5 border border-border/60 rounded p-0.5">
            {(['resume', 'portfolio'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setPreviewType(type)}
                className={`px-3 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.12em] rounded transition-all duration-[var(--duration-fast)] ${
                  previewType === type
                    ? 'bg-primary-600 text-white'
                    : 'text-on-surface-muted hover:text-on-surface'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {previewType === 'resume' && (
            <div className="flex items-center gap-4 border-l border-border/70 pl-4">
              {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPreviewMode(mode)}
                  className={`border-b-2 pb-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-all duration-[var(--duration-fast)] ${previewMode === mode
                    ? 'border-primary-600 text-on-surface'
                    : 'border-transparent text-on-surface-muted hover:text-on-surface'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">
        {previewType === 'resume' ? (
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
        ) : (
          <iframe
            srcDoc={portfolioHtml}
            title="Portfolio preview"
            className="w-full h-full min-h-[600px] border-0 rounded"
            sandbox="allow-same-origin"
          />
        )}
      </div>
    </section>
  )
}
