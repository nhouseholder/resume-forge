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
    <div className="w-full max-w-4xl mx-auto">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        disabled={disabled}
        className={`w-full rounded-[14px] border text-left transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-quart)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'} ${isDragging
          ? 'border-primary-400 bg-primary-50/35 shadow-[0_28px_50px_-40px_rgba(60,35,25,0.35)]'
          : 'border-border bg-white/88 hover:border-primary-200 hover:bg-white'
        }`}
      >
        <div className="border-b border-border/70 px-5 py-4 sm:px-6">
          <div className="folio-meta">
            <span>Intake</span>
            <span>PDF or DOCX</span>
            <span>Up to {MAX_SIZE_MB}MB</span>
          </div>
        </div>

        <div className="grid gap-6 px-5 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-center">
          <div>
            <p className="shell-kicker">Current document</p>
            <p className="mt-3 text-[var(--font-size-h3)] text-on-surface">
              {isDragging ? 'Drop the file onto the desk' : 'Place the resume you already use on the desk.'}
            </p>
            <p className="mt-3 max-w-xl text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">
              The file is read locally first. Extracted text is then sent to the parser so the working proof can be assembled while your editable draft remains in the browser.
            </p>
          </div>

          <div className={`proof-ticket px-5 py-5 ${isDragging ? 'border-primary-400 bg-primary-50/50' : ''}`}>
            <p className="shell-kicker">Insert file</p>
            <p className="mt-3 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">
              Choose a document and begin the revision pass.
            </p>
            <span className={`mt-5 desk-button ${isDragging ? 'border-primary-300 bg-primary-50 text-primary-700' : 'desk-button-subtle'}`}>
              Select document
            </span>
          </div>
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
