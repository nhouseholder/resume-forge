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
    <div className="max-w-md text-right">
      <div className="text-xs leading-relaxed text-on-surface-muted">
        Share a read-only link or save this design as a PDF directly from your browser.
      </div>

      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <button
          onClick={copyShareLink}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-primary-600 active:bg-primary-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 6.364 6.364l-4.243 4.243a4.5 4.5 0 0 1-6.364-6.364m4.242-4.242-4.242 4.242m-6.364 6.364a4.5 4.5 0 0 1 0-6.364l4.243-4.243a4.5 4.5 0 0 1 6.364 6.364" />
          </svg>
          Copy share link
        </button>

        <button
          onClick={exportPDF}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-on-surface transition-colors duration-150 hover:bg-neutral-50 active:bg-neutral-100"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-2.25 0h.008v.008H16.5V12z" />
          </svg>
          Save as PDF
        </button>
      </div>

      {notice && (
        <p
          aria-live="polite"
          className={`mt-2 text-xs ${notice.kind === 'success' ? 'text-primary-700' : 'text-red-600'}`}
        >
          {notice.message}
        </p>
      )}
    </div>
  )
}
