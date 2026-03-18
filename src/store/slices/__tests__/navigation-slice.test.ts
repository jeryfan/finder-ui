import { describe, it, expect, vi } from 'vitest'
import { createFinderStore } from '../../index'

function createTestStore() {
  return createFinderStore()
}

describe('navigation-slice', () => {
  describe('navigateTo', () => {
    it('navigates to a new path', () => {
      const store = createTestStore()
      store.getState().navigateTo('/docs')

      const state = store.getState()
      expect(state.currentPath).toBe('/docs')
      expect(state.historyStack).toEqual(['/', '/docs'])
      expect(state.historyIndex).toBe(1)
    })

    it('skips navigation when path is the same as current', () => {
      const store = createTestStore()
      store.getState().navigateTo('/')

      const state = store.getState()
      expect(state.historyStack).toEqual(['/'])
      expect(state.historyIndex).toBe(0)
    })

    it('truncates forward history when navigating from middle', () => {
      const store = createTestStore()
      store.getState().navigateTo('/a')
      store.getState().navigateTo('/b')
      store.getState().navigateTo('/c')

      // Go back twice: now at /a
      store.getState().goBack()
      store.getState().goBack()

      // Navigate to /d — should truncate /b and /c
      store.getState().navigateTo('/d')

      const state = store.getState()
      expect(state.historyStack).toEqual(['/', '/a', '/d'])
      expect(state.historyIndex).toBe(2)
      expect(state.currentPath).toBe('/d')
    })

    it('clears selectedPaths on navigate', () => {
      const store = createTestStore()
      store.getState().setSelectedPaths(new Set(['/file1']))
      store.getState().navigateTo('/docs')

      expect(store.getState().selectedPaths.size).toBe(0)
    })

    it('clears searchQuery on navigate', () => {
      const store = createTestStore()
      store.getState().setSearchQuery('test')
      store.getState().navigateTo('/docs')

      expect(store.getState().searchQuery).toBe('')
    })
  })

  describe('goBack', () => {
    it('goes back to previous path', () => {
      const store = createTestStore()
      store.getState().setNavigateToPathHandler(vi.fn())
      store.getState().navigateTo('/docs')
      store.getState().goBack()

      const state = store.getState()
      expect(state.currentPath).toBe('/')
      expect(state.historyIndex).toBe(0)
    })

    it('does nothing when at the beginning', () => {
      const store = createTestStore()
      store.getState().goBack()

      expect(store.getState().currentPath).toBe('/')
      expect(store.getState().historyIndex).toBe(0)
    })

    it('clears selectedPaths on goBack', () => {
      const store = createTestStore()
      store.getState().setNavigateToPathHandler(vi.fn())
      store.getState().navigateTo('/docs')
      store.getState().setSelectedPaths(new Set(['/docs/file1']))
      store.getState().goBack()

      expect(store.getState().selectedPaths.size).toBe(0)
    })

    it('calls onNavigateToPath handler', () => {
      const handler = vi.fn()
      const store = createTestStore()
      store.getState().setNavigateToPathHandler(handler)
      store.getState().navigateTo('/docs')
      store.getState().goBack()

      expect(handler).toHaveBeenCalledWith('/')
    })
  })

  describe('goForward', () => {
    it('goes forward to next path', () => {
      const store = createTestStore()
      store.getState().setNavigateToPathHandler(vi.fn())
      store.getState().navigateTo('/docs')
      store.getState().goBack()
      store.getState().goForward()

      const state = store.getState()
      expect(state.currentPath).toBe('/docs')
      expect(state.historyIndex).toBe(1)
    })

    it('does nothing when at the end', () => {
      const store = createTestStore()
      store.getState().navigateTo('/docs')
      store.getState().goForward()

      expect(store.getState().currentPath).toBe('/docs')
      expect(store.getState().historyIndex).toBe(1)
    })

    it('clears selectedPaths on goForward', () => {
      const store = createTestStore()
      store.getState().setNavigateToPathHandler(vi.fn())
      store.getState().navigateTo('/docs')
      store.getState().goBack()
      store.getState().setSelectedPaths(new Set(['/file1']))
      store.getState().goForward()

      expect(store.getState().selectedPaths.size).toBe(0)
    })

    it('calls onNavigateToPath handler', () => {
      const handler = vi.fn()
      const store = createTestStore()
      store.getState().setNavigateToPathHandler(handler)
      store.getState().navigateTo('/docs')
      store.getState().goBack()
      store.getState().goForward()

      expect(handler).toHaveBeenCalledWith('/docs')
    })
  })
})
