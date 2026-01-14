import * as React from 'react'
import { usePlayerStore } from '../../stores/player-store'
import { PlaybackControls, ProgressBar, VolumeControl } from '../player'
import { LazyImage, DefaultAlbumArt } from '../common'

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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 flex h-20 items-center border-t border-zinc-200 bg-white px-4 transition-colors dark:border-zinc-800 dark:bg-zinc-950">
      {/* Left section - Track info */}
      <div className="flex w-1/4 min-w-0 items-center gap-3">
        <LazyImage
          src={currentTrack?.coverUrl}
          alt={currentTrack?.album || 'Album art'}
          className="h-14 w-14 rounded object-cover"
          fallback={<DefaultAlbumArt size="md" />}
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
      <div className="flex flex-1 flex-col items-center justify-center gap-1">
        <PlaybackControls />
        <ProgressBar maxWidthClass="max-w-xl" />
      </div>

      {/* Right section - Volume control */}
      <div className="flex w-1/4 items-center justify-end">
        <VolumeControl />
      </div>
    </div>
  )
}
