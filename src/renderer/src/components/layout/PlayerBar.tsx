import * as React from 'react'
import { usePlayerStore } from '@renderer/stores/player-store'
import { useUIStore } from '@renderer/stores/ui-store'
import { PlaybackControls, ProgressBar, VolumeControl } from '@renderer/components/player'
import { RotatingAlbumArt } from '@renderer/components/player/RotatingAlbumArt'
import { AudioVisualizer } from '@renderer/components/player/AudioVisualizer'
import { useColorExtractor } from '@renderer/hooks/useColorExtractor'

/**
 * PlayerBar component
 *
 * Fixed bottom bar displaying current track info, playback controls,
 * progress bar, and volume control.
 *
 * Requirements: 8.1, 8.4
 */
export function PlayerBar(): React.JSX.Element {
  const currentTrack = usePlayerStore((state) => state.currentTrack)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const lyricsVisible = useUIStore((state) => state.lyricsVisible)
  const toggleLyrics = useUIStore((state) => state.toggleLyrics)
  const { dominantColor, palette } = useColorExtractor(currentTrack?.coverUrl)

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-20 flex h-20 items-center px-4 player-bar-glass dynamic-bg relative"
      style={{
        background: `linear-gradient(135deg, ${dominantColor}20 0%, transparent 50%), linear-gradient(to right, ${palette[0]}10, ${palette[1] || palette[0]}10)`
      }}
    >
      {/* Audio visualizer background */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none overflow-hidden">
        <AudioVisualizer
          isPlaying={isPlaying}
          barCount={48}
          barColor="rgba(249, 115, 22, 0.2)"
          className="w-full"
        />
      </div>

      {/* Left section - Track info */}
      <div className="flex w-1/4 min-w-0 items-center gap-3 relative z-10">
        <RotatingAlbumArt
          src={currentTrack?.coverUrl}
          alt={currentTrack?.album || 'Album art'}
          isPlaying={isPlaying}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {currentTrack?.title || '未播放'}
          </p>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            {currentTrack?.artist || '选择一首歌曲开始播放'}
          </p>
        </div>
      </div>

      {/* Center section - Playback controls and progress */}
      <div className="flex flex-1 flex-col items-center justify-center gap-1 relative z-10">
        <PlaybackControls />
        <ProgressBar maxWidthClass="max-w-xl" />
      </div>

      {/* Right section - Volume control and lyrics button */}
      <div className="flex w-1/4 items-center justify-end gap-2 relative z-10">
        <button
          onClick={toggleLyrics}
          className={`rounded-md p-2 transition-colors ${
            lyricsVisible
              ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
              : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
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
        <VolumeControl />
      </div>
    </div>
  )
}
