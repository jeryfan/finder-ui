import type { FinderLocale } from '@/locale'
import type { ContextMenuTargetType, FileEntry } from '@/types'

export type ContextMenuIconName =
  | 'download'
  | 'openFile'
  | 'openFolder'
  | 'rename'
  | 'delete'
  | 'uploadFiles'
  | 'uploadFolder'
  | 'newFolder'
  | 'refresh'

export type ContextMenuItem = {
  id: string
  label: string
  icon: ContextMenuIconName
  action: () => void
  divider?: boolean
}

type ContextMenuPermissions = {
  hasRename: boolean
  hasDelete: boolean
  hasCreateFolder: boolean
  hasUpload: boolean
  hasDownload: boolean
  hasBatchDownload: boolean
}

type ContextMenuHandlers = {
  onOpen: (file: FileEntry) => void
  onDownload: (file: FileEntry) => void
  onBatchDownload: (files: FileEntry[]) => void
  onUpload: (isFolder: boolean, targetPath?: string) => void
  onRefresh: () => void
  onDelete: (files: FileEntry[]) => Promise<void> | void
  setRenamingPath: (path: string | null) => void
  setIsCreatingFolder: (creating: boolean) => void
  closeMenu: () => void
  confirm: (message: string) => boolean
}

type BuildContextMenuItemsOptions = ContextMenuPermissions &
  ContextMenuHandlers & {
    targetType: ContextMenuTargetType
    targetFile: FileEntry | null
    selectedFiles: FileEntry[]
    selectedCount: number
    locale: FinderLocale
  }

const buildBatchItems = ({
  hasBatchDownload,
  hasDelete,
  selectedFiles,
  selectedCount,
  locale,
  onBatchDownload,
  onDelete,
  closeMenu,
  confirm,
}: Pick<
  BuildContextMenuItemsOptions,
  | 'hasBatchDownload'
  | 'hasDelete'
  | 'selectedFiles'
  | 'selectedCount'
  | 'locale'
  | 'onBatchDownload'
  | 'onDelete'
  | 'closeMenu'
  | 'confirm'
>): ContextMenuItem[] => {
  const items: ContextMenuItem[] = []

  if (hasBatchDownload) {
    items.push({
      id: 'download-selected',
      label: locale.downloadAll,
      icon: 'download',
      action: () => {
        onBatchDownload(selectedFiles)
        closeMenu()
      },
    })
  }

  if (hasDelete) {
    items.push({
      id: 'delete-selected',
      label: locale.delete,
      icon: 'delete',
      action: () => {
        if (confirm(locale.deleteMultipleConfirm(selectedCount))) {
          onDelete(selectedFiles)
        }
        closeMenu()
      },
    })
  }

  return items
}

const buildSingleFileItems = ({
  targetFile,
  hasDownload,
  hasRename,
  hasDelete,
  locale,
  onOpen,
  onDownload,
  onDelete,
  setRenamingPath,
  closeMenu,
  confirm,
}: Pick<
  BuildContextMenuItemsOptions,
  | 'targetFile'
  | 'hasDownload'
  | 'hasRename'
  | 'hasDelete'
  | 'locale'
  | 'onOpen'
  | 'onDownload'
  | 'onDelete'
  | 'setRenamingPath'
  | 'closeMenu'
  | 'confirm'
>): ContextMenuItem[] => {
  if (!targetFile) return []

  const items: ContextMenuItem[] = [
    {
      id: 'open-file',
      label: locale.open,
      icon: 'openFile',
      action: () => {
        onOpen(targetFile)
        closeMenu()
      },
    },
  ]

  if (hasDownload) {
    items.push({
      id: 'download-file',
      label: locale.download,
      icon: 'download',
      action: () => {
        onDownload(targetFile)
        closeMenu()
      },
    })
  }

  if (hasRename) {
    items.push({
      id: 'rename-file',
      label: locale.rename,
      icon: 'rename',
      action: () => {
        setRenamingPath(targetFile.path)
        closeMenu()
      },
    })
  }

  if (hasDelete) {
    items.push({
      id: 'delete-file',
      label: locale.delete,
      icon: 'delete',
      action: () => {
        if (confirm(locale.deleteConfirm(targetFile.name))) {
          onDelete([targetFile])
        }
        closeMenu()
      },
    })
  }

  return items
}

