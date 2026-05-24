import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FileEntry } from '@/types'

export type KeyboardNavActions = {
  onOpenEntry: (entry: FileEntry) => void
  onToggleSelection: (path: string) => void
  onSetSelection: (paths: Set<string>) => void
  onSelectRange: (toPath: string) => void
  onSelectAll: () => void
  onClearSelection: () => void
  onCloseContextMenu: () => void
  onNavigateBack: () => void
}

export type KeyboardNavOptions = {
  sortedFiles: FileEntry[]
  viewMode: 'list' | 'grouped'
  actions: KeyboardNavActions
  containerRef: React.RefObject<HTMLDivElement | null>
}

function getColumnsFromContainer(container: HTMLDivElement | null): number {
  if (!container) return 1
  const grid = container.querySelector('[data-file-grid="true"]')
  if (!grid) return 1
  const style = window.getComputedStyle(grid)
  const columns = style.gridTemplateColumns.split(' ').length
  return Math.max(1, columns)
}

export function useKeyboardNavigation({
  sortedFiles,
  viewMode,
  actions,
  containerRef,
}: KeyboardNavOptions) {
  const [focusedPath, setFocusedPath] = useState<string | null>(null)
  const focusedIndex = useMemo(
    () => focusedPath ? sortedFiles.findIndex((file) => file.path === focusedPath) : -1,
    [focusedPath, sortedFiles],
  )
  const focusedIndexRef = useRef(focusedIndex)

  useEffect(() => {
    focusedIndexRef.current = focusedIndex
  }, [focusedIndex])

  const setFocusedIndex = useCallback((index: number) => {
    setFocusedPath(sortedFiles[index]?.path ?? null)
  }, [sortedFiles])

  const scrollToIndex = useCallback((index: number) => {
    if (!containerRef.current) return
    const el = containerRef.current.querySelector(`[data-file-index="${index}"]`)
    if (el) {
      el.scrollIntoView({ block: 'nearest' })
    }
  }, [containerRef])

  const moveFocus = useCallback((delta: number) => {
    const maxIndex = sortedFiles.length - 1
    if (maxIndex < 0) return -1
    const current = focusedIndexRef.current
    const next = current < 0 ? 0 : Math.max(0, Math.min(maxIndex, current + delta))
    setFocusedPath(sortedFiles[next].path)
    scrollToIndex(next)
    return next
  }, [sortedFiles, scrollToIndex])

  const focusIndex = useCallback((index: number) => {
    const maxIndex = sortedFiles.length - 1
    if (maxIndex < 0) return -1
    const next = Math.max(0, Math.min(maxIndex, index))
    setFocusedPath(sortedFiles[next].path)
    scrollToIndex(next)
    return next
  }, [scrollToIndex, sortedFiles])

  const selectFocusedFile = useCallback((index: number, extendRange: boolean) => {
    if (index < 0) return
    const file = sortedFiles[index]
    if (!file) return
    if (extendRange) {
      actions.onSelectRange(file.path)
    } else {
      actions.onSetSelection(new Set([file.path]))
    }
  }, [actions, sortedFiles])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    // Don't handle keys when typing in input/textarea
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

    const { key, shiftKey, metaKey, ctrlKey } = event

    // Cmd/Ctrl+A: select all
    if ((metaKey || ctrlKey) && key === 'a') {
      event.preventDefault()
      actions.onSelectAll()
      return
    }

    switch (key) {
      case 'ArrowDown': {
        event.preventDefault()
        const delta = viewMode === 'grouped' ? getColumnsFromContainer(containerRef.current) : 1
        const nextIndex = moveFocus(delta)
        selectFocusedFile(nextIndex, shiftKey)
        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        const delta = viewMode === 'grouped' ? getColumnsFromContainer(containerRef.current) : 1
        const nextIndex = moveFocus(-delta)
        selectFocusedFile(nextIndex, shiftKey)
        break
      }
      case 'ArrowRight': {
        if (viewMode !== 'grouped') break
        event.preventDefault()
        const nextIndex = moveFocus(1)
        selectFocusedFile(nextIndex, shiftKey)
        break
      }
      case 'ArrowLeft': {
        if (viewMode !== 'grouped') break
        event.preventDefault()
        const nextIndex = moveFocus(-1)
        selectFocusedFile(nextIndex, shiftKey)
        break
      }
      case 'Home': {
        event.preventDefault()
        const nextIndex = focusIndex(0)
        selectFocusedFile(nextIndex, shiftKey)
        break
      }
      case 'End': {
        event.preventDefault()
        const nextIndex = focusIndex(sortedFiles.length - 1)
        selectFocusedFile(nextIndex, shiftKey)
        break
      }
      case 'Enter': {
        event.preventDefault()
        const idx = focusedIndexRef.current
        if (idx >= 0 && idx < sortedFiles.length) {
          actions.onOpenEntry(sortedFiles[idx])
        }
        break
      }
      case ' ': {
        event.preventDefault()
        const idx = focusedIndexRef.current
        if (idx >= 0 && idx < sortedFiles.length) {
          actions.onToggleSelection(sortedFiles[idx].path)
        }
        break
      }
      case 'Escape': {
        event.preventDefault()
        actions.onClearSelection()
        actions.onCloseContextMenu()
        setFocusedIndex(-1)
        break
      }
      case 'Backspace': {
        event.preventDefault()
        actions.onNavigateBack()
        break
      }
    }
  }, [
    actions,
    containerRef,
    focusIndex,
    moveFocus,
    selectFocusedFile,
    setFocusedIndex,
    sortedFiles,
    viewMode,
  ])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const finderWindow = container.closest('[data-finder-window="true"]')
    const target = finderWindow ?? container

    target.addEventListener('keydown', handleKeyDown as EventListener)
    return () => {
      target.removeEventListener('keydown', handleKeyDown as EventListener)
    }
  }, [containerRef, handleKeyDown])

  return { focusedIndex, setFocusedIndex }
}
