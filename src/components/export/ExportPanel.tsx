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
        <span className="shell-kicker">Dispatch desk</span>
        <h2 className="text-[var(--font-size-h2)] text-on-surface">Issue the finished document</h2>
        <p className="editor-note max-w-xl">
          Use the reader-facing share link when the page is ready to circulate, or open the print flow when you need a clean PDF copy of the same dossier.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DispatchCard
          eyebrow="Reader copy"
          title="Issue share URL"
          description="Anyone with the link can review the current resume snapshot without editing access or an account."
          actionLabel="Copy link"
          onAction={copyShareLink}
          primary
        />
        <DispatchCard
          eyebrow="Print ticket"
          title="Open PDF print flow"
          description="Use the browser print dialog to capture the same page as a print-ready PDF with the document styles preserved."
          actionLabel="Print to PDF"
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

function DispatchCard({
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
    <div className="proof-ticket p-5">
      <p className="shell-kicker">{eyebrow}</p>
      <h3 className="mt-3 text-[var(--font-size-h3)] text-on-surface">{title}</h3>
      <p className="mt-3 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">{description}</p>
      <button
        type="button"
        onClick={onAction}
        className={`mt-5 desk-button ${primary
          ? 'desk-button-primary'
          : 'desk-button-subtle'
        }`}
      >
        {actionLabel}
      </button>
    </div>
  )
}
