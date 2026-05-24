import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { PreviewWindow } from '@/types'
import { downloadPreviewContent } from './download-preview'

const createPreview = (name: string, content: string): PreviewWindow => ({
  path: `/${name}`,
  name,
  size: content.length,
  content,
  draftContent: content,
  isLoading: false,
  isSaving: false,
  isEditing: false,
})

describe('downloadPreviewContent', () => {
  const originalCreateObjectURL = URL.createObjectURL
  const originalRevokeObjectURL = URL.revokeObjectURL

  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:generated')
    URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('downloads media previews from their existing object URL', () => {
    downloadPreviewContent(createPreview('clip.mp4', 'blob:existing'))

    expect(URL.createObjectURL).not.toHaveBeenCalled()
    expect(URL.revokeObjectURL).not.toHaveBeenCalled()
  })

  it('downloads text previews from draft content', () => {
    const preview = createPreview('README.md', 'original')
    preview.draftContent = 'changed'

    downloadPreviewContent(preview)

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:generated')
  })
})
