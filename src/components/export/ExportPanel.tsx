import { useCallback, useState } from 'react'
import { buildSharedResumeUrl } from '@/components/export/shareExporter'
import { useResumeStore } from '@/store/useResumeStore'

/**
 * ExportPanel — PDF export via browser print.
 * Uses window.print() with @media print styles that isolate the resume preview.
 */
export function ExportPanel() {
  const resume = useResumeStore((s) => s.resume)
  const meta = useResumeStore((s) => s.meta)
  const [notice, setNotice] = useState<{ kind: 'success' | 'error'; message: string } | null>(null)

  const exportPDF = useCallback(() => {
    window.print()
  }, [])

  const copyShareLink = useCallback(async () => {
    if (!resume) {
      setNotice({ kind: 'error', message: 'Add resume content before creating a share link.' })
      return
    }

    const result = buildSharedResumeUrl({
      resume: { ...resume, meta },
      meta,
      origin: window.location.origin,
    })

    if (!result.ok) {
      setNotice({ kind: 'error', message: result.error })
      return
    }

    try {
      await navigator.clipboard.writeText(result.url)
      setNotice({ kind: 'success', message: 'Share link copied. Anyone with the link can view this resume.' })
    } catch {
      window.prompt('Copy this share link', result.url)
      setNotice({ kind: 'success', message: 'Share link ready. Use the dialog to copy it.' })
    }
  }, [meta, resume])

  if (!resume) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="editor-section-header">
        <span className="shell-kicker">Publish options</span>
        <h2 className="text-[var(--font-size-h2)] text-on-surface">Send the finished artifact</h2>
        <p className="editor-note max-w-xl">
          Share a read-only link for browser viewing, or open the print flow to generate a PDF with the current template and styling.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <PublishCard
          eyebrow="Read-only link"
          title="Copy share URL"
          description="Anyone with the link can view the current resume snapshot without needing an account."
          actionLabel="Copy share link"
          onAction={copyShareLink}
          primary
        />
        <PublishCard
          eyebrow="Print-ready file"
          title="Open PDF print flow"
          description="Use the browser print dialog to save the current resume as a PDF with the production print styles applied."
          actionLabel="Save as PDF"
          onAction={exportPDF}
        />
      </div>

      {notice && (
        <p
          aria-live="polite"
          className={`text-[var(--font-size-body-sm)] ${notice.kind === 'success' ? 'text-primary-700' : 'text-red-600'}`}
        >
          {notice.message}
        </p>
      )}
    </div>
  )
}

function PublishCard({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
  primary = false,
}: {
  eyebrow: string
  title: string
  description: string
  actionLabel: string
  onAction: () => void
  primary?: boolean
}) {
  return (
    <div className="shell-card p-5">
      <p className="shell-kicker">{eyebrow}</p>
      <h3 className="mt-3 text-[var(--font-size-h3)] text-on-surface">{title}</h3>
      <p className="mt-3 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">{description}</p>
      <button
        type="button"
        onClick={onAction}
        className={`mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-[var(--duration-fast)] ${primary
          ? 'bg-primary-600 text-white hover:-translate-y-0.5 hover:bg-primary-700'
          : 'border border-border bg-white/80 text-on-surface hover:-translate-y-0.5 hover:bg-white'
        }`}
      >
        {actionLabel}
      </button>
    </div>
  )
}
