import type { MimeResolvable, FilePreviewType } from '@/types'
import {
  FolderIcon,
  FileIcon,
  FileCodeIcon,
  FileBracesIcon,
  FileSpreadsheetIcon,
  PresentationIcon,
  ImageIcon,
  FileArchiveIcon,
  FilmIcon,
} from '@/icons'
import { cn } from './index'
import {
  MARKDOWN_EXTENSIONS,
  CODE_ICON_EXTENSIONS,
  BRACES_EXTENSIONS,
  SPREADSHEET_EXTENSIONS,
  TEXT_EXTENSIONS,
  ARCHIVE_EXTENSIONS,
  IMAGE_EXTENSIONS,
  VIDEO_EXTENSIONS,
} from '@/constants'
import { extractExtension, resolveEntryMimeType } from './index'

export type { FilePreviewType } from '@/types'

export const getFilePreviewType = (entry: MimeResolvable & { type?: string }): FilePreviewType => {
  const ext = extractExtension(entry.name)
  const mimeType = resolveEntryMimeType(entry).toLowerCase()

  if (SPREADSHEET_EXTENSIONS.has(ext) || mimeType.includes('spreadsheet') || mimeType.includes('csv'))
    return 'sheet'
  if (['doc', 'docx'].includes(ext) || mimeType.includes('word') || mimeType.includes('officedocument.wordprocessingml'))
    return 'doc'
  if (['ppt', 'pptx'].includes(ext) || mimeType.includes('presentation') || mimeType.includes('officedocument.presentationml'))
    return 'presentation'
  if (MARKDOWN_EXTENSIONS.has(ext) || mimeType.includes('markdown'))
    return 'markdown'
  return null
}

export const getFileIcon = (
  entry: MimeResolvable & { type?: string },
  className = 'h-4 w-4',
) => {
  if (entry.type === 'directory')
    return <FolderIcon className={cn(className, 'text-amber-500')} />

  const ext = extractExtension(entry.name)
  const mimeType = resolveEntryMimeType(entry).toLowerCase()
  const previewType = getFilePreviewType(entry)

  if (previewType === 'sheet')
    return <FileSpreadsheetIcon className={cn(className, 'text-green-600')} />
  if (previewType === 'doc')
    return <FileIcon className={cn(className, 'text-blue-600')} />
  if (previewType === 'presentation')
    return <PresentationIcon className={cn(className, 'text-orange-600')} />
  if (previewType === 'markdown')
    return <FileIcon className={cn(className, 'text-black')} />

  if (mimeType.startsWith('image/'))
    return <ImageIcon className={cn(className, 'text-green-500')} />

  if (mimeType.includes('archive') || mimeType.includes('zip') || mimeType.includes('tar'))
    return <FileArchiveIcon className={cn(className, 'text-yellow-600')} />

  if (IMAGE_EXTENSIONS.has(ext))
    return <ImageIcon className={cn(className, 'text-green-500')} />
  if (VIDEO_EXTENSIONS.has(ext))
    return <FilmIcon className={cn(className, 'text-purple-500')} />
  if (CODE_ICON_EXTENSIONS.has(ext))
    return <FileCodeIcon className={cn(className, 'text-emerald-500')} />
  if (BRACES_EXTENSIONS.has(ext))
    return <FileBracesIcon className={cn(className, 'text-yellow-600')} />
  if (TEXT_EXTENSIONS.has(ext) || MARKDOWN_EXTENSIONS.has(ext))
    return <FileIcon className={cn(className, 'text-black')} />
  if (ARCHIVE_EXTENSIONS.has(ext))
    return <FileArchiveIcon className={cn(className, 'text-yellow-600')} />

  return <FileIcon className={cn(className, 'text-gray-600')} />
}
