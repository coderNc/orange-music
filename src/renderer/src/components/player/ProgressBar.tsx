import * as React from 'react'
import { usePlayerStore } from '@renderer/stores/player-store'
import { formatTime } from '@renderer/utils'

export interface ProgressBarProps {
  className?: string
  maxWidthClass?: string
}

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
  const [isHovering, setIsHovering] = React.useState(false)
  const progressContainerRef = React.useRef<HTMLDivElement>(null)

  const displayPosition = isDragging ? dragPosition : position
  const progress = duration > 0 ? (displayPosition / duration) * 100 : 0

  const handleMouseDown = (): void => {
    setIsDragging(true)
    setDragPosition(position)
  }

  const handleMouseUp = (): void => {
    if (!isDragging) return
    seek(dragPosition)
    setIsDragging(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newPosition = parseFloat(e.target.value)
    if (isDragging) {
      setDragPosition(newPosition)
      return
    }
    seek(newPosition)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!progressContainerRef.current || duration <= 0) return
    const rect = progressContainerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, x / rect.width))
    setHoverPosition(percent * duration)
    setTooltipX(Math.max(20, Math.min(x, rect.width - 20)))
    setIsHovering(true)
  }

  const handleMouseLeave = (): void => {
    setHoverPosition(null)
    setIsHovering(false)
  }

  React.useEffect(() => {
    if (!isDragging) return

    const handleGlobalMouseUp = (): void => {
      seek(dragPosition)
      setIsDragging(false)
    }

    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [isDragging, dragPosition, seek])

  const thumbPercent = duration > 0 ? `${progress}%` : '0%'
  const showHint = hoverPosition !== null && duration > 0

  return (
    <div className={`flex w-full items-center gap-2 ${maxWidthClass} ${className}`}>
      <span className="w-10 text-right text-xs text-zinc-600 dark:text-zinc-300">
        {formatTime(displayPosition)}
      </span>
      <div
        ref={progressContainerRef}
        className={`magnetic-slider relative h-2 flex-1 cursor-pointer ${isDragging ? 'dragging' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-0 rounded-full bg-zinc-300/90 dark:bg-zinc-700/70" />
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, rgba(var(--ambient-rgb), 0.85), rgba(var(--ambient-rgb), 0.48))'
          }}
        />

        <div
          data-active={isDragging || isHovering}
          className="progress-thumb absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 bg-white shadow-md"
          style={{ left: thumbPercent }}
        />

        <input
          type="range"
          min={0}
          max={duration || 100}
          value={displayPosition}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="focus-ring absolute inset-0 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-transparent"
          aria-label="播放进度"
          aria-valuemin={0}
          aria-valuemax={duration || 100}
          aria-valuenow={displayPosition}
          aria-valuetext={`${formatTime(displayPosition)} / ${formatTime(duration)}`}
        />

        {showHint && (
          <div
            className="absolute -top-9 -translate-x-1/2 rounded-md border border-white/30 bg-zinc-900/90 px-2 py-1 text-[11px] text-white shadow-xl"
            style={{ left: tooltipX }}
          >
            {formatTime(hoverPosition)}
          </div>
        )}
      </div>
      <span className="w-10 text-xs text-zinc-600 dark:text-zinc-300">{formatTime(duration)}</span>
    </div>
  )
}
