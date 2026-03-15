import { useMemo } from 'react'
import { useFinderStore, useFinderStoreApi } from '@/store'
import { FolderIcon, LoaderIcon, ChevronDownIcon, UploadIcon } from '@/icons'
import { cn, formatDateTimeEN, formatFileSize } from '@/utils'
import { getFileIcon } from '@/utils/file-icons'
import type { FileEntry } from '@/types'
import { useFileDrop } from './use-file-drop'

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
    uploadingFiles,
    currentPath,
    setSort,
    setSelectedPaths,
    toggleSelection,
    selectRange,
    clearSelection,
    openContextMenu,
    onOpen,
    navigateTo,
    onNavigateToPath,
    previews,
    setActivePreviewPath,
    onDropFiles,
  } = useFinderStore()

  const storeApi = useFinderStoreApi()

  const {
    isDragOver,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useFileDrop(currentPath, onDropFiles)

  const dateColumnClass = 'w-32'
  const sizeColumnClass = 'w-20'

  const filteredFiles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return files
    return files.filter(item => item.name.toLowerCase().includes(query))
  }, [files, searchQuery])

  const sortedFiles = useMemo(() => {
    const direction = sortOrder === 'asc' ? 1 : -1
    return [...filteredFiles].sort((left, right) => {
      if (left.type !== right.type) return left.type === 'directory' ? -1 : 1
      if (sortField === 'lastModified') {
        const leftTime = Date.parse(left.lastModified || '')
        const rightTime = Date.parse(right.lastModified || '')
        return (leftTime - rightTime) * direction
      }
      if (sortField === 'size') return (left.size - right.size) * direction
      return left.name.localeCompare(right.name) * direction
    })
  }, [filteredFiles, sortField, sortOrder])

  const handleEntryClick = (entry: FileEntry, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const isMetaSelect = event.metaKey || event.ctrlKey
    const isShiftSelect = event.shiftKey

    if (isMetaSelect) {
      toggleSelection(entry.path)
    } else if (isShiftSelect && selectedPaths.size > 0) {
      selectRange(entry.path)
    } else {
      setSelectedPaths(new Set([entry.path]))
    }

    if (previews.some(item => item.path === entry.path)) {
      setActivePreviewPath(entry.path)
    }
  }

  const handleEntryDoubleClick = (entry: FileEntry, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (entry.type === 'directory') {
      clearSelection()
      navigateTo(entry.path)
      onNavigateToPath(entry.path)
      return
    }
    onOpen(entry)
  }

  const handleContextMenu = (event: React.MouseEvent, entry: FileEntry | null) => {
    event.preventDefault()
    const targetType = entry?.type === 'directory' ? 'folder' : entry ? 'file' : 'empty'
    if (entry && !selectedPaths.has(entry.path)) {
      setSelectedPaths(new Set([entry.path]))
    }
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
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drop overlay */}
        {isDragOver && (
          <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center rounded-xl border-2 border-dashed border-[#F59E0B] bg-[#F59E0B]/5">
            <div className="flex flex-col items-center gap-2 text-[#F59E0B]">
              <UploadIcon className="h-8 w-8" />
              <span className="text-sm font-medium">Drop files here to upload</span>
            </div>
          </div>
        )}
        {viewMode === 'list' && (sortedFiles.length > 0 || loading) && (
          <div className="flex items-center gap-2 px-2 py-1 text-[10px] leading-4 font-semibold text-[#666666] uppercase tracking-wider border-b border-[#EAE9E6]">
            <button
              onClick={() => setSort('name')}
              className="flex-1 text-left flex items-center gap-1 hover:text-[#2E2929]"
            >
              Name
              {sortField === 'name' && <ChevronDownIcon className={cn('w-3 h-3', sortOrder === 'desc' && 'rotate-180')} />}
            </button>
            <button
              onClick={() => setSort('lastModified')}
              className={`${dateColumnClass} text-left flex items-center gap-1 hover:text-[#2E2929]`}
            >
              Date Modified
              {sortField === 'lastModified' && <ChevronDownIcon className={cn('w-3 h-3', sortOrder === 'desc' && 'rotate-180')} />}
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
                onClick={() => storeApi.getState().onRefresh()}
                className="mt-2 px-3 py-1 text-xs rounded-md bg-[#2E2929] text-white hover:opacity-90"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {viewMode === 'grouped' && loading && sortedFiles.length === 0 && (
          <div className="grid grid-cols-8 gap-4 p-4">
            {Array.from({ length: 16 }).map((_, index) => (
              <div key={`grid-skeleton-${index}`} className="flex flex-col items-center gap-2 animate-pulse">
                <div className="w-12 h-12 bg-[#F1EFEB] rounded shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
                <div className="w-16 h-3 bg-[#F1EFEB] rounded shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && loading && sortedFiles.length === 0 && (
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

        {sortedFiles.length === 0 && uploadingFiles.length === 0 && !loading && !loadError && (
          <div className="h-full flex items-center justify-center text-[#666666]">
            <div className="text-center">
              <FolderIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No files found</p>
              {!!searchQuery && <p className="text-xs mt-1">Try a different search term</p>}
            </div>
          </div>
        )}

        {viewMode === 'grouped' && (sortedFiles.length > 0 || uploadingFiles.length > 0) && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-3">
            {sortedFiles.map(entry => (
              <button
                key={entry.path}
                data-file-row="true"
                data-file-path={entry.path}
                onClick={event => handleEntryClick(entry, event)}
                onDoubleClick={event => handleEntryDoubleClick(entry, event)}
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
            {uploadingFiles.map((item, index) => (
              <div
                key={`uploading-${index}`}
                className="flex flex-col items-center p-2 rounded-lg bg-[#F1EFEB]/50 animate-pulse"
              >
                <div className="w-14 h-14 mb-1 flex items-center justify-center">
                  {item.type === 'directory'
                    ? <FolderIcon className="w-8 h-8 text-[#666666]/40" />
                    : <div className="w-10 h-10 rounded bg-[#666666]/10" />}
                </div>
                <span className="text-[11px] leading-tight line-clamp-2 w-full break-all text-[#666666] text-center">{item.name}</span>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && (sortedFiles.length > 0 || uploadingFiles.length > 0) && (
          <div className="mt-0.5 space-y-0.5">
            {sortedFiles.map(entry => (
              <button
                key={entry.path}
                data-file-row="true"
                data-file-path={entry.path}
                onClick={event => handleEntryClick(entry, event)}
                onDoubleClick={event => handleEntryDoubleClick(entry, event)}
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
                  {entry.lastModified ? formatDateTimeEN(entry.lastModified) : '--'}
                </span>
                <span className={`${sizeColumnClass} text-xs text-[#666666] text-right`}>
                  {formatFileSize(entry.size || 0, entry.type)}
                </span>
              </button>
            ))}
            {uploadingFiles.map((item, index) => (
              <div
                key={`uploading-${index}`}
                className="w-full flex items-center gap-2 px-2 py-1 rounded-md bg-[#F1EFEB]/50 animate-pulse leading-[25.6px]"
              >
                {item.type === 'directory'
                  ? <FolderIcon className="w-4 h-4 flex-shrink-0 text-[#666666]/40" />
                  : <div className="w-4 h-4 flex-shrink-0 rounded bg-[#666666]/10" />}
                <span className="flex-1 text-sm truncate text-[#666666]">{item.name}</span>
                <span className={`${dateColumnClass} text-xs text-[#666666]`}>--</span>
                <span className={`${sizeColumnClass} text-xs text-[#666666] text-right`}>--</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex h-6 shrink-0 items-center border-t border-[#EAE9E6] bg-[#F6F5F433] px-3 text-[10px] leading-4 text-[#666666]">
        <span>{sortedFiles.length} items</span>
        {selectedPaths.size > 0 && (
          <span className="ml-2">{selectedPaths.size} selected</span>
        )}
        {uploadingFiles.length > 0 && (
          <span className="ml-auto">uploading {uploadingFiles.length} file(s)...</span>
        )}
        {uploadingFiles.length === 0 && loading && <span className="ml-auto">refreshing</span>}
      </div>
    </>
  )
}
