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

export function SectionNav() {
  const resume = useResumeStore((s) => s.resume)
  const activeSection = useResumeStore((s) => s.activeSection)
  const setActiveSection = useResumeStore((s) => s.setActiveSection)

  if (!resume) return null

  const available = [...CORE_SECTIONS, ...OPTIONAL_SECTIONS.filter((s) => hasData(resume, s.key))]

  return (
    <nav
      className="flex lg:flex-col gap-px overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden
        p-2 lg:min-w-[180px] lg:w-[180px] border-b lg:border-b-0 lg:border-r border-border/60"
      aria-label="Resume sections"
    >
      {available.map((section) => {
        const isActive = activeSection === section.key
        return (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            aria-current={isActive ? 'true' : undefined}
            className={`
              flex items-center gap-2.5 px-3 py-2 rounded-md text-[var(--font-size-body-sm)] font-medium whitespace-nowrap
              text-left w-full
              transition-all duration-[var(--duration-fast)]
              ${isActive
                ? 'bg-primary-50 text-primary-700 font-semibold'
                : 'text-on-surface-muted hover:bg-neutral-100 hover:text-on-surface'
              }
            `}
          >
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-primary-500 shrink-0" aria-hidden="true" />
            )}
            {!isActive && <span className="w-1 h-1 rounded-full bg-transparent shrink-0" aria-hidden="true" />}
            <span className="hidden lg:inline">{section.label}</span>
            <span className="lg:hidden">{section.shortLabel}</span>
          </button>
        )
      })}
    </nav>
  )
}
