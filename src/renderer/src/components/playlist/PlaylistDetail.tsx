import * as React from 'react'
import { Virtuoso } from 'react-virtuoso'
import type { TrackMetadata, Playlist } from '@shared/types'
import { usePlaylistStore } from '@renderer/stores/playlist-store'
import { useLibraryStore } from '@renderer/stores/library-store'
import { usePlayerStore } from '@renderer/stores/player-store'
import { formatTime } from '@renderer/utils/format'
import { LazyImage, DefaultAlbumArt } from '@renderer/components/common'

function BackIcon(): React.JSX.Element {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function DragHandleIcon(): React.JSX.Element {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
    </svg>
  )
}

function DeleteIcon(): React.JSX.Element {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  )
}

function PlayIcon(): React.JSX.Element {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PlaylistIcon(): React.JSX.Element {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  )
}

function PlayingIndicator(): React.JSX.Element {
  return (
    <div className="flex h-10 w-10 items-center justify-center">
      <div className="flex items-end gap-0.5">
        <div className="h-3 w-1 animate-pulse rounded-full bg-orange-500" style={{ animationDelay: '0ms' }} />
        <div className="h-4 w-1 animate-pulse rounded-full bg-orange-500" style={{ animationDelay: '150ms' }} />
        <div className="h-2 w-1 animate-pulse rounded-full bg-orange-500" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

interface PlaylistTrackItemProps {
  track: TrackMetadata
  index: number
  isPlaying: boolean
  isCurrentTrack: boolean
  isDragging: boolean
  onDoubleClick: () => void
  onRemove: () => void
  onDragStart: (e: React.DragEvent, index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDragEnd: () => void
  onDrop: (e: React.DragEvent, index: number) => void
}

function PlaylistTrackItem({
  track,
  index,
  isPlaying,
  isCurrentTrack,
  isDragging,
  onDoubleClick,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop
}: PlaylistTrackItemProps): React.JSX.Element {
  return (
    <div
      className={`interactive-soft group flex items-center gap-3 rounded-xl px-3 py-2 ${
        isDragging ? 'opacity-50' : ''
      } ${isCurrentTrack ? 'bg-orange-100/75 dark:bg-orange-900/20' : 'hover:bg-zinc-200/60 dark:hover:bg-zinc-800/50'}`}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      onDrop={(e) => onDrop(e, index)}
      onDoubleClick={onDoubleClick}
    >
      <div className="cursor-grab text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing dark:text-zinc-400">
        <DragHandleIcon />
      </div>

      <div className="w-8 text-center">
        {isCurrentTrack && isPlaying ? (
          <PlayingIndicator />
        ) : (
          <span className={`text-sm ${isCurrentTrack ? 'text-orange-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
            {index + 1}
          </span>
        )}
      </div>

      <LazyImage
        src={track.coverUrl}
        alt={track.album || 'Album art'}
        className="h-10 w-10 rounded-lg object-cover"
        fallback={<DefaultAlbumArt size="sm" />}
      />

      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${isCurrentTrack ? 'text-orange-600 dark:text-orange-300' : 'text-zinc-900 dark:text-zinc-100'}`}>
          {track.title}
        </p>
        <p className="truncate text-xs text-zinc-600 dark:text-zinc-300">{track.artist}</p>
      </div>

      <div className="hidden w-1/4 min-w-0 md:block">
        <p className="truncate text-sm text-zinc-600 dark:text-zinc-300">{track.album}</p>
      </div>

      <div className="w-12 text-right">
        <span className="text-sm text-zinc-600 dark:text-zinc-300">{formatTime(track.duration)}</span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="interactive-soft focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 opacity-0 transition-all hover:bg-zinc-200/60 hover:text-red-600 group-hover:opacity-100 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-red-400"
        title="从播放列表中移除"
      >
        <DeleteIcon />
      </button>
    </div>
  )
}

function EmptyPlaylistState(): React.JSX.Element {
  return (
    <div className="glass-soft flex flex-col items-center justify-center rounded-2xl py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
        <svg className="h-8 w-8 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-medium text-zinc-900 dark:text-zinc-100">播放列表为空</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">从音乐库中添加歌曲到这个播放列表</p>
    </div>
  )
}

export interface PlaylistDetailProps {
  playlist: Playlist
  onBack: () => void
}

export function PlaylistDetail({ playlist, onBack }: PlaylistDetailProps): React.JSX.Element {
  const tracks = useLibraryStore((state) => state.tracks)
  const getPlaylistTracks = usePlaylistStore((state) => state.getPlaylistTracks)
  const removeTrackFromPlaylist = usePlaylistStore((state) => state.removeTrackFromPlaylist)
  const reorderPlaylistTracks = usePlaylistStore((state) => state.reorderPlaylistTracks)

  const currentTrack = usePlayerStore((state) => state.currentTrack)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const setQueue = usePlayerStore((state) => state.setQueue)

  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null)

  const playlistTracks = React.useMemo(() => getPlaylistTracks(playlist.id, tracks), [playlist.id, tracks, getPlaylistTracks])
  const totalDuration = React.useMemo(() => playlistTracks.reduce((sum, track) => sum + track.duration, 0), [playlistTracks])

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="interactive-soft focus-ring inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100">
        <BackIcon />
        返回播放列表
      </button>

      <div className="glass-panel flex items-start gap-6 rounded-3xl p-6">
        <div className="flex h-48 w-48 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20">
          <PlaylistIcon />
        </div>

        <div className="flex flex-col justify-end py-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">播放列表</p>
          <h1 className="mb-2 text-4xl font-bold text-zinc-900 dark:text-zinc-100">{playlist.name}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {playlistTracks.length} 首歌曲 · {formatTime(totalDuration)}
          </p>

          {playlistTracks.length > 0 && (
            <button
              onClick={() => setQueue(playlistTracks, 0)}
              className="interactive-soft focus-ring mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/25"
              title="播放全部"
            >
              <PlayIcon />
            </button>
          )}
        </div>
      </div>

      {playlistTracks.length === 0 ? (
        <EmptyPlaylistState />
      ) : (
        <div>
          <div className="mb-2 flex items-center gap-3 border-b border-zinc-200/70 px-3 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-700/70 dark:text-zinc-400">
            <div className="w-4" />
            <div className="w-8 text-center">#</div>
            <div className="w-10" />
            <div className="min-w-0 flex-1">标题</div>
            <div className="hidden w-1/4 min-w-0 md:block">专辑</div>
            <div className="w-12 text-right">时长</div>
            <div className="w-8" />
          </div>

          <Virtuoso
            style={{ height: 'calc(100vh - 420px)' }}
            totalCount={playlistTracks.length}
            itemContent={(index) => {
              const track = playlistTracks[index]
              const isCurrentTrack = currentTrack?.id === track.id
              const isDragging = draggedIndex === index
              const isDragOver = dragOverIndex === index && draggedIndex !== index

              return (
                <div className={isDragOver ? 'border-t-2 border-orange-500' : ''}>
                  <PlaylistTrackItem
                    track={track}
                    index={index}
                    isPlaying={isPlaying}
                    isCurrentTrack={isCurrentTrack}
                    isDragging={isDragging}
                    onDoubleClick={() => setQueue(playlistTracks, index)}
                    onRemove={() => removeTrackFromPlaylist(playlist.id, index)}
                    onDragStart={(e, from) => {
                      setDraggedIndex(from)
                      e.dataTransfer.effectAllowed = 'move'
                      e.dataTransfer.setData('text/plain', from.toString())
                    }}
                    onDragOver={(e, over) => {
                      e.preventDefault()
                      e.dataTransfer.dropEffect = 'move'
                      setDragOverIndex(over)
                    }}
                    onDragEnd={() => {
                      setDraggedIndex(null)
                      setDragOverIndex(null)
                    }}
                    onDrop={(e, to) => {
                      e.preventDefault()
                      const from = draggedIndex
                      if (from !== null && from !== to) reorderPlaylistTracks(playlist.id, from, to)
                      setDraggedIndex(null)
                      setDragOverIndex(null)
                    }}
                  />
                </div>
              )
            }}
          />
        </div>
      )}
    </div>
  )
}
