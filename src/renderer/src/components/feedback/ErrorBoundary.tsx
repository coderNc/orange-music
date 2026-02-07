import * as React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null })
  }

  handleReload = (): void => {
    window.location.reload()
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="stage-gradient flex h-screen w-screen flex-col items-center justify-center bg-zinc-50 p-8 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
          <div className="glass-panel max-w-md rounded-3xl p-6 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 dark:text-red-400">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-100">出现了一些问题</h1>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">应用程序遇到了意外错误。可以尝试重试或重新加载应用。</p>

            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
                  查看错误详情
                </summary>
                <pre className="mt-2 max-h-48 overflow-auto rounded-xl bg-zinc-900/90 p-3 text-xs text-red-300 dark:bg-zinc-950">
                  {this.state.error.message}
                  {this.state.error.stack && (
                    <>
                      {'\n\n'}
                      {this.state.error.stack}
                    </>
                  )}
                </pre>
              </details>
            )}

            <div className="flex justify-center gap-3">
              <button
                onClick={this.handleRetry}
                className="interactive-soft focus-ring rounded-xl bg-zinc-200/80 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                重试
              </button>
              <button
                onClick={this.handleReload}
                className="interactive-soft focus-ring rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
              >
                重新加载
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export function useErrorHandler(): (error: Error) => void {
  const [, setError] = React.useState<Error | null>(null)

  return React.useCallback((error: Error) => {
    setError(() => {
      throw error
    })
  }, [])
}
