import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { decodeSharedResumePayload } from '@/components/export/shareExporter'
import TemplateRenderer from '@/components/templates/TemplateRenderer'

export default function ViewPage() {
  const navigate = useNavigate()
  const { hash } = useParams()
  const result = useMemo(() => decodeSharedResumePayload(hash ?? ''), [hash])

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      <header className="border-b border-border/60 bg-surface/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-[var(--font-size-h4)] font-display tracking-tight text-on-surface hover:text-primary-600 transition-colors duration-[var(--duration-normal)]"
          >
            Resume<span className="text-primary-600 italic">Forge</span>
          </button>
          <button
            onClick={() => navigate('/builder')}
            className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[var(--font-size-body-sm)] font-medium text-primary-600 transition-colors duration-[var(--duration-fast)] hover:bg-primary-50"
          >
            Create your own
          </button>
        </div>
      </header>
      <main className="flex-1 px-4 py-8 lg:px-6 lg:py-10">
        {!result.ok ? (
          <div className="mx-auto flex max-w-md flex-1 items-center justify-center py-10">
            <div className="rounded-2xl border border-border/70 bg-white p-8 text-center shadow-sm">
              <p className="text-[var(--font-size-caption)] font-medium uppercase tracking-[0.12em] text-primary-600">
                Shared Resume
              </p>
              <h1 className="mt-3 text-[var(--font-size-h2)] font-display text-on-surface">
                Link unavailable
              </h1>
              <p className="mt-4 text-[var(--font-size-body)] leading-relaxed text-on-surface-muted">
                {result.error}
              </p>
              <button
                onClick={() => navigate('/builder')}
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-[var(--font-size-body)] font-semibold text-white transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-quart)] hover:bg-primary-700 hover:shadow-md hover:shadow-primary-600/15 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
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
            <div className="mx-auto mb-6 flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[var(--font-size-caption)] font-medium uppercase tracking-[0.12em] text-primary-600">
                  Shared Resume
                </p>
                <h1 className="mt-3 text-[var(--font-size-h2)] font-display text-on-surface">
                  Read-only resume preview
                </h1>
                <p className="mt-3 text-[var(--font-size-body)] leading-relaxed text-on-surface-muted">
                  This link contains a browser-generated snapshot of the resume and its current theme. No account is required to view it.
                </p>
              </div>
              <div className="text-[var(--font-size-body-sm)] text-on-surface-muted">
                Shared from ResumeForge
              </div>
            </div>

            <div className="mx-auto max-w-6xl overflow-x-auto rounded-[24px] border border-border/70 bg-neutral-200/60 p-4 lg:p-8">
              <div
                data-resume-preview
                className="mx-auto overflow-hidden rounded-lg bg-white shadow-xl print:rounded-none print:shadow-none"
                style={{ width: '816px', minHeight: '1056px' }}
              >
                <TemplateRenderer
                  data={{ ...result.payload.resume, meta: result.payload.meta }}
                  meta={result.payload.meta}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
