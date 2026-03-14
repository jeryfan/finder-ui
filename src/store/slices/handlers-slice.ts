import type { StateCreator } from 'zustand'
import type { StoreState, HandlersSlice } from '../types'

export const createHandlersSlice: StateCreator<StoreState, [], [], HandlersSlice> = (set) => ({
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
})
