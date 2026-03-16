import { createPortal } from 'react-dom'
import { useEffect, useRef } from 'react'
import { useFinderStore } from '@/store'
import {
  FolderOpenIcon,
  FolderIcon,
  EyeIcon,
  UploadIcon,
  DownloadIcon,
  RefreshIcon,
} from '@/icons'

export function ContextMenu() {
  const {
    contextMenu,
    closeContextMenu,
    onOpen,
    onDownload,
    onBatchDownload,
    onUpload,
    onRefresh,
    files,
    selectedPaths,
  } = useFinderStore()

  const { isOpen, x, y, targetFile, targetType } = contextMenu

  // Close menu on outside click
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-context-menu="true"]')) {
        closeContextMenu()
      }
    }

    // Use capture phase to handle before event bubbles
    document.addEventListener('click', handleClickOutside, true)
    document.addEventListener('contextmenu', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
      document.removeEventListener('contextmenu', handleClickOutside, true)
    }
  }, [isOpen, closeContextMenu])

  // Adjust position to keep menu within viewport
  const menuRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!isOpen || !menuRef.current) return
    const rect = menuRef.current.getBoundingClientRect()
    const adjustedX = x + rect.width > window.innerWidth ? window.innerWidth - rect.width - 4 : x
    const adjustedY = y + rect.height > window.innerHeight ? window.innerHeight - rect.height - 4 : y
    if (adjustedX !== x || adjustedY !== y) {
      menuRef.current.style.left = `${Math.max(0, adjustedX)}px`
      menuRef.current.style.top = `${Math.max(0, adjustedY)}px`
    }
  }, [isOpen, x, y])

  if (!isOpen) return null

  const selectedFiles = files.filter((f) => selectedPaths.has(f.path))
  const selectedCount = selectedFiles.length

  return createPortal(
    <div
      ref={menuRef}
      className="finder-ui-root fixed z-[9999] min-w-[180px] bg-white border border-[#EAE9E6] rounded-lg py-1 text-sm shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
      style={{ left: x, top: y }}
      onClick={(event) => event.stopPropagation()}
      data-context-menu="true"
    >
      {targetType === 'file' && selectedCount > 1 && (
        <>
          <div className="px-3 py-1.5 text-xs text-[#666666] border-b border-[#EAE9E6]">
            {selectedCount} items selected
          </div>
          <button
            onClick={() => {
              onBatchDownload(selectedFiles)
              closeContextMenu()
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#F6F5F4] transition-colors text-left text-[#2E2929] border-0"
          >
            <DownloadIcon className="w-4 h-4" />
            Download All
          </button>
        </>
      )}

      {targetType === 'file' && selectedCount <= 1 && targetFile && (
        <>
          <button
            onClick={() => {
              onOpen(targetFile)
              closeContextMenu()
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#F6F5F4] transition-colors text-left text-[#2E2929] border-0"
          >
            <EyeIcon className="w-4 h-4" />
            Open
          </button>
          <button
            onClick={() => {
              onDownload(targetFile)
              closeContextMenu()
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#F6F5F4] transition-colors text-left text-[#2E2929] border-0"
          >
            <DownloadIcon className="w-4 h-4" />
            Download
          </button>
        </>
      )}

      {targetType === 'folder' && selectedCount > 1 && (
        <>
          <div className="px-3 py-1.5 text-xs text-[#666666] border-b border-[#EAE9E6]">
            {selectedCount} items selected
          </div>
          <button
            onClick={() => {
              onBatchDownload(selectedFiles)
              closeContextMenu()
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#F6F5F4] transition-colors text-left text-[#2E2929] border-0"
          >
            <DownloadIcon className="w-4 h-4" />
            Download All
          </button>
        </>
      )}

      {targetType === 'folder' && selectedCount <= 1 && targetFile && (
        <>
          <button
            onClick={() => {
              onOpen(targetFile)
              closeContextMenu()
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#F6F5F4] transition-colors text-left text-[#2E2929] border-0"
          >
            <FolderOpenIcon className="w-4 h-4" />
            Open
          </button>
          <button
            onClick={() => {
              onUpload(false, targetFile.path)
              closeContextMenu()
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#F6F5F4] transition-colors text-left text-[#2E2929] border-0"
          >
            <UploadIcon className="w-4 h-4" />
            Upload Files
          </button>
          <button
            onClick={() => {
              onUpload(true, targetFile.path)
              closeContextMenu()
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#F6F5F4] transition-colors text-left text-[#2E2929] border-0"
          >
            <FolderIcon className="w-4 h-4" />
            Upload Folder
          </button>
        </>
      )}

      {targetType === 'empty' && (
        <>
          <button
            onClick={() => {
              onUpload(false)
              closeContextMenu()
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#F6F5F4] transition-colors text-left text-[#2E2929] border-0"
          >
            <UploadIcon className="w-4 h-4" />
            Upload Files
          </button>
          <button
            onClick={() => {
              onUpload(true)
              closeContextMenu()
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#F6F5F4] transition-colors text-left text-[#2E2929] border-0"
          >
            <FolderIcon className="w-4 h-4" />
            Upload Folder
          </button>
          <div className="my-1 border-t border-[#EAE9E6]" />
          <button
            onClick={() => {
              onRefresh()
              closeContextMenu()
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#F6F5F4] transition-colors text-left text-[#2E2929] border-0"
          >
            <RefreshIcon className="w-4 h-4" />
            Refresh
          </button>
        </>
      )}
    </div>,
    document.body
  )
}
