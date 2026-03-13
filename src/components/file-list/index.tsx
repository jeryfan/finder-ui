import { useStore } from '@/store'
import { FolderIcon, LoaderIcon, ChevronDownIcon } from '@/icons'
import { cn, formatDateTimeEN, formatFileSize } from '@/utils'
import { getFileIcon } from '@/utils/file-icons'
import type { FileEntry } from '@/types'

export function FileList() {
  const {
    files,
    selectedPaths,
    loading,
    loadError,
    viewMode,
    sortField,
    sortOrder,
    searchQuery,
    fileLoadingStates,
    setSort,
    toggleSelection,
    clearSelection,
    openContextMenu,
    setOpenHandler,
    setLoading,
  } = useStore()

  const dateColumnClass = 'w-32'
  const sizeColumnClass = 'w-20'

  const handleEntryClick = (entry: FileEntry, event: React.MouseEvent) => {
    if (event.metaKey || event.ctrlKey) {
      toggleSelection(entry.path)
    } else {
      setLoading(true)
      clearSelection()
      toggleSelection(entry.path)
      setLoading(false)
    }
  }

  const handleEntryDoubleClick = (entry: FileEntry) => {
    if (entry.type === 'directory') {
      // Navigate into folder
    } else {
      const { onOpen } = useStore.getState()
      onOpen(entry)
    }
  }

  const handleContextMenu = (event: React.MouseEvent, entry: FileEntry | null) => {
    event.preventDefault()
    const targetType = entry?.type === 'directory' ? 'folder' : entry ? 'file' : 'empty'
    openContextMenu(event.clientX, event.clientY, entry, targetType)
  }

  return (
    <>
      <div
        className="flex-1 overflow-auto p-3 relative"
        onClick={(event) => {
          const target = event.target as HTMLElement
          if (target.closest('[data-file-row="true"]')) return
          if (!event.metaKey && !event.ctrlKey) clearSelection()
        }}
        onContextMenu={(event) => {
          const target = event.target as HTMLElement
          if (target.closest('[data-file-row="true"]')) return
          handleContextMenu(event, null)
        }}
      >
        {viewMode === 'list' && (files.length > 0 || loading) && (
          <div className="flex items-center gap-2 px-2 py-1 text-[10px] leading-4 font-semibold text-[#666666] uppercase tracking-wider border-b border-[#EAE9E6]">
            <button
              onClick={() => setSort('name')}
              className="flex-1 text-left flex items-center gap-1 hover:text-[#2E2929]"
            >
              Name
              {sortField === 'name' && <ChevronDownIcon className={cn('w-3 h-3', sortOrder === 'desc' && 'rotate-180')} />}
            </button>
            <button
              onClick={() => setSort('modified_at')}
              className={`${dateColumnClass} text-left flex items-center gap-1 hover:text-[#2E2929]`}
            >
              Date Modified
              {sortField === 'modified_at' && <ChevronDownIcon className={cn('w-3 h-3', sortOrder === 'desc' && 'rotate-180')} />}
            </button>
            <button
              onClick={() => setSort('size')}
              className={`${sizeColumnClass} text-right flex items-center justify-end gap-1 hover:text-[#2E2929]`}
            >
              Size
              {sortField === 'size' && <ChevronDownIcon className={cn('w-3 h-3', sortOrder === 'desc' && 'rotate-180')} />}
            </button>
          </div>
        )}

        {loadError && !loading && (
          <div className="h-full flex items-center justify-center p-4 text-center">
            <div>
              <p className="text-sm text-red-600">Failed to load files</p>
              <button
                onClick={() => useStore.getState().onRefresh()}
                className="mt-2 px-3 py-1 text-xs rounded-md bg-[#2E2929] text-white hover:opacity-90"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {viewMode === 'grouped' && loading && files.length === 0 && (
          <div className="grid grid-cols-8 gap-4 p-4">
            {Array.from({ length: 16 }).map((_, index) => (
              <div key={`grid-skeleton-${index}`} className="flex flex-col items-center gap-2 animate-pulse">
                <div className="w-12 h-12 bg-[#F1EFEB] rounded shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
                <div className="w-16 h-3 bg-[#F1EFEB] rounded shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && loading && files.length === 0 && (
          <div className="p-4 space-y-1">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={`list-skeleton-${index}`} className="flex items-center gap-3 py-2 animate-pulse">
                <div className="w-4 h-4 rounded bg-[#F1EFEB] shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
                <div className="h-3 flex-1 rounded bg-[#F1EFEB] shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
                <div className="w-16 h-3 rounded bg-[#F1EFEB] shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
                <div className="w-10 h-3 rounded bg-[#F1EFEB] shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
              </div>
            ))}
          </div>
        )}

        {files.length === 0 && !loading && !loadError && (
          <div className="h-full flex items-center justify-center text-[#666666]">
            <div className="text-center">
              <FolderIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No files found</p>
              {!!searchQuery && <p className="text-xs mt-1">Try a different search term</p>}
            </div>
          </div>
        )}

        {viewMode === 'grouped' && files.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-3">
            {files.map(entry => (
              <button
                key={entry.path}
                data-file-row="true"
                data-file-path={entry.path}
                onClick={event => handleEntryClick(entry, event)}
                onDoubleClick={() => handleEntryDoubleClick(entry)}
                onContextMenu={event => handleContextMenu(event, entry)}
                className={cn(
                  'flex flex-col items-center p-2 rounded-lg transition-colors text-center group',
                  selectedPaths.has(entry.path) ? 'bg-black/5 ring-1 ring-black/30' : 'hover:bg-[#F6F5F4]',
                )}
              >
                <div className="w-14 h-14 mb-1 flex items-center justify-center">
                  {fileLoadingStates[entry.path]
                    ? <LoaderIcon className="w-8 h-8 text-blue-600" />
                    : getFileIcon(entry, 'w-8 h-8')}
                </div>
                <span className="text-[11px] leading-tight line-clamp-2 w-full break-all">{entry.name}</span>
              </button>
            ))}
          </div>
        )}

        {viewMode === 'list' && files.length > 0 && (
          <div className="mt-0.5 space-y-0.5">
            {files.map(entry => (
              <button
                key={entry.path}
                data-file-row="true"
                data-file-path={entry.path}
                onClick={event => handleEntryClick(entry, event)}
                onDoubleClick={() => handleEntryDoubleClick(entry)}
                onContextMenu={event => handleContextMenu(event, entry)}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-1 rounded-md transition-colors text-left leading-[25.6px] group',
                  selectedPaths.has(entry.path) ? 'bg-black/5 ring-1 ring-black/30' : 'hover:bg-[#F6F5F4]',
                )}
              >
                <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                  {fileLoadingStates[entry.path]
                    ? <LoaderIcon className="w-4 h-4 text-blue-600" />
                    : getFileIcon(entry)}
                </div>
                <span className="flex-1 text-sm truncate">{entry.name}</span>
                <span className={`${dateColumnClass} text-xs text-[#666666] truncate`}>
                  {(entry.lastModified || entry.modified_at) ? formatDateTimeEN(entry.lastModified || entry.modified_at || '') : '--'}
                </span>
                <span className={`${sizeColumnClass} text-xs text-[#666666] text-right`}>
                  {formatFileSize(entry.size || 0, entry.type)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex h-6 shrink-0 items-center border-t border-[#EAE9E6] bg-[#F6F5F433] px-3 text-[10px] leading-4 text-[#666666]">
        <span>{files.length} items</span>
        {selectedPaths.size > 0 && (
          <span className="ml-2">{selectedPaths.size} selected</span>
        )}
        {loading && <span className="ml-auto">refreshing</span>}
      </div>
    </>
  )
}
