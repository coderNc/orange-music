import * as React from 'react'
import { usePlayerStore } from '@renderer/stores/player-store'
import { useUIStore } from '@renderer/stores/ui-store'
import { PlaybackControls, ProgressBar, VolumeControl } from '@renderer/components/player'
import { RotatingAlbumArt } from '@renderer/components/player/RotatingAlbumArt'
import { AudioVisualizer } from '@renderer/components/player/AudioVisualizer'
import { useColorExtractor } from '@renderer/hooks/useColorExtractor'
import { useTheme } from '@renderer/hooks'

export function PlayerBar(): React.JSX.Element {
  const currentTrack = usePlayerStore((state) => state.currentTrack)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const lyricsVisible = useUIStore((state) => state.lyricsVisible)
  const toggleLyrics = useUIStore((state) => state.toggleLyrics)
  const desktopLyricsVisible = useUIStore((state) => state.desktopLyricsVisible)
  const toggleDesktopLyrics = useUIStore((state) => state.toggleDesktopLyrics)
  const { dominantColor, palette } = useColorExtractor(currentTrack?.coverUrl)
  const { resolvedTheme } = useTheme()

  React.useEffect(() => {
    const root = document.documentElement
    const rgbMatch = dominantColor.match(/\d+/g)

    if (!rgbMatch || rgbMatch.length < 3) {
      root.style.setProperty('--ambient-rgb', '249, 115, 22')
      return
    }

    root.style.setProperty('--ambient-rgb', `${rgbMatch[0]}, ${rgbMatch[1]}, ${rgbMatch[2]}`)
  }, [dominantColor])

  return (
    <div
      data-playing={isPlaying}
      className="fixed bottom-0 left-0 right-0 z-20 flex h-20 items-center px-4 player-bar-glass dynamic-bg player-breath relative"
      style={{
        backgroundImage:
          resolvedTheme === 'dark'
            ? `linear-gradient(120deg, ${dominantColor}14 0%, transparent 42%), linear-gradient(to right, ${palette[0]}0D, ${palette[1] || palette[0]}08)`
            : `linear-gradient(120deg, ${dominantColor}20 0%, transparent 45%), linear-gradient(to right, ${palette[0]}18, ${palette[1] || palette[0]}10)`
      }}
    >
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none overflow-hidden">
        <AudioVisualizer
          isPlaying={isPlaying}
          barCount={54}
          barColor={
            resolvedTheme === 'dark' ? 'rgba(249, 115, 22, 0.14)' : 'rgba(249, 115, 22, 0.22)'
          }
          className="w-full"
        />
      </div>

      <div className="relative z-10 flex w-1/4 min-w-0 items-center gap-3">
        <RotatingAlbumArt
          src={currentTrack?.coverUrl}
          alt={currentTrack?.album || 'Album art'}
          isPlaying={isPlaying}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {currentTrack?.title || '未播放'}
          </p>
          <p className="truncate text-xs text-zinc-600 dark:text-zinc-300">
            {currentTrack?.artist || '选择一首歌曲开始播放'}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-1">
        <PlaybackControls />
        <ProgressBar maxWidthClass="max-w-xl" />
      </div>

      <div className="relative z-10 flex w-1/4 items-center justify-end gap-2">
        <button
          onClick={toggleLyrics}
          className={`interactive-soft focus-ring rounded-xl p-2 transition-colors ${
            lyricsVisible
              ? 'bg-orange-100/80 text-orange-700 dark:bg-orange-500/25 dark:text-orange-300'
              : 'text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100'
          }`}
          title="歌词"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        </button>
        <button
          onClick={toggleDesktopLyrics}
          className={`interactive-soft focus-ring rounded-xl p-2 transition-colors ${
            desktopLyricsVisible
              ? 'bg-orange-100/80 text-orange-700 dark:bg-orange-500/25 dark:text-orange-300'
              : 'text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100'
          }`}
          title="桌面歌词"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1.25 1h8.5L15 20l-.75-3M3 13V5a2 2 0 012-2h14a2 2 0 012 2v8M3 13h18M5 13v2a2 2 0 002 2h10a2 2 0 002-2v-2"
            />
          </svg>
        </button>
        <VolumeControl />
      </div>
    </div>
  )
}
