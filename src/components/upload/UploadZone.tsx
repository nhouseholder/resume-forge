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
    <div className="w-full max-w-lg mx-auto">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        disabled={disabled}
        className={`
          w-full rounded-xl border border-dashed p-12 text-center
          transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] cursor-pointer
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
          ${isDragging
            ? 'border-primary-400 bg-primary-50/60 scale-[1.01]'
            : 'border-neutral-300 hover:border-primary-300 hover:bg-neutral-50/50'
          }
        `}
      >
        <div className="flex flex-col items-center gap-3">
          <svg
            className={`w-9 h-9 transition-colors duration-[var(--duration-fast)] ${isDragging ? 'text-primary-500' : 'text-neutral-400'}`}
            fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
            />
          </svg>
          <div>
            <p className="text-[var(--font-size-body)] font-medium text-on-surface">
              {isDragging ? 'Drop your resume here' : 'Upload your resume'}
            </p>
            <p className="text-[var(--font-size-body-sm)] text-on-surface-muted mt-1">
              PDF or DOCX, up to {MAX_SIZE_MB}MB
            </p>
          </div>
          <span className={`inline-flex items-center px-4 py-2 rounded-lg text-[var(--font-size-body-sm)] font-medium
            transition-all duration-[var(--duration-fast)]
            ${isDragging
              ? 'bg-primary-100 text-primary-700'
              : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.97]'
            }`}>
            Choose file
          </span>
        </div>
        <input
          ref={inputRef} type="file" accept=".pdf,.docx"
          onChange={() => { const f = inputRef.current?.files?.[0]; if (f) handleFile(f) }}
          className="sr-only" aria-label="Upload resume file"
        />
      </button>
      {error && <p className="mt-3 text-[var(--font-size-body-sm)] text-red-600 text-center" role="alert">{error}</p>}
    </div>
  )
}
