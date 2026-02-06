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
        boxShadow: '0 0 0 2px rgba(0,0,0,0.1), inset 0 0 20px rgba(0,0,0,0.1)'
      }}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
      <div
        className="absolute inset-[15%] rounded-full bg-zinc-700"
        style={{ boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' }}
      />
      <div
        className={`absolute inset-[5%] rounded-full overflow-hidden animate-spin-slow ${isPlaying ? '' : 'paused'}`}
        data-playing={isPlaying ? 'true' : 'false'}
      >
        <LazyImage
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          fallback={<DefaultAlbumArt size={size} />}
        />
      </div>
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)'
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[12%] w-[12%] rounded-full bg-zinc-900 border border-zinc-700" />
    </div>
  )
}
