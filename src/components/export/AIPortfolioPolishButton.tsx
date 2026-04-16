import { memo, type ReactNode, useState } from 'react'
import { useResumeStore } from '@/store/useResumeStore'
import type { ResumeData } from '@/types/resume'
import {
  applyPortfolioPolish,
  hasPolishableContent,
  type PortfolioPolishPatch,
} from '@/utils/portfolioPolish'

interface PolishResponse {
  ok: boolean
  data?: PortfolioPolishPatch
  model?: string
  error?: string
}

interface ProjectChangePreview {
  key: string
  name: string
  descriptionBefore?: string
  descriptionAfter?: string
  highlightsBefore: string[]
  highlightsAfter: string[]
}

interface WorkChangePreview {
  key: string
  title: string
  before: string[]
  after: string[]
}

interface PolishPreview {
  summary?: { before: string; after: string }
  projects: ProjectChangePreview[]
  work: WorkChangePreview[]
  totalChanges: number
}

const API_URL = '/api/polish-portfolio'

export const AIPortfolioPolishButton = memo(function AIPortfolioPolishButton() {
  const canPolish = useResumeStore((s) => (s.resume ? hasPolishableContent(s.resume) : false))
  const detectedField = useResumeStore((s) => s.detectedField)
  const projectCount = useResumeStore((s) => s.resume?.projects?.length ?? 0)

  const [isPolishing, setIsPolishing] = useState(false)
  const [pendingPatch, setPendingPatch] = useState<PortfolioPolishPatch | null>(null)
  const [preview, setPreview] = useState<PolishPreview | null>(null)
  const [pendingModel, setPendingModel] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePolish = async () => {
    const { resume } = useResumeStore.getState()
    if (!resume || !canPolish || isPolishing) return

    setIsPolishing(true)
    setNotice(null)
    setError(null)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, fieldCategory: detectedField }),
      })

      const payload = (await response.json().catch(() => ({}))) as PolishResponse

      if (!response.ok || !payload.ok || !payload.data) {
        setError(payload.error ?? `Polish failed with status ${response.status}.`)
        return
      }

      const nextPreview = buildPolishPreview(resume, payload.data)
      if (nextPreview.totalChanges === 0) {
        setPendingPatch(null)
        setPreview(null)
        setPendingModel(null)
        setNotice('No stronger portfolio copy was found from the current content.')
        return
      }

      setPendingPatch(payload.data)
      setPreview(nextPreview)
      setPendingModel(payload.model ?? null)
      setNotice(`Review ${nextPreview.totalChanges} proposed edit${nextPreview.totalChanges === 1 ? '' : 's'} before applying.`)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Portfolio polish request failed.')
    } finally {
      setIsPolishing(false)
    }
  }

  const handleApply = () => {
    const { resume, updateSection } = useResumeStore.getState()
    if (!pendingPatch || !preview || !resume) return

    const nextResume = applyPortfolioPolish(resume, pendingPatch)
    updateSection('basics', nextResume.basics)
    updateSection('projects', nextResume.projects)
    updateSection('work', nextResume.work)

    const label = pendingModel ? ` with ${pendingModel}` : ''
    setPendingPatch(null)
    setPreview(null)
    setPendingModel(null)
    setNotice(`Applied ${preview.totalChanges} portfolio edit${preview.totalChanges === 1 ? '' : 's'}${label}.`)
  }

  const handleDismiss = () => {
    setPendingPatch(null)
    setPreview(null)
    setPendingModel(null)
    setNotice('Portfolio polish preview dismissed.')
  }

  return (
    <div className="proof-ticket p-4 sm:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="shell-kicker">AI polish pass</p>
          <p className="mt-2 text-sm font-semibold text-on-surface">Tune the portfolio copy</p>
          <p className="mt-2 text-xs leading-5 text-on-surface-muted">
            Rewrites the hero paragraph, project descriptions, and bullet highlights for web
            presentation without changing the facts.
            {projectCount > 0 && ` ${projectCount} project${projectCount === 1 ? '' : 's'} eligible.`}
          </p>
        </div>

        <button
          type="button"
          onClick={handlePolish}
          disabled={!canPolish || isPolishing}
          className={`desk-button ${!canPolish || isPolishing
            ? 'cursor-not-allowed border-border bg-neutral-200 text-neutral-500'
            : 'desk-button-primary'
          }`}
        >
          {isPolishing ? 'Polishing…' : pendingPatch ? 'Refresh polish' : 'Polish for portfolio'}
        </button>
      </div>

      {!canPolish && (
        <p className="mt-3 text-xs text-on-surface-muted">
          Add a summary, project descriptions, or bullet highlights first.
        </p>
      )}

      {preview && (
        <div className="mt-4 space-y-4 rounded-[10px] border border-primary-200 bg-primary-50/25 p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="shell-kicker">Review portfolio edits</p>
              <p className="mt-1 text-sm text-on-surface-muted">
                Compare the current copy with the portfolio revision before applying it.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-on-surface-muted">
              <span className="font-mono uppercase tracking-[0.14em]">
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
              label="Hero paragraph"
              before={<p>{preview.summary.before}</p>}
              after={<p>{preview.summary.after}</p>}
            />
          )}

          {preview.projects.length > 0 && (
            <div className="space-y-3">
              <p className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-on-surface-muted">Projects</p>
              {preview.projects.map((entry) => (
                <ChangeCard
                  key={entry.key}
                  label={entry.name}
                  before={
                    <div className="space-y-2">
                      {entry.descriptionBefore && <p>{entry.descriptionBefore}</p>}
                      {entry.highlightsBefore.length > 0 && <BulletList items={entry.highlightsBefore} />}
                    </div>
                  }
                  after={
                    <div className="space-y-2">
                      {entry.descriptionAfter && <p>{entry.descriptionAfter}</p>}
                      {entry.highlightsAfter.length > 0 && <BulletList items={entry.highlightsAfter} />}
                    </div>
                  }
                />
              ))}
            </div>
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

          <div className="flex flex-col gap-2 border-t border-border/70 pt-3 md:flex-row md:justify-end">
            <button type="button" onClick={handleDismiss} className="desk-button desk-button-subtle">
              Dismiss preview
            </button>
            <button type="button" onClick={handleApply} className="desk-button desk-button-primary">
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

function buildPolishPreview(resume: ResumeData, patch: PortfolioPolishPatch): PolishPreview {
  const next = applyPortfolioPolish(resume, patch)

  const summaryBefore = resume.basics.summary?.trim() ?? ''
  const summaryAfter = next.basics.summary?.trim() ?? ''
  const summary = summaryAfter && summaryAfter !== summaryBefore
    ? { before: summaryBefore, after: summaryAfter }
    : undefined

  const projects = (patch.projects ?? [])
    .map((entry) => {
      const current = resume.projects[entry.index]
      const updated = next.projects[entry.index]
      if (!current || !updated) return null

      const descBefore = current.description?.trim() ?? ''
      const descAfter = updated.description?.trim() ?? ''
      const hlBefore = cleanItems(current.highlights)
      const hlAfter = cleanItems(updated.highlights)

      const changed = descAfter !== descBefore || !sameItems(hlBefore, hlAfter)
      if (!changed) return null

      return {
        key: `project-${entry.index}`,
        name: current.name,
        descriptionBefore: descBefore || undefined,
        descriptionAfter: descAfter !== descBefore ? descAfter : undefined,
        highlightsBefore: hlBefore,
        highlightsAfter: sameItems(hlBefore, hlAfter) ? [] : hlAfter,
      }
    })
    .filter(Boolean) as ProjectChangePreview[]

  const work = (patch.work ?? [])
    .map((entry) => {
      const current = resume.work[entry.index]
      const updated = next.work[entry.index]
      if (!current || !updated) return null

      const before = cleanItems(current.highlights)
      const after = cleanItems(updated.highlights)
      if (sameItems(before, after)) return null

      return {
        key: `work-${entry.index}`,
        title: [current.position, current.name].filter(Boolean).join(' at '),
        before,
        after,
      }
    })
    .filter((e): e is WorkChangePreview => Boolean(e))

  return {
    summary,
    projects,
    work,
    totalChanges: (summary ? 1 : 0) + projects.length + work.length,
  }
}

function cleanItems(items?: string[]): string[] {
  return (items ?? []).map((i) => i.trim()).filter(Boolean)
}

function sameItems(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((item, i) => item === right[i])
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
          <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">Portfolio revision</p>
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
        <li key={item} className="list-disc">{item}</li>
      ))}
    </ul>
  )
}
