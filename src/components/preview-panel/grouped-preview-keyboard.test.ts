import { describe, expect, it } from 'vitest'
import { getNextPreviewTabIndex } from './grouped-preview-keyboard'

describe('getNextPreviewTabIndex', () => {
  it('wraps between preview tabs', () => {
    expect(getNextPreviewTabIndex({
      currentIndex: 2,
      tabCount: 3,
      direction: 'next',
    })).toBe(0)
    expect(getNextPreviewTabIndex({
      currentIndex: 0,
      tabCount: 3,
      direction: 'previous',
    })).toBe(2)
  })

  it('supports first and last tab jumps', () => {
    expect(getNextPreviewTabIndex({
      currentIndex: 1,
      tabCount: 3,
      direction: 'first',
    })).toBe(0)
    expect(getNextPreviewTabIndex({
      currentIndex: 1,
      tabCount: 3,
      direction: 'last',
    })).toBe(2)
  })

  it('returns no active tab for empty lists', () => {
    expect(getNextPreviewTabIndex({
      currentIndex: -1,
      tabCount: 0,
      direction: 'next',
    })).toBe(-1)
  })
})
