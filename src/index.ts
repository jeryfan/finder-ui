import './styles/index.css'

// Utils
export { cn } from '@/utils'

// Types
export type {
  TabKey,
  SidebarTab,
  FileEntry,
  ContextMenuTargetType,
  PreviewMode,
  PreviewWindow,
  FilePreviewType,
  MimeResolvable,
} from '@/types'

// Components
export { Finder } from '@/components/finder'
export type { FinderProps } from '@/components/finder'
export { Sidebar } from '@/components/sidebar'
export { FileList } from '@/components/file-list'
export { ContextMenu } from '@/components/context-menu'
export { PreviewPanel, getPreviewLeftPaneWidth } from '@/components/preview-panel'
export { Toolbar } from '@/components/toolbar'

// Store
export { useStore } from '@/store'

// Icons
export {
  HardDriveIcon,
  FolderIcon,
  FolderOpenIcon,
  FileIcon,
  FileCodeIcon,
  FileBracesIcon,
  FileSpreadsheetIcon,
  PresentationIcon,
  ImageIcon,
  FileArchiveIcon,
  FilmIcon,
  LoaderIcon,
  EyeIcon,
  UploadIcon,
  DownloadIcon,
  RefreshIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SaveIcon,
  EditIcon,
  MaximizeIcon,
  MinimizeIcon,
  CloseIcon,
} from '@/icons'
export type { IconProps } from '@/icons'

// File icon utilities
export { getFileIcon, getFilePreviewType } from '@/utils/file-icons'

// File utilities
export { readEntryFiles } from '@/utils/read-entry-files'
