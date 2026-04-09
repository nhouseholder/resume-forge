import { useResumeStore } from '@/store/useResumeStore'
import type { ResumeSkill } from '@/types/resume'

export function SkillsEditor() {
  const skills = useResumeStore((s) => s.resume?.skills ?? [])
  const updateSection = useResumeStore((s) => s.updateSection)
  const addSectionItem = useResumeStore((s) => s.addSectionItem)
  const removeSectionItem = useResumeStore((s) => s.removeSectionItem)

  const updateSkill = (index: number, field: keyof ResumeSkill, value: string) => {
    const updated = skills.map((s, i) =>
      i === index ? { ...s, [field]: value } : s,
    )
    updateSection('skills', updated)
  }

  const updateKeywords = (index: number, keywords: string) => {
    const updated = skills.map((s, i) =>
      i === index
        ? { ...s, keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean) }
        : s,
    )
    updateSection('skills', updated)
  }

  const addSkill = () => {
    addSectionItem('skills', { name: '', level: 'intermediate' })
  }

  const LEVELS = ['beginner', 'intermediate', 'advanced', 'expert', 'master']

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="shell-kicker">Capabilities</p>
          <h2 className="text-[var(--font-size-h2)] text-on-surface">
          Skills
          <span className="ml-2 text-[var(--font-size-body-sm)] font-body font-normal text-on-surface-muted">
            ({skills.length})
          </span>
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">
            Keep the list readable. Use skill names for the main signal and keywords only where they add searchability or precision.
          </p>
        </div>
        <button
          type="button"
          onClick={addSkill}
          className="rounded-full bg-primary-600 px-4 py-2 text-[var(--font-size-body-sm)] font-semibold text-white transition-all duration-[var(--duration-fast)] hover:-translate-y-0.5 hover:bg-primary-700"
        >
          Add skill
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="editor-empty px-5 py-12 text-center">
          <p className="text-[var(--font-size-body)] font-medium text-on-surface">Add your first skill</p>
          <p className="text-[var(--font-size-body-sm)] text-on-surface-muted mt-2 max-w-sm mx-auto leading-relaxed">
            Skills are extracted from your resume. Add or edit them here — include technical tools,
            languages, and professional competencies.
          </p>
          <button
            type="button"
            onClick={addSkill}
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-4 py-2 text-[var(--font-size-body-sm)] font-semibold text-white transition-all duration-[var(--duration-fast)] hover:-translate-y-0.5 hover:bg-primary-700"
          >
            Add skill
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={index} className="shell-card p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_10rem_minmax(0,1fr)_auto] md:items-end">
                <div className="min-w-[150px]">
                  <label className="editor-label">Skill Name</label>
                  <input
                    value={skill.name}
                    onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    placeholder="e.g. React, Python, Data Analysis"
                    autoFocus={index === 0}
                    className="editor-input text-[var(--font-size-body-sm)]"
                  />
                </div>

                <div className="w-full md:w-40">
                  <label className="editor-label">Level</label>
                  <select
                    value={skill.level ?? 'intermediate'}
                    onChange={(e) => updateSkill(index, 'level', e.target.value)}
                    className="editor-select text-[var(--font-size-body-sm)]"
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l.charAt(0).toUpperCase() + l.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-[200px]">
                  <label className="editor-label">Keywords</label>
                  <input
                    value={(skill.keywords ?? []).join(', ')}
                    onChange={(e) => updateKeywords(index, e.target.value)}
                    placeholder="hook, context, reducers"
                    className="editor-input text-[var(--font-size-body-sm)]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeSectionItem('skills', index)}
                  className="rounded-full border border-border bg-white/80 p-3 text-neutral-500 transition-all duration-[var(--duration-fast)] hover:border-primary-200 hover:text-primary-700"
                  aria-label="Remove skill"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
