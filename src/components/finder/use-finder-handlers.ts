import { useEffect } from 'react'
import { useFinderStore, useFinderStoreApi } from '@/store'
import type { FileEntry } from '@/types'
import type { useFinderCallbackRefs } from './use-finder-callback-refs'

type FinderCallbackRefs = ReturnType<typeof useFinderCallbackRefs>

type UseFinderHandlersOptions = Omit<FinderCallbackRefs, 'fetchFilesRef' | 'uploadRef'> & {
  requestUpload: (isFolder: boolean, targetPath?: string) => void
  performUpload: (files: File[], targetPath?: string) => Promise<void>
  loadFiles: (path: string) => Promise<void>
}

export function useFinderHandlers({
  openFileRef,
  downloadRef,
  batchDownloadRef,
  saveRef,
  renameRef,
  deleteRef,
  confirmDeleteRef,
  createFolderRef,
  requestUpload,
  performUpload,
  loadFiles,
}: UseFinderHandlersOptions) {
  const {
    setOpenHandler,
    setDownloadHandler,
    setBatchDownloadHandler,
    setUploadHandler,
    setRefreshHandler,
    setSavePreviewHandler,
    setNavigateToPathHandler,
    setDropFilesHandler,
    setRenameHandler,
    setDeleteHandler,
    setConfirmDeleteHandler,
    setCreateFolderHandler,
  } = useFinderStore()
  const storeApi = useFinderStoreApi()

  useEffect(() => {
    setNavigateToPathHandler((path: string) => {
      loadFiles(path)
    })

    setOpenHandler(async (file: FileEntry) => {
      const handler = openFileRef.current
      if (!handler) return
      storeApi.getState().openPreviewLoading(file)
      try {
        const result = await handler(file)
        if (typeof result === 'string') {
          storeApi.getState().openPreview(file, result)
        } else {
          storeApi.getState().closePreview(file.path)
        }
      } catch {
        storeApi.getState().setPreviewError(file.path, 'Failed to load file')
      }
    })

    setDownloadHandler(async (file) => {
      await downloadRef.current?.(file)
    })
    setBatchDownloadHandler(async (files) => {
      await batchDownloadRef.current?.(files)
    })
    setUploadHandler(requestUpload)
    setSavePreviewHandler(async (path, content) => {
      await saveRef.current?.(path, content)
    })
    setDropFilesHandler((files, targetPath) => {
      performUpload(files, targetPath)
    })
    setRenameHandler(async (file, newName) => {
      await renameRef.current?.(file, newName)
      loadFiles(storeApi.getState().currentPath)
    })
    setDeleteHandler(async (files) => {
      await deleteRef.current?.(files)
      loadFiles(storeApi.getState().currentPath)
    })
    setConfirmDeleteHandler((files, message) => {
      const handler = confirmDeleteRef.current
      if (handler) return handler(files, message)
      return window.confirm(message)
    })
    setCreateFolderHandler(async (parentPath, name) => {
      await createFolderRef.current?.(parentPath, name)
      loadFiles(storeApi.getState().currentPath)
    })
    setRefreshHandler(() => {
      loadFiles(storeApi.getState().currentPath)
    })
  }, [
    batchDownloadRef,
    createFolderRef,
    deleteRef,
    confirmDeleteRef,
    downloadRef,
    loadFiles,
    openFileRef,
    performUpload,
    renameRef,
    requestUpload,
    saveRef,
    setBatchDownloadHandler,
    setCreateFolderHandler,
    setDeleteHandler,
    setConfirmDeleteHandler,
    setDownloadHandler,
    setDropFilesHandler,
    setNavigateToPathHandler,
    setOpenHandler,
    setRefreshHandler,
    setRenameHandler,
    setSavePreviewHandler,
    setUploadHandler,
    storeApi,
  ])
}
