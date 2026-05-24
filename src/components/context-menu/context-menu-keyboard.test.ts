import { describe, expect, it } from 'vitest'
import { getNextContextMenuIndex } from './context-menu-keyboard'

describe('getNextContextMenuIndex', () => {
  it('wraps next and previous movement', () => {
    expect(getNextContextMenuIndex({
      currentIndex: 2,
      itemCount: 3,
      direction: 'next',
    })).toBe(0)
    expect(getNextContextMenuIndex({
      currentIndex: 0,
      itemCount: 3,
      direction: 'previous',
    })).toBe(2)
  })

  it('moves directly to first and last items', () => {
    expect(getNextContextMenuIndex({
      currentIndex: 1,
      itemCount: 3,
      direction: 'first',
    })).toBe(0)
    expect(getNextContextMenuIndex({
      currentIndex: 1,
      itemCount: 3,
      direction: 'last',
    })).toBe(2)
  })

  it('returns no focus for empty menus', () => {
    expect(getNextContextMenuIndex({
      currentIndex: -1,
      itemCount: 0,
      direction: 'next',
    })).toBe(-1)
  })
})
