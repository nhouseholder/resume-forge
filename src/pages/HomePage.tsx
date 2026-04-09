import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'

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
  const prefersReducedMotion = useReducedMotion()

  const fadeInUp = (delay = 0) => {
    if (prefersReducedMotion) {
      return {}
    }

    return {
      initial: { opacity: 0, y: 28 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: 0.62,
        delay,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }
  }

  const revealOnView = (delay = 0) => {
    if (prefersReducedMotion) {
      return {}
    }

    return {
      initial: { opacity: 0, y: 22 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.3 },
      transition: {
        duration: 0.56,
        delay,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }
  }

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
          <motion.div className="relative z-10 max-w-3xl" {...fadeInUp(0.04)}>
            <motion.div className="folio-meta" {...fadeInUp(0.08)}>
              <span>Edition 02</span>
              <span>Career dossier proof room</span>
              <span>Not another AI wrapper</span>
            </motion.div>

            <motion.h1 className="mt-8 max-w-4xl text-[var(--font-size-display)] text-on-surface" {...fadeInUp(0.12)}>
              One document. <span className="italic text-primary-600">Too consequential</span> to feel like every other AI resume app.
            </motion.h1>

            <motion.p className="mt-8 max-w-2xl text-[1.12rem] leading-[1.7] text-on-surface-muted" {...fadeInUp(0.18)}>
              ResumeForge behaves like an editorial desk around a live resume. Bring in the file you already use, move through it like a proof, adjust the house treatment, then dispatch a reader-facing version that feels finished.
            </motion.p>

            <motion.div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-start" {...fadeInUp(0.24)}>
              <motion.button
                onClick={() => navigate('/builder')}
                className="desk-button desk-button-primary"
                whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.01 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
              >
                Start the revision
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </motion.button>
              <p className="max-w-sm text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">
                PDF or DOCX intake. Local read first. Quiet machine-assisted line edits. Read-only dispatch when the page is ready to be seen.
              </p>
            </motion.div>

            <motion.div className="mt-14 grid gap-8 border-t border-border/70 pt-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" {...revealOnView(0.04)}>
              <div>
                <p className="shell-kicker">Why this feels different</p>
                <div className="mt-4 space-y-5">
                  {REVIEW_SIGNALS.map((signal) => (
                    <ReviewPoint key={signal.title} title={signal.title} description={signal.description} />
                  ))}
                </div>
              </div>

              <motion.div
                className="proof-ticket p-5 sm:p-6"
                whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                {...revealOnView(0.12)}
              >
                <p className="shell-kicker">Reviewer standard</p>
                <h2 className="mt-4 text-[var(--font-size-h2)] text-on-surface">
                  The product frames the resume like a page under review, not a feature demo.
                </h2>
                <div className="mt-5 space-y-4 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">
                  <p>Hiring managers need signal density, not another dashboard. Every part of the shell is there to serve the document.</p>
                  <p>The result is quieter, more deliberate, and easier to trust at a glance than the usual AI builder aesthetic.</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div className="relative min-h-[34rem] lg:min-h-[40rem]" {...fadeInUp(0.16)}>
            <motion.div
              className="absolute right-0 top-0 w-[88%] shell-panel p-5 sm:p-6 rotate-[1.2deg]"
              whileHover={prefersReducedMotion ? undefined : { y: -6, rotate: 0.4 }}
              {...fadeInUp(0.22)}
            >
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
            </motion.div>

            <motion.div
              className="absolute left-0 top-24 w-[70%] -rotate-[2.5deg] proof-ticket proof-ticket-accent p-5 sm:p-6"
              whileHover={prefersReducedMotion ? undefined : { y: -4, rotate: -1.2 }}
              {...fadeInUp(0.3)}
            >
              <p className="shell-kicker">Margin notes</p>
              <div className="mt-4 space-y-4">
                <MarginNote label="Signal" text="Make the strongest outcomes scannable in the first third of the page." />
                <MarginNote label="Voice" text="Keep the language direct, outcome-first, and free of startup filler." />
                <MarginNote label="Format" text="Treat template choice like house style, not decorative theming." />
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-0 right-8 w-[72%] border border-border/80 bg-white/92 p-5 shadow-[0_28px_55px_-42px_rgba(39,29,17,0.45)]"
              whileHover={prefersReducedMotion ? undefined : { y: -5 }}
              {...fadeInUp(0.36)}
            >
              <p className="shell-kicker">House treatments</p>
              <div className="mt-4 divide-y divide-border/70">
                <TreatmentRow name="Meridian" note="Executive and academic dossiers" />
                <TreatmentRow name="Signal" note="Technical and systems-heavy work" />
                <TreatmentRow name="Canvas" note="Creative and portfolio-led narratives" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        <motion.section className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-8 lg:pb-28" {...revealOnView(0.06)}>
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
                  <motion.button
                    onClick={() => navigate('/builder')}
                    className="desk-button desk-button-subtle"
                    whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.01 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
                  >
                    Open ResumeForge
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
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
    <motion.div
      className="proof-ticket p-5"
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 18 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="shell-kicker">{label}</p>
      <p className="mt-3 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">{text}</p>
    </motion.div>
  )
}
