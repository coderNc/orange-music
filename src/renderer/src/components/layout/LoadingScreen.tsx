import * as React from 'react'

interface LoadingScreenProps {
  message?: string
  error?: string | null
}

function MusicIcon(): React.JSX.Element {
  return (
    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
      />
    </svg>
  )
}

export function LoadingScreen({ message, error }: LoadingScreenProps): React.JSX.Element {
  return (
    <div className="stage-gradient flex h-screen w-screen flex-col items-center justify-center bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="mb-8 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-orange-500/20" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-xl shadow-orange-500/30">
            <MusicIcon />
          </div>
        </div>
      </div>

      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">橘子的晴天</h1>

      {error ? (
        <div className="glass-panel flex flex-col items-center gap-4 rounded-2xl px-5 py-4">
          <div className="rounded-lg bg-red-500/10 px-4 py-2 text-red-600 dark:text-red-400">
            <p>{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="interactive-soft focus-ring rounded-lg bg-zinc-200 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            重试
          </button>
        </div>
      ) : (
        <div className="glass-panel flex flex-col items-center gap-4 rounded-2xl px-6 py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-orange-500 dark:border-zinc-700" />
          <p className="text-sm text-zinc-600 dark:text-zinc-300">{message || '正在加载...'}</p>
        </div>
      )}
    </div>
  )
}
