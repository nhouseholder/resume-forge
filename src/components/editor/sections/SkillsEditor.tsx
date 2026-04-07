import { useResumeStore } from '@/store/useResumeStore'
import type { ResumeSkill } from '@/types/resume'

export function SkillsEditor() {
  const resume = useResumeStore((s) => s.resume)
  const updateSection = useResumeStore((s) => s.updateSection)
  const addSectionItem = useResumeStore((s) => s.addSectionItem)
  const removeSectionItem = useResumeStore((s) => s.removeSectionItem)

  const skills = resume?.skills ?? []

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
      <div className="flex items-center justify-between">
        <h2 className="text-[var(--font-size-h2)] font-display text-on-surface">
          Skills
          <span className="ml-2 text-[var(--font-size-body-sm)] font-body font-normal text-on-surface-muted">
            ({skills.length})
          </span>
        </h2>
        <button
          onClick={addSkill}
          className="px-4 py-2 rounded-lg text-[var(--font-size-body-sm)] font-medium bg-primary-600 text-white
            transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-quart)]
            hover:bg-primary-700 active:scale-[0.97]"
        >
          Add skill
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <p className="text-[var(--font-size-body)] font-medium text-on-surface">Add your first skill</p>
          <p className="text-[var(--font-size-body-sm)] text-on-surface-muted mt-2 max-w-sm mx-auto leading-relaxed">
            Skills are extracted from your resume. Add or edit them here — include technical tools,
            languages, and professional competencies.
          </p>
          <button
            onClick={addSkill}
            className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white
              text-[var(--font-size-body-sm)] font-medium
              hover:bg-primary-700 active:scale-[0.97]
              transition-all duration-[var(--duration-fast)]"
          >
            Add skill
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-border bg-surface-elevated flex flex-wrap gap-3 items-end
                hover:shadow-sm
                transition-shadow duration-[var(--duration-fast)]"
            >
              <div className="flex-1 min-w-[150px]">
                <label className="block text-[var(--font-size-body-sm)] font-medium text-on-surface-muted mb-1.5">Skill Name</label>
                <input
                  value={skill.name}
                  onChange={(e) => updateSkill(index, 'name', e.target.value)}
                  placeholder="e.g. React, Python, Data Analysis"
                  autoFocus={index === 0}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface text-on-surface text-[var(--font-size-body-sm)]
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                    transition-shadow duration-[var(--duration-fast)]"
                />
              </div>
              <div className="w-40">
                <label className="block text-[var(--font-size-body-sm)] font-medium text-on-surface-muted mb-1.5">Level</label>
                <select
                  value={skill.level ?? 'intermediate'}
                  onChange={(e) => updateSkill(index, 'level', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface text-on-surface text-[var(--font-size-body-sm)]
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                    transition-shadow duration-[var(--duration-fast)]"
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[var(--font-size-body-sm)] font-medium text-on-surface-muted mb-1.5">Keywords (comma-separated)</label>
                <input
                  value={(skill.keywords ?? []).join(', ')}
                  onChange={(e) => updateKeywords(index, e.target.value)}
                  placeholder="hook, context, reducers"
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface text-on-surface text-[var(--font-size-body-sm)]
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                    transition-shadow duration-[var(--duration-fast)]"
                />
              </div>
              <button
                onClick={() => removeSectionItem('skills', index)}
                className="p-2 text-neutral-400 hover:text-red-500 rounded-md
                  transition-colors duration-[var(--duration-fast)]"
                aria-label="Remove skill"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
