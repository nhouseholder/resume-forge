import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/useResumeStore'
import { UploadZone } from '@/components/upload/UploadZone'
import { parseResume } from '@/parsers/parseResume'
import { ResumeEditor } from '@/components/editor/ResumeEditor'
import { detectFieldCategory } from '@/utils/fieldDetector'
import { applyFieldDefaults } from '@/utils/fieldDefaults'

type Step = 'upload' | 'parsing' | 'editor' | 'error'

export default function BuilderPage() {
  const navigate = useNavigate()
  const { resume, setResume, setRawText, setParsing } = useResumeStore()
  const [step, setStep] = useState<Step>(resume ? 'editor' : 'upload')
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setFileName(file.name)
    setStep('parsing')
    setParsing(true)
    setError(null)

    const result = await parseResume(file)

    setParsing(false)

    if (result.success && result.data) {
      // Detect field and apply design defaults
      const category = detectFieldCategory(result.data)
      const metaWithDefaults = applyFieldDefaults(
        result.data.meta ?? {
          templateId: 'meridian',
          palette: 'deep-navy',
          fontPairing: 'editorial-classic',
          layoutDensity: 'balanced',
          darkMode: false,
          sectionVisibility: {},
        },
        category,
      )
      result.data.meta = metaWithDefaults

      setResume(result.data)
      if (result.rawText) setRawText(result.rawText)
      setStep('editor')
    } else {
      setError(result.error || 'Parsing failed. Try again.')
      setStep('error')
      if (result.rawText) setRawText(result.rawText)
    }
  }

  const handleReset = () => {
    setStep('upload')
    setError(null)
    setFileName(null)
  }

  // If resume exists, show the editor
  if (resume && step === 'editor') {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-border/60 bg-surface/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="text-[var(--font-size-h4)] font-display tracking-tight text-on-surface hover:text-primary-600 transition-colors duration-[var(--duration-normal)]"
            >
              Resume<span className="text-primary-600 italic">Forge</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-[var(--font-size-body-sm)] text-on-surface-muted hidden sm:inline">
                {resume.basics?.name}
              </span>
              <button
                onClick={() => {
                  if (window.confirm('Start a new resume? Your current work will be lost.')) {
                    useResumeStore.getState().reset()
                    setStep('upload')
                  }
                }}
                className="px-3 py-1 rounded-md text-[var(--font-size-body-sm)] font-medium text-on-surface-muted
                  border border-border hover:bg-neutral-100 hover:text-on-surface
                  transition-all duration-[var(--duration-fast)]"
              >
                New resume
              </button>
            </div>
          </div>
        </header>
        <ResumeEditor />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/60 bg-surface/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center">
          <button
            onClick={() => navigate('/')}
            className="text-[var(--font-size-h4)] font-display tracking-tight text-on-surface hover:text-primary-600 transition-colors duration-[var(--duration-normal)]"
          >
            Resume<span className="text-primary-600 italic">Forge</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        {step === 'upload' && <UploadState onFile={handleFile} />}
        {step === 'parsing' && <ParsingState fileName={fileName} />}
        {step === 'error' && <ErrorState error={error} onRetry={handleReset} />}
      </main>
    </div>
  )
}

function UploadState({ onFile }: { onFile: (file: File) => void }) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="text-[var(--font-size-h1)] font-display text-on-surface leading-[1.15]">
          Build your resume
        </h1>
        <p className="text-[var(--font-size-body)] text-on-surface-muted mt-4 max-w-md leading-[1.7]">
          Upload your resume and we'll turn it into a stunning digital document.
          AI-powered parsing extracts every detail automatically.
        </p>
      </div>
      <UploadZone onFile={onFile} />
    </div>
  )
}

function ParsingState({ fileName }: { fileName: string | null }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-10 h-10 rounded-full border-[3px] border-neutral-200 border-t-primary-600 animate-spin" />
      <div className="text-center">
        <p className="text-[var(--font-size-body)] font-medium text-on-surface">Analyzing your resume</p>
        <p className="text-[var(--font-size-body-sm)] text-on-surface-muted mt-1">{fileName}</p>
      </div>
    </div>
  )
}

function ErrorState({ error, onRetry }: { error: string | null; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
        <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      </div>
      <div className="text-center max-w-md">
        <h2 className="text-[var(--font-size-h3)] font-display text-on-surface">Something went wrong</h2>
        <p className="text-[var(--font-size-body-sm)] text-on-surface-muted mt-3 leading-relaxed">{error}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 rounded-lg bg-primary-600 text-white font-medium text-[var(--font-size-body)]
          transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-quart)]
          hover:bg-primary-700 active:scale-[0.98]
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      >
        Try again
      </button>
    </div>
  )
}
