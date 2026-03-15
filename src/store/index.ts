import { createStore as createZustandStore } from 'zustand/vanilla'
import { useStore as useZustandStore } from 'zustand/react'
import { createContext, useContext } from 'react'
import type { StoreApi } from 'zustand'
import type { StoreState } from './types'
import { createSidebarSlice } from './slices/sidebar-slice'
import { createNavigationSlice } from './slices/navigation-slice'
import { createFileListSlice } from './slices/file-list-slice'
import { createPreviewSlice } from './slices/preview-slice'
import { createContextMenuSlice } from './slices/context-menu-slice'
import { createHandlersSlice } from './slices/handlers-slice'

export type FinderStore = StoreApi<StoreState>

export function createFinderStore(): FinderStore {
  return createZustandStore<StoreState>((...args) => ({
    ...createSidebarSlice(...args),
    ...createNavigationSlice(...args),
    ...createFileListSlice(...args),
    ...createPreviewSlice(...args),
    ...createContextMenuSlice(...args),
    ...createHandlersSlice(...args),
  }))
}

export const FinderStoreContext = createContext<FinderStore | null>(null)

export function useFinderStore(): StoreState {
  const store = useContext(FinderStoreContext)
  if (!store) throw new Error('useFinderStore must be used within <Finder>')
  return useZustandStore(store)
}

export function useFinderStoreApi(): FinderStore {
  const store = useContext(FinderStoreContext)
  if (!store) throw new Error('useFinderStoreApi must be used within <Finder>')
  return store
}
