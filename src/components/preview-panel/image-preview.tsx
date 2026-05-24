import { ZoomOutIcon, ZoomInIcon, RotateIcon, FitToWindowIcon } from '@/icons'
import type { FinderLocale } from '@/locale'
import { useImagePreview } from './use-image-preview'

export type ImagePreviewProps = {
  src: string
  alt: string
  locale: FinderLocale
}

export function ImagePreview({ src, alt, locale }: ImagePreviewProps) {
  const {
    containerRef,
    imageRef,
    imageStyle,
    cursor,
    zoomPercent,
    handleImageLoad,
    handleWheel,
    handleMouseDown,
    zoomOut,
    zoomIn,
    rotate,
    resetToWindow,
  } = useImagePreview()

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-muted"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      style={{ cursor }}
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
          style={imageStyle}
        />
      </div>

      {/* Floating toolbar */}
      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg border border-border bg-card/90 px-1.5 py-1 shadow-sm backdrop-blur-sm">
        <button
          onClick={zoomOut}
          className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title={locale.zoomOut}
        >
          <ZoomOutIcon className="h-4 w-4" />
        </button>
        <span className="min-w-[40px] select-none text-center text-xs font-medium text-muted-foreground">
          {zoomPercent}%
        </span>
        <button
          onClick={zoomIn}
          className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title={locale.zoomIn}
        >
          <ZoomInIcon className="h-4 w-4" />
        </button>
        <button
          onClick={rotate}
          className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title={locale.rotate}
        >
          <RotateIcon className="h-4 w-4" />
        </button>
        <button
          onClick={resetToWindow}
          className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title={locale.fitToWindow}
        >
          <FitToWindowIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
