import type { ComponentType } from 'react'
import type { IconProps } from '@/icons'

export type TabKey = string

export type SidebarTab = {
  key: TabKey
  label: string
  rootPath: string
  icon?: ComponentType<IconProps>
}
