import * as React from 'react'
import { usePlayerStore } from '@renderer/stores/player-store'

function VolumeMutedIcon(): React.JSX.Element {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
      />
    </svg>
  )
}

function VolumeLowIcon(): React.JSX.Element {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
      />
    </svg>
  )
}

function VolumeHighIcon(): React.JSX.Element {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
      />
    </svg>
  )
}

function getVolumeIcon(volume: number): React.JSX.Element {
  if (volume === 0) return <VolumeMutedIcon />
  if (volume < 0.5) return <VolumeLowIcon />
  return <VolumeHighIcon />
}

export interface VolumeControlProps {
  className?: string
  sliderWidthClass?: string
}

export function VolumeControl({
  className = '',
  sliderWidthClass = 'w-24'
}: VolumeControlProps): React.JSX.Element {
  const volume = usePlayerStore((state) => state.volume)
  const setVolume = usePlayerStore((state) => state.setVolume)
  const [previousVolume, setPreviousVolume] = React.useState(1)

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (newVolume > 0) setPreviousVolume(newVolume)
  }

  const toggleMute = (): void => {
    if (volume > 0) {
      setPreviousVolume(volume)
      setVolume(0)
      return
    }
    setVolume(previousVolume)
  }

  const volumePercent = volume * 100

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={toggleMute}
        className="interactive-soft focus-ring flex h-8 w-8 items-center justify-center rounded-xl text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100"
        title={volume > 0 ? '静音' : '取消静音'}
        aria-label={volume > 0 ? '静音' : '取消静音'}
      >
        {getVolumeIcon(volume)}
      </button>
      <div className={`relative h-1.5 ${sliderWidthClass}`}>
        <div className="absolute inset-0 rounded-full bg-zinc-300/90 dark:bg-zinc-700/70" />
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${volumePercent}%`,
            background: 'linear-gradient(90deg, rgba(var(--ambient-rgb), 0.88), rgba(var(--ambient-rgb), 0.45))'
          }}
        />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          className="focus-ring absolute inset-0 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-zinc-200 dark:[&::-webkit-slider-thumb]:border-zinc-500 [&::-webkit-slider-thumb]:bg-zinc-900 dark:[&::-webkit-slider-thumb]:bg-zinc-100 [&::-webkit-slider-thumb]:shadow-md"
          aria-label="音量"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(volumePercent)}
          aria-valuetext={`${Math.round(volumePercent)}%`}
        />
      </div>
    </div>
  )
}
