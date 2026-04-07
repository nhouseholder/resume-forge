import { useState } from 'react'
import { useResumeStore } from '@/store/useResumeStore'
import { SectionNav } from './SectionNav'
import { BasicsEditor } from './sections/BasicsEditor'
import { SkillsEditor } from './sections/SkillsEditor'
import { ListSectionEditor } from './sections/ListSectionEditor'
import { TemplateCustomizer } from '@/components/customizer/TemplateCustomizer'
import { ExportPanel } from '@/components/export/ExportPanel'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import { SECTION_FIELDS, SECTION_BLANKS, SECTION_TITLES } from './sections/sectionConfig'
import type { ResumeData } from '@/types/resume'

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

type ArraySectionKey = Exclude<keyof ResumeData, 'basics' | 'meta'>

export function ResumeEditor() {
  const resume = useResumeStore((s) => s.resume)
  const meta = useResumeStore((s) => s.meta)
  const activeSection = useResumeStore((s) => s.activeSection)
  const [view, setView] = useState<'edit' | 'customize' | 'preview'>('edit')

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

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* ── View Toggle Bar ── */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
        {(['edit', 'customize', 'preview'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-150
              ${view === v
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700'}
            `}
          >
            {v === 'customize' ? '🎨 Design' : v}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 min-h-0">
        {view === 'edit' && (
          <>
            <SectionNav />
            <div className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-2xl" key={activeSection}>
              {renderSection()}
            </div>
          </>
        )}

        {view === 'customize' && (
          <div className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-xl">
            <TemplateCustomizer />
          </div>
        )}

        {view === 'preview' && resume && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Export toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 bg-white/80">
              <span className="text-sm text-on-surface-muted">Live Preview</span>
              <ExportPanel />
            </div>
            {/* Preview area */}
            <div className="flex-1 overflow-y-auto bg-neutral-100 p-8 flex justify-center">
              <div
                data-resume-preview
                className="bg-white shadow-xl rounded-lg overflow-hidden print:shadow-none print:rounded-none"
                style={{ width: '816px', minHeight: '1056px' }}
              >
                <TemplateRenderer data={resume} meta={meta} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
