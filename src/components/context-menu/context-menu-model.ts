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

export type ContextMenuItemBuilderOptions = {
  targetType: ContextMenuTargetType
  targetFile: FileEntry | null
  selectedFiles: FileEntry[]
  selectedCount: number
  hasRename: boolean
  hasDelete: boolean
  hasCreateFolder: boolean
  hasUpload: boolean
  hasDownload: boolean
  hasBatchDownload: boolean
  locale: FinderLocale
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
