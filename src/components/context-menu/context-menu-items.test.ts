import { describe, expect, it, vi } from 'vitest'
import { zhCNLocale } from '@/locale/zh-CN'
import type { FileEntry } from '@/types'
import { buildContextMenuItems } from './context-menu-items'

const fileEntry: FileEntry = {
  name: 'a.txt',
  path: '/a.txt',
  size: 100,
  type: 'file',
}

const folderEntry: FileEntry = {
  name: 'docs',
  path: '/docs',
  size: 0,
  type: 'directory',
}

const selectedFiles: FileEntry[] = [
  fileEntry,
  { name: 'b.txt', path: '/b.txt', size: 200, type: 'file' },
]

const createOptions = (
  overrides: Partial<Parameters<typeof buildContextMenuItems>[0]> = {},
): Parameters<typeof buildContextMenuItems>[0] => ({
  targetType: 'empty',
  targetFile: null,
  selectedFiles: [],
  selectedCount: 0,
  hasRename: true,
  hasDelete: true,
  hasCreateFolder: true,
  hasUpload: true,
  hasDownload: true,
  hasBatchDownload: true,
  locale: zhCNLocale,
  onOpen: vi.fn(),
  onDownload: vi.fn(),
  onBatchDownload: vi.fn(),
  onUpload: vi.fn(),
  onRefresh: vi.fn(),
  onDelete: vi.fn(),
  setRenamingPath: vi.fn(),
  setIsCreatingFolder: vi.fn(),
  closeMenu: vi.fn(),
  confirm: vi.fn(() => true),
  ...overrides,
})

describe('buildContextMenuItems', () => {
  it('builds batch actions for multi-select file targets', async () => {
    const options = createOptions({
      targetType: 'file',
      targetFile: fileEntry,
      selectedFiles,
      selectedCount: selectedFiles.length,
    })

    const items = buildContextMenuItems(options)

    expect(items.map((item) => item.id)).toEqual([
      'download-selected',
      'delete-selected',
    ])

    await items[0].action()
    expect(options.onBatchDownload).toHaveBeenCalledWith(selectedFiles)
    expect(options.closeMenu).toHaveBeenCalledTimes(1)

    await items[1].action()
    expect(options.confirm).toHaveBeenCalledWith(selectedFiles, '确定删除 2 个项目吗？')
    expect(options.onDelete).toHaveBeenCalledWith(selectedFiles)
    expect(options.closeMenu).toHaveBeenCalledTimes(2)
  })

  it('builds single file actions in the expected order', () => {
    const options = createOptions({
      targetType: 'file',
      targetFile: fileEntry,
      selectedFiles: [fileEntry],
      selectedCount: 1,
    })

    const items = buildContextMenuItems(options)

    expect(items.map((item) => item.id)).toEqual([
      'open-file',
      'download-file',
      'rename-file',
      'delete-file',
    ])

    items[2].action()
    expect(options.setRenamingPath).toHaveBeenCalledWith('/a.txt')
    expect(options.closeMenu).toHaveBeenCalledTimes(1)
  })

  it('builds folder upload actions scoped to the target folder', () => {
    const options = createOptions({
      targetType: 'folder',
      targetFile: folderEntry,
      selectedFiles: [folderEntry],
      selectedCount: 1,
    })

    const items = buildContextMenuItems(options)

    expect(items.map((item) => item.id)).toEqual([
      'open-folder',
      'upload-files-to-folder',
      'upload-folder-to-folder',
      'rename-folder',
      'delete-folder',
    ])

    items[1].action()
    expect(options.onUpload).toHaveBeenCalledWith(false, '/docs')

    items[2].action()
    expect(options.onUpload).toHaveBeenCalledWith(true, '/docs')
  })

  it('builds empty area actions and separates refresh after upload/create actions', () => {
    const options = createOptions()

    const items = buildContextMenuItems(options)

    expect(items.map((item) => item.id)).toEqual([
      'new-folder',
      'upload-files',
      'upload-folder',
      'refresh',
    ])
    expect(items[3].divider).toBe(true)

    items[0].action()
    expect(options.setIsCreatingFolder).toHaveBeenCalledWith(true)

    items[3].action()
    expect(options.onRefresh).toHaveBeenCalledTimes(1)
  })

  it('keeps closing after a delete confirmation is cancelled', async () => {
    const options = createOptions({
      targetType: 'file',
      targetFile: fileEntry,
      selectedFiles: [fileEntry],
      selectedCount: 1,
      confirm: vi.fn(() => false),
    })

    const items = buildContextMenuItems(options)

    await items[3].action()
    expect(options.onDelete).not.toHaveBeenCalled()
    expect(options.closeMenu).toHaveBeenCalledTimes(1)
  })

  it('waits for async delete confirmation before deleting', async () => {
    const confirm = vi.fn(async () => true)
    const options = createOptions({
      targetType: 'folder',
      targetFile: folderEntry,
      selectedFiles: [folderEntry],
      selectedCount: 1,
      confirm,
    })

    const items = buildContextMenuItems(options)

    await items[4].action()
    expect(confirm).toHaveBeenCalledWith([folderEntry], '确定删除"docs"吗？')
    expect(options.onDelete).toHaveBeenCalledWith([folderEntry])
    expect(options.closeMenu).toHaveBeenCalledTimes(1)
  })

  it('keeps closing after async delete confirmation is cancelled', async () => {
    const options = createOptions({
      targetType: 'file',
      targetFile: fileEntry,
      selectedFiles: [fileEntry],
      selectedCount: 1,
      confirm: vi.fn(async () => false),
    })

    const items = buildContextMenuItems(options)

    await items[3].action()
    expect(options.onDelete).not.toHaveBeenCalled()
    expect(options.closeMenu).toHaveBeenCalledTimes(1)
  })
})
