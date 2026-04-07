import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav — minimal editorial header */}
      <header className="border-b border-border/60 bg-surface/90 backdrop-blur-sm sticky top-0 z-10">
        <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-[var(--font-size-h4)] font-display tracking-tight text-on-surface hover:text-primary-600 transition-colors duration-[var(--duration-normal)]"
          >
            Resume<span className="text-primary-600 italic">Forge</span>
          </button>
          <button
            onClick={() => navigate('/builder')}
            className="px-4 py-1.5 text-[var(--font-size-body-sm)] font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-[var(--duration-fast)]"
          >
            Build resume
          </button>
        </nav>
      </header>

      {/* Hero — editorial asymmetric layout */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-primary-400" aria-hidden="true" />
              <span className="text-[var(--font-size-caption)] font-medium uppercase tracking-[0.12em] text-primary-600">
                AI-Powered
              </span>
            </div>

            {/* Headline — serif, generous leading */}
            <h1 className="text-[var(--font-size-display)] font-display text-on-surface leading-[1.08]">
              Your resume,<br />
              <span className="italic text-primary-600">reimagined</span> as a<br />
              digital experience
            </h1>

            {/* Subhead — relaxed line-height, max-width for readability */}
            <p className="text-[var(--font-size-body)] text-on-surface-muted mt-8 max-w-[28rem] leading-[1.7]">
              Upload your resume and our AI extracts every detail — experience,
              education, publications, research — then renders it as a
              stunning, shareable document. No design skills needed.
            </p>

            {/* CTAs — primary + secondary */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
              <button
                onClick={() => navigate('/builder')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold text-[var(--font-size-body)]
                  transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-quart)]
                  hover:bg-primary-700 hover:shadow-md hover:shadow-primary-600/15
                  active:scale-[0.98] active:bg-primary-800
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                Build your resume
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <span className="text-[var(--font-size-body-sm)] text-on-surface-muted self-center">
                Free to start · No account needed
              </span>
            </div>
          </div>

          {/* Value props — horizontal editorial strip, not metric cards */}
          <div className="mt-24 pt-12 border-t border-border/60">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <ValueProp
                step="01"
                title="Upload"
                description="Drop your PDF or DOCX. Everything stays in your browser until you're ready to parse."
              />
              <ValueProp
                step="02"
                title="Refine"
                description="AI extracts your experience, education, publications. Edit anything in our structured editor."
              />
              <ValueProp
                step="03"
                title="Publish"
                description="Choose a template, customize colors and fonts, then export as HTML, PDF, or a shareable link."
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function ValueProp({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="group">
      <span className="text-[var(--font-size-caption)] font-mono text-primary-500 tracking-wider">
        {step}
      </span>
      <h3 className="text-[var(--font-size-h3)] font-display text-on-surface mt-2">
        {title}
      </h3>
      <p className="text-[var(--font-size-body-sm)] text-on-surface-muted mt-2 leading-relaxed max-w-[18rem]">
        {description}
      </p>
    </div>
  )
}
