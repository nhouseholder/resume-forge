import { useResumeStore } from '@/store/useResumeStore'
import { PALETTES } from '@/design/palettes'
import { FONT_PAIRINGS } from '@/design/fontPairings'
import { TEMPLATE_REGISTRY } from '@/components/templates/templateConfig'

// ── Section labels for visibility toggles ──

const SECTION_LABELS: Record<string, string> = {
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

/**
 * TemplateCustomizer — Design controls panel.
 * Template selection, palette, font, density, dark mode, section visibility.
 */
export function TemplateCustomizer() {
  const meta = useResumeStore((s) => s.meta)
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
    <div className="space-y-6">
      {/* ── Template Selection ── */}
      <ControlGroup label="Template">
        <div className="grid grid-cols-3 gap-2">
          {TEMPLATE_REGISTRY.map((t) => (
            <button
              key={t.id}
              onClick={() => updateMeta({ templateId: t.id })}
              className={`
                flex flex-col items-start p-3 rounded-lg border-2 text-left transition-all duration-150
                ${meta.templateId === t.id
                  ? 'border-primary-500 bg-primary-50 shadow-sm'
                  : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'}
              `}
            >
              <span className="text-sm font-semibold text-on-surface leading-tight">{t.name}</span>
              <span className="text-[11px] text-on-surface-muted mt-1 leading-tight line-clamp-2">{t.description}</span>
            </button>
          ))}
        </div>
      </ControlGroup>

      {/* ── Palette ── */}
      <ControlGroup label="Color Palette">
        <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
          {PALETTES.map((p) => {
            const neutral = p.neutral as unknown as Record<string, string>
            const accent = p.accent as unknown as Record<string, string>
            return (
              <button
                key={p.id}
                onClick={() => updateMeta({ palette: p.id })}
                className={`
                  flex items-center gap-3 p-2 rounded-lg text-left transition-all duration-150
                  ${meta.palette === p.id
                    ? 'bg-primary-50 ring-1 ring-primary-300'
                    : 'hover:bg-neutral-50'}
                `}
              >
                {/* Color swatches */}
                <div className="flex gap-0.5 flex-shrink-0">
                  {[neutral['900'], neutral['700'], accent['500'], accent['300'], neutral['100']].map((color, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-sm border border-neutral-200/60"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-on-surface truncate">{p.name}</div>
                  <div className="text-[11px] text-on-surface-muted truncate">{p.description}</div>
                </div>
              </button>
            )
          })}
        </div>
      </ControlGroup>

      {/* ── Font Pairing ── */}
      <ControlGroup label="Typography">
        <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
          {FONT_PAIRINGS.map((f) => (
            <button
              key={f.id}
              onClick={() => updateMeta({ fontPairing: f.id })}
              className={`
                flex items-center justify-between p-2 rounded-lg text-left transition-all duration-150
                ${meta.fontPairing === f.id
                  ? 'bg-primary-50 ring-1 ring-primary-300'
                  : 'hover:bg-neutral-50'}
              `}
            >
              <div className="min-w-0">
                <div className="text-sm font-medium text-on-surface truncate">{f.name}</div>
                <div className="text-[11px] text-on-surface-muted truncate">
                  {f.heading} + {f.body}
                </div>
              </div>
              <span className="text-[11px] text-on-surface-muted flex-shrink-0 ml-2">{f.description}</span>
            </button>
          ))}
        </div>
      </ControlGroup>

      {/* ── Layout Density ── */}
      <ControlGroup label="Layout">
        <div className="flex gap-2">
          {(['compact', 'balanced', 'spacious'] as const).map((density) => (
            <button
              key={density}
              onClick={() => updateMeta({ layoutDensity: density })}
              className={`
                flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all duration-150
                ${meta.layoutDensity === density
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-neutral-100 text-on-surface-muted hover:bg-neutral-200'}
              `}
            >
              {density}
            </button>
          ))}
        </div>
      </ControlGroup>

      {/* ── Dark Mode ── */}
      <ControlGroup label="Appearance">
        <button
          onClick={() => updateMeta({ darkMode: !meta.darkMode })}
          className={`
            w-full flex items-center justify-between py-2 px-3 rounded-lg text-sm transition-all duration-150
            ${meta.darkMode
              ? 'bg-neutral-800 text-white'
              : 'bg-neutral-100 text-on-surface hover:bg-neutral-200'}
          `}
        >
          <span>{meta.darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
          <span className="text-xs opacity-60">{meta.darkMode ? 'ON' : 'OFF'}</span>
        </button>
      </ControlGroup>

      {/* ── Section Visibility ── */}
      <ControlGroup label="Sections">
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(SECTION_LABELS).map(([key, label]) => {
            const isVisible = meta.sectionVisibility[key] ?? true
            return (
              <button
                key={key}
                onClick={() => toggleSection(key)}
                className={`
                  flex items-center gap-2 py-1.5 px-2 rounded-md text-xs transition-all duration-150
                  ${isVisible
                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                    : 'bg-neutral-100 text-neutral-400 border border-transparent line-through'}
                `}
              >
                <span className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center text-[10px]
                  ${isVisible ? 'bg-primary-500 border-primary-500 text-white' : 'border-neutral-300'}`}
                >
                  {isVisible ? '✓' : ''}
                </span>
                {label}
              </button>
            )
          })}
        </div>
      </ControlGroup>
    </div>
  )
}

// ── Helpers ──

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-muted mb-2">
        {label}
      </h3>
      {children}
    </div>
  )
}
