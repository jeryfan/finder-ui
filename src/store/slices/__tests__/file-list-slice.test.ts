import { describe, it, expect } from 'vitest'
import type { FileEntry } from '@/types'
import { createFinderStore } from '../../index'

function createTestStore() {
  return createFinderStore()
}

const mockFiles: FileEntry[] = [
  { name: 'a.txt', path: '/a.txt', size: 100, type: 'file' },
  { name: 'b.txt', path: '/b.txt', size: 200, type: 'file' },
  { name: 'c.txt', path: '/c.txt', size: 300, type: 'file' },
  { name: 'd.txt', path: '/d.txt', size: 400, type: 'file' },
]

describe('file-list-slice', () => {
  describe('toggleSelection', () => {
    it('adds a path to selection', () => {
      const store = createTestStore()
      store.getState().toggleSelection('/a.txt')

      expect(store.getState().selectedPaths.has('/a.txt')).toBe(true)
    })

    it('removes a path from selection', () => {
      const store = createTestStore()
      store.getState().toggleSelection('/a.txt')
      store.getState().toggleSelection('/a.txt')

      expect(store.getState().selectedPaths.has('/a.txt')).toBe(false)
    })

    it('handles multiple selections', () => {
      const store = createTestStore()
      store.getState().toggleSelection('/a.txt')
      store.getState().toggleSelection('/b.txt')

      const selected = store.getState().selectedPaths
      expect(selected.has('/a.txt')).toBe(true)
      expect(selected.has('/b.txt')).toBe(true)
      expect(selected.size).toBe(2)
    })
  })

  describe('selectRange', () => {
    it('selects a range of files', () => {
      const store = createTestStore()
      store.getState().setFiles(mockFiles)
      store.getState().setSelectedPaths(new Set(['/a.txt']))

      store.getState().selectRange('/c.txt')

      const selected = store.getState().selectedPaths
      expect(selected.has('/a.txt')).toBe(true)
      expect(selected.has('/b.txt')).toBe(true)
      expect(selected.has('/c.txt')).toBe(true)
      expect(selected.size).toBe(3)
    })

    it('falls back to single selection when no prior selection', () => {
      const store = createTestStore()
      store.getState().setFiles(mockFiles)

      store.getState().selectRange('/b.txt')

      const selected = store.getState().selectedPaths
      expect(selected.has('/b.txt')).toBe(true)
      expect(selected.size).toBe(1)
    })

    it('handles reverse range (to < from)', () => {
      const store = createTestStore()
      store.getState().setFiles(mockFiles)
      store.getState().setSelectedPaths(new Set(['/c.txt']))

      store.getState().selectRange('/a.txt')

      const selected = store.getState().selectedPaths
      expect(selected.has('/a.txt')).toBe(true)
      expect(selected.has('/b.txt')).toBe(true)
      expect(selected.has('/c.txt')).toBe(true)
      expect(selected.size).toBe(3)
    })

    it('falls back to single selection when prior selected path not in files', () => {
      const store = createTestStore()
      store.getState().setFiles(mockFiles)
      store.getState().setSelectedPaths(new Set(['/nonexistent']))

      store.getState().selectRange('/b.txt')

      const selected = store.getState().selectedPaths
      expect(selected.has('/b.txt')).toBe(true)
      expect(selected.size).toBe(1)
    })
  })

  describe('setSort', () => {
    it('toggles sort order when same field', () => {
      const store = createTestStore()
      expect(store.getState().sortField).toBe('name')
      expect(store.getState().sortOrder).toBe('asc')

      store.getState().setSort('name')
      expect(store.getState().sortOrder).toBe('desc')
    })

    it('resets to asc when switching fields', () => {
      const store = createTestStore()
      store.getState().setSort('name') // now desc
      store.getState().setSort('size')

      expect(store.getState().sortField).toBe('size')
      expect(store.getState().sortOrder).toBe('asc')
    })

    it('toggles back to asc after desc', () => {
      const store = createTestStore()
      store.getState().setSort('name') // desc
      store.getState().setSort('name') // asc

      expect(store.getState().sortOrder).toBe('asc')
    })
  })

  describe('setFileLoading', () => {
    it('sets loading state for a path', () => {
      const store = createTestStore()
      store.getState().setFileLoading('/a.txt', true)

      expect(store.getState().fileLoadingStates['/a.txt']).toBe(true)
    })

    it('updates loading state for a path', () => {
      const store = createTestStore()
      store.getState().setFileLoading('/a.txt', true)
      store.getState().setFileLoading('/a.txt', false)

      expect(store.getState().fileLoadingStates['/a.txt']).toBe(false)
    })

    it('handles multiple paths independently', () => {
      const store = createTestStore()
      store.getState().setFileLoading('/a.txt', true)
      store.getState().setFileLoading('/b.txt', false)

      const states = store.getState().fileLoadingStates
      expect(states['/a.txt']).toBe(true)
      expect(states['/b.txt']).toBe(false)
    })
  })
})
