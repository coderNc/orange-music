import * as React from 'react'
import { useLibraryStore } from '@renderer/stores/library-store'
import { debounce } from '@renderer/utils'

const SearchIcon = React.memo(function SearchIcon(): React.JSX.Element {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  )
})

const ClearIcon = React.memo(function ClearIcon(): React.JSX.Element {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
})

export interface SearchBarProps {
  placeholder?: string
  className?: string
  debounceMs?: number
  inputRef?: React.RefObject<HTMLInputElement | null>
}

export function SearchBar({
  placeholder = '搜索歌曲、艺术家、专辑...',
  className = '',
  debounceMs = 300,
  inputRef
}: SearchBarProps): React.JSX.Element {
  const searchQuery = useLibraryStore((state) => state.searchQuery)
  const setSearchQuery = useLibraryStore((state) => state.setSearchQuery)
  const clearSearch = useLibraryStore((state) => state.clearSearch)

  const [localValue, setLocalValue] = React.useState(searchQuery)
  const internalInputRef = React.useRef<HTMLInputElement>(null)
  const actualInputRef = inputRef || internalInputRef

  const debouncedSetSearch = React.useMemo(
    () => debounce((value: string) => setSearchQuery(value), debounceMs),
    [setSearchQuery, debounceMs]
  )

  React.useEffect(() => {
    setLocalValue(searchQuery)
  }, [searchQuery])

  React.useEffect(() => {
    return () => debouncedSetSearch.cancel()
  }, [debouncedSetSearch])

  const handleClear = (): void => {
    setLocalValue('')
    debouncedSetSearch.cancel()
    clearSearch()
    actualInputRef.current?.focus()
  }

  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 dark:text-zinc-400">
        <SearchIcon />
      </div>

      <input
        ref={actualInputRef}
        type="text"
        value={localValue}
        onChange={(event) => {
          const value = event.target.value
          setLocalValue(value)
          debouncedSetSearch(value)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') handleClear()
        }}
        placeholder={placeholder}
        className="glass-soft focus-ring w-full rounded-xl py-2 pl-10 pr-10 text-sm text-zinc-900 placeholder-zinc-500 dark:text-zinc-100 dark:placeholder-zinc-400"
        aria-label="搜索"
      />

      {localValue && (
        <button
          onClick={handleClear}
          className="interactive-soft absolute inset-y-0 right-0 flex items-center rounded-r-xl px-3 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          aria-label="清除搜索"
        >
          <ClearIcon />
        </button>
      )}
    </div>
  )
}
