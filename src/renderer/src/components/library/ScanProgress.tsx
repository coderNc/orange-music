import * as React from 'react'

export interface ScanProgressProps {
  current: number
  total: number
  currentFile?: string
  className?: string
}

export function ScanProgress({
  current,
  total,
  currentFile,
  className = ''
}: ScanProgressProps): React.JSX.Element {
  const progress = total > 0 ? (current / total) * 100 : 0
  const isComplete = current === total && total > 0

  return (
    <div className={`glass-panel rounded-2xl p-4 ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isComplete && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-orange-500" />
          )}
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {isComplete ? '扫描完成' : '正在扫描...'}
          </span>
        </div>
        <span className="text-sm text-zinc-600 dark:text-zinc-300">
          {current} / {total} 个文件
        </span>
      </div>
      <div className="mb-2 h-2 overflow-hidden rounded-full bg-zinc-200/85 dark:bg-zinc-800/70">
        <div
          className={`h-full rounded-full transition-all duration-300 ${isComplete ? 'bg-orange-500' : 'bg-orange-500/85'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {currentFile && !isComplete && (
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400" title={currentFile}>
          {getFileName(currentFile)}
        </p>
      )}
    </div>
  )
}

function getFileName(filePath: string): string {
  const parts = filePath.replace(/\\/g, '/').split('/')
  return parts[parts.length - 1] || filePath
}

export function ScanProgressCompact({
  current,
  total
}: Pick<ScanProgressProps, 'current' | 'total'>): React.JSX.Element {
  const progress = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="flex items-center gap-2">
      <div className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-500 border-t-orange-500" />
      <div className="flex items-center gap-1.5">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-200/85 dark:bg-zinc-800/70">
          <div
            className="h-full rounded-full bg-orange-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-zinc-600 dark:text-zinc-300">
          {current}/{total}
        </span>
      </div>
    </div>
  )
}
