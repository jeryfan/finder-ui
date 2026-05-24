import { useCallback, useRef } from 'react'
import type { RefObject } from 'react'
import { useFinderStore, useFinderStoreApi } from '@/store'
import type { FinderProps } from './index'

type UseFinderUploadOptions = {
  uploadRef: RefObject<FinderProps['onUpload']>
  loadFiles: (path: string) => Promise<void>
}

const getUploadingItems = (files: File[]) => {
  const hasRelativePaths = files.some((file) => file.webkitRelativePath?.includes('/'))

  if (!hasRelativePaths) {
    return files.map((file) => ({ name: file.name, type: 'file' as const }))
  }

  const folderNames = new Set<string>()
  for (const file of files) {
    const topDir = file.webkitRelativePath.split('/')[0]
    if (topDir) folderNames.add(topDir)
  }

  return Array.from(folderNames).map((name) => ({ name, type: 'directory' as const }))
}

export function useFinderUpload({
  uploadRef,
  loadFiles,
}: UseFinderUploadOptions) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const uploadTargetPathRef = useRef<string | undefined>(undefined)
  const { setUploadingFiles, setLoadError } = useFinderStore()
  const storeApi = useFinderStoreApi()

  const performUpload = useCallback(async (files: File[], targetPath?: string) => {
    const resolvedPath = targetPath ?? storeApi.getState().currentPath

    setUploadingFiles(getUploadingItems(files))
    try {
      await uploadRef.current?.(files, resolvedPath)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploadingFiles([])
      loadFiles(storeApi.getState().currentPath)
    }
  }, [loadFiles, setLoadError, setUploadingFiles, storeApi, uploadRef])

  const requestUpload = useCallback((isFolder: boolean, targetPath?: string) => {
    uploadTargetPathRef.current = targetPath
    const input = fileInputRef.current
    if (!input) return

    input.value = ''
    if (isFolder) {
      input.setAttribute('webkitdirectory', '')
    } else {
      input.removeAttribute('webkitdirectory')
    }
    input.click()
  }, [])

  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (!selectedFiles || selectedFiles.length === 0) return
    performUpload(Array.from(selectedFiles), uploadTargetPathRef.current)
  }, [performUpload])

  return {
    fileInputRef,
    performUpload,
    requestUpload,
    handleFileInputChange,
  }
}
