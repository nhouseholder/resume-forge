import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="shell-page min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-surface/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="text-left transition-colors duration-[var(--duration-normal)] hover:text-primary-600"
          >
            <span className="shell-kicker block">Resume Studio</span>
            <span className="text-[var(--font-size-h4)] font-display tracking-tight text-on-surface">
              Resume<span className="text-primary-600 italic">Forge</span>
            </span>
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden text-[var(--font-size-body-sm)] text-on-surface-muted md:inline">
              Local text extraction. AI-structured parsing. Read-only sharing.
            </span>
            <button
              onClick={() => navigate('/builder')}
              className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-600 px-5 py-2.5 text-[var(--font-size-body-sm)] font-semibold text-white shadow-sm transition-all duration-[var(--duration-fast)] hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-md active:translate-y-0"
            >
              Launch builder
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-7xl gap-14 px-6 pb-16 pt-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(26rem,0.92fr)] lg:px-8 lg:pb-24 lg:pt-20">
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-4">
              <span className="shell-rule" aria-hidden="true" />
              <span className="shell-kicker">Quiet authority for modern resumes</span>
            </div>

            <h1 className="mt-8 max-w-4xl text-[var(--font-size-display)] text-on-surface">
              Build a <span className="italic text-primary-600">published-quality</span> resume presence without wrestling a design tool.
            </h1>

            <p className="mt-8 max-w-2xl text-[1.12rem] leading-[1.7] text-on-surface-muted">
              ResumeForge turns an existing PDF or DOCX into a structured editing studio. Parse what you already have, tighten the language, choose the right template voice, then share a clean read-only link or print a polished PDF.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                onClick={() => navigate('/builder')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3.5 text-[var(--font-size-body)] font-semibold text-white shadow-sm transition-all duration-[var(--duration-normal)] hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-md active:translate-y-0"
              >
                Start with your resume
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <div className="flex flex-wrap items-center gap-2 text-[var(--font-size-body-sm)] text-on-surface-muted">
                <span className="shell-chip">No account required</span>
                <span className="shell-chip">Local draft saved in browser</span>
                <span className="shell-chip">Share link + PDF export</span>
              </div>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              <TransformationCard
                title="Intake"
                caption="PDF or DOCX"
                description="Drop in the resume you already have. ResumeForge extracts structure without forcing you to start from zero."
              />
              <TransformationCard
                title="Edit"
                caption="Structured studio"
                description="Refine each section in a real editor while the resume stays visible as a live artifact, not an afterthought."
              />
              <TransformationCard
                title="Publish"
                caption="Ready to send"
                description="Use the best-fit template, tighten phrasing, then generate a share link or a print-ready PDF."
              />
            </div>
          </div>

          <div className="relative">
            <div className="shell-panel overflow-hidden p-5 md:p-6">
              <div className="flex items-center justify-between border-b border-border/70 pb-4">
                <div>
                  <p className="shell-kicker">Issue 01</p>
                  <h2 className="mt-2 text-[var(--font-size-h3)] text-on-surface">Editorial studio preview</h2>
                </div>
                <span className="shell-chip">Three template voices</span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-[1.05fr_0.95fr]">
                <StudioSheet
                  label="Resume input"
                  eyebrow="Current file"
                  lines={[
                    'Jane Doe',
                    'Senior Product Designer',
                    'Led onboarding redesign across 3 products',
                    'Built repeatable design systems and handoff rituals',
                    'BFA, Visual Communication',
                  ]}
                />
                <StudioSheet
                  label="Published output"
                  eyebrow="Meridian / Signal / Canvas"
                  accent
                  lines={[
                    'Jane Doe',
                    'Product designer translating systems into growth',
                    '18% activation lift across redesign launch',
                    'Share-ready profile with reader-first hierarchy',
                    'Read-only link and PDF export ready',
                  ]}
                />
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <TemplateStrip name="Meridian" mood="Academic and executive" />
                <TemplateStrip name="Signal" mood="Technical and product" />
                <TemplateStrip name="Canvas" mood="Creative and portfolio-led" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24">
          <div className="grid gap-10 border-t border-border/70 pt-12 lg:grid-cols-[0.9fr_minmax(0,1.1fr)] lg:items-start">
            <div>
              <p className="shell-kicker">How it actually works</p>
              <h2 className="mt-4 max-w-xl text-[var(--font-size-h1)] text-on-surface">
                The product is designed to preserve trust all the way from upload to send.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <ValueProp
                step="01"
                title="Private start"
                description="The file is read locally first, then extracted text is sent to the parser so you land in a structured draft instead of a blank canvas."
              />
              <ValueProp
                step="02"
                title="Sharper language"
                description="AI polish suggests phrasing changes only after showing the before and after, so nothing changes silently."
              />
              <ValueProp
                step="03"
                title="Published finish"
                description="Choose the right template voice, adjust the palette and density, and send a real resume artifact instead of another builder screenshot."
              />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-8 lg:pb-28">
          <div className="shell-panel p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className="shell-kicker">Ready to publish</p>
                <h2 className="mt-4 max-w-2xl text-[var(--font-size-h1)] text-on-surface">
                  Start from the resume you already have and leave with a document worth sending.
                </h2>
              </div>
              <button
                onClick={() => navigate('/builder')}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-200 bg-primary-600 px-6 py-3.5 text-[var(--font-size-body)] font-semibold text-white transition-all duration-[var(--duration-normal)] hover:-translate-y-0.5 hover:bg-primary-700"
              >
                Open ResumeForge
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function TransformationCard({
  title,
  caption,
  description,
}: {
  title: string
  caption: string
  description: string
}) {
  return (
    <div className="shell-card p-5">
      <p className="shell-kicker">{caption}</p>
      <h2 className="mt-3 text-[var(--font-size-h3)] text-on-surface">{title}</h2>
      <p className="mt-3 text-[var(--font-size-body-sm)] leading-6 text-on-surface-muted">{description}</p>
    </div>
  )
}

function StudioSheet({
  label,
  eyebrow,
  lines,
  accent = false,
}: {
  label: string
  eyebrow: string
  lines: string[]
  accent?: boolean
}) {
  return (
    <div className={`rounded-[26px] border p-5 shadow-sm ${accent ? 'border-primary-200 bg-primary-50/70' : 'border-border/80 bg-white/75'}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="shell-kicker">{eyebrow}</p>
          <h3 className="mt-2 text-[var(--font-size-h4)] font-semibold text-on-surface">{label}</h3>
        </div>
        <span className={`h-2.5 w-2.5 rounded-full ${accent ? 'bg-primary-500' : 'bg-accent-500'}`} aria-hidden="true" />
      </div>
      <div className="mt-5 space-y-3">
        {lines.map((line, index) => (
          <div key={line} className="rounded-2xl border border-border/60 bg-white/80 px-4 py-3">
            <p className={`${index === 0 ? 'text-lg font-semibold text-on-surface' : 'text-sm text-on-surface-muted'}`}>
              {line}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TemplateStrip({ name, mood }: { name: string; mood: string }) {
  return (
    <div className="rounded-[20px] border border-border/70 bg-white/80 px-4 py-4">
      <p className="shell-kicker">Template</p>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <h3 className="text-[var(--font-size-h4)] font-semibold text-on-surface">{name}</h3>
        <span className="text-[var(--font-size-caption)] uppercase tracking-[0.14em] text-on-surface-muted">{mood}</span>
      </div>
    </div>
  )
}

function ValueProp({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="group">
      <span className="shell-kicker text-primary-500">
        {step}
      </span>
      <h3 className="mt-3 text-[var(--font-size-h3)] text-on-surface">
        {title}
      </h3>
      <p className="mt-3 max-w-[18rem] text-[var(--font-size-body-sm)] leading-relaxed text-on-surface-muted">
        {description}
      </p>
    </div>
  )
}
