import { create } from 'zustand'
import type { StoreState } from './types'
import { createSidebarSlice } from './slices/sidebar-slice'
import { createNavigationSlice } from './slices/navigation-slice'
import { createFileListSlice } from './slices/file-list-slice'
import { createPreviewSlice } from './slices/preview-slice'
import { createContextMenuSlice } from './slices/context-menu-slice'
import { createHandlersSlice } from './slices/handlers-slice'

export const useStore = create<StoreState>((...args) => ({
  ...createSidebarSlice(...args),
  ...createNavigationSlice(...args),
  ...createFileListSlice(...args),
  ...createPreviewSlice(...args),
  ...createContextMenuSlice(...args),
  ...createHandlersSlice(...args),
}))
