import type {
  ContextMenuItem,
  ContextMenuItemBuilderOptions,
} from './context-menu-model'

export function buildEmptyContextMenuItems({
  hasCreateFolder,
  hasUpload,
  locale,
  onUpload,
  onRefresh,
  setIsCreatingFolder,
  closeMenu,
}: ContextMenuItemBuilderOptions): ContextMenuItem[] {
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
