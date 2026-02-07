import * as React from 'react'
import { Virtuoso } from 'react-virtuoso'
import type { Album } from '@shared/types'
import { useLibraryStore } from '@renderer/stores/library-store'
import { usePlayerStore } from '@renderer/stores/player-store'
import { LazyImage, DefaultAlbumArt } from '@renderer/components/common'

const PlayOverlay = React.memo(function PlayOverlay(): React.JSX.Element {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/45 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30">
        <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  )
})

interface AlbumCardProps {
  album: Album
  onPlay: () => void
  onClick: () => void
}

const AlbumCard = React.memo(
  function AlbumCard({ album, onPlay, onClick }: AlbumCardProps): React.JSX.Element {
    const handlePlayClick = (e: React.MouseEvent): void => {
      e.stopPropagation()
      onPlay()
    }

    return (
      <div className="surface-card interactive-soft group scroll-parallax cursor-pointer rounded-2xl p-3" onClick={onClick}>
        <div className="relative mb-3">
          <LazyImage
            src={album.coverData}
            alt={album.name}
            className="aspect-square w-full rounded-xl object-cover"
            fallback={<DefaultAlbumArt size="lg" className="rounded-xl" />}
          />
          <div onClick={handlePlayClick}>
            <PlayOverlay />
          </div>
        </div>

        <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">{album.name}</h3>
        <p className="truncate text-xs text-zinc-600 dark:text-zinc-300">
          {album.artist}
          {album.year && <span className="ml-1">• {album.year}</span>}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{album.trackCount} 首歌曲</p>
      </div>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.album.name === nextProps.album.name &&
      prevProps.album.artist === nextProps.album.artist &&
      prevProps.album.trackCount === nextProps.album.trackCount &&
      prevProps.album.coverData === nextProps.album.coverData
    )
  }
)

function EmptyState(): React.JSX.Element {
  return (
    <div className="glass-soft flex flex-col items-center justify-center rounded-2xl py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
        <svg className="h-8 w-8 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-medium text-zinc-900 dark:text-zinc-100">没有专辑</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">添加音乐文件夹来查看专辑</p>
    </div>
  )
}

export interface AlbumGridProps {
  artistFilter?: string
  onSelectAlbum?: (album: Album) => void
  height?: number | string
}

export function AlbumGrid({
  artistFilter,
  onSelectAlbum,
  height = 'calc(100vh - 200px)'
}: AlbumGridProps): React.JSX.Element {
  const getAlbums = useLibraryStore((state) => state.getAlbums)
  const setQueue = usePlayerStore((state) => state.setQueue)

  const allAlbums = getAlbums()

  const albums = React.useMemo(() => {
    if (!artistFilter) return allAlbums
    return allAlbums.filter((album) => album.artist.toLowerCase() === artistFilter.toLowerCase())
  }, [allAlbums, artistFilter])

  const COLUMNS = 4
  const rows = React.useMemo(() => {
    const result: Album[][] = []
    for (let i = 0; i < albums.length; i += COLUMNS) {
      result.push(albums.slice(i, i + COLUMNS))
    }
    return result
  }, [albums])

  if (albums.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-300">专辑 ({albums.length})</h3>
      </div>

      <Virtuoso
        style={{ height }}
        totalCount={rows.length}
        itemContent={(index) => {
          const row = rows[index]
          return (
            <div className="grid grid-cols-4 gap-4 pb-4">
              {row.map((album) => (
                <AlbumCard
                  key={`${album.name}-${album.artist}`}
                  album={album}
                  onPlay={() => setQueue(album.tracks, 0)}
                  onClick={() => onSelectAlbum?.(album)}
                />
              ))}
              {row.length < COLUMNS &&
                Array.from({ length: COLUMNS - row.length }).map((_, i) => <div key={`empty-${i}`} />)}
            </div>
          )
        }}
      />
    </div>
  )
}
