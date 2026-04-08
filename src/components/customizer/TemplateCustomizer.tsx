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
        <span className="shell-kicker">House style proofs</span>
        <h2 className="text-[var(--font-size-h2)] text-on-surface">Choose the publishing treatment</h2>
        <p className="editor-note max-w-xl">
          Start with the house layout, then review palette, typography, spacing, and visibility like specimen proofs. Every choice changes the rendered page directly.
        </p>
        {detectedField && (
          <div className="folio-meta mt-2">
            <span>Detected field</span>
            <span>{detectedField}</span>
          </div>
        )}
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
                className={`rounded-[12px] border p-4 text-left transition-all duration-[var(--duration-fast)] ${meta.templateId === template.id
                  ? 'border-primary-400 bg-primary-50/35'
                  : 'border-border/80 bg-transparent hover:border-primary-200 hover:bg-white/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="shell-kicker">House layout</p>
                    <p className="mt-2 text-[var(--font-size-h4)] font-semibold text-on-surface">{template.name}</p>
                  </div>
                  {recommended && (
                    <span className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-accent-800">
                      Field match
                    </span>
                  )}
                </div>

                <p className="mt-3 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">{template.description}</p>

                <div className="mt-4 flex flex-wrap gap-3 border-t border-border/70 pt-3">
                  {template.targetFields.map((field) => (
                    <span key={field} className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-on-surface-muted">
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
                className={`rounded-[12px] border p-3 text-left transition-all duration-[var(--duration-fast)] ${meta.palette === palette.id
                  ? 'border-primary-400 bg-primary-50/35'
                  : 'border-border/80 bg-transparent hover:border-primary-200 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5 flex-shrink-0">
                    {[neutral['900'], neutral['700'], accent['500'], accent['300'], neutral['100']].map((color, index) => (
                      <div
                        key={index}
                        className="h-8 w-8 rounded-[3px] border border-neutral-200/60"
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
              className={`rounded-[12px] border p-4 text-left transition-all duration-[var(--duration-fast)] ${meta.fontPairing === pairing.id
                ? 'border-primary-400 bg-primary-50/35'
                : 'border-border/80 bg-transparent hover:border-primary-200 hover:bg-white/60'
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
                <span className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-on-surface-muted">
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
        <div className="grid grid-cols-3 border border-border/70 bg-white/70">
          {(['compact', 'balanced', 'spacious'] as const).map((density) => (
            <button
              key={density}
              type="button"
              onClick={() => updateMeta({ layoutDensity: density })}
              className={`border-r border-border/70 px-3 py-2.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-all duration-[var(--duration-fast)] last:border-r-0 ${meta.layoutDensity === density
                ? 'bg-primary-50 text-on-surface'
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
              className={`rounded-[12px] border p-4 text-left transition-all duration-[var(--duration-fast)] ${meta.darkMode === option.active
                ? 'border-primary-400 bg-primary-50/35'
                : 'border-border/80 bg-transparent hover:border-primary-200 hover:bg-white/60'
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
                className={`rounded-[10px] border px-4 py-3 text-left transition-all duration-[var(--duration-fast)] ${isVisible
                  ? 'border-primary-200 bg-white/85 text-on-surface hover:border-primary-300'
                  : 'border-border bg-neutral-100/80 text-on-surface-muted hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{label}</span>
                  <span className={`font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] ${isVisible
                    ? 'text-primary-700'
                    : 'text-on-surface-muted'
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
