// Auto-inject styles at runtime (no separate CSS import needed)
import cssText from './styles/index.css?inline'

function injectStyles() {
  if (typeof document === 'undefined') return
  const id = '__finder-ui-styles__'
  if (document.getElementById(id)) return
  const style = document.createElement('style')
  style.id = id
  style.textContent = cssText
  document.head.appendChild(style)
}

injectStyles()

// Utils
export { cn, isImageFile, isVideoFile, isMarkdownFile, isCodeFile } from '@/utils'

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
export type { SidebarProps } from '@/components/sidebar'
export { FileList } from '@/components/file-list'
export { ContextMenu } from '@/components/context-menu'
export { PreviewPanel, getPreviewLeftPaneWidth } from '@/components/preview-panel'
export type { PreviewPanelProps } from '@/components/preview-panel'
export { Toolbar } from '@/components/toolbar'
export type { ToolbarProps } from '@/components/toolbar'

// Store
export { useFinderStore, useFinderStoreApi, createFinderStore, FinderStoreContext } from '@/store'
export type { FinderStore } from '@/store'

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
  UploadIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ZoomInIcon,
  ZoomOutIcon,
  RotateIcon,
  FitToWindowIcon,
} from '@/icons'
export type { IconProps } from '@/icons'

// File icon utilities
export { getFileIcon, getFilePreviewType } from '@/utils/file-icons'

// File utilities
export { readEntryFiles } from '@/utils/read-entry-files'

// Constants
export { IMAGE_EXTENSIONS, VIDEO_EXTENSIONS, MARKDOWN_EXTENSIONS, CODE_EXTENSIONS } from '@/constants'