const buildSingleFolderItems = ({
  targetFile,
  hasUpload,
  hasRename,
  hasDelete,
  locale,
  onOpen,
  onUpload,
  onDelete,
  setRenamingPath,
  closeMenu,
  confirm,
}: Pick<
  BuildContextMenuItemsOptions,
  | 'targetFile'
  | 'hasUpload'
  | 'hasRename'
  | 'hasDelete'
  | 'locale'
  | 'onOpen'
  | 'onUpload'
  | 'onDelete'
  | 'setRenamingPath'
  | 'closeMenu'
  | 'confirm'
>): ContextMenuItem[] => {
  if (!targetFile) return []

  const items: ContextMenuItem[] = [
    {
      id: 'open-folder',
      label: locale.open,
      icon: 'openFolder',
      action: () => {
        onOpen(targetFile)
        closeMenu()
      },
    },
  ]

  if (hasUpload) {
    items.push(
      {
        id: 'upload-files-to-folder',
        label: locale.uploadFiles,
        icon: 'uploadFiles',
        action: () => {
          onUpload(false, targetFile.path)
          closeMenu()
        },
      },
      {
        id: 'upload-folder-to-folder',
        label: locale.uploadFolder,
        icon: 'uploadFolder',
        action: () => {
          onUpload(true, targetFile.path)
          closeMenu()
        },
      },
    )
  }

  if (hasRename) {
    items.push({
      id: 'rename-folder',
      label: locale.rename,
      icon: 'rename',
      action: () => {
        setRenamingPath(targetFile.path)
        closeMenu()
      },
    })
  }

  if (hasDelete) {
    items.push({
      id: 'delete-folder',
      label: locale.delete,
      icon: 'delete',
      action: () => {
        if (confirm(locale.deleteConfirm(targetFile.name))) {
          onDelete([targetFile])
        }
        closeMenu()
      },
    })
  }

  return items
}

const buildEmptyAreaItems = ({
  hasCreateFolder,
  hasUpload,
  locale,
  onUpload,
  onRefresh,
  setIsCreatingFolder,
  closeMenu,
}: Pick<
  BuildContextMenuItemsOptions,
  | 'hasCreateFolder'
  | 'hasUpload'
  | 'locale'
  | 'onUpload'
  | 'onRefresh'
  | 'setIsCreatingFolder'
  | 'closeMenu'
>): ContextMenuItem[] => {
  const items: ContextMenuItem[] = []

  if (hasCreateFolder) {
    items.push({
      id: 'new-folder',
      label: locale.newFolder,
      icon: 'newFolder',
      action: () => {
        setIsCreatingFolder(true)
        closeMenu()
      },
    })
  }

  if (hasUpload) {
    items.push(
      {
        id: 'upload-files',
        label: locale.uploadFiles,
        icon: 'uploadFiles',
        action: () => {
          onUpload(false)
          closeMenu()
        },
      },
      {
        id: 'upload-folder',
        label: locale.uploadFolder,
        icon: 'uploadFolder',
        action: () => {
          onUpload(true)
          closeMenu()
        },
      },
    )
  }

  items.push({
    id: 'refresh',
    label: locale.refresh,
    icon: 'refresh',
    action: () => {
      onRefresh()
      closeMenu()
    },
    divider: items.length > 0,
  })

  return items
}

export const buildContextMenuItems = (
  options: BuildContextMenuItemsOptions,
): ContextMenuItem[] => {
  const { targetType, selectedCount } = options

  if ((targetType === 'file' || targetType === 'folder') && selectedCount > 1) {
    return buildBatchItems(options)
  }

  if (targetType === 'file') {
    return buildSingleFileItems(options)
  }

  if (targetType === 'folder') {
    return buildSingleFolderItems(options)
  }

  return buildEmptyAreaItems(options)
}
