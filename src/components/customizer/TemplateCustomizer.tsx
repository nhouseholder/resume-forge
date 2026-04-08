import { useResumeStore } from '@/store/useResumeStore'
import { PALETTES } from '@/design/palettes'
import { FONT_PAIRINGS } from '@/design/fontPairings'
import { TEMPLATE_REGISTRY } from '@/components/templates/templateConfig'

const SECTION_LABELS: Record<string, string> = {
  summary: 'Professional Summary',
  work: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  publications: 'Publications',
  presentations: 'Presentations',
  projects: 'Projects',
  volunteer: 'Volunteer',
  awards: 'Awards',
  certifications: 'Certifications',
  languages: 'Languages',
  interests: 'Interests',
  references: 'References',
  researchThreads: 'Research',
  leadership: 'Leadership',
}

export function TemplateCustomizer() {
  const meta = useResumeStore((s) => s.meta)
  const detectedField = useResumeStore((s) => s.detectedField)
  const updateMeta = useResumeStore((s) => s.updateMeta)

  const toggleSection = (section: string) => {
    updateMeta({
      sectionVisibility: {
        ...meta.sectionVisibility,
        [section]: !(meta.sectionVisibility[section] ?? true),
      },
    })
  }

  return (
    <div className="space-y-8">
      <header className="editor-section-header">
        <span className="shell-kicker">Style studio</span>
        <h2 className="text-[var(--font-size-h2)] text-on-surface">Choose the document voice</h2>
        <p className="editor-note max-w-xl">
          Pick the template character first, then refine palette, typography, spacing, and visibility. These controls change the rendered resume directly.
        </p>
        {detectedField && <span className="shell-chip">Detected field: {detectedField}</span>}
      </header>

      <ControlGroup
        label="Template"
        description="Choose the information hierarchy that best matches how your reader evaluates candidates."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {TEMPLATE_REGISTRY.map((template) => {
            const recommended = detectedField ? template.targetFields.includes(detectedField) : false

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => updateMeta({ templateId: template.id })}
                className={`rounded-[24px] border p-4 text-left transition-all duration-[var(--duration-fast)] ${meta.templateId === template.id
                  ? 'border-primary-300 bg-primary-50 shadow-sm'
                  : 'border-border bg-white/75 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="shell-kicker">Template</p>
                    <p className="mt-2 text-[var(--font-size-h4)] font-semibold text-on-surface">{template.name}</p>
                  </div>
                  {recommended && (
                    <span className="rounded-full bg-accent-100 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-accent-800">
                      Recommended
                    </span>
                  )}
                </div>

                <p className="mt-3 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">{template.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {template.targetFields.map((field) => (
                    <span key={field} className="rounded-full border border-border/70 bg-white/80 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-on-surface-muted">
                      {field}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </ControlGroup>

      <ControlGroup
        label="Palette"
        description="Keep the accent rare so it carries emphasis instead of noise."
      >
        <div className="grid gap-2 max-h-[21rem] overflow-y-auto pr-1">
          {PALETTES.map((palette) => {
            const neutral = palette.neutral as unknown as Record<string, string>
            const accent = palette.accent as unknown as Record<string, string>

            return (
              <button
                key={palette.id}
                type="button"
                onClick={() => updateMeta({ palette: palette.id })}
                className={`rounded-[20px] border p-3 text-left transition-all duration-[var(--duration-fast)] ${meta.palette === palette.id
                  ? 'border-primary-300 bg-primary-50 shadow-sm'
                  : 'border-border bg-white/75 hover:border-primary-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5 flex-shrink-0">
                    {[neutral['900'], neutral['700'], accent['500'], accent['300'], neutral['100']].map((color, index) => (
                      <div
                        key={index}
                        className="h-9 w-9 rounded-full border border-neutral-200/60"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-on-surface truncate">{palette.name}</div>
                    <div className="mt-1 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">{palette.description}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </ControlGroup>

      <ControlGroup
        label="Typography"
        description="Use the preview to judge whether the voice reads executive, technical, academic, or creative."
      >
        <div className="grid gap-2 max-h-[24rem] overflow-y-auto pr-1">
          {FONT_PAIRINGS.map((pairing) => (
            <button
              key={pairing.id}
              type="button"
              onClick={() => updateMeta({ fontPairing: pairing.id })}
              className={`rounded-[20px] border p-4 text-left transition-all duration-[var(--duration-fast)] ${meta.fontPairing === pairing.id
                ? 'border-primary-300 bg-primary-50 shadow-sm'
                : 'border-border bg-white/75 hover:border-primary-200 hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="shell-kicker">{pairing.heading} + {pairing.body}</p>
                  <p className="mt-3 text-2xl text-on-surface" style={{ fontFamily: `${pairing.heading}, var(--font-display)` }}>
                    Publish with restraint.
                  </p>
                  <p className="mt-2 text-[var(--font-size-body-sm)] text-on-surface-muted" style={{ fontFamily: `${pairing.body}, var(--font-body)` }}>
                    A clear line of experience that reads well in print and on screen.
                  </p>
                </div>
                <span className="rounded-full border border-border/70 bg-white/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-on-surface-muted">
                  {pairing.name}
                </span>
              </div>

              <p className="mt-3 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">{pairing.description}</p>
            </button>
          ))}
        </div>
      </ControlGroup>

      <ControlGroup
        label="Density"
        description="Tighten or loosen the document rhythm depending on how much material you need to fit."
      >
        <div className="grid grid-cols-3 gap-2 rounded-full border border-border/70 bg-white/80 p-1">
          {(['compact', 'balanced', 'spacious'] as const).map((density) => (
            <button
              key={density}
              type="button"
              onClick={() => updateMeta({ layoutDensity: density })}
              className={`rounded-full px-3 py-2 text-sm font-semibold capitalize transition-all duration-[var(--duration-fast)] ${meta.layoutDensity === density
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-on-surface-muted hover:bg-white hover:text-on-surface'
              }`}
            >
              {density}
            </button>
          ))}
        </div>
      </ControlGroup>

      <ControlGroup
        label="Appearance"
        description="Dark mode applies to the document itself, not the surrounding product shell."
      >
        <div className="grid grid-cols-2 gap-3">
          {[
            { active: false, label: 'Light document', description: 'Bright paper and classic contrast.' },
            { active: true, label: 'Dark document', description: 'Higher drama for creative-forward sharing.' },
          ].map((option) => (
            <button
              key={String(option.active)}
              type="button"
              onClick={() => updateMeta({ darkMode: option.active })}
              className={`rounded-[20px] border p-4 text-left transition-all duration-[var(--duration-fast)] ${meta.darkMode === option.active
                ? 'border-primary-300 bg-primary-50 shadow-sm'
                : 'border-border bg-white/75 hover:border-primary-200 hover:bg-white'
              }`}
            >
              <p className="text-sm font-semibold text-on-surface">{option.label}</p>
              <p className="mt-2 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">{option.description}</p>
            </button>
          ))}
        </div>
      </ControlGroup>

      <ControlGroup
        label="Sections"
        description="Hidden sections are removed from the rendered resume, so use these controls to shape the final reader-facing document."
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {Object.entries(SECTION_LABELS).map(([key, label]) => {
            const isVisible = meta.sectionVisibility[key] ?? true

            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleSection(key)}
                className={`rounded-[18px] border px-4 py-3 text-left transition-all duration-[var(--duration-fast)] ${isVisible
                  ? 'border-primary-200 bg-white/85 text-on-surface hover:border-primary-300'
                  : 'border-border bg-neutral-100/80 text-on-surface-muted hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{label}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] ${isVisible
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-neutral-200 text-on-surface-muted'
                  }`}>
                    {isVisible ? 'Show' : 'Hide'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </ControlGroup>
    </div>
  )
}

function ControlGroup({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="editor-label mb-2">{label}</h3>
        {description && <p className="text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">{description}</p>}
      </div>
      {children}
    </div>
  )
}
