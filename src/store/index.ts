import { create } from 'zustand'
import type { SidebarTab, TabKey, FileEntry, ContextMenuTargetType, PreviewMode, PreviewWindow } from '@/types'

interface ContextMenuState {
  isOpen: boolean
  x: number
  y: number
  targetFile: FileEntry | null
  targetType: ContextMenuTargetType
}

interface State {
  // Sidebar state
  activeTab: TabKey | undefined
  tabs: SidebarTab[]

  // Navigation state
  currentPath: string
  historyStack: string[]
  historyIndex: number

  // File list state
  files: FileEntry[]
  selectedPaths: Set<string>
  loading: boolean
  loadError: string | null
  viewMode: 'list' | 'grouped'
  sortField: 'name' | 'modified_at' | 'size'
  sortOrder: 'asc' | 'desc'
  searchQuery: string
  fileLoadingStates: Record<string, boolean>

  // Preview state
  previews: PreviewWindow[]
  activePreviewPath: string | null
  previewMode: PreviewMode
  updateEnabled: boolean

  // Context menu
  contextMenu: ContextMenuState

  // Actions
  setActiveTab: (tab: TabKey) => void
  setTabs: (tabs: SidebarTab[]) => void
  setFiles: (files: FileEntry[]) => void
  setSelectedPaths: (paths: Set<string>) => void
  toggleSelection: (path: string) => void
  selectRange: (toPath: string) => void
  clearSelection: () => void
  setLoading: (loading: boolean) => void
  setLoadError: (error: string | null) => void
  setViewMode: (mode: 'list' | 'grouped') => void
  setSort: (field: 'name' | 'modified_at' | 'size') => void
  setSearchQuery: (query: string) => void
  setFileLoading: (path: string, loading: boolean) => void

  // Navigation actions
  setCurrentPath: (path: string) => void
  navigateTo: (path: string) => void
  goBack: () => void
  goForward: () => void

  // Preview actions
  openPreview: (file: FileEntry, content: string) => void
  closePreview: (path: string) => void
  setActivePreviewPath: (path: string | null) => void
  setPreviewMode: (mode: PreviewMode) => void
  setUpdateEnabled: (enabled: boolean) => void
  updatePreviewDraft: (path: string, content: string) => void
  setPreviewEditing: (path: string, isEditing: boolean) => void
  setPreviewSaving: (path: string, isSaving: boolean) => void
  setPreviewError: (path: string, error: string | undefined) => void
  refreshPreview: (path: string, content: string) => void

  // Context menu actions
  openContextMenu: (x: number, y: number, targetFile: FileEntry | null, targetType: ContextMenuTargetType) => void
  closeContextMenu: () => void

  // Handlers (to be set by consumer)
  onOpen: (file: FileEntry) => void
  setOpenHandler: (handler: (file: FileEntry) => void) => void
  onDownload: (file: FileEntry) => void
  setDownloadHandler: (handler: (file: FileEntry) => void) => void
  onBatchDownload: (files: FileEntry[]) => void
  setBatchDownloadHandler: (handler: (files: FileEntry[]) => void) => void
  onUpload: (isFolder: boolean, targetPath?: string) => void
  setUploadHandler: (handler: (isFolder: boolean, targetPath?: string) => void) => void
  onRefresh: () => void
  setRefreshHandler: (handler: () => void) => void
  onSavePreview: (path: string, content: string) => Promise<void> | void
  setSavePreviewHandler: (handler: (path: string, content: string) => Promise<void> | void) => void
  onNavigateToPath: (path: string) => void
  setNavigateToPathHandler: (handler: (path: string) => void) => void
  onDropFiles: (files: File[], targetPath?: string) => void
  setDropFilesHandler: (handler: (files: File[], targetPath?: string) => void) => void
}

export const useStore = create<State>((set, get) => ({
  // Initial state
  activeTab: undefined,
  tabs: [],
  currentPath: '/',
  historyStack: ['/'],
  historyIndex: 0,
  files: [],
  selectedPaths: new Set(),
  loading: false,
  loadError: null,
  viewMode: 'list',
  sortField: 'name',
  sortOrder: 'asc',
  searchQuery: '',
  fileLoadingStates: {},
  previews: [],
  activePreviewPath: null,
  previewMode: 'split',
  updateEnabled: false,
  contextMenu: {
    isOpen: false,
    x: 0,
    y: 0,
    targetFile: null,
    targetType: 'empty',
  },

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setTabs: (tabs) => set({ tabs }),
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

  // Navigation actions
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

  // Preview actions
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

  // Context menu actions
  openContextMenu: (x, y, targetFile, targetType) => set({
    contextMenu: { isOpen: true, x, y, targetFile, targetType },
  }),
  closeContextMenu: () => set((state) => ({
    contextMenu: { ...state.contextMenu, isOpen: false },
  })),

  // Default handlers
  onOpen: () => {},
  setOpenHandler: (handler) => set({ onOpen: handler }),
  onDownload: () => {},
  setDownloadHandler: (handler) => set({ onDownload: handler }),
  onBatchDownload: () => {},
  setBatchDownloadHandler: (handler) => set({ onBatchDownload: handler }),
  onUpload: () => {},
  setUploadHandler: (handler) => set({ onUpload: handler }),
  onRefresh: () => {},
  setRefreshHandler: (handler) => set({ onRefresh: handler }),
  onSavePreview: async () => {},
  setSavePreviewHandler: (handler) => set({ onSavePreview: handler }),
  onNavigateToPath: () => {},
  setNavigateToPathHandler: (handler) => set({ onNavigateToPath: handler }),
  onDropFiles: () => {},
  setDropFilesHandler: (handler) => set({ onDropFiles: handler }),
}))
