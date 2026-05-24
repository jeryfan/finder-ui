import { useEffect, useRef } from 'react'
import type { FinderProps } from './index'

export function useFinderCallbackRefs({
  onFetchFiles,
  onOpenFile,
  onDownload,
  onBatchDownload,
  onUpload,
  onSave,
  onRename,
  onDelete,
  onCreateFolder,
}: FinderProps) {
  const fetchFilesRef = useRef(onFetchFiles)
  const openFileRef = useRef(onOpenFile)
  const downloadRef = useRef(onDownload)
  const batchDownloadRef = useRef(onBatchDownload)
  const uploadRef = useRef(onUpload)
  const saveRef = useRef(onSave)
  const renameRef = useRef(onRename)
  const deleteRef = useRef(onDelete)
  const createFolderRef = useRef(onCreateFolder)

  useEffect(() => {
    fetchFilesRef.current = onFetchFiles
    openFileRef.current = onOpenFile
    downloadRef.current = onDownload
    batchDownloadRef.current = onBatchDownload
    uploadRef.current = onUpload
    saveRef.current = onSave
    renameRef.current = onRename
    deleteRef.current = onDelete
    createFolderRef.current = onCreateFolder
  }, [
    onFetchFiles,
    onOpenFile,
    onDownload,
    onBatchDownload,
    onUpload,
    onSave,
    onRename,
    onDelete,
    onCreateFolder,
  ])

  return {
    fetchFilesRef,
    openFileRef,
    downloadRef,
    batchDownloadRef,
    uploadRef,
    saveRef,
    renameRef,
    deleteRef,
    createFolderRef,
  }
}
