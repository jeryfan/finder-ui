import { describe, expect, it } from 'vitest'
import { zhCNLocale } from '@/locale/zh-CN'
import type { FileEntry } from '@/types'
import { getDeleteSelectionRequest } from './delete-selection'

const files: FileEntry[] = [
  { name: 'a.txt', path: '/a.txt', size: 100, type: 'file' },
  { name: 'b.txt', path: '/b.txt', size: 200, type: 'file' },
]

describe('getDeleteSelectionRequest', () => {
  it('returns null when nothing is selected', () => {
    expect(getDeleteSelectionRequest({
      files,
      selectedPaths: new Set(),
      locale: zhCNLocale,
    })).toBeNull()
  })

  it('builds single-file delete confirmation', () => {
    expect(getDeleteSelectionRequest({
      files,
      selectedPaths: new Set(['/a.txt']),
      locale: zhCNLocale,
    })).toEqual({
      files: [files[0]],
      message: '确定删除"a.txt"吗？',
    })
  })

  it('builds multi-file delete confirmation', () => {
    expect(getDeleteSelectionRequest({
      files,
      selectedPaths: new Set(['/a.txt', '/b.txt']),
      locale: zhCNLocale,
    })).toEqual({
      files,
      message: '确定删除 2 个项目吗？',
    })
  })
})
