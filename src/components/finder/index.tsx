import { useState } from 'react'
import { createFinderStore, FinderStoreContext } from '@/store'
import type { SidebarTab, FileEntry } from '@/types'
import { FinderInner } from './finder-inner'

export type FinderProps = {
  /** Tab configuration for the sidebar navigation */
  tabs: SidebarTab[]
  /** Key of the tab to activate initially. Defaults to the first tab. */
  defaultTab?: string
  /** Fetch files for a given directory path. Called on every navigation. */
  onFetchFiles: (path: string) => Promise<FileEntry[]> | FileEntry[]
  /** Handle file open. Return a content string to show it in the preview panel. */
  onOpenFile?: (file: FileEntry) => Promise<string | void> | string | void
  /** Handle single file download */
  onDownload?: (file: FileEntry) => void
  /** Handle batch file download */
  onBatchDownload?: (files: FileEntry[]) => void
  /** Handle file upload. Receives the selected files and the target directory path. */
  onUpload?: (files: File[], targetPath?: string) => Promise<void> | void
  /** Handle save of edited file content in preview */
  onSave?: (path: string, content: string) => Promise<void> | void
  /** Whether files can be edited in the preview panel. Default: false */
  editable?: boolean
  /** Custom markdown content renderer */
  renderMarkdown?: (content: string) => React.ReactNode
  /** Additional CSS class name for the root element */
  className?: string
  /** Inline styles for the root element. Use to set dimensions, e.g. `{ height: '100vh' }` */
  style?: React.CSSProperties
  /** Theme variant. Default: 'target' */
  theme?: 'target' | 'graphite' | 'clean'
}

export function Finder(props: FinderProps) {
  const [store] = useState(createFinderStore)

  return (
    <FinderStoreContext.Provider value={store}>
      <FinderInner {...props} />
    </FinderStoreContext.Provider>
  )
}
