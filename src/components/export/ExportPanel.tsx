import { useCallback } from 'react'
import { useResumeStore } from '@/store/useResumeStore'

/**
 * ExportPanel — PDF export via browser print.
 * Uses window.print() with @media print styles that isolate the resume preview.
 */
export function ExportPanel() {
  const resume = useResumeStore((s) => s.resume)

  const exportPDF = useCallback(() => {
    // Switch to preview view first, then trigger print
    // The @media print CSS in index.css handles hiding non-preview elements
    window.print()
  }, [])

  if (!resume) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-on-surface-muted">
        Export your resume as a PDF. Switch to the <strong>Preview</strong> tab first, then click below.
        Your browser's print dialog will open — choose &quot;Save as PDF&quot; as the destination.
      </div>

      <button
        onClick={exportPDF}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg
          bg-primary-500 text-white font-semibold text-sm
          hover:bg-primary-600 active:bg-primary-700
          transition-colors duration-150 shadow-sm"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-2.25 0h.008v.008H16.5V12z" />
        </svg>
        Export as PDF
      </button>
    </div>
  )
}
