import type { StateCreator } from 'zustand'
import type { StoreState, FileListSlice } from '../types'

export const createFileListSlice: StateCreator<StoreState, [], [], FileListSlice> = (set) => ({
  files: [],
  selectedPaths: new Set(),
  loading: false,
  loadError: null,
  viewMode: 'list',
  sortField: 'name',
  sortOrder: 'asc',
  searchQuery: '',
  fileLoadingStates: {},
  uploadingFiles: [],

  setFiles: (files) => set({ files }),
  setSelectedPaths: (paths) => set({ selectedPaths: paths }),

  toggleSelection: (path) => set((state) => {
    const newSet = new Set(state.selectedPaths)
    if (newSet.has(path)) {
      newSet.delete(path)
    } else {
      newSet.add(path)
    }
    return { selectedPaths: newSet }
  }),

  selectRange: (toPath) => set((state) => {
    const files = state.files
    const prevList = Array.from(state.selectedPaths)
    const lastSelected = prevList[prevList.length - 1]
    const from = files.findIndex(item => item.path === lastSelected)
    const to = files.findIndex(item => item.path === toPath)
    if (from < 0 || to < 0) return { selectedPaths: new Set([toPath]) }
    const start = Math.min(from, to)
    const end = Math.max(from, to)
    const newSet = new Set(state.selectedPaths)
    for (let i = start; i <= end; i++) newSet.add(files[i].path)
    return { selectedPaths: newSet }
  }),

  clearSelection: () => set({ selectedPaths: new Set() }),
  setLoading: (loading) => set({ loading }),
  setLoadError: (error) => set({ loadError: error }),
  setViewMode: (mode) => set({ viewMode: mode }),

  setSort: (field) => set((state) => ({
    sortField: field,
    sortOrder: state.sortField === field && state.sortOrder === 'asc' ? 'desc' : 'asc',
  })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setFileLoading: (path, loading) => set((state) => ({
    fileLoadingStates: { ...state.fileLoadingStates, [path]: loading },
  })),

  setUploadingFiles: (files) => set({ uploadingFiles: files }),
})
