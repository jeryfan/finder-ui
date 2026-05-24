import type {
  ContextMenuItem,
  ContextMenuItemBuilderOptions,
} from './context-menu-model'

export function buildFileContextMenuItems({
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
}: ContextMenuItemBuilderOptions): ContextMenuItem[] {
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
