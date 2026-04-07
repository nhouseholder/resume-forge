import { useNavigate, useParams } from 'react-router-dom'

export default function ViewPage() {
  const navigate = useNavigate()
  const { hash } = useParams()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/60 bg-surface/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center">
          <button
            onClick={() => navigate('/')}
            className="text-[var(--font-size-h4)] font-display tracking-tight text-on-surface hover:text-primary-600 transition-colors duration-[var(--duration-normal)]"
          >
            Resume<span className="text-primary-600 italic">Forge</span>
          </button>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center max-w-md">
          <h1 className="text-[var(--font-size-h2)] font-display text-on-surface">
            Shared portfolios
          </h1>
          <p className="text-[var(--font-size-body)] text-on-surface-muted mt-4 leading-relaxed">
            {hash
              ? 'This shared portfolio link isn\'t active yet. Shared resumes will be available in a future update.'
              : 'Shareable portfolio links are coming soon. Build your portfolio now and you\'ll be first to access sharing.'}
          </p>
          <button
            onClick={() => navigate('/builder')}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold text-[var(--font-size-body)]
              transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-quart)]
              hover:bg-primary-700 hover:shadow-md hover:shadow-primary-600/15
              active:scale-[0.98]
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            Build your portfolio
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  )
}
