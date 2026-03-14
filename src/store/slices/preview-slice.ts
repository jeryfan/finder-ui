import type { StateCreator } from 'zustand'
import type { PreviewWindow } from '@/types'
import type { StoreState, PreviewSlice } from '../types'

export const createPreviewSlice: StateCreator<StoreState, [], [], PreviewSlice> = (set) => ({
  previews: [],
  activePreviewPath: null,
  previewMode: 'split',
  updateEnabled: false,

  openPreview: (file, content) => set((state) => {
    const existingIndex = state.previews.findIndex(p => p.path === file.path)

    const newPreview: PreviewWindow = {
      path: file.path,
      name: file.name,
      size: file.size,
      content,
      draftContent: content,
      isLoading: false,
      isSaving: false,
      isEditing: false,
      mimeType: file.mimeType || file.mimetype,
    }

    let newPreviews: PreviewWindow[]
    if (existingIndex >= 0) {
      newPreviews = [...state.previews]
      newPreviews[existingIndex] = { ...newPreviews[existingIndex], ...newPreview }
    } else {
      newPreviews = [...state.previews, newPreview]
    }

    return {
      previews: newPreviews,
      activePreviewPath: file.path,
    }
  }),

  closePreview: (path) => set((state) => {
    const newPreviews = state.previews.filter(p => p.path !== path)
    let newActivePath = state.activePreviewPath

    if (state.activePreviewPath === path) {
      newActivePath = newPreviews[newPreviews.length - 1]?.path || null
    }

    return {
      previews: newPreviews,
      activePreviewPath: newActivePath,
    }
  }),

  setActivePreviewPath: (path) => set({ activePreviewPath: path }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
  setUpdateEnabled: (enabled) => set({ updateEnabled: enabled }),

  updatePreviewDraft: (path, content) => set((state) => ({
    previews: state.previews.map(p =>
      p.path === path ? { ...p, draftContent: content } : p
    ),
  })),

  setPreviewEditing: (path, isEditing) => set((state) => ({
    previews: state.previews.map(p =>
      p.path === path ? { ...p, isEditing } : p
    ),
  })),

  setPreviewSaving: (path, isSaving) => set((state) => ({
    previews: state.previews.map(p =>
      p.path === path ? { ...p, isSaving } : p
    ),
  })),

  setPreviewError: (path, error) => set((state) => ({
    previews: state.previews.map(p =>
      p.path === path ? { ...p, error } : p
    ),
  })),

  refreshPreview: (path, content) => set((state) => ({
    previews: state.previews.map(p =>
      p.path === path ? { ...p, content, draftContent: content, error: undefined } : p
    ),
  })),
})
