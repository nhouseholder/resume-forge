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
  const resume = useResumeStore((s) => s.resume)
  const updateSection = useResumeStore((s) => s.updateSection)
  const addSectionItem = useResumeStore((s) => s.addSectionItem)
  const removeSectionItem = useResumeStore((s) => s.removeSectionItem)

  const items = (resume?.[sectionKey] as unknown as Record<string, unknown>[]) ?? []

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
      <div className="flex items-center justify-between">
        <h2 className="text-[var(--font-size-h2)] font-display text-on-surface">
          {title}
          <span className="ml-2 text-[var(--font-size-body-sm)] font-body font-normal text-on-surface-muted">
            ({items.length})
          </span>
        </h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 rounded-lg text-[var(--font-size-body-sm)] font-medium bg-primary-600 text-white
            transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-quart)]
            hover:bg-primary-700 active:scale-[0.97]"
        >
          Add entry
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <p className="text-[var(--font-size-body)] text-on-surface-muted">
            No {title.toLowerCase()} yet.
          </p>
          <p className="text-[var(--font-size-body-sm)] text-on-surface-muted mt-1">
            Add your first entry to get started.
          </p>
          <button
            onClick={handleAdd}
            className="mt-4 text-[var(--font-size-body-sm)] text-primary-600 hover:text-primary-700 font-medium
              transition-colors duration-[var(--duration-fast)]"
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
              className="p-5 rounded-lg border border-border bg-surface-elevated
                hover:shadow-sm
                transition-shadow duration-[var(--duration-fast)]"
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[var(--font-size-body)] font-semibold text-on-surface truncate">
                  {getCardTitle(record) || `Entry ${index + 1}`}
                </h3>
                <button
                  onClick={() => handleRemove(index)}
                  className="p-1.5 text-neutral-400 hover:text-red-500 rounded-md
                    transition-colors duration-[var(--duration-fast)]"
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
                        <label className="block text-[var(--font-size-body-sm)] font-medium text-on-surface-muted mb-1.5">
                          {field.label}
                        </label>
                        <textarea
                          value={value}
                          onChange={(e) => handleFieldChange(index, field.key, e.target.value)}
                          rows={3}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface text-on-surface
                            text-[var(--font-size-body-sm)] focus:outline-none focus:ring-2 focus:ring-primary-500
                            resize-y transition-shadow duration-[var(--duration-fast)]"
                        />
                      </div>
                    )
                  }
                  return (
                    <div key={field.key}>
                      <label className="block text-[var(--font-size-body-sm)] font-medium text-on-surface-muted mb-1.5">
                        {field.label}
                      </label>
                      <input
                        type={field.type ?? 'text'}
                        value={value}
                        onChange={(e) => handleFieldChange(index, field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface text-on-surface
                          text-[var(--font-size-body-sm)] focus:outline-none focus:ring-2 focus:ring-primary-500
                          transition-shadow duration-[var(--duration-fast)]"
                      />
                    </div>
                  )
                })}
              </div>

              {/* Highlights */}
              {Array.isArray(record.highlights) && (
                <div className="mt-5 pt-4 border-t border-border/60">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-[var(--font-size-body-sm)] font-medium text-on-surface-muted">Highlights</label>
                    <button
                      onClick={() => addHighlight(index)}
                      className="text-[var(--font-size-caption)] text-primary-600 hover:text-primary-700 font-medium
                        transition-colors duration-[var(--duration-fast)]"
                    >
                      + Add highlight
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
                          className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface text-on-surface
                            text-[var(--font-size-body-sm)] focus:outline-none focus:ring-2 focus:ring-primary-500
                            transition-shadow duration-[var(--duration-fast)]"
                        />
                        <button
                          onClick={() => removeHighlight(index, hi)}
                          className="p-1 text-neutral-400 hover:text-red-500 rounded-md mt-0.5
                            transition-colors duration-[var(--duration-fast)]"
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
