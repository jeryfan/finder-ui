import type { ComponentType, ReactNode } from 'react'
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
