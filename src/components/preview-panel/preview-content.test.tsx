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

const waitFor = async (assertion: () => void) => {
  let lastError: unknown
  for (let i = 0; i < 10; i += 1) {
    try {
      assertion()
      return
    } catch (error) {
      lastError = error
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0))
      })
    }
  }
  throw lastError
}

describe('PreviewContent', () => {
  it('does not expose a resolvable url before text content finishes loading', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const root = createRoot(host)
    const contentUrl = `data:text/markdown;charset=utf-8,${encodeURIComponent('# URL markdown')}`

    await act(async () => {
      root.render(
        <PreviewContent
          preview={createPreview('notes.md', {
            content: contentUrl,
            draftContent: contentUrl,
            mimeType: 'text/markdown',
          })}
          locale={enLocale}
          renderMarkdown={(content) => <div data-testid="markdown-content">{content}</div>}
        />,
      )
    })

    expect(host.textContent).not.toContain(contentUrl)

    await act(async () => {
      root.unmount()
    })
    host.remove()
  })

  it('resolves url content with surrounding whitespace for text based previews', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const root = createRoot(host)
    const contentUrl = `data:text/markdown;charset=utf-8,${encodeURIComponent('# Trimmed URL markdown')}`

    await act(async () => {
      root.render(
        <PreviewContent
          preview={createPreview('notes.md', {
            content: `\n${contentUrl}\n`,
            draftContent: `\n${contentUrl}\n`,
            mimeType: 'text/markdown',
          })}
          locale={enLocale}
          renderMarkdown={(content) => <div data-testid="markdown-content">{content}</div>}
        />,
      )
    })

    await waitFor(() => {
      expect(host.textContent).toContain('# Trimmed URL markdown')
    })

    await act(async () => {
      root.unmount()
    })
    host.remove()
  })

  it('resolves url content for text based previews', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const root = createRoot(host)
    const contentUrl = `data:text/markdown;charset=utf-8,${encodeURIComponent('# URL markdown')}`

    await act(async () => {
      root.render(
        <PreviewContent
          preview={createPreview('notes.md', {
            content: contentUrl,
            draftContent: contentUrl,
            mimeType: 'text/markdown',
          })}
          locale={enLocale}
          renderMarkdown={(content) => <div data-testid="markdown-content">{content}</div>}
        />,
      )
    })

    await waitFor(() => {
      expect(host.textContent).toContain('# URL markdown')
    })
    await act(async () => {
      root.unmount()
    })
    host.remove()
  })

  it('allows scripts in html previews by default', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const root = createRoot(host)

    await act(async () => {
      root.render(
        <PreviewContent
          preview={createPreview('page.html', {
            content: '<button onclick="window.clicked = true">Click</button>',
            draftContent: '<button onclick="window.clicked = true">Click</button>',
            mimeType: 'text/html',
          })}
          locale={enLocale}
        />,
      )
    })

    expect(host.querySelector('iframe')?.getAttribute('sandbox')).toBe('allow-same-origin allow-scripts')

    await act(async () => {
      root.unmount()
    })
    host.remove()
  })

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
