import { useCallback, useEffect, useRef, useState } from 'react'
import { ZoomOutIcon, ZoomInIcon, RotateIcon, FitToWindowIcon } from '@/icons'

const ZOOM_STEP = 0.1
const MIN_ZOOM = 0.1
const MAX_ZOOM = 5

export type ImagePreviewProps = {
  src: string
  alt: string
}

export function ImagePreview({ src, alt }: ImagePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 })
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 })

  const fitToWindow = useCallback(() => {
    const container = containerRef.current
    if (!container || !naturalSize.w || !naturalSize.h) return

    const containerW = container.clientWidth - 32
    const containerH = container.clientHeight - 32
    const scaleW = containerW / naturalSize.w
    const scaleH = containerH / naturalSize.h
    const fitZoom = Math.min(scaleW, scaleH, 1)
    setZoom(fitZoom)
    setPosition({ x: 0, y: 0 })
  }, [naturalSize])

  const handleImageLoad = useCallback(() => {
    const img = imageRef.current
    if (!img) return
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
  }, [])

  // Fit to window on first load and when natural size is determined
  useEffect(() => {
    if (naturalSize.w > 0 && naturalSize.h > 0) {
      fitToWindow()
    }
  }, [naturalSize, fitToWindow])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setZoom(prev => {
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
      return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev + delta))
    })
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    setIsDragging(true)
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    }
  }, [position])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y
      setPosition({
        x: dragStart.current.posX + dx,
        y: dragStart.current.posY + dy,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const zoomPercent = Math.round(zoom * 100)

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-muted"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Image */}
      <div className="flex h-full w-full items-center justify-center">
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          draggable={false}
          onLoad={handleImageLoad}
          className="max-h-none max-w-none select-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
          }}
        />
      </div>

      {/* Floating toolbar */}
      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg border border-border bg-card/90 px-1.5 py-1 shadow-sm backdrop-blur-sm">
        <button
          onClick={() => setZoom(prev => Math.max(MIN_ZOOM, prev - ZOOM_STEP))}
          className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Zoom out"
        >
          <ZoomOutIcon className="h-4 w-4" />
        </button>
        <span className="min-w-[40px] select-none text-center text-xs font-medium text-muted-foreground">
          {zoomPercent}%
        </span>
        <button
          onClick={() => setZoom(prev => Math.min(MAX_ZOOM, prev + ZOOM_STEP))}
          className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Zoom in"
        >
          <ZoomInIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => setRotation(prev => (prev + 90) % 360)}
          className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Rotate"
        >
          <RotateIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            fitToWindow()
            setRotation(0)
          }}
          className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Fit to window"
        >
          <FitToWindowIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
