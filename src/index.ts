import './styles/index.css'

// Utils
export { cn } from '@/utils'

// Types
export type {
  TabKey,
  SidebarTab,
  FileEntry,
  ContextMenuTargetType,
} from '@/types'

// Components
export { Sidebar } from '@/components/sidebar'
export { FileList } from '@/components/file-list'
export { ContextMenu } from '@/components/context-menu'

// Store
export { useStore } from '@/store'

// Icons
export {
  HardDriveIcon,
  FolderIcon,
  FolderOpenIcon,
  FileIcon,
  FileCodeIcon,
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
} from '@/icons'
export type { IconProps } from '@/icons'

export { getFileIcon, getFilePreviewType } from '@/utils/file-icons'
