import { useEffect } from 'react'
import type { RefObject } from 'react'

type UseContextMenuLayerOptions = {
  isOpen: boolean
  x: number
  y: number
  menuRef: RefObject<HTMLDivElement | null>
  onClose: () => void
}

export function useContextMenuLayer({
  isOpen,
  x,
  y,
  menuRef,
  onClose,
}: UseContextMenuLayerOptions) {
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-context-menu="true"]')) {
        onClose()
      }
    }

    document.addEventListener('click', handleClickOutside, true)
    document.addEventListener('contextmenu', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
      document.removeEventListener('contextmenu', handleClickOutside, true)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen || !menuRef.current) return

    const rect = menuRef.current.getBoundingClientRect()
    const adjustedX =
      x + rect.width > window.innerWidth ? window.innerWidth - rect.width - 4 : x
    const adjustedY =
      y + rect.height > window.innerHeight
        ? window.innerHeight - rect.height - 4
        : y

    if (adjustedX !== x || adjustedY !== y) {
      menuRef.current.style.left = `${Math.max(0, adjustedX)}px`
      menuRef.current.style.top = `${Math.max(0, adjustedY)}px`
    }
  }, [isOpen, menuRef, x, y])

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => menuRef.current?.focus())
    }
  }, [isOpen, menuRef])

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])
}
