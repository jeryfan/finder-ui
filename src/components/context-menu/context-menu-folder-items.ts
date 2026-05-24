import type {
  ContextMenuItem,
  ContextMenuItemBuilderOptions,
} from './context-menu-model'

export function buildFolderContextMenuItems({
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
}: ContextMenuItemBuilderOptions): ContextMenuItem[] {
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
