import { useUIStore } from '@renderer/stores/ui-store'
import { Sidebar } from './Sidebar'
import { PlayerBar } from './PlayerBar'
import { QueuePanel } from '@renderer/components/queue'
import { LyricsPanel } from '@renderer/components/lyrics'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps): React.JSX.Element {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed)
  const queueVisible = useUIStore((state) => state.queueVisible)
  const lyricsVisible = useUIStore((state) => state.lyricsVisible)
  const isMacOS = navigator.platform.toLowerCase().includes('mac')

  return (
    <div
      className={`flex h-screen w-screen flex-col overflow-hidden text-zinc-900 transition-colors dark:text-zinc-100 ${
        isMacOS ? 'bg-transparent macos-vibrancy' : 'bg-zinc-50 dark:bg-zinc-900'
      }`}
    >
      {/* macOS draggable title bar region */}
      {isMacOS && (
        <div
          className="fixed left-0 right-0 top-0 z-50 h-[38px]"
          style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
        />
      )}
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main
          className={`flex-1 overflow-hidden transition-all duration-200 ${
            sidebarCollapsed ? 'ml-16' : 'ml-56'
          } ${queueVisible ? 'mr-80' : ''} ${lyricsVisible ? 'mr-80' : ''}`}
        >
          <div className="h-full overflow-auto p-4">{children}</div>
        </main>

        {/* Queue panel (conditionally rendered) */}
        {queueVisible && (
          <aside
            className={`fixed right-0 top-0 h-[calc(100vh-80px)] w-80 border-l ${
              isMacOS
                ? 'border-white/20 bg-white/30 backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-900/30'
                : 'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900'
            }`}
            style={isMacOS ? { paddingTop: '38px' } : undefined}
          >
            <QueuePanel />
          </aside>
        )}

        {/* Lyrics panel (conditionally rendered) */}
        {lyricsVisible && !queueVisible && (
          <aside
            className={`fixed right-0 top-0 h-[calc(100vh-80px)] w-80 border-l ${
              isMacOS
                ? 'border-white/20 bg-white/30 backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-900/30'
                : 'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900'
            }`}
            style={isMacOS ? { paddingTop: '38px' } : undefined}
          >
            <LyricsPanel className="h-full" />
          </aside>
        )}
      </div>
      {/* Player bar at bottom */}
      <PlayerBar />
    </div>
  )
}
