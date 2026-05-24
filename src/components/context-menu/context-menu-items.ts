import { buildBatchContextMenuItems } from './context-menu-batch-items'
import { buildEmptyContextMenuItems } from './context-menu-empty-items'
import { buildFileContextMenuItems } from './context-menu-file-items'
import { buildFolderContextMenuItems } from './context-menu-folder-items'
import type {
  ContextMenuItem,
  ContextMenuItemBuilderOptions,
  ContextMenuIconName,
} from './context-menu-model'

export type {
  ContextMenuIconName,
  ContextMenuItem,
  ContextMenuItemBuilderOptions,
}

export const buildContextMenuItems = (
  options: ContextMenuItemBuilderOptions,
): ContextMenuItem[] => {
  const { targetType, selectedCount } = options

  if ((targetType === 'file' || targetType === 'folder') && selectedCount > 1) {
    return buildBatchContextMenuItems(options)
  }

  if (targetType === 'file') {
    return buildFileContextMenuItems(options)
  }

  if (targetType === 'folder') {
    return buildFolderContextMenuItems(options)
  }

  return buildEmptyContextMenuItems(options)
}
