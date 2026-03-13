import { create } from 'zustand'
import type { SidebarTab, TabKey } from '@/types'

interface State {
  // Sidebar state
  activeTab: TabKey | undefined
  tabs: SidebarTab[]

  // Actions
  setActiveTab: (tab: TabKey) => void
  setTabs: (tabs: SidebarTab[]) => void

  // Context menu
  onContextMenu: (event: React.MouseEvent, targetFile: null) => void
  setContextMenuHandler: (
    handler: (event: React.MouseEvent, targetFile: null) => void
  ) => void
}

export const useStore = create<State>((set) => ({
  // Initial state
  activeTab: undefined,
  tabs: [],

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setTabs: (tabs) => set({ tabs }),

  // Context menu
  onContextMenu: () => {},
  setContextMenuHandler: (handler) => set({ onContextMenu: handler }),
}))
