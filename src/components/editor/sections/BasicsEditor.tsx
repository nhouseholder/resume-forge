import { useState, useCallback } from 'react'
import { useResumeStore } from '@/store/useResumeStore'
import type { ResumeBasics } from '@/types/resume'

export function BasicsEditor() {
  const resume = useResumeStore((s) => s.resume)
  const updateSection = useResumeStore((s) => s.updateSection)

  const basics = resume?.basics ?? { name: '' }
  const [local, setLocal] = useState<ResumeBasics>(basics)

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
      <h2 className="text-[var(--font-size-h2)] font-display text-on-surface">Basic Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Full Name" value={local.name ?? ''} onChange={(v) => update({ name: v })} autoFocus />
        <Field label="Title / Label" value={local.label ?? ''} onChange={(v) => update({ label: v })} placeholder="e.g. Senior Software Engineer" />
        <Field label="Email" type="email" value={local.email ?? ''} onChange={(v) => update({ email: v })} />
        <Field label="Phone" type="tel" value={local.phone ?? ''} onChange={(v) => update({ phone: v })} />
        <Field label="Website" type="url" value={local.url ?? ''} onChange={(v) => update({ url: v })} />
      </div>

      <div>
        <label className="block text-[var(--font-size-body-sm)] font-medium text-on-surface-muted mb-1.5">Professional Summary</label>
        <textarea
          value={local.summary ?? ''}
          onChange={(e) => update({ summary: e.target.value })}
          rows={4}
          placeholder="Brief professional overview..."
          className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface text-on-surface
            focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y text-[var(--font-size-body)]
            transition-shadow duration-[var(--duration-fast)]"
        />
      </div>

      <div className="pt-4 border-t border-border/60">
        <h3 className="text-[var(--font-size-h3)] font-display text-on-surface">Location</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Field label="City" value={local.location?.city ?? ''} onChange={(v) => updateLocation('city', v)} />
        <Field label="State / Region" value={local.location?.region ?? ''} onChange={(v) => updateLocation('region', v)} />
        <Field label="Country Code" value={local.location?.countryCode ?? ''} onChange={(v) => updateLocation('countryCode', v)} placeholder="US" />
      </div>

      <div className="pt-4 border-t border-border/60">
        <div className="flex items-center justify-between">
          <h3 className="text-[var(--font-size-h3)] font-display text-on-surface">Social Profiles</h3>
          <button
            onClick={addProfile}
            className="text-[var(--font-size-body-sm)] font-medium text-primary-600 hover:text-primary-700
              transition-colors duration-[var(--duration-fast)]"
          >
            + Add profile
          </button>
        </div>
      </div>
      {(local.profiles ?? []).length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border rounded-lg">
          <p className="text-[var(--font-size-body)] font-medium text-on-surface">Add your first profile</p>
          <p className="text-[var(--font-size-body-sm)] text-on-surface-muted mt-2 max-w-sm mx-auto leading-relaxed">
            Link your LinkedIn, GitHub, personal site, or other professional profiles.
          </p>
          <button
            onClick={addProfile}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white
              text-[var(--font-size-body-sm)] font-medium
              hover:bg-primary-700 active:scale-[0.97]
              transition-all duration-[var(--duration-fast)]"
          >
            Add profile
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {(local.profiles ?? []).map((profile, i) => (
            <div key={i} className="flex gap-3 items-end">
              <div className="flex-1">
                <Field label="Network" value={profile.network} onChange={(v) => updateProfile(i, 'network', v)} placeholder="LinkedIn, GitHub, etc." />
              </div>
              <div className="flex-1">
                <Field label="URL" type="url" value={profile.url ?? ''} onChange={(v) => updateProfile(i, 'url', v)} />
              </div>
              <button
                onClick={() => removeProfile(i)}
                className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                aria-label="Remove profile"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
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
      <label className="block text-[var(--font-size-body-sm)] font-medium text-on-surface-muted mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface text-on-surface text-[var(--font-size-body)]
          focus:outline-none focus:ring-2 focus:ring-primary-500
          transition-shadow duration-[var(--duration-fast)]"
      />
    </div>
  )
}
