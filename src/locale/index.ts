export type FinderLocale = {
  sidebarTitle: string
  noTabsConfigured: string
  search: string
  fileListLabel: string
  back: string
  forward: string
  groupedView: string
  listView: string
  noFiles: string
  noFilesAvailable: string
  emptyFile: string
  tableRowsTruncated: (shown: number, total: number) => string
  audioNotSupported: string
  tryDifferentSearch: string
  failedToLoad: string
  failedToSave: string
  retry: string
  name: string
  dateModified: string
  size: string
  items: (count: number) => string
  selected: (count: number) => string
  uploading: (count: number) => string
  refreshing: string
  dropFilesToUpload: string
  open: string
  download: string
  downloadAll: string
  edit: string
  preview: string
  save: string
  close: string
  addFile: string
  ungroupWindows: string
  switchToGroupedMode: string
  zoomIn: string
  zoomOut: string
  rotate: string
  fitToWindow: string
  uploadFiles: string
  uploadFolder: string
  refresh: string
  rename: string
  delete: string
  newFolder: string
  itemsSelected: (count: number) => string
  deleteConfirm: (name: string) => string
  deleteMultipleConfirm: (count: number) => string
}
