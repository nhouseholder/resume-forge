import { useState, type ReactNode, memo } from 'react'
import { useResumeStore } from '@/store/useResumeStore'
import type { ResumeData } from '@/types/resume'
import {
  applyResumeEnhancement,
  hasEnhanceableContent,
  type ResumeEnhancementPatch,
} from '@/utils/resumeEnhancement'
import { TEMPLATE_REGISTRY } from '@/components/templates/templateConfig'

interface EnhanceResponse {
  ok: boolean
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

export const AIEnhanceButton = memo(function AIEnhanceButton() {
  const canEnhance = useResumeStore((state) => (state.resume ? hasEnhanceableContent(state.resume) : false))
  const templateId = useResumeStore((state) => state.meta.templateId)
  const templateName = TEMPLATE_REGISTRY.find(t => t.id === templateId)?.name ?? 'Meridian'
  const detectedField = useResumeStore((state) => state.detectedField)
  const workCount = useResumeStore((state) => state.resume?.work?.length ?? 0)
  const projectCount = useResumeStore((state) => state.resume?.projects?.length ?? 0)

  const [isEnhancing, setIsEnhancing] = useState(false)
  const [pendingPatch, setPendingPatch] = useState<ResumeEnhancementPatch | null>(null)
  const [preview, setPreview] = useState<EnhancementPreview | null>(null)
  const [pendingModel, setPendingModel] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleEnhance = async () => {
    const { resume, meta } = useResumeStore.getState()
    if (!resume || !canEnhance || isEnhancing) {
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

      if (!response.ok || !payload.ok || !payload.data) {
        setError(payload.error ?? `Enhancement failed with status ${response.status}.`)
        return
      }

      const nextPreview = buildEnhancementPreview(resume, payload.data)
      if (nextPreview.totalChanges === 0) {
        setPendingPatch(null)
        setPreview(null)
        setPendingModel(null)
        setNotice('No stronger phrasing was found from the current content.')
        return
      }

      setPendingPatch(payload.data)
      setPreview(nextPreview)
      setPendingModel(payload.model ?? null)
      setNotice(`Review ${nextPreview.totalChanges} proposed edit${nextPreview.totalChanges === 1 ? '' : 's'} before applying.`)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Enhancement request failed.')
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleApply = () => {
    const { resume, updateSection } = useResumeStore.getState()
    if (!pendingPatch || !preview || !resume) {
      return
    }

    const nextResume = applyResumeEnhancement(resume, pendingPatch)
    updateSection('basics', nextResume.basics)
    updateSection('work', nextResume.work)
    updateSection('projects', nextResume.projects)

    const label = pendingModel ? ` with ${pendingModel}` : ''
    setPendingPatch(null)
    setPreview(null)
    setPendingModel(null)
    setNotice(`Applied ${preview.totalChanges} polished edit${preview.totalChanges === 1 ? '' : 's'}${label}.`)
  }

  const handleDismiss = () => {
    setPendingPatch(null)
    setPreview(null)
    setPendingModel(null)
    setNotice('AI polish preview dismissed.')
  }

  return (
    <div className="proof-ticket p-4 sm:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="shell-kicker">Tracked revision</p>
          <p className="mt-2 text-sm font-semibold text-on-surface">Prepare a line-edit pass for the summary and strongest bullets without changing the facts.</p>
          <p className="mt-2 text-xs leading-5 text-on-surface-muted">
            Uses the {templateName} treatment for {detectedField ?? 'general'} resumes.
            {` ${workCount} work entries and ${projectCount} projects are eligible.`}
          </p>
        </div>

        <button
          type="button"
          onClick={handleEnhance}
          disabled={!canEnhance || isEnhancing}
          className={`desk-button ${!canEnhance || isEnhancing
            ? 'cursor-not-allowed border-border bg-neutral-200 text-neutral-500'
            : 'desk-button-primary'
          }`}
        >
          {isEnhancing ? 'Preparing…' : pendingPatch ? 'Refresh revision pass' : 'Prepare line edits'}
        </button>
      </div>

      {!canEnhance && (
        <p className="mt-3 text-xs text-on-surface-muted">
          Add a professional summary or bullet highlights first. The enhancer only rewrites existing content.
        </p>
      )}

      {preview && (
        <div className="mt-4 space-y-4 rounded-[10px] border border-primary-200 bg-primary-50/25 p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="shell-kicker">Review line edits</p>
              <p className="mt-1 text-sm text-on-surface-muted">
                Compare the current phrasing with the revision pass before applying it to the page.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-on-surface-muted">
              <span className="font-mono uppercase tracking-[0.14em] text-on-surface-muted">
                {preview.totalChanges} change{preview.totalChanges === 1 ? '' : 's'}
              </span>
              {pendingModel && (
                <span className="font-mono uppercase tracking-[0.14em] text-primary-700">
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
              <p className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-on-surface-muted">Work Experience</p>
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
              <p className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-on-surface-muted">Projects</p>
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

          <div className="flex flex-col gap-2 border-t border-border/70 pt-3 md:flex-row md:justify-end">
            <button
              type="button"
              onClick={handleDismiss}
              className="desk-button desk-button-subtle"
            >
              Dismiss preview
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="desk-button desk-button-primary"
            >
              Apply edits
            </button>
          </div>
        </div>
      )}

      {notice && <p className="mt-3 text-xs text-emerald-700">{notice}</p>}
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
    </div>
  )
})

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
    <div className="overflow-hidden rounded-[10px] border border-border/80 bg-white shadow-[0_14px_28px_-24px_rgba(23,23,23,0.32)]">
      <div className="border-b border-border/70 bg-neutral-50 px-4 py-3">
        <p className="text-sm font-semibold text-on-surface">{label}</p>
      </div>
      <div className="grid gap-px bg-border/70 md:grid-cols-2">
        <div className="bg-white px-4 py-4">
          <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">Current copy</p>
          <div className="space-y-2 text-sm leading-6 text-on-surface-muted">{before}</div>
        </div>
        <div className="bg-[linear-gradient(180deg,rgba(246,240,232,0.84),rgba(255,255,255,0.98))] px-4 py-4">
          <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">Revision pass</p>
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
