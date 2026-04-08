import { useResumeStore } from '@/store/useResumeStore'
import type { ResumeData } from '@/types/resume'

interface SectionDef {
  key: keyof ResumeData
  label: string
  shortLabel: string
}

const CORE_SECTIONS: SectionDef[] = [
  { key: 'basics', label: 'Basic Information', shortLabel: 'Basics' },
  { key: 'work', label: 'Work Experience', shortLabel: 'Work' },
  { key: 'education', label: 'Education', shortLabel: 'Education' },
  { key: 'skills', label: 'Skills', shortLabel: 'Skills' },
  { key: 'publications', label: 'Publications', shortLabel: 'Pubs' },
  { key: 'presentations', label: 'Presentations', shortLabel: 'Talks' },
  { key: 'projects', label: 'Projects', shortLabel: 'Projects' },
]

const OPTIONAL_SECTIONS: SectionDef[] = [
  { key: 'volunteer', label: 'Volunteer Work', shortLabel: 'Volunteer' },
  { key: 'awards', label: 'Awards', shortLabel: 'Awards' },
  { key: 'certifications', label: 'Certifications', shortLabel: 'Certs' },
  { key: 'languages', label: 'Languages', shortLabel: 'Languages' },
  { key: 'interests', label: 'Interests', shortLabel: 'Interests' },
  { key: 'references', label: 'References', shortLabel: 'References' },
  { key: 'researchThreads', label: 'Research', shortLabel: 'Research' },
  { key: 'leadership', label: 'Leadership', shortLabel: 'Leadership' },
]

function hasData(resume: ResumeData, key: keyof ResumeData): boolean {
  const val = resume[key]
  if (key === 'basics') return true
  if (Array.isArray(val)) return val.length > 0
  return !!val
}

function itemCount(resume: ResumeData, key: keyof ResumeData): string {
  if (key === 'basics') return 'Core'
  const value = resume[key]
  if (Array.isArray(value)) {
    return value.length > 0 ? `${value.length}` : 'Add'
  }

  return value ? 'Ready' : 'Add'
}

function SectionButton({
  section,
  active,
  filled,
  badge,
  onSelect,
  compact = false,
}: {
  section: SectionDef
  active: boolean
  filled: boolean
  badge: string
  onSelect: () => void
  compact?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? 'true' : undefined}
      className={`w-full rounded-[20px] border text-left transition-all duration-[var(--duration-fast)] ${compact
        ? active
          ? 'border-primary-300 bg-primary-600 px-4 py-2.5 text-white'
          : 'border-border bg-white/70 px-4 py-2.5 text-on-surface-muted hover:border-primary-200 hover:bg-white hover:text-on-surface'
        : active
          ? 'border-primary-300 bg-primary-50 px-4 py-3.5 shadow-sm'
          : 'border-border/80 bg-white/72 px-4 py-3.5 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-white'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className={`text-[var(--font-size-body-sm)] font-semibold ${active && !compact ? 'text-primary-700' : active ? 'text-white' : 'text-on-surface'}`}>
            {compact ? section.shortLabel : section.label}
          </p>
          {!compact && (
            <p className={`mt-1 text-[var(--font-size-caption)] ${active ? 'text-primary-600' : 'text-on-surface-muted'}`}>
              {filled ? 'Included in the draft' : 'Ready to add'}
            </p>
          )}
        </div>

        <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] ${active
          ? compact
            ? 'bg-white/20 text-white'
            : 'bg-primary-100 text-primary-700'
          : filled
            ? 'bg-neutral-100 text-on-surface-muted'
            : 'bg-accent-100 text-accent-800'
        }`}>
          {badge}
        </span>
      </div>
    </button>
  )
}

export function SectionNav() {
  const resume = useResumeStore((s) => s.resume)
  const activeSection = useResumeStore((s) => s.activeSection)
  const setActiveSection = useResumeStore((s) => s.setActiveSection)

  if (!resume) return null

  const available = [...CORE_SECTIONS, ...OPTIONAL_SECTIONS]

  return (
    <nav className="shell-panel flex h-full min-h-0 flex-col overflow-hidden" aria-label="Resume sections">
      <div className="border-b border-border/70 px-4 py-4">
        <p className="shell-kicker">Table of contents</p>
        <p className="mt-2 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">
          Every section stays available whether it was parsed from the file or you add it manually.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto p-3 lg:hidden">
        {available.map((section) => (
          <SectionButton
            key={section.key}
            section={section}
            active={activeSection === section.key}
            badge={itemCount(resume, section.key)}
            filled={hasData(resume, section.key)}
            compact
            onSelect={() => setActiveSection(section.key)}
          />
        ))}
      </div>

      <div className="hidden min-h-0 flex-1 overflow-y-auto p-4 lg:flex lg:flex-col lg:gap-6">
        <SectionGroup
          title="Core dossier"
          sections={CORE_SECTIONS}
          resume={resume}
          activeSection={activeSection}
          onSelect={setActiveSection}
        />
        <SectionGroup
          title="Supporting detail"
          sections={OPTIONAL_SECTIONS}
          resume={resume}
          activeSection={activeSection}
          onSelect={setActiveSection}
        />
      </div>
    </nav>
  )
}

function SectionGroup({
  title,
  sections,
  resume,
  activeSection,
  onSelect,
}: {
  title: string
  sections: SectionDef[]
  resume: ResumeData
  activeSection: string
  onSelect: (section: string) => void
}) {
  return (
    <div>
      <p className="editor-label mb-3">{title}</p>
      <div className="space-y-2">
        {sections.map((section) => (
          <SectionButton
            key={section.key}
            section={section}
            active={activeSection === section.key}
            badge={itemCount(resume, section.key)}
            filled={hasData(resume, section.key)}
            onSelect={() => onSelect(section.key)}
          />
        ))}
      </div>
    </div>
  )
}
