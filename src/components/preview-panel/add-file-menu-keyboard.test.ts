import { describe, expect, it } from 'vitest'
import { getNextAddFileMenuIndex } from './add-file-menu-keyboard'

describe('getNextAddFileMenuIndex', () => {
  it('wraps next and previous menu focus', () => {
    expect(getNextAddFileMenuIndex({
      currentIndex: 2,
      itemCount: 3,
      direction: 'next',
    })).toBe(0)
    expect(getNextAddFileMenuIndex({
      currentIndex: 0,
      itemCount: 3,
      direction: 'previous',
    })).toBe(2)
  })

  it('supports first and last jumps', () => {
    expect(getNextAddFileMenuIndex({
      currentIndex: 1,
      itemCount: 3,
      direction: 'first',
    })).toBe(0)
    expect(getNextAddFileMenuIndex({
      currentIndex: 1,
      itemCount: 3,
      direction: 'last',
    })).toBe(2)
  })

  it('returns no focus for empty menus', () => {
    expect(getNextAddFileMenuIndex({
      currentIndex: -1,
      itemCount: 0,
      direction: 'next',
    })).toBe(-1)
  })
})
