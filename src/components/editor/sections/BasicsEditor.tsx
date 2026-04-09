import { useState, useCallback, useEffect } from 'react'
import { useResumeStore } from '@/store/useResumeStore'
import type { ResumeBasics } from '@/types/resume'

const EMPTY_BASICS: ResumeBasics = { name: '' }

export function BasicsEditor() {
  const basics = useResumeStore((s) => s.resume?.basics ?? EMPTY_BASICS)
  const updateSection = useResumeStore((s) => s.updateSection)

  const [local, setLocal] = useState<ResumeBasics>(basics)

  useEffect(() => {
    setLocal(basics)
  }, [basics])

  const update = useCallback(
    (partial: Partial<ResumeBasics>) => {
      const next = { ...local, ...partial }
      setLocal(next)
      updateSection('basics', next)
    },
    [local, updateSection],
  )

  const updateLocation = useCallback(
    (field: string, value: string) => {
      const location = { ...local.location, [field]: value } as ResumeBasics['location']
      update({ location })
    },
    [local, update],
  )

  const addProfile = () => {
    const profiles = [...(local.profiles ?? []), { network: '', url: '' }]
    update({ profiles })
  }

  const removeProfile = (index: number) => {
    const profiles = (local.profiles ?? []).filter((_, i) => i !== index)
    update({ profiles })
  }

  const updateProfile = (index: number, field: string, value: string) => {
    const profiles = (local.profiles ?? []).map((p, i) =>
      i === index ? { ...p, [field]: value } : p,
    )
    update({ profiles })
  }

  return (
    <div className="space-y-8">
      <header className="editor-section-header">
        <span className="shell-kicker">Core profile</span>
        <h2 className="text-[var(--font-size-h2)] text-on-surface">Basic information</h2>
        <p className="editor-note max-w-2xl">
          Set the identity line, contact details, summary, and public links that frame the rest of the resume.
        </p>
      </header>

      <div className="shell-card p-5 sm:p-6">
        <p className="shell-kicker">Identity</p>
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Full Name" value={local.name ?? ''} onChange={(v) => update({ name: v })} autoFocus />
          <Field label="Title / Label" value={local.label ?? ''} onChange={(v) => update({ label: v })} placeholder="e.g. Senior Software Engineer" />
          <Field label="Email" type="email" value={local.email ?? ''} onChange={(v) => update({ email: v })} />
          <Field label="Phone" type="tel" value={local.phone ?? ''} onChange={(v) => update({ phone: v })} />
          <Field label="Website" type="url" value={local.url ?? ''} onChange={(v) => update({ url: v })} />
        </div>
      </div>

      <div className="shell-card p-5 sm:p-6">
        <label className="editor-label">Professional Summary</label>
        <textarea
          value={local.summary ?? ''}
          onChange={(e) => update({ summary: e.target.value })}
          rows={4}
          placeholder="Brief professional overview..."
          className="editor-textarea text-[var(--font-size-body)]"
        />
      </div>

      <div className="shell-card p-5 sm:p-6">
        <p className="shell-kicker">Location</p>
        <h3 className="mt-2 text-[var(--font-size-h3)] text-on-surface">Reader-facing geography</h3>
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
          <Field label="City" value={local.location?.city ?? ''} onChange={(v) => updateLocation('city', v)} />
          <Field label="State / Region" value={local.location?.region ?? ''} onChange={(v) => updateLocation('region', v)} />
          <Field label="Country Code" value={local.location?.countryCode ?? ''} onChange={(v) => updateLocation('countryCode', v)} placeholder="US" />
        </div>
      </div>

      <div className="shell-card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="shell-kicker">Public links</p>
            <h3 className="mt-2 text-[var(--font-size-h3)] text-on-surface">Social profiles</h3>
          </div>
          <button
            type="button"
            onClick={addProfile}
            className="rounded-full border border-border bg-white/80 px-4 py-2 text-[var(--font-size-body-sm)] font-semibold text-on-surface transition-all duration-[var(--duration-fast)] hover:-translate-y-0.5 hover:bg-white"
          >
            Add profile
          </button>
        </div>

        {(local.profiles ?? []).length === 0 ? (
          <div className="editor-empty mt-5 px-5 py-8 text-center">
            <p className="text-[var(--font-size-body)] font-medium text-on-surface">Add your first profile</p>
            <p className="mx-auto mt-2 max-w-sm text-[var(--font-size-body-sm)] leading-relaxed text-on-surface-muted">
            Link your LinkedIn, GitHub, personal site, or other professional profiles.
            </p>
            <button
              type="button"
              onClick={addProfile}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-4 py-2 text-[var(--font-size-body-sm)] font-semibold text-white transition-all duration-[var(--duration-fast)] hover:-translate-y-0.5 hover:bg-primary-700"
            >
              Add profile
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {(local.profiles ?? []).map((profile, i) => (
              <div key={i} className="rounded-[20px] border border-border/70 bg-white/80 p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
                  <Field label="Network" value={profile.network} onChange={(v) => updateProfile(i, 'network', v)} placeholder="LinkedIn, GitHub, etc." />
                  <Field label="URL" type="url" value={profile.url ?? ''} onChange={(v) => updateProfile(i, 'url', v)} />
                  <button
                    type="button"
                    onClick={() => removeProfile(i)}
                    className="rounded-full border border-border bg-white/80 p-3 text-neutral-500 transition-all duration-[var(--duration-fast)] hover:border-primary-200 hover:text-primary-700"
                    aria-label="Remove profile"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Reusable field component ── */

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoFocus,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  autoFocus?: boolean
}) {
  return (
    <div>
      <label className="editor-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="editor-input text-[var(--font-size-body)]"
      />
    </div>
  )
}
