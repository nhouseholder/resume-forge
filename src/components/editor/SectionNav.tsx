import { useResumeStore } from '@/store/useResumeStore'
import type { ResumeData } from '@/types/resume'

interface SectionDef {
  key: keyof ResumeData
  label: string
  shortLabel: string
}

const CORE_SECTIONS: SectionDef[] = [
  { key: 'basics', label: 'Identity & Summary', shortLabel: 'Identity' },
  { key: 'work', label: 'Experience', shortLabel: 'Work' },
  { key: 'education', label: 'Education', shortLabel: 'Education' },
  { key: 'skills', label: 'Capabilities', shortLabel: 'Skills' },
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
  if (key === 'basics') return 'Ready'
  const value = resume[key]
  if (Array.isArray(value)) {
    return value.length > 0 ? `${value.length}` : 'Add'
  }

  return value ? 'Ready' : 'Add'
}

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, '0')
}

function SectionButton({
  section,
  index,
  active,
  filled,
  badge,
  onSelect,
  compact = false,
}: {
  section: SectionDef
  index: number
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
      className={`w-full text-left transition-all duration-[var(--duration-fast)] ${compact
        ? active
          ? 'border-primary-400 bg-primary-50/35'
          : 'border-border bg-white/75 hover:border-primary-200 hover:bg-white'
        : active
          ? 'bg-primary-50/40'
          : 'hover:bg-white/60'
      }`}
    >
      <div className={`${compact ? 'grid min-w-[11rem] grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 border px-3 py-3' : `grid grid-cols-[2.4rem_minmax(0,1fr)_auto] items-start gap-3 border-b border-border/70 px-4 py-3 ${active ? 'border-l-[3px] border-l-primary-600 pl-[calc(1rem-3px)]' : 'border-l-[3px] border-l-transparent'}`}`}>
        <span className={`font-mono text-[0.68rem] uppercase tracking-[0.16em] ${active ? 'text-primary-700' : 'text-on-surface-muted'}`}>
          {formatIndex(index)}
        </span>
        <div className="min-w-0">
          <p className={`text-[var(--font-size-body-sm)] font-semibold ${active ? 'text-on-surface' : 'text-on-surface'}`}>
            {compact ? section.shortLabel : section.label}
          </p>
          {!compact && (
            <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-on-surface-muted">
              {filled ? 'On the page' : 'Available to add'}
            </p>
          )}
        </div>

        <span className={`font-mono text-[0.68rem] uppercase tracking-[0.14em] ${filled ? 'text-on-surface-muted' : 'text-accent-800'}`}>
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
        <p className="shell-kicker">Dossier index</p>
        <p className="mt-2 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">
          Move through the page like a file under review. Every section remains available whether it came from parsing or you add it manually.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto p-3 lg:hidden">
        {available.map((section, index) => (
          <SectionButton
            key={section.key}
            section={section}
            index={index}
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
          startIndex={0}
          resume={resume}
          activeSection={activeSection}
          onSelect={setActiveSection}
        />
        <SectionGroup
          title="Supporting detail"
          sections={OPTIONAL_SECTIONS}
          startIndex={CORE_SECTIONS.length}
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
  startIndex,
  resume,
  activeSection,
  onSelect,
}: {
  title: string
  sections: SectionDef[]
  startIndex: number
  resume: ResumeData
  activeSection: string
  onSelect: (section: string) => void
}) {
  return (
    <div>
      <p className="editor-label mb-3">{title}</p>
      <div className="space-y-0">
        {sections.map((section, index) => (
          <SectionButton
            key={section.key}
            section={section}
            index={startIndex + index}
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
