import type {
  ContextMenuItem,
  ContextMenuItemBuilderOptions,
} from './context-menu-model'

export function buildBatchContextMenuItems({
  hasBatchDownload,
  hasDelete,
  selectedFiles,
  selectedCount,
  locale,
  onBatchDownload,
  onDelete,
  closeMenu,
  confirm,
}: ContextMenuItemBuilderOptions): ContextMenuItem[] {
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
