import type { StateCreator } from 'zustand'
import type { StoreState, NavigationSlice } from '../types'

export const createNavigationSlice: StateCreator<StoreState, [], [], NavigationSlice> = (set, get) => ({
  currentPath: '/',
  historyStack: ['/'],
  historyIndex: 0,

  setCurrentPath: (path) => set({ currentPath: path }),

  navigateTo: (path) => set((state) => {
    const base = state.historyStack.slice(0, state.historyIndex + 1)
    if (base[base.length - 1] === path) return {}
    const nextStack = [...base, path]
    return {
      currentPath: path,
      historyStack: nextStack,
      historyIndex: nextStack.length - 1,
      selectedPaths: new Set(),
      searchQuery: '',
    }
  }),

  goBack: () => {
    const state = get()
    if (state.historyIndex <= 0) return
    const nextIndex = state.historyIndex - 1
    const nextPath = state.historyStack[nextIndex]
    set({
      historyIndex: nextIndex,
      currentPath: nextPath,
      selectedPaths: new Set(),
    })
    state.onNavigateToPath(nextPath)
  },

  goForward: () => {
    const state = get()
    if (state.historyIndex >= state.historyStack.length - 1) return
    const nextIndex = state.historyIndex + 1
    const nextPath = state.historyStack[nextIndex]
    set({
      historyIndex: nextIndex,
      currentPath: nextPath,
      selectedPaths: new Set(),
    })
    state.onNavigateToPath(nextPath)
  },
})
