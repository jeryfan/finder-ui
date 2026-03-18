import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  cn,
  extractExtension,
  isMarkdownFile,
  isCodeFile,
  isImageFile,
  isVideoFile,
  formatDateTimeEN,
  formatFileSize,
} from '../index'

describe('cn', () => {
  it('joins multiple class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('filters out falsy values', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b')
  })

  it('returns empty string when all values are falsy', () => {
    expect(cn(false, null, undefined)).toBe('')
  })
})

describe('extractExtension', () => {
  it('extracts normal extension', () => {
    expect(extractExtension('file.txt')).toBe('txt')
  })

  it('extracts last extension from multiple dots', () => {
    expect(extractExtension('archive.tar.gz')).toBe('gz')
  })

  it('returns empty string when no extension', () => {
    expect(extractExtension('Makefile')).toBe('')
  })

  it('returns empty string when name ends with dot', () => {
    expect(extractExtension('file.')).toBe('')
  })

  it('converts extension to lowercase', () => {
    expect(extractExtension('README.MD')).toBe('md')
  })
})

describe('isMarkdownFile', () => {
  it('recognizes .md files', () => {
    expect(isMarkdownFile('readme.md')).toBe(true)
  })

  it('recognizes .markdown files', () => {
    expect(isMarkdownFile('doc.markdown')).toBe(true)
  })

  it('recognizes .mdx files', () => {
    expect(isMarkdownFile('page.mdx')).toBe(true)
  })

  it('rejects non-markdown files', () => {
    expect(isMarkdownFile('file.txt')).toBe(false)
  })
})

describe('isCodeFile', () => {
  it('recognizes .ts files', () => {
    expect(isCodeFile('index.ts')).toBe(true)
  })

  it('recognizes .py files', () => {
    expect(isCodeFile('main.py')).toBe(true)
  })

  it('rejects non-code files', () => {
    expect(isCodeFile('photo.png')).toBe(false)
  })
})

describe('isImageFile', () => {
  it('recognizes .png files', () => {
    expect(isImageFile('photo.png')).toBe(true)
  })

  it('recognizes .jpg files', () => {
    expect(isImageFile('photo.jpg')).toBe(true)
  })

  it('rejects non-image files', () => {
    expect(isImageFile('doc.pdf')).toBe(false)
  })
})

describe('isVideoFile', () => {
  it('recognizes .mp4 files', () => {
    expect(isVideoFile('clip.mp4')).toBe(true)
  })

  it('recognizes .webm files', () => {
    expect(isVideoFile('clip.webm')).toBe(true)
  })

  it('rejects non-video files', () => {
    expect(isVideoFile('song.mp3')).toBe(false)
  })
})

describe('formatDateTimeEN', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "--" for invalid date', () => {
    expect(formatDateTimeEN('not-a-date')).toBe('--')
  })

  it('returns relative time for < 24h ago', () => {
    vi.useFakeTimers()
    const now = new Date('2026-03-18T12:00:00Z')
    vi.setSystemTime(now)

    const threeHoursAgo = new Date('2026-03-18T09:00:00Z').toISOString()
    expect(formatDateTimeEN(threeHoursAgo)).toBe('3 hr ago')
  })

  it('returns "1 hr ago" for less than 1 hour', () => {
    vi.useFakeTimers()
    const now = new Date('2026-03-18T12:00:00Z')
    vi.setSystemTime(now)

    const minutesAgo = new Date('2026-03-18T11:45:00Z').toISOString()
    expect(formatDateTimeEN(minutesAgo)).toBe('1 hr ago')
  })

  it('returns absolute date for > 24h ago', () => {
    vi.useFakeTimers()
    const now = new Date('2026-03-18T12:00:00Z')
    vi.setSystemTime(now)

    const twoDaysAgo = new Date('2026-03-16T10:00:00Z').toISOString()
    const result = formatDateTimeEN(twoDaysAgo)
    expect(result).toContain('Mar')
    expect(result).toContain('16')
    expect(result).toContain('2026')
  })

  it('returns absolute date for future dates', () => {
    vi.useFakeTimers()
    const now = new Date('2026-03-18T12:00:00Z')
    vi.setSystemTime(now)

    const future = new Date('2026-03-20T12:00:00Z').toISOString()
    const result = formatDateTimeEN(future)
    expect(result).toContain('Mar')
    expect(result).toContain('20')
  })
})

describe('formatFileSize', () => {
  it('returns "--" for directories', () => {
    expect(formatFileSize(1024, 'directory')).toBe('--')
  })

  it('returns "0 B" for zero size', () => {
    expect(formatFileSize(0, 'file')).toBe('0 B')
  })

  it('formats bytes', () => {
    expect(formatFileSize(500, 'file')).toBe('500 B')
  })

  it('formats KB', () => {
    expect(formatFileSize(1536, 'file')).toBe('1.5 KB')
  })

  it('formats MB', () => {
    expect(formatFileSize(10 * 1024 * 1024, 'file')).toBe('10 MB')
  })

  it('formats GB', () => {
    expect(formatFileSize(2.5 * 1024 * 1024 * 1024, 'file')).toBe('2.5 GB')
  })

  it('rounds values >= 10 to integer', () => {
    expect(formatFileSize(15 * 1024, 'file')).toBe('15 KB')
  })
})
