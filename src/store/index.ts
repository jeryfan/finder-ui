import { create } from 'zustand'
import type { SidebarTab, TabKey, FileEntry, ContextMenuTargetType } from '@/types'

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

  // Context menu
  contextMenu: ContextMenuState

  // Actions
  setActiveTab: (tab: TabKey) => void
  setTabs: (tabs: SidebarTab[]) => void
  setFiles: (files: FileEntry[]) => void
  setSelectedPaths: (paths: Set<string>) => void
  toggleSelection: (path: string) => void
  clearSelection: () => void
  setLoading: (loading: boolean) => void
  setLoadError: (error: string | null) => void
  setViewMode: (mode: 'list' | 'grouped') => void
  setSort: (field: 'name' | 'modified_at' | 'size') => void
  setSearchQuery: (query: string) => void
  setFileLoading: (path: string, loading: boolean) => void

  // Context menu actions
  openContextMenu: (x: number, y: number, targetFile: FileEntry | null, targetType: ContextMenuTargetType) => void
  closeContextMenu: () => void

  // Handlers (to be set by consumer)
  onContextMenu: (event: React.MouseEvent, targetFile: FileEntry | null) => void
  setContextMenuHandler: (handler: (event: React.MouseEvent, targetFile: FileEntry | null) => void) => void
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
}

export const useStore = create<State>((set, get) => ({
  // Initial state
  activeTab: undefined,
  tabs: [],
  files: [],
  selectedPaths: new Set(),
  loading: false,
  loadError: null,
  viewMode: 'list',
  sortField: 'name',
  sortOrder: 'asc',
  searchQuery: '',
  fileLoadingStates: {},
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

  // Context menu actions
  openContextMenu: (x, y, targetFile, targetType) => set({
    contextMenu: { isOpen: true, x, y, targetFile, targetType },
  }),
  closeContextMenu: () => set((state) => ({
    contextMenu: { ...state.contextMenu, isOpen: false },
  })),

  // Default handlers
  onContextMenu: () => {},
  setContextMenuHandler: (handler) => set({ onContextMenu: handler }),
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
}))
