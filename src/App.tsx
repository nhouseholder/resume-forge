import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

// Lazy-load pages for code splitting
import { lazy, Suspense } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
const HomePage = lazy(() => import('./pages/HomePage'))
const BuilderPage = lazy(() => import('./pages/BuilderPage'))
const ViewPage = lazy(() => import('./pages/ViewPage'))

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 rounded-full border-3 border-neutral-200 border-t-primary-600 animate-spin" />
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-8xl font-display font-bold text-primary-200 mb-2">404</h1>
        <p className="text-[var(--font-size-h4)] font-display text-on-surface mb-2">Page not found</p>
        <p className="text-[var(--font-size-body)] text-on-surface-muted mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-2.5 rounded-lg text-[var(--font-size-body-sm)] font-medium
            bg-primary-600 text-white transition-all duration-[var(--duration-fast)]
            hover:bg-primary-700 active:scale-[0.97]"
        >
          Back to ResumeForge
        </a>
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <div className="min-h-screen bg-surface text-on-surface">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/builder" element={<BuilderPage />} />
              <Route path="/view/:hash" element={<ViewPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
