import { useState, type ReactNode } from 'react'
import { useResumeStore } from '@/store/useResumeStore'
import type { ResumeData } from '@/types/resume'
import {
  applyResumeEnhancement,
  buildResumeEnhancementRequest,
  hasEnhanceableContent,
  type ResumeEnhancementPatch,
} from '@/utils/resumeEnhancement'

interface EnhanceResponse {
  data?: ResumeEnhancementPatch
  model?: string
  error?: string
}

interface HighlightChangePreview {
  key: string
  title: string
  before: string[]
  after: string[]
}

interface EnhancementPreview {
  summary?: {
    before: string
    after: string
  }
  work: HighlightChangePreview[]
  projects: HighlightChangePreview[]
  totalChanges: number
}

const API_URL = '/api/enhance-resume'

export function AIEnhanceButton() {
  const resume = useResumeStore((state) => state.resume)
  const meta = useResumeStore((state) => state.meta)
  const detectedField = useResumeStore((state) => state.detectedField)
  const updateSection = useResumeStore((state) => state.updateSection)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [pendingPatch, setPendingPatch] = useState<ResumeEnhancementPatch | null>(null)
  const [pendingModel, setPendingModel] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!resume) {
    return null
  }

  const canEnhance = hasEnhanceableContent(resume)
  const preview = pendingPatch ? buildEnhancementPreview(resume, pendingPatch) : null

  const handleEnhance = async () => {
    if (!canEnhance || isEnhancing) {
      return
    }

    setIsEnhancing(true)
    setNotice(null)
    setError(null)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume,
          meta,
          fieldCategory: detectedField,
        }),
      })

      const payload = (await response.json().catch(() => ({}))) as EnhanceResponse

      if (!response.ok || !payload.data) {
        setError(payload.error ?? `Enhancement failed with status ${response.status}.`)
        return
      }

      const nextPreview = buildEnhancementPreview(resume, payload.data)
      if (nextPreview.totalChanges === 0) {
        setPendingPatch(null)
        setPendingModel(null)
        setNotice('No stronger phrasing was found from the current content.')
        return
      }

      setPendingPatch(payload.data)
      setPendingModel(payload.model ?? null)
      setNotice(`Review ${nextPreview.totalChanges} proposed edit${nextPreview.totalChanges === 1 ? '' : 's'} before applying.`)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Enhancement request failed.')
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleApply = () => {
    if (!pendingPatch || !preview) {
      return
    }

    const nextResume = applyResumeEnhancement(resume, pendingPatch)
    updateSection('basics', nextResume.basics)
    updateSection('work', nextResume.work)
    updateSection('projects', nextResume.projects)

    const label = pendingModel ? ` with ${pendingModel}` : ''
    setPendingPatch(null)
    setPendingModel(null)
    setNotice(`Applied ${preview.totalChanges} polished edit${preview.totalChanges === 1 ? '' : 's'}${label}.`)
  }

  const handleDismiss = () => {
    setPendingPatch(null)
    setPendingModel(null)
    setNotice('AI polish preview dismissed.')
  }

  const requestPreview = buildResumeEnhancementRequest(resume, meta, detectedField)
  const workCount = requestPreview.source.work.length
  const projectCount = requestPreview.source.projects.length

  return (
    <div className="shell-card p-4 sm:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="shell-kicker">AI polish</p>
          <p className="mt-2 text-sm font-semibold text-on-surface">Tighten the summary and strongest bullets without changing the facts.</p>
          <p className="mt-2 text-xs leading-5 text-on-surface-muted">
            Targets {requestPreview.context.templateName} voice for {requestPreview.context.fieldCategory ?? 'general'} resumes.
            {` ${workCount} work entries and ${projectCount} projects are eligible.`}
          </p>
        </div>

        <button
          type="button"
          onClick={handleEnhance}
          disabled={!canEnhance || isEnhancing}
          className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-[var(--duration-fast)] ${!canEnhance || isEnhancing
            ? 'cursor-not-allowed bg-neutral-200 text-neutral-500'
            : 'bg-primary-600 text-white hover:-translate-y-0.5 hover:bg-primary-700 active:translate-y-0'
          }`}
        >
          {isEnhancing ? 'Polishing…' : pendingPatch ? 'Refresh preview' : 'Generate polish preview'}
        </button>
      </div>

      {!canEnhance && (
        <p className="mt-3 text-xs text-on-surface-muted">
          Add a professional summary or bullet highlights first. The enhancer only rewrites existing content.
        </p>
      )}

      {preview && (
        <div className="mt-4 space-y-4 rounded-[1.5rem] border border-primary-100 bg-[linear-gradient(180deg,rgba(252,247,241,0.96),rgba(255,255,255,0.98))] p-4 shadow-[0_18px_48px_-28px_rgba(23,23,23,0.24)]">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="shell-kicker">Review suggested edits</p>
              <p className="mt-1 text-sm text-on-surface-muted">
                Compare the current phrasing with the AI polish pass before applying it to the resume.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-on-surface-muted">
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-neutral-200">
                {preview.totalChanges} change{preview.totalChanges === 1 ? '' : 's'}
              </span>
              {pendingModel && (
                <span className="rounded-full bg-primary-600 px-3 py-1 text-white">
                  {pendingModel}
                </span>
              )}
            </div>
          </div>

          {preview.summary && (
            <ChangeCard
              label="Professional Summary"
              before={<p>{preview.summary.before}</p>}
              after={<p>{preview.summary.after}</p>}
            />
          )}

          {preview.work.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Work Experience</p>
              {preview.work.map((entry) => (
                <ChangeCard
                  key={entry.key}
                  label={entry.title}
                  before={<BulletList items={entry.before} />}
                  after={<BulletList items={entry.after} />}
                />
              ))}
            </div>
          )}

          {preview.projects.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Projects</p>
              {preview.projects.map((entry) => (
                <ChangeCard
                  key={entry.key}
                  label={entry.title}
                  before={<BulletList items={entry.before} />}
                  after={<BulletList items={entry.after} />}
                />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2 border-t border-neutral-200 pt-3 md:flex-row md:justify-end">
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400 hover:bg-white"
            >
              Dismiss preview
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 active:scale-[0.99]"
            >
              Apply polish
            </button>
          </div>
        </div>
      )}

      {notice && <p className="mt-3 text-xs text-emerald-700">{notice}</p>}
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
    </div>
  )
}

function buildEnhancementPreview(resume: ResumeData, patch: ResumeEnhancementPatch): EnhancementPreview {
  const nextResume = applyResumeEnhancement(resume, patch)
  const summaryBefore = resume.basics.summary?.trim() ?? ''
  const summaryAfter = nextResume.basics.summary?.trim() ?? ''

  const work = (patch.work ?? [])
    .map((entry) => {
      const current = resume.work[entry.index]
      const next = nextResume.work[entry.index]
      if (!current || !next) {
        return null
      }

      const before = cleanItems(current.highlights)
      const after = cleanItems(next.highlights)
      if (sameItems(before, after)) {
        return null
      }

      return {
        key: `work-${entry.index}`,
        title: [current.position, current.name].filter(Boolean).join(' at '),
        before,
        after,
      }
    })
    .filter((entry): entry is HighlightChangePreview => Boolean(entry))

  const projects = (patch.projects ?? [])
    .map((entry) => {
      const current = resume.projects[entry.index]
      const next = nextResume.projects[entry.index]
      if (!current || !next) {
        return null
      }

      const before = cleanItems(current.highlights)
      const after = cleanItems(next.highlights)
      if (sameItems(before, after)) {
        return null
      }

      return {
        key: `project-${entry.index}`,
        title: current.name,
        before,
        after,
      }
    })
    .filter((entry): entry is HighlightChangePreview => Boolean(entry))

  const summary = summaryAfter && summaryAfter !== summaryBefore
    ? {
        before: summaryBefore,
        after: summaryAfter,
      }
    : undefined

  return {
    summary,
    work,
    projects,
    totalChanges: (summary ? 1 : 0) + work.length + projects.length,
  }
}

function cleanItems(items?: string[]): string[] {
  return (items ?? []).map((item) => item.trim()).filter(Boolean)
}

function sameItems(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((item, index) => item === right[index])
}

function ChangeCard({
  label,
  before,
  after,
}: {
  label: string
  before: ReactNode
  after: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-neutral-200 bg-white shadow-[0_12px_36px_-28px_rgba(23,23,23,0.4)]">
      <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3">
        <p className="text-sm font-semibold text-on-surface">{label}</p>
      </div>
      <div className="grid gap-px bg-neutral-200 md:grid-cols-2">
        <div className="bg-white px-4 py-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">Current</p>
          <div className="space-y-2 text-sm leading-6 text-on-surface-muted">{before}</div>
        </div>
        <div className="bg-[linear-gradient(180deg,rgba(245,241,233,0.85),rgba(255,255,255,0.98))] px-4 py-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">Proposed</p>
          <div className="space-y-2 text-sm leading-6 text-on-surface">{after}</div>
        </div>
      </div>
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-4">
      {items.map((item) => (
        <li key={item} className="list-disc">
          {item}
        </li>
      ))}
    </ul>
  )
}
