import * as React from 'react'
import { usePlayerStore } from '@renderer/stores/player-store'
import { formatTime } from '@renderer/utils'

export interface ProgressBarProps {
  /** Additional CSS classes */
  className?: string
  /** Maximum width class for the progress bar container */
  maxWidthClass?: string
}

/**
 * ProgressBar component
 *
 * Displays playback progress with a draggable slider and time display.
 * Connects to the Player Store for position, duration, and seek operations.
 *
 * Requirements: 3.5
 */
export function ProgressBar({
  className = '',
  maxWidthClass = 'max-w-xl'
}: ProgressBarProps): React.JSX.Element {
  const position = usePlayerStore((state) => state.position)
  const duration = usePlayerStore((state) => state.duration)
  const seek = usePlayerStore((state) => state.seek)

  const [isDragging, setIsDragging] = React.useState(false)
  const [dragPosition, setDragPosition] = React.useState(0)
  const [hoverPosition, setHoverPosition] = React.useState<number | null>(null)
  const [tooltipX, setTooltipX] = React.useState(0)
  const progressContainerRef = React.useRef<HTMLDivElement>(null)

  const displayPosition = isDragging ? dragPosition : position
  const progress = duration > 0 ? (displayPosition / duration) * 100 : 0

  const handleMouseDown = (): void => {
    setIsDragging(true)
    setDragPosition(position)
  }

  const handleMouseUp = (): void => {
    if (isDragging) {
      seek(dragPosition)
      setIsDragging(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newPosition = parseFloat(e.target.value)
    if (isDragging) {
      setDragPosition(newPosition)
    } else {
      seek(newPosition)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!progressContainerRef.current || duration <= 0) return
    const rect = progressContainerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, x / rect.width))
    setHoverPosition(percent * duration)
    setTooltipX(x)
  }

  const handleMouseLeave = (): void => {
    setHoverPosition(null)
  }

  // Handle mouse up outside the slider
  React.useEffect(() => {
    if (!isDragging) {
      return
    }
    const handleGlobalMouseUp = (): void => {
      seek(dragPosition)
      setIsDragging(false)
    }
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [isDragging, dragPosition, seek])

  return (
    <div className={`flex w-full items-center gap-2 ${maxWidthClass} ${className}`}>
      <span className="w-10 text-right text-xs text-zinc-500 dark:text-zinc-400">
        {formatTime(displayPosition)}
      </span>
      <div
        ref={progressContainerRef}
        className="progress-bar-container relative h-2 flex-1 cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-0 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-orange-500"
          style={{ width: `${progress}%` }}
        />
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={displayPosition}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="absolute inset-0 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:transition-opacity hover:[&::-webkit-slider-thumb]:opacity-100"
          aria-label="播放进度"
          aria-valuemin={0}
          aria-valuemax={duration || 100}
          aria-valuenow={displayPosition}
          aria-valuetext={`${formatTime(displayPosition)} / ${formatTime(duration)}`}
        />
        {hoverPosition !== null && (
          <div
            className="time-tooltip absolute -top-8 transform -translate-x-1/2 rounded bg-zinc-800 px-2 py-1 text-xs text-white shadow-lg"
            style={{ left: tooltipX }}
          >
            {formatTime(hoverPosition)}
          </div>
        )}
      </div>
      <span className="w-10 text-xs text-zinc-500 dark:text-zinc-400">{formatTime(duration)}</span>
    </div>
  )
}
