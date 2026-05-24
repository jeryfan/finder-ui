import { SplitMode } from './split-mode'
import { GroupedMode } from './grouped-mode'
import { usePreviewPanel } from './use-preview-panel'

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
    activePreview,
    groupedMode,
    previewLeft,
    updateEnabled,
    files,
    locale,
    setActivePreviewPath,
    setPreviewMode,
    closePreview,
    updatePreviewDraft,
    setPreviewEditing,
    onOpen,
    handleSave,
    handleRefresh,
    handleMaximize,
  } = usePreviewPanel(leftPaneWidth)

  if (!previews.length) return null

  return (
    <>
      {!groupedMode && (
        <SplitMode
          previews={previews}
          previewLeft={previewLeft}
          updateEnabled={updateEnabled}
          locale={locale}
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
          locale={locale}
          files={files}
          renderMarkdown={renderMarkdown}
          onSave={(p) => void handleSave(p)}
          onRefresh={handleRefresh}
          onClose={closePreview}
          onSetEditing={setPreviewEditing}
          onDraftChange={updatePreviewDraft}
          onSetActivePreviewPath={setActivePreviewPath}
          onSetPreviewMode={setPreviewMode}
          onOpenFile={onOpen}
        />
      )}
    </>
  )
}
