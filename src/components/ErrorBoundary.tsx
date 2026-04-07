import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-semibold text-on-surface mb-2">
              Something went wrong
            </h1>
            <p className="text-[var(--font-size-body)] text-on-surface-muted mb-2">
              An unexpected error occurred. Your work has been saved.
            </p>
            {this.state.error?.message && (
              <p className="text-[var(--font-size-body-sm)] text-on-surface-muted/70 font-mono bg-neutral-100 rounded-lg p-3 mb-6 text-left break-words">
                {this.state.error.message}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-lg text-[var(--font-size-body-sm)] font-medium
                  bg-primary-600 text-white transition-all duration-[var(--duration-fast)]
                  hover:bg-primary-700 active:scale-[0.97]"
              >
                Try again
              </button>
              <a
                href="/"
                className="px-5 py-2.5 rounded-lg text-[var(--font-size-body-sm)] font-medium
                  border border-border text-on-surface-muted transition-all duration-[var(--duration-fast)]
                  hover:bg-neutral-50 hover:text-on-surface"
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
