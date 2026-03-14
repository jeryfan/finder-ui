import type { ComponentType } from 'react'
import type { IconProps } from '@/icons'

export type TabKey = string

export type SidebarTab = {
  key: TabKey
  label: string
  rootPath: string
  icon?: ComponentType<IconProps>
}

export type FileEntry = {
  name: string
  path: string
  size: number
  type: 'file' | 'directory'
  lastModified?: string
  modified_at?: string
  mimeType?: string
  mimetype?: string
}

export type ContextMenuTargetType = 'file' | 'folder' | 'empty'

export type FilePreviewType = 'sheet' | 'doc' | 'presentation' | 'markdown' | null

export type MimeResolvable = { name: string; mimeType?: string; mimetype?: string }

export type PreviewMode = 'split' | 'grouped'

export type PreviewWindow = {
  path: string
  name: string
  size: number
  content: string
  draftContent: string
  isLoading: boolean
  isSaving: boolean
  isEditing: boolean
  error?: string
  mimeType?: string
  mimetype?: string
}
