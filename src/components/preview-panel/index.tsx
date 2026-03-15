import { useMemo } from 'react'
import { useFinderStore, useFinderStoreApi } from '@/store'
import type { PreviewWindow } from '@/types'
import { PREVIEW_GAP, GROUPED_PREVIEW_GAP } from './constants'
import { SplitMode } from './split-mode'
import { GroupedMode } from './grouped-mode'

export { getPreviewLeftPaneWidth } from './constants'

export type PreviewPanelProps = {
  leftPaneWidth: number
  renderMarkdown?: (content: string) => React.ReactNode
  onDownloadPreview?: (path: string) => void | Promise<void>
}

export function PreviewPanel({
  leftPaneWidth,
  renderMarkdown,
  onDownloadPreview,
}: PreviewPanelProps) {
  const {
    previews,
    activePreviewPath,
    previewMode,
    updateEnabled,
    setActivePreviewPath,
    setPreviewMode,
    closePreview,
    updatePreviewDraft,
    setPreviewEditing,
    setPreviewSaving,
    refreshPreview,
    onSavePreview,
  } = useFinderStore()

  const storeApi = useFinderStoreApi()

  const activePreview = useMemo(
    () => previews.find(item => item.path === activePreviewPath) ?? previews[previews.length - 1] ?? null,
    [activePreviewPath, previews],
  )

  const groupedMode = previewMode === 'grouped' && previews.length > 0
  const previewLeft = leftPaneWidth + (groupedMode ? GROUPED_PREVIEW_GAP : PREVIEW_GAP)

  const handleSave = async (preview: PreviewWindow) => {
    if (!updateEnabled) return
    setPreviewSaving(preview.path, true)
    try {
      await onSavePreview(preview.path, preview.draftContent)
      refreshPreview(preview.path, preview.draftContent)
    } catch (err) {
      storeApi.getState().setPreviewError(
        preview.path,
        err instanceof Error ? err.message : 'Failed to save file',
      )
    } finally {
      setPreviewSaving(preview.path, false)
    }
  }

  const handleRefresh = (_path: string) => {
    storeApi.getState().onRefresh()
  }

  const handleMaximize = (path: string) => {
    setActivePreviewPath(path)
    setPreviewMode('grouped')
  }

  if (!previews.length) return null

  return (
    <>
      {!groupedMode && (
        <SplitMode
          previews={previews}
          previewLeft={previewLeft}
          updateEnabled={updateEnabled}
          renderMarkdown={renderMarkdown}
          onDownloadPreview={onDownloadPreview}
          onSave={(p) => void handleSave(p)}
          onRefresh={handleRefresh}
          onMaximize={handleMaximize}
          onClose={closePreview}
          onSetEditing={setPreviewEditing}
          onDraftChange={updatePreviewDraft}
        />
      )}
      {groupedMode && activePreview && (
        <GroupedMode
          previews={previews}
          activePreview={activePreview}
          activePreviewPath={activePreviewPath}
          previewLeft={previewLeft}
          updateEnabled={updateEnabled}
          renderMarkdown={renderMarkdown}
          onSave={(p) => void handleSave(p)}
          onRefresh={handleRefresh}
          onClose={closePreview}
          onSetEditing={setPreviewEditing}
          onDraftChange={updatePreviewDraft}
          onSetActivePreviewPath={setActivePreviewPath}
          onSetPreviewMode={setPreviewMode}
        />
      )}
    </>
  )
}
