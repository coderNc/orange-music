import * as React from 'react'
import { LazyImage, DefaultAlbumArt } from '@renderer/components/common'

export interface RotatingAlbumArtProps {
  src: string | undefined
  alt?: string
  isPlaying: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-20 w-20'
}

export function RotatingAlbumArt({
  src,
  alt = 'Album art',
  isPlaying,
  size = 'md'
}: RotatingAlbumArtProps): React.JSX.Element {
  return (
    <div
      className={`relative ${sizeClasses[size]} overflow-hidden rounded-full`}
      style={{
        boxShadow: '0 0 0 2px rgba(255,255,255,0.45), 0 10px 20px rgba(0,0,0,0.18), inset 0 0 16px rgba(0,0,0,0.22)'
      }}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 dark:from-zinc-500 dark:to-zinc-900" />
      <div className="absolute inset-[15%] rounded-full bg-zinc-700/90 dark:bg-zinc-800" style={{ boxShadow: 'inset 0 0 10px rgba(0,0,0,0.45)' }} />
      <div
        className={`absolute inset-[5%] overflow-hidden rounded-full animate-spin-slow ${isPlaying ? '' : 'paused'}`}
        data-playing={isPlaying ? 'true' : 'false'}
      >
        <LazyImage
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          fallback={<DefaultAlbumArt size={size} />}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 30% 28%, rgba(255,255,255,0.24) 0%, transparent 52%)' }} />
      <div className="absolute left-1/2 top-1/2 h-[12%] w-[12%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-zinc-900" />
    </div>
  )
}
