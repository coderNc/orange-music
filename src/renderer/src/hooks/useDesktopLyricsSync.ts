import * as React from 'react'
import { useLyrics } from './useLyrics'
import { useUIStore } from '@renderer/stores/ui-store'
import { usePlayerStore } from '@renderer/stores/player-store'
import { ipcService } from '@renderer/services/ipc-service'

export function useDesktopLyricsSync(): void {
  const desktopLyricsVisible = useUIStore((state) => state.desktopLyricsVisible)
  const setDesktopLyricsVisible = useUIStore((state) => state.setDesktopLyricsVisible)
  const currentTrack = usePlayerStore((state) => state.currentTrack)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const play = usePlayerStore((state) => state.play)
  const pause = usePlayerStore((state) => state.pause)
  const previous = usePlayerStore((state) => state.previous)
  const next = usePlayerStore((state) => state.next)
  const { lyrics, currentIndex } = useLyrics(currentTrack)

  React.useEffect(() => {
    const unsubscribe = ipcService.onDesktopLyricsControl((action) => {
      if (action === 'play-pause') {
        if (usePlayerStore.getState().isPlaying) {
          pause()
        } else {
          void play()
        }
      }

      if (action === 'previous') {
        void previous()
      }

      if (action === 'next') {
        void next()
      }

      if (action === 'close-desktop-lyrics') {
        setDesktopLyricsVisible(false)
      }
    })

    return unsubscribe
  }, [next, pause, play, previous, setDesktopLyricsVisible])

  React.useEffect(() => {
    if (!desktopLyricsVisible) {
      void ipcService.hideDesktopLyrics().catch(() => undefined)
      return
    }

    void ipcService.showDesktopLyrics().catch(() => undefined)
  }, [desktopLyricsVisible])

  React.useEffect(() => {
    if (!desktopLyricsVisible) return

    const activeLine = currentIndex >= 0 ? lyrics[currentIndex] : null
    const nextLine = currentIndex >= 0 ? lyrics[currentIndex + 1] : null
    const fallbackLine = currentTrack ? currentTrack.title : '未播放'

    void ipcService
      .updateDesktopLyrics({
        currentLine: activeLine?.text || fallbackLine,
        nextLine: nextLine?.text || activeLine?.translatedText || '',
        trackTitle: currentTrack?.title || 'OrangeMusic',
        artist: currentTrack?.artist || '',
        isPlaying
      })
      .catch(() => undefined)
  }, [desktopLyricsVisible, currentIndex, lyrics, currentTrack, isPlaying])
}
