import { PREVIEW_TOP_INSET, PREVIEW_BOTTOM_INSET, PREVIEW_GAP } from './constants'
import { PreviewTitleBar } from './preview-title-bar'
import { PreviewBody } from './preview-body'
import type { PreviewWindow } from '@/types'

export type SplitModeProps = {
  previews: PreviewWindow[]
  previewLeft: number
  updateEnabled: boolean
  renderMarkdown?: (content: string) => React.ReactNode
  onDownloadPreview?: (path: string) => void | Promise<void>
  onSave: (preview: PreviewWindow) => void
  onRefresh: (path: string) => void
  onMaximize: (path: string) => void
  onClose: (path: string) => void
  onSetEditing: (path: string, isEditing: boolean) => void
  onDraftChange: (path: string, content: string) => void
}

export function SplitMode({
  previews,
  previewLeft,
  updateEnabled,
  renderMarkdown,
  onDownloadPreview,
  onSave,
  onRefresh,
  onMaximize,
  onClose,
  onSetEditing,
  onDraftChange,
}: SplitModeProps) {
  const splitPreviewColumns = previews.length >= 3 ? 2 : 1
  const splitPreviewRows = Math.ceil(Math.max(1, previews.length) / splitPreviewColumns)

  return (
    <div
      className="absolute grid"
      style={{
        left: `${previewLeft}px`,
        right: '0px',
        top: `${PREVIEW_TOP_INSET}px`,
        bottom: `${PREVIEW_BOTTOM_INSET}px`,
        gap: `${PREVIEW_GAP}px`,
        gridTemplateColumns: `repeat(${splitPreviewColumns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${splitPreviewRows}, minmax(0, 1fr))`,
      }}
    >
      {previews.map((preview) => (
        <div
          key={preview.path}
          className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#EAE9E6] bg-white"
        >
          <PreviewTitleBar
            preview={preview}
            updateEnabled={updateEnabled}
            onDownloadPreview={onDownloadPreview}
            onSave={onSave}
            onRefresh={onRefresh}
            onMaximize={onMaximize}
            onClose={onClose}
            onSetEditing={onSetEditing}
          />
          <div className="min-h-0 flex-1 select-text overflow-hidden bg-white outline-none">
            <PreviewBody
              preview={preview}
              updateEnabled={updateEnabled}
              renderMarkdown={renderMarkdown}
              onDraftChange={onDraftChange}
              onRefresh={onRefresh}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
