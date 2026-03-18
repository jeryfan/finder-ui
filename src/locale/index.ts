export type FinderLocale = {
  search: string
  noFiles: string
  tryDifferentSearch: string
  failedToLoad: string
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
