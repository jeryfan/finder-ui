import { describe, it, expect } from 'vitest'
import type { FileEntry } from '@/types'
import { createFinderStore } from '../../index'

function createTestStore() {
  return createFinderStore()
}

const mockFile: FileEntry = {
  name: 'readme.md',
  path: '/readme.md',
  size: 1024,
  type: 'file',
  mimeType: 'text/markdown',
}

const mockFile2: FileEntry = {
  name: 'index.ts',
  path: '/index.ts',
  size: 2048,
  type: 'file',
  mimeType: 'text/typescript',
}

describe('preview-slice', () => {
  describe('openPreview', () => {
    it('adds a new preview', () => {
      const store = createTestStore()
      store.getState().openPreview(mockFile, '# Hello')

      const state = store.getState()
      expect(state.previews).toHaveLength(1)
      expect(state.previews[0].path).toBe('/readme.md')
      expect(state.previews[0].content).toBe('# Hello')
      expect(state.previews[0].isLoading).toBe(false)
      expect(state.activePreviewPath).toBe('/readme.md')
    })

    it('updates existing preview if path matches', () => {
      const store = createTestStore()
      store.getState().openPreview(mockFile, '# Hello')
      store.getState().openPreview(mockFile, '# Updated')

      const state = store.getState()
      expect(state.previews).toHaveLength(1)
      expect(state.previews[0].content).toBe('# Updated')
    })

    it('sets activePreviewPath to opened file', () => {
      const store = createTestStore()
      store.getState().openPreview(mockFile, '# Hello')
      store.getState().openPreview(mockFile2, 'export {}')

      expect(store.getState().activePreviewPath).toBe('/index.ts')
    })
  })

  describe('openPreviewLoading', () => {
    it('adds a new loading preview', () => {
      const store = createTestStore()
      store.getState().openPreviewLoading(mockFile)

      const state = store.getState()
      expect(state.previews).toHaveLength(1)
      expect(state.previews[0].isLoading).toBe(true)
      expect(state.previews[0].content).toBe('')
      expect(state.activePreviewPath).toBe('/readme.md')
    })

    it('marks existing preview as loading', () => {
      const store = createTestStore()
      store.getState().openPreview(mockFile, '# Hello')
      store.getState().openPreviewLoading(mockFile)

      const state = store.getState()
      expect(state.previews).toHaveLength(1)
      expect(state.previews[0].isLoading).toBe(true)
      // Content preserved when marking existing as loading
      expect(state.previews[0].content).toBe('# Hello')
    })
  })

  describe('closePreview', () => {
    it('removes the preview', () => {
      const store = createTestStore()
      store.getState().openPreview(mockFile, '# Hello')
      store.getState().closePreview('/readme.md')

      expect(store.getState().previews).toHaveLength(0)
    })

    it('sets active to last remaining preview when closing active', () => {
      const store = createTestStore()
      store.getState().openPreview(mockFile, '# Hello')
      store.getState().openPreview(mockFile2, 'export {}')
      store.getState().closePreview('/index.ts')

      expect(store.getState().activePreviewPath).toBe('/readme.md')
    })

    it('sets active to null when closing last preview', () => {
      const store = createTestStore()
      store.getState().openPreview(mockFile, '# Hello')
      store.getState().closePreview('/readme.md')

      expect(store.getState().activePreviewPath).toBeNull()
    })

    it('does not change active when closing non-active preview', () => {
      const store = createTestStore()
      store.getState().openPreview(mockFile, '# Hello')
      store.getState().openPreview(mockFile2, 'export {}')
      // active is now /index.ts
      store.getState().closePreview('/readme.md')

      expect(store.getState().activePreviewPath).toBe('/index.ts')
    })
  })

  describe('updatePreviewDraft', () => {
    it('updates draft content for a preview', () => {
      const store = createTestStore()
      store.getState().openPreview(mockFile, '# Hello')
      store.getState().updatePreviewDraft('/readme.md', '# Modified')

      expect(store.getState().previews[0].draftContent).toBe('# Modified')
    })

    it('does not affect other previews', () => {
      const store = createTestStore()
      store.getState().openPreview(mockFile, '# Hello')
      store.getState().openPreview(mockFile2, 'export {}')
      store.getState().updatePreviewDraft('/readme.md', '# Modified')

      expect(store.getState().previews[1].draftContent).toBe('export {}')
    })
  })

  describe('setPreviewEditing', () => {
    it('sets editing state', () => {
      const store = createTestStore()
      store.getState().openPreview(mockFile, '# Hello')
      store.getState().setPreviewEditing('/readme.md', true)

      expect(store.getState().previews[0].isEditing).toBe(true)
    })

    it('unsets editing state', () => {
      const store = createTestStore()
      store.getState().openPreview(mockFile, '# Hello')
      store.getState().setPreviewEditing('/readme.md', true)
      store.getState().setPreviewEditing('/readme.md', false)

      expect(store.getState().previews[0].isEditing).toBe(false)
    })
  })

  describe('setPreviewSaving', () => {
    it('sets saving state', () => {
      const store = createTestStore()
      store.getState().openPreview(mockFile, '# Hello')
      store.getState().setPreviewSaving('/readme.md', true)

      expect(store.getState().previews[0].isSaving).toBe(true)
    })
  })

  describe('refreshPreview', () => {
    it('updates content and draftContent, clears error', () => {
      const store = createTestStore()
      store.getState().openPreview(mockFile, '# Hello')
      store.getState().setPreviewError('/readme.md', 'some error')
      store.getState().updatePreviewDraft('/readme.md', '# Draft')
      store.getState().refreshPreview('/readme.md', '# Refreshed')

      const preview = store.getState().previews[0]
      expect(preview.content).toBe('# Refreshed')
      expect(preview.draftContent).toBe('# Refreshed')
      expect(preview.error).toBeUndefined()
    })
  })
})
