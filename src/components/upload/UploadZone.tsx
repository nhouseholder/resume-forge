import { useCallback, useState, useRef, type DragEvent } from 'react'

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx']
const MAX_SIZE_MB = 10

interface UploadZoneProps {
  onFile: (file: File) => void
  disabled?: boolean
}

export function UploadZone({ onFile, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validate = useCallback((file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      return `Unsupported format: ${ext}. Please upload PDF or DOCX.`
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max ${MAX_SIZE_MB}MB.`
    }
    return null
  }, [])

  const handleFile = useCallback(
    (file: File) => {
      const err = validate(file)
      if (err) { setError(err); return }
      setError(null)
      onFile(file)
    },
    [validate, onFile],
  )

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  return (
    <div className="w-full max-w-3xl mx-auto">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        disabled={disabled}
        className={`w-full rounded-[28px] border p-6 text-left transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-quart)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:p-8 ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'} ${isDragging
          ? 'border-primary-300 bg-primary-50/70 shadow-md -translate-y-1'
          : 'border-border bg-white/80 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-white'
        }`}
      >
        <div className="grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-primary-100 bg-white/90 shadow-sm">
            <svg
              className={`h-8 w-8 transition-colors duration-[var(--duration-fast)] ${isDragging ? 'text-primary-600' : 'text-primary-500'}`}
              fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
              />
            </svg>
          </div>

          <div>
            <p className="shell-kicker">Document intake</p>
            <p className="mt-3 text-[var(--font-size-h3)] text-on-surface">
              {isDragging ? 'Drop your resume here' : 'Upload a resume file to start the studio draft'}
            </p>
            <p className="mt-3 max-w-xl text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">
              Accepted formats: PDF and DOCX. Up to {MAX_SIZE_MB}MB. The file is read locally first, then extracted text is sent to the parser while your draft continues in the browser.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="shell-chip">PDF</span>
              <span className="shell-chip">DOCX</span>
              <span className="shell-chip">Up to {MAX_SIZE_MB}MB</span>
            </div>
          </div>

          <span className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-[var(--font-size-body-sm)] font-semibold transition-all duration-[var(--duration-fast)] ${isDragging
            ? 'bg-primary-100 text-primary-700'
            : 'bg-primary-600 text-white shadow-sm hover:bg-primary-700'
          }`}>
            Upload resume file
          </span>
        </div>
        <input
          ref={inputRef} type="file" accept=".pdf,.docx"
          onChange={() => { const f = inputRef.current?.files?.[0]; if (f) handleFile(f) }}
          className="sr-only" aria-label="Upload resume file"
        />
      </button>
      {error && <p className="mt-3 text-[var(--font-size-body-sm)] text-primary-700" role="alert">{error}</p>}
    </div>
  )
}
