import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/useResumeStore'
import { UploadZone } from '@/components/upload/UploadZone'
import { parseResume } from '@/parsers/parseResume'
import { ResumeEditor } from '@/components/editor/ResumeEditor'
import { detectFieldCategory } from '@/utils/fieldDetector'
import { applyFieldDefaults } from '@/utils/fieldDefaults'
import { TEMPLATE_REGISTRY } from '@/components/templates/templateConfig'
import type { ResumeData } from '@/types/resume'

type Step = 'upload' | 'parsing' | 'editor' | 'error'

function createBlankResume(): ResumeData {
  const meta = applyFieldDefaults(
    {
      templateId: 'meridian',
      palette: 'deep-navy',
      fontPairing: 'editorial-classic',
      layoutDensity: 'balanced',
      darkMode: false,
      sectionVisibility: {},
    },
    'business',
  )

  return {
    basics: { name: '' },
    work: [],
    education: [],
    skills: [],
    publications: [],
    presentations: [],
    projects: [],
    meta,
  }
}

export default function BuilderPage() {
  const navigate = useNavigate()
  const { resume, setResume, setRawText, setParsing, detectField } = useResumeStore()
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

      detectField(category)
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

  const handleManualStart = () => {
    detectField('business')
    setResume(createBlankResume())
    setError(null)
    setStep('editor')
  }

  // If resume exists, show the editor
  if (resume && step === 'editor') {
    const activeTemplate = TEMPLATE_REGISTRY.find((template) => template.id === useResumeStore.getState().meta.templateId)

    return (
      <div className="shell-page min-h-screen flex flex-col">
        <header className="border-b border-border/60 bg-surface/95">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
            <button
              onClick={() => navigate('/')}
              className="text-left transition-colors duration-[var(--duration-normal)] hover:text-primary-600"
            >
              <span className="shell-kicker block">Proof Room</span>
              <span className="text-[var(--font-size-h4)] font-display tracking-tight text-on-surface">
                Resume<span className="text-primary-600 italic">Forge</span>
              </span>
            </button>
            <div className="hidden lg:block">
              <div className="folio-meta justify-end">
                <span>{resume.basics?.name || 'Untitled candidate'}</span>
                {activeTemplate && <span>{activeTemplate.name}</span>}
                <span>Local working copy</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (window.confirm('Start a new resume? Your current work will be lost.')) {
                    useResumeStore.getState().reset()
                    setStep('upload')
                  }
                }}
                className="desk-button desk-button-subtle"
              >
                New draft
              </button>
            </div>
          </div>
        </header>
        <ResumeEditor />
      </div>
    )
  }

  return (
    <div className="shell-page min-h-screen flex flex-col">
      <header className="border-b border-border/60 bg-surface/95">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="text-left transition-colors duration-[var(--duration-normal)] hover:text-primary-600"
          >
            <span className="shell-kicker block">Proof Room</span>
            <span className="text-[var(--font-size-h4)] font-display tracking-tight text-on-surface">
              Resume<span className="text-primary-600 italic">Forge</span>
            </span>
          </button>
          <span className="hidden text-[var(--font-size-body-sm)] text-on-surface-muted md:inline">
            Bring in one serious document. Leave with a finished dossier.
          </span>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 lg:px-8 lg:py-14">
        {step === 'upload' && <UploadState onFile={handleFile} />}
        {step === 'parsing' && <ParsingState fileName={fileName} />}
        {step === 'error' && <ErrorState error={error} onRetry={handleReset} onManualStart={handleManualStart} />}
      </main>
    </div>
  )
}

function UploadState({ onFile }: { onFile: (file: File) => void }) {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.02fr)_22rem] lg:items-start">
      <div className="shell-panel p-6 sm:p-8 lg:p-10">
        <div className="folio-meta">
          <span>Document intake</span>
          <span>Local read first</span>
          <span>Working copy remains in browser</span>
        </div>

        <div className="editor-section-header mt-6 max-w-2xl">
          <span className="shell-kicker">Start with the file you already send</span>
          <h1 className="text-[var(--font-size-h1)] text-on-surface">Bring the current resume onto the desk and turn it into a working proof.</h1>
          <p className="editor-note max-w-xl">
            ResumeForge reads the file locally first, structures the extracted text into editable sections, and keeps the live page close while you revise the copy, hierarchy, and final presentation.
          </p>
        </div>

        <div className="mt-8">
          <UploadZone onFile={onFile} />
        </div>
      </div>

      <aside className="proof-ticket p-6">
        <p className="shell-kicker">Proof sequence</p>
        <div className="mt-4 space-y-5">
          <AsideStep
            step="01"
            title="Parse the structure"
            text="Text is extracted from the file first, then arranged into editable sections like experience, education, projects, and supporting detail."
          />
          <AsideStep
            step="02"
            title="Review the copy"
            text="Move leaf by leaf through the dossier, compare line edits, and keep the live page in view while the writing improves."
          />
          <AsideStep
            step="03"
            title="Issue the document"
            text="Choose the house treatment, confirm the final reader view, then issue a shareable link or print-ready PDF."
          />
        </div>
      </aside>
    </div>
  )
}

function ParsingState({ fileName }: { fileName: string | null }) {
  return (
    <div className="mx-auto w-full max-w-3xl shell-panel p-8 sm:p-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="shell-kicker">Proof in preparation</p>
          <h1 className="mt-3 text-[var(--font-size-h2)] text-on-surface">Preparing the working dossier</h1>
          <p className="mt-3 max-w-xl text-[var(--font-size-body)] leading-7 text-on-surface-muted">
            We’re extracting the key sections from {fileName ?? 'your resume'} so you arrive at a structured proof instead of a blank form.
          </p>
        </div>

        <div className="proof-ticket flex items-center gap-4 px-5 py-4">
          <div className="h-11 w-11 rounded-full border-[3px] border-primary-100 border-t-primary-600 animate-spin" />
          <div>
            <p className="text-[var(--font-size-body-sm)] font-semibold text-on-surface">Reading file</p>
            <p className="text-[var(--font-size-caption)] text-on-surface-muted">Extracting sections and preparing defaults</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ErrorState({
  error,
  onRetry,
  onManualStart,
}: {
  error: string | null
  onRetry: () => void
  onManualStart: () => void
}) {
  return (
    <div className="mx-auto w-full max-w-2xl shell-panel p-8 sm:p-10">
      <div className="flex flex-col gap-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
          <svg className="h-7 w-7 text-primary-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
        </div>

        <div className="max-w-xl">
          <p className="shell-kicker">Resume intake issue</p>
          <h2 className="mt-3 text-[var(--font-size-h2)] text-on-surface">We couldn’t build the draft from that file yet.</h2>
          <p className="mt-4 text-[var(--font-size-body)] leading-7 text-on-surface-muted">{error}</p>
          <p className="mt-3 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">
            Try the file again, export a cleaner PDF or DOCX, or continue in a blank editor and rebuild the resume manually.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="desk-button desk-button-primary"
          >
            Try another file
          </button>
          <button
            type="button"
            onClick={onManualStart}
            className="desk-button desk-button-subtle"
          >
            Start blank editor
          </button>
        </div>
      </div>
    </div>
  )
}

function AsideStep({ step, title, text }: { step: string; title: string; text: string }) {
  return (
    <div className="border-t border-border/70 pt-4 first:border-t-0 first:pt-0">
      <p className="shell-kicker">{step}</p>
      <h2 className="mt-2 text-[var(--font-size-h4)] font-semibold text-on-surface">{title}</h2>
      <p className="mt-2 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">{text}</p>
    </div>
  )
}
