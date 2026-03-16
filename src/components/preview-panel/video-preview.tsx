export type VideoPreviewProps = {
  src: string
}

export function VideoPreview({ src }: VideoPreviewProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-white">
      <video
        src={src}
        controls
        className="max-h-full max-w-full"
        style={{ outline: 'none' }}
      />
    </div>
  )
}
