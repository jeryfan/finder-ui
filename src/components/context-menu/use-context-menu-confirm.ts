import { useCallback } from 'react'
import { useFinderStore } from '@/store'
import type { FileEntry } from '@/types'

export function useContextMenuConfirm() {
  const { onConfirmDelete } = useFinderStore()

  return useCallback(
    (files: FileEntry[], message: string) => onConfirmDelete(files, message),
    [onConfirmDelete],
  )
}
