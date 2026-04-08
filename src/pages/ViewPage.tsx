import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { decodeSharedResumePayload } from '@/components/export/shareExporter'
import TemplateRenderer from '@/components/templates/TemplateRenderer'

export default function ViewPage() {
  const navigate = useNavigate()
  const { hash } = useParams()
  const result = useMemo(() => decodeSharedResumePayload(hash ?? ''), [hash])
  const basics = result.ok ? result.payload.resume.basics : null

  return (
    <div className="shell-page min-h-screen flex flex-col">
      <header className="border-b border-border/60 bg-surface/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="text-left transition-colors duration-[var(--duration-normal)] hover:text-primary-600"
          >
            <span className="shell-kicker block">Published with ResumeForge</span>
            <span className="text-[var(--font-size-h4)] font-display tracking-tight text-on-surface">
              Resume<span className="text-primary-600 italic">Forge</span>
            </span>
          </button>
          <button
            onClick={() => navigate('/builder')}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-[var(--font-size-body-sm)] font-semibold text-on-surface transition-all duration-[var(--duration-fast)] hover:-translate-y-0.5 hover:bg-white"
          >
            Create your own
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 lg:px-8 lg:py-12">
        {!result.ok ? (
          <div className="mx-auto flex max-w-2xl flex-1 items-center justify-center py-10">
            <div className="shell-panel p-8 text-left sm:p-10">
              <p className="shell-kicker">
                Shared Resume
              </p>
              <h1 className="mt-4 text-[var(--font-size-h2)] text-on-surface">
                Link unavailable
              </h1>
              <p className="mt-4 max-w-xl text-[var(--font-size-body)] leading-relaxed text-on-surface-muted">
                {result.error}
              </p>
              <button
                onClick={() => navigate('/builder')}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-[var(--font-size-body)] font-semibold text-white transition-all duration-[var(--duration-normal)] hover:-translate-y-0.5 hover:bg-primary-700"
              >
                Build your resume
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto mb-8 grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="max-w-3xl">
                <p className="shell-kicker">Shared resume</p>
                <h1 className="mt-4 text-[var(--font-size-h1)] text-on-surface">
                  {basics?.name || 'Candidate'}
                  {basics?.label ? <span className="block text-[var(--font-size-h3)] italic text-primary-600">{basics.label}</span> : null}
                </h1>
                <p className="mt-4 max-w-2xl text-[var(--font-size-body)] leading-relaxed text-on-surface-muted">
                  This link contains a read-only snapshot of the current resume and its chosen theme. It opens without an account and preserves the exact document styling selected in the editor.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[var(--font-size-body-sm)] text-on-surface-muted">
                <span className="shell-chip">Read-only link</span>
                <span className="shell-chip">Built with ResumeForge</span>
              </div>
            </div>

            <div className="mx-auto max-w-7xl">
              <div className="workspace-stage overflow-x-auto p-4 sm:p-6 lg:p-10">
                <div
                  data-resume-preview
                  className="workspace-paper mx-auto print:rounded-none print:shadow-none"
                  style={{ width: '816px', minHeight: '1056px' }}
                >
                  <TemplateRenderer
                    data={{ ...result.payload.resume, meta: result.payload.meta }}
                    meta={result.payload.meta}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
