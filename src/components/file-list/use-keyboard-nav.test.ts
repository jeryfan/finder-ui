import { describe, expect, it } from 'vitest'
import { shouldIgnoreKeyboardNavigation } from './use-keyboard-nav'

describe('shouldIgnoreKeyboardNavigation', () => {
  it('handles keyboard events from the file list container', () => {
    const container = document.createElement('div')
    const option = document.createElement('button')
    container.appendChild(option)

    expect(shouldIgnoreKeyboardNavigation(option, container)).toBe(false)
  })

  it('ignores events from editable controls inside the file list', () => {
    const container = document.createElement('div')
    const input = document.createElement('input')
    const editable = document.createElement('div')
    editable.contentEditable = 'true'
    container.append(input, editable)

    expect(shouldIgnoreKeyboardNavigation(input, container)).toBe(true)
    expect(shouldIgnoreKeyboardNavigation(editable, container)).toBe(true)
  })

  it('ignores events outside the file list container', () => {
    const container = document.createElement('div')
    const previewEditor = document.createElement('div')
    previewEditor.contentEditable = 'true'

    expect(shouldIgnoreKeyboardNavigation(previewEditor, container)).toBe(true)
  })
})
