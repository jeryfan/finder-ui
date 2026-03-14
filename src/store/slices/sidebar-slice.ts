import type { StateCreator } from 'zustand'
import type { StoreState, SidebarSlice } from '../types'

export const createSidebarSlice: StateCreator<StoreState, [], [], SidebarSlice> = (set) => ({
  activeTab: undefined,
  tabs: [],
  setActiveTab: (tab) => set({ activeTab: tab }),
  setTabs: (tabs) => set({ tabs }),
})
