import * as React from 'react'
import { getAnalyserNode, getAudioContext } from '@renderer/services/audio-service'

export interface AudioVisualizerProps {
  isPlaying: boolean
  barCount?: number
  barColor?: string
  className?: string
}

export function AudioVisualizer({
  isPlaying,
  barCount = 32,
  barColor = 'rgba(249, 115, 22, 0.6)',
  className = ''
}: AudioVisualizerProps): React.JSX.Element {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const animationRef = React.useRef<number>(0)
  const analyserRef = React.useRef<AnalyserNode | null>(null)
  const dataArrayRef = React.useRef<Uint8Array | null>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const initAnalyser = (): boolean => {
      const audioCtx = getAudioContext()
      if (!audioCtx) return false

      if (audioCtx.state === 'suspended') {
        audioCtx.resume()
      }

      const analyser = getAnalyserNode()
      if (!analyser) return false

      analyserRef.current = analyser
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount)
      return true
    }

    const draw = (): void => {
      if (!isPlaying) {
        drawIdle(ctx, canvas.width, canvas.height, barCount, barColor)
        return
      }

      animationRef.current = requestAnimationFrame(draw)

      if (!analyserRef.current || !dataArrayRef.current) {
        if (!initAnalyser()) {
          drawIdle(ctx, canvas.width, canvas.height, barCount, barColor)
          return
        }
      }

      analyserRef.current!.getByteFrequencyData(dataArrayRef.current! as Uint8Array<ArrayBuffer>)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const barWidth = canvas.width / barCount
      const heightMultiplier = canvas.height / 255

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * dataArrayRef.current!.length)
        const barHeight = Math.max(2, dataArrayRef.current![dataIndex] * heightMultiplier)

        ctx.fillStyle = barColor
        ctx.fillRect(i * barWidth + 1, canvas.height - barHeight, barWidth - 2, barHeight)
      }
    }

    if (isPlaying) {
      draw()
    } else {
      drawIdle(ctx, canvas.width, canvas.height, barCount, barColor)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, barCount, barColor])

  return (
    <canvas
      ref={canvasRef}
      className={`audio-visualizer ${className}`}
      width={320}
      height={40}
      style={{ opacity: 0.5 }}
    />
  )
}

function drawIdle(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  barCount: number,
  barColor: string
): void {
  ctx.clearRect(0, 0, width, height)
  const barWidth = width / barCount

  for (let i = 0; i < barCount; i++) {
    ctx.fillStyle = barColor
    ctx.fillRect(i * barWidth + 1, height - 2, barWidth - 2, 2)
  }
}
