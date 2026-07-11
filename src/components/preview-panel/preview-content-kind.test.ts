import { describe, expect, it } from 'vitest'
import type { PreviewWindow } from '@/types'
import { getPreviewActionState } from './preview-action-state'
import { getPreviewContentKind } from './preview-content-kind'

const createPreview = (
  name: string,
  overrides: Partial<PreviewWindow> = {},
): PreviewWindow => ({
  path: `/${name}`,
  name,
  size: 100,
  content: 'original',
  draftContent: 'original',
  isLoading: false,
  isSaving: false,
  isEditing: false,
  ...overrides,
})

describe('getPreviewContentKind', () => {
  it.each([
    ['photo.JPG', 'image'],
    ['clip.mp4', 'video'],
    ['song.mp3', 'audio'],
    ['report.pdf', 'pdf'],
    ['data.csv', 'csv'],
    ['notes.md', 'markdown'],
    ['page.html', 'html'],
    ['script.ts', 'code'],
    ['README', 'text'],
  ] as const)('classifies %s as %s', (name, kind) => {
    expect(getPreviewContentKind(createPreview(name)).kind).toBe(kind)
  })

  it('classifies files by mime type when the name has no extension', () => {
    expect(getPreviewContentKind(createPreview('pasted-image', { mimeType: 'image/png' })).kind).toBe('image')
    expect(getPreviewContentKind(createPreview('pasted-video', { mimeType: 'video/mp4' })).kind).toBe('video')
    expect(getPreviewContentKind(createPreview('pasted-audio', { mimeType: 'audio/mpeg' })).kind).toBe('audio')
    expect(getPreviewContentKind(createPreview('pasted-pdf', { mimeType: 'application/pdf' })).kind).toBe('pdf')
    expect(getPreviewContentKind(createPreview('pasted-markdown', { mimeType: 'text/markdown' })).kind).toBe('markdown')
    expect(getPreviewContentKind(createPreview('pasted-html', { mimeType: 'text/html' })).kind).toBe('html')
    expect(getPreviewContentKind(createPreview('pasted-json', { mimeType: 'application/json' })).kind).toBe('code')
    expect(getPreviewContentKind(createPreview('pasted-csv', { mimeType: 'text/csv' })).kind).toBe('csv')
  })

  it('uses the code editor kind while markdown or html files are being edited', () => {
    expect(getPreviewContentKind(createPreview('notes.md', { isEditing: true }))).toEqual({
      kind: 'code',
      extension: 'md',
    })
    expect(getPreviewContentKind(createPreview('page.html', { isEditing: true }))).toEqual({
      kind: 'code',
      extension: 'html',
    })
  })
})

describe('getPreviewActionState', () => {
  it('shows save for editable markdown/html files only in edit mode', () => {
    const preview = createPreview('notes.md', {
      content: 'original',
      draftContent: 'changed',
      isEditing: true,
    })

    expect(getPreviewActionState(preview, true)).toMatchObject({
      isEditMode: true,
      isEditableFile: true,
      shouldShowSave: true,
      canSave: true,
    })
  })

  it('blocks save while configured loading guard is active', () => {
    const preview = createPreview('config.json', {
      content: 'original',
      draftContent: 'changed',
      isLoading: true,
    })

    expect(getPreviewActionState(preview, true, { blockSaveWhileLoading: true }).canSave).toBe(false)
  })
})
