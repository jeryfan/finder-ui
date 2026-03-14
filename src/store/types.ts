import type { SidebarTab, TabKey, FileEntry, ContextMenuTargetType, PreviewMode, PreviewWindow } from '@/types'

export interface ContextMenuState {
  isOpen: boolean
  x: number
  y: number
  targetFile: FileEntry | null
  targetType: ContextMenuTargetType
}

export interface StoreState
  extends SidebarSlice,
    NavigationSlice,
    FileListSlice,
    PreviewSlice,
    ContextMenuSlice,
    HandlersSlice {}

export interface SidebarSlice {
  activeTab: TabKey | undefined
  tabs: SidebarTab[]
  setActiveTab: (tab: TabKey) => void
  setTabs: (tabs: SidebarTab[]) => void
}

export interface NavigationSlice {
  currentPath: string
  historyStack: string[]
  historyIndex: number
  setCurrentPath: (path: string) => void
  navigateTo: (path: string) => void
  goBack: () => void
  goForward: () => void
}

export interface FileListSlice {
  files: FileEntry[]
  selectedPaths: Set<string>
  loading: boolean
  loadError: string | null
  viewMode: 'list' | 'grouped'
  sortField: 'name' | 'modified_at' | 'size'
  sortOrder: 'asc' | 'desc'
  searchQuery: string
  fileLoadingStates: Record<string, boolean>
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
}

export interface PreviewSlice {
  previews: PreviewWindow[]
  activePreviewPath: string | null
  previewMode: PreviewMode
  updateEnabled: boolean
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
}

export interface ContextMenuSlice {
  contextMenu: ContextMenuState
  openContextMenu: (x: number, y: number, targetFile: FileEntry | null, targetType: ContextMenuTargetType) => void
  closeContextMenu: () => void
}

export interface HandlersSlice {
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
