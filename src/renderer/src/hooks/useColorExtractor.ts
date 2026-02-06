import * as React from 'react'

interface ColorExtractionResult {
  dominantColor: string
  palette: string[]
  isLoading: boolean
}

const DEFAULT_COLOR = '#f97316'
const DEFAULT_PALETTE = ['#f97316', '#ea580c', '#c2410c']

export function useColorExtractor(imageUrl: string | undefined): ColorExtractionResult {
  const [result, setResult] = React.useState<ColorExtractionResult>({
    dominantColor: DEFAULT_COLOR,
    palette: DEFAULT_PALETTE,
    isLoading: false
  })

  React.useEffect(() => {
    if (!imageUrl) {
      setResult({ dominantColor: DEFAULT_COLOR, palette: DEFAULT_PALETTE, isLoading: false })
      return
    }

    setResult((prev) => ({ ...prev, isLoading: true }))

    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const colors = extractColorsFromImage(img)
        setResult({
          dominantColor: colors[0] || DEFAULT_COLOR,
          palette: colors.length > 0 ? colors : DEFAULT_PALETTE,
          isLoading: false
        })
      } catch {
        setResult({ dominantColor: DEFAULT_COLOR, palette: DEFAULT_PALETTE, isLoading: false })
      }
    }

    img.onerror = () => {
      setResult({ dominantColor: DEFAULT_COLOR, palette: DEFAULT_PALETTE, isLoading: false })
    }

    img.src = imageUrl

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [imageUrl])

  return result
}

function extractColorsFromImage(img: HTMLImageElement): string[] {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return []

  const size = 50
  canvas.width = size
  canvas.height = size

  ctx.drawImage(img, 0, 0, size, size)

  const imageData = ctx.getImageData(0, 0, size, size)
  const data = imageData.data

  const colorCounts: Map<string, number> = new Map()

  for (let i = 0; i < data.length; i += 4) {
    const r = Math.round(data[i] / 16) * 16
    const g = Math.round(data[i + 1] / 16) * 16
    const b = Math.round(data[i + 2] / 16) * 16
    const a = data[i + 3]

    if (a < 128) continue
    if (r + g + b < 30 || r + g + b > 720) continue

    const key = `rgb(${r}, ${g}, ${b})`
    colorCounts.set(key, (colorCounts.get(key) || 0) + 1)
  }

  const sorted = Array.from(colorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([color]) => color)

  return sorted
}
