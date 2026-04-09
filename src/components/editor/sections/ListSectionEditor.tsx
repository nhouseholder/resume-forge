import type React from 'react'
import { useResumeStore } from '@/store/useResumeStore'
import type { ResumeData } from '@/types/resume'

export interface FieldDef {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'date' | 'url' | 'email'
  placeholder?: string
  required?: boolean
}

interface ListSectionEditorProps {
  sectionKey: keyof ResumeData
  title: string
  fields: FieldDef[]
  /** Create a blank item for this section */
  createBlank: () => Record<string, unknown>
  /** Render a title for a card from its data */
  getCardTitle: (item: Record<string, unknown>) => string
}

export function ListSectionEditor({
  sectionKey,
  title,
  fields,
  createBlank,
  getCardTitle,
}: ListSectionEditorProps) {
  const items = useResumeStore((s) => (s.resume?.[sectionKey] as unknown as Record<string, unknown>[]) ?? [])
  const updateSection = useResumeStore((s) => s.updateSection)
  const addSectionItem = useResumeStore((s) => s.addSectionItem)
  const removeSectionItem = useResumeStore((s) => s.removeSectionItem)

  const handleAdd = () => {
    addSectionItem(sectionKey, createBlank())
  }

  const handleRemove = (index: number) => {
    removeSectionItem(sectionKey, index)
  }

  const handleFieldChange = (index: number, fieldKey: string, value: unknown) => {
    const updated = items.map((item, i) =>
      i === index ? { ...(item as Record<string, unknown>), [fieldKey]: value } : item,
    )
    updateSection(sectionKey, updated as unknown as ResumeData[typeof sectionKey])
  }

  const handleHighlightChange = (index: number, highlightIndex: number, value: string) => {
    const item = items[index] as Record<string, unknown>
    const highlights = (item.highlights as string[]) ?? []
    const updated = highlights.map((h, i) => (i === highlightIndex ? value : h))
    const newItems = items.map((it, i) =>
      i === index ? { ...(it as Record<string, unknown>), highlights: updated } : it,
    )
    updateSection(sectionKey, newItems as unknown as ResumeData[typeof sectionKey])
  }

  const addHighlight = (index: number) => {
    const item = items[index] as Record<string, unknown>
    const highlights = [...((item.highlights as string[]) ?? []), '']
    const newItems = items.map((it, i) =>
      i === index ? { ...(it as Record<string, unknown>), highlights } : it,
    )
    updateSection(sectionKey, newItems as unknown as ResumeData[typeof sectionKey])
  }

  const removeHighlight = (index: number, highlightIndex: number) => {
    const item = items[index] as Record<string, unknown>
    const highlights = (item.highlights as string[])?.filter((_, i) => i !== highlightIndex) ?? []
    const newItems = items.map((it, i) =>
      i === index ? { ...(it as Record<string, unknown>), highlights } : it,
    )
    updateSection(sectionKey, newItems as unknown as ResumeData[typeof sectionKey])
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="shell-kicker">Section editor</p>
          <h2 className="text-[var(--font-size-h2)] text-on-surface">
          {title}
          <span className="ml-2 text-[var(--font-size-body-sm)] font-body font-normal text-on-surface-muted">
            ({items.length})
          </span>
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">
            Build this section entry by entry. Use highlights for the clearest, outcome-driven lines.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-full bg-primary-600 px-4 py-2 text-[var(--font-size-body-sm)] font-semibold text-white transition-all duration-[var(--duration-fast)] hover:-translate-y-0.5 hover:bg-primary-700"
        >
          Add entry
        </button>
      </div>

      {items.length === 0 ? (
        <div className="editor-empty px-5 py-12 text-center">
          <p className="text-[var(--font-size-body)] text-on-surface-muted">
            No {title.toLowerCase()} yet.
          </p>
          <p className="text-[var(--font-size-body-sm)] text-on-surface-muted mt-1">
            Add your first entry to get started.
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-4 rounded-full bg-primary-600 px-4 py-2 text-[var(--font-size-body-sm)] font-semibold text-white transition-all duration-[var(--duration-fast)] hover:-translate-y-0.5 hover:bg-primary-700"
          >
            Add your first {title.toLowerCase().replace(/s$/, '')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index): React.ReactNode => {
            const record = item as Record<string, unknown>
            return (
            <div
              key={index}
              className="shell-card p-5"
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[var(--font-size-body)] font-semibold text-on-surface truncate">
                  {getCardTitle(record) || `Entry ${index + 1}`}
                </h3>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="rounded-full border border-border bg-white/80 p-2 text-neutral-500 transition-all duration-[var(--duration-fast)] hover:border-primary-200 hover:text-primary-700"
                  aria-label="Remove entry"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {fields.map((field): React.ReactNode => {
                  const value = (record[field.key] as string) ?? ''
                  if (field.type === 'textarea') {
                    return (
                      <div key={field.key} className={mdColSpan(field.key)}>
                        <label className="editor-label">
                          {field.label}
                        </label>
                        <textarea
                          value={value}
                          onChange={(e) => handleFieldChange(index, field.key, e.target.value)}
                          rows={3}
                          placeholder={field.placeholder}
                          className="editor-textarea text-[var(--font-size-body-sm)]"
                        />
                      </div>
                    )
                  }
                  return (
                    <div key={field.key}>
                      <label className="editor-label">
                        {field.label}
                      </label>
                      <input
                        type={field.type ?? 'text'}
                        value={value}
                        onChange={(e) => handleFieldChange(index, field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="editor-input text-[var(--font-size-body-sm)]"
                      />
                    </div>
                  )
                })}
              </div>

              {/* Highlights */}
              {Array.isArray(record.highlights) && (
                <div className="editor-divider mt-5 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="editor-label mb-0">Highlights</label>
                    <button
                      type="button"
                      onClick={() => addHighlight(index)}
                      className="rounded-full border border-border bg-white/80 px-3 py-1.5 text-[var(--font-size-caption)] font-semibold text-on-surface transition-all duration-[var(--duration-fast)] hover:border-primary-200 hover:text-primary-700"
                    >
                      Add highlight
                    </button>
                  </div>
                  <div className="space-y-2">
                    {((record.highlights as string[]) ?? []).map((h, hi) => (
                      <div key={hi} className="flex gap-2 items-start">
                        <span className="mt-2.5 text-[var(--font-size-caption)] text-on-surface-muted" aria-hidden="true">•</span>
                        <input
                          value={h}
                          onChange={(e) => handleHighlightChange(index, hi, e.target.value)}
                          placeholder="Achievement or responsibility..."
                          className="editor-input flex-1 text-[var(--font-size-body-sm)]"
                        />
                        <button
                          type="button"
                          onClick={() => removeHighlight(index, hi)}
                          className="mt-0.5 rounded-full border border-border bg-white/80 p-2 text-neutral-500 transition-all duration-[var(--duration-fast)] hover:border-primary-200 hover:text-primary-700"
                          aria-label="Remove highlight"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
          })}
        </div>
      )}
    </div>
  )
}

function mdColSpan(key: string): string {
  const fullWidth = ['summary', 'description']
  return fullWidth.includes(key) ? 'md:col-span-2' : ''
}
