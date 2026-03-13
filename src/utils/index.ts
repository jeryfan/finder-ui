import type { FileEntry } from '@/types'
import {
  MARKDOWN_EXTENSIONS,
  CODE_EXTENSIONS,
  IMAGE_EXTENSIONS,
  VIDEO_EXTENSIONS,
  CODE_ICON_EXTENSIONS,
  BRACES_EXTENSIONS,
  SPREADSHEET_EXTENSIONS,
  TEXT_EXTENSIONS,
  ARCHIVE_EXTENSIONS,
} from '@/constants'

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export const extractExtension = (name: string) => {
  const idx = name.lastIndexOf('.')
  if (idx < 0 || idx === name.length - 1)
    return ''
  return name.slice(idx + 1).toLowerCase()
}

export const isMarkdownFile = (name: string) => MARKDOWN_EXTENSIONS.has(extractExtension(name))
export const isCodeFile = (name: string) => CODE_EXTENSIONS.has(extractExtension(name))

export const resolveEntryMimeType = (entry: FileEntry) =>
  (entry.mimeType || entry.mimetype || '')

export const formatDateTimeEN = (isoString: string) => {
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime()))
    return '--'

  const diffHours = (Date.now() - date.getTime()) / (1000 * 60 * 60)
  if (diffHours >= 0 && diffHours < 24)
    return `${Math.max(1, Math.floor(diffHours))} hr ago`

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export const formatFileSize = (size: number, type: FileEntry['type']) => {
  if (type === 'directory')
    return '--'
  if (!size)
    return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let value = size
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`
}
