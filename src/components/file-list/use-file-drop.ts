import { useState, useRef, useCallback } from 'react'
import { readEntryFiles } from '@/utils/read-entry-files'

export function useFileDrop(
  currentPath: string,
  onDropFiles: (files: File[], targetPath?: string) => void,
) {
  const [isDragOver, setIsDragOver] = useState(false)
  const dragCounterRef = useRef(0)

  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    dragCounterRef.current += 1
    if (event.dataTransfer.types.includes('Files')) {
      setIsDragOver(true)
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    dragCounterRef.current -= 1
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0
      setIsDragOver(false)
    }
  }, [])

  const handleDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault()
    dragCounterRef.current = 0
    setIsDragOver(false)

    const items = event.dataTransfer.items
    if (!items || items.length === 0) return

    // Try to use webkitGetAsEntry for folder support
    const entries = Array.from(items)
      .map((item) => item.webkitGetAsEntry?.())
      .filter((entry): entry is FileSystemEntry => entry != null)

    if (entries.length > 0) {
      const nestedFiles = await Promise.all(entries.map((e) => readEntryFiles(e)))
      const allFiles = nestedFiles.flat()
      if (allFiles.length > 0) {
        onDropFiles(allFiles, currentPath)
      }
      return
    }

    // Fallback: plain file list (no folder recursion)
    const droppedFiles = Array.from(event.dataTransfer.files)
    if (droppedFiles.length > 0) {
      onDropFiles(droppedFiles, currentPath)
    }
  }, [currentPath, onDropFiles])

  return {
    isDragOver,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  }
}
