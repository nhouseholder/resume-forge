import { useNavigate } from 'react-router-dom'

const REVIEW_SIGNALS = [
  {
    title: 'The document stays central',
    description: 'The live resume holds the visual weight while revisions, structure, and delivery stay around it.',
  },
  {
    title: 'Copy is treated like copy',
    description: 'Line edits, hierarchy, and section sequencing feel like an editorial pass instead of an assistant-generated demo.',
  },
  {
    title: 'Dispatch feels deliberate',
    description: 'The final share link and PDF flow read like issuing a finished dossier to a hiring manager, not exporting app output.',
  },
]

const DISPATCH_NOTES = [
  {
    label: 'Quiet mechanics',
    text: 'Parsing and revision support stay backstage. The product talks about trust, fit, and readability rather than AI spectacle.',
  },
  {
    label: 'House treatments',
    text: 'Template, palette, and typography choices feel like publishing decisions instead of settings-panel toggles.',
  },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="shell-page min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-surface/95">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="text-left transition-colors duration-[var(--duration-normal)] hover:text-primary-600"
          >
            <span className="shell-kicker block">Proof Room</span>
            <span className="text-[var(--font-size-h4)] font-display tracking-tight text-on-surface">
              Resume<span className="text-primary-600 italic">Forge</span>
            </span>
          </button>
          <div className="flex items-center gap-4">
            <span className="hidden max-w-sm text-[var(--font-size-body-sm)] text-on-surface-muted lg:inline">
              One serious document, revised like a proof and sent like a finished dossier.
            </span>
            <button
              onClick={() => navigate('/builder')}
              className="desk-button desk-button-primary"
            >
              Enter the proof room
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-7xl gap-12 px-6 pb-16 pt-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:px-8 lg:pb-24 lg:pt-20">
          <div className="relative z-10 max-w-3xl">
            <div className="folio-meta">
              <span>Edition 02</span>
              <span>Career dossier proof room</span>
              <span>Not another AI wrapper</span>
            </div>

            <h1 className="mt-8 max-w-4xl text-[var(--font-size-display)] text-on-surface">
              One document. <span className="italic text-primary-600">Too consequential</span> to feel like every other AI resume app.
            </h1>

            <p className="mt-8 max-w-2xl text-[1.12rem] leading-[1.7] text-on-surface-muted">
              ResumeForge behaves like an editorial desk around a live resume. Bring in the file you already use, move through it like a proof, adjust the house treatment, then dispatch a reader-facing version that feels finished.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-start">
              <button
                onClick={() => navigate('/builder')}
                className="desk-button desk-button-primary"
              >
                Start the revision
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <p className="max-w-sm text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">
                PDF or DOCX intake. Local read first. Quiet machine-assisted line edits. Read-only dispatch when the page is ready to be seen.
              </p>
            </div>

            <div className="mt-14 grid gap-8 border-t border-border/70 pt-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div>
                <p className="shell-kicker">Why this feels different</p>
                <div className="mt-4 space-y-5">
                  {REVIEW_SIGNALS.map((signal) => (
                    <ReviewPoint key={signal.title} title={signal.title} description={signal.description} />
                  ))}
                </div>
              </div>

              <div className="proof-ticket p-5 sm:p-6">
                <p className="shell-kicker">Reviewer standard</p>
                <h2 className="mt-4 text-[var(--font-size-h2)] text-on-surface">
                  The product frames the resume like a page under review, not a feature demo.
                </h2>
                <div className="mt-5 space-y-4 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">
                  <p>Hiring managers need signal density, not another dashboard. Every part of the shell is there to serve the document.</p>
                  <p>The result is quieter, more deliberate, and easier to trust at a glance than the usual AI builder aesthetic.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative min-h-[34rem] lg:min-h-[40rem]">
            <div className="absolute right-0 top-0 w-[88%] shell-panel p-5 sm:p-6 rotate-[1.2deg]">
              <div className="folio-meta">
                <span>Candidate proof</span>
                <span>Meridian house style</span>
              </div>
              <h2 className="mt-6 text-[2.2rem] leading-none text-on-surface">Jane Doe</h2>
              <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-primary-600">Product design director</p>

              <div className="mt-6 space-y-3">
                <PaperRow label="Summary" text="Product designer translating systems work into growth, retention, and clearer decision-making." />
                <PaperRow label="Work" text="Led onboarding redesign across three products and built the shared design language behind the rollout." />
                <PaperRow label="Projects" text="Documented launches with measurable activation gains instead of tool lists and vague responsibilities." />
                <PaperRow label="Dispatch" text="Read-only reviewer link and print-ready PDF prepared from the same working page." />
              </div>
            </div>

            <div className="absolute left-0 top-24 w-[70%] -rotate-[2.5deg] proof-ticket proof-ticket-accent p-5 sm:p-6">
              <p className="shell-kicker">Margin notes</p>
              <div className="mt-4 space-y-4">
                <MarginNote label="Signal" text="Make the strongest outcomes scannable in the first third of the page." />
                <MarginNote label="Voice" text="Keep the language direct, outcome-first, and free of startup filler." />
                <MarginNote label="Format" text="Treat template choice like house style, not decorative theming." />
              </div>
            </div>

            <div className="absolute bottom-0 right-8 w-[72%] border border-border/80 bg-white/92 p-5 shadow-[0_28px_55px_-42px_rgba(39,29,17,0.45)]">
              <p className="shell-kicker">House treatments</p>
              <div className="mt-4 divide-y divide-border/70">
                <TreatmentRow name="Meridian" note="Executive and academic dossiers" />
                <TreatmentRow name="Signal" note="Technical and systems-heavy work" />
                <TreatmentRow name="Canvas" note="Creative and portfolio-led narratives" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-8 lg:pb-28">
          <div className="grid gap-10 border-t border-border/70 pt-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
            <div>
              <p className="shell-kicker">Dispatch standard</p>
              <h2 className="mt-4 max-w-xl text-[var(--font-size-h1)] text-on-surface">
                Send something that reads like a finished dossier, not a software export.
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {DISPATCH_NOTES.map((note) => (
                <DispatchNote key={note.label} label={note.label} text={note.text} />
              ))}

              <div className="sm:col-span-2 border-t border-border/70 pt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <p className="max-w-xl text-[var(--font-size-body)] leading-7 text-on-surface-muted">
                    Built for candidates who already have substance and need the front end to frame that substance with more taste and less product theater.
                  </p>
                  <button
                    onClick={() => navigate('/builder')}
                    className="desk-button desk-button-subtle"
                  >
                    Open ResumeForge
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function ReviewPoint({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-t border-border/70 pt-4 first:border-t-0 first:pt-0">
      <p className="shell-kicker">Review note</p>
      <h2 className="mt-2 text-[var(--font-size-h3)] text-on-surface">{title}</h2>
      <p className="mt-2 max-w-xl text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">{description}</p>
    </div>
  )
}

function PaperRow({ label, text }: { label: string; text: string }) {
  return (
    <div className="border-t border-border/70 pt-3 first:border-t-0 first:pt-0">
      <p className="font-mono text-[0.66rem] uppercase tracking-[0.15em] text-on-surface-muted">{label}</p>
      <p className="mt-1 text-[var(--font-size-body-sm)] leading-6 text-on-surface">{text}</p>
    </div>
  )
}

function MarginNote({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="font-mono text-[0.66rem] uppercase tracking-[0.15em] text-primary-700">{label}</p>
      <p className="mt-1 text-[var(--font-size-body-sm)] leading-6 text-on-surface">{text}</p>
    </div>
  )
}

function TreatmentRow({ name, note }: { name: string; note: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div>
        <p className="text-[var(--font-size-h4)] font-semibold text-on-surface">{name}</p>
        <p className="mt-1 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">{note}</p>
      </div>
      <span className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-on-surface-muted">Active</span>
    </div>
  )
}

function DispatchNote({ label, text }: { label: string; text: string }) {
  return (
    <div className="proof-ticket p-5">
      <p className="shell-kicker">{label}</p>
      <p className="mt-3 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">{text}</p>
    </div>
  )
}
