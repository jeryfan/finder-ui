import type { StateCreator } from 'zustand'
import type { StoreState, ContextMenuSlice } from '../types'

export const createContextMenuSlice: StateCreator<StoreState, [], [], ContextMenuSlice> = (set) => ({
  contextMenu: {
    isOpen: false,
    x: 0,
    y: 0,
    targetFile: null,
    targetType: 'empty',
  },

  openContextMenu: (x, y, targetFile, targetType) => set({
    contextMenu: { isOpen: true, x, y, targetFile, targetType },
  }),

  closeContextMenu: () => set((state) => ({
    contextMenu: { ...state.contextMenu, isOpen: false },
  })),
})
