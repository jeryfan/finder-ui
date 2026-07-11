import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import { PreviewContent } from '@/index'
import { enLocale } from '@/locale/en'
import type { PreviewWindow } from '@/types'

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true

const createPreview = (
  name: string,
  overrides: Partial<PreviewWindow> = {},
): PreviewWindow => ({
  path: `/${name}`,
  name,
  size: 100,
  content: 'original content',
  draftContent: 'draft content',
  isLoading: false,
  isSaving: false,
  isEditing: false,
  ...overrides,
})

describe('PreviewContent', () => {
  it('is exported as a standalone preview renderer', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const root = createRoot(host)

    await act(async () => {
      root.render(
        <PreviewContent
          preview={createPreview('README')}
          updateEnabled={false}
          locale={enLocale}
          onDraftChange={() => {}}
          onRefresh={() => {}}
        />,
      )
    })

    expect(host.querySelector('textarea')?.value).toBe('draft content')

    await act(async () => {
      root.unmount()
    })
    host.remove()
  })
})
