import type { FinderLocale } from "@/locale";
import type { PreviewWindow } from "@/types";
import { PreviewBody } from "./preview-body";
import { PreviewTitleBar } from "./preview-title-bar";

export type SplitPreviewWindowProps = {
  preview: PreviewWindow;
  updateEnabled: boolean;
  locale: FinderLocale;
  renderMarkdown?: (content: string) => React.ReactNode;
  onDownloadPreview?: (path: string) => void | Promise<void>;
  onSave: (preview: PreviewWindow) => void;
  onRefresh: (path: string) => void;
  onMaximize: (path: string) => void;
  onClose: (path: string) => void;
  onSetEditing: (path: string, isEditing: boolean) => void;
  onDraftChange: (path: string, content: string) => void;
};

export function SplitPreviewWindow({
  preview,
  updateEnabled,
  locale,
  renderMarkdown,
  onDownloadPreview,
  onSave,
  onRefresh,
  onMaximize,
  onClose,
  onSetEditing,
  onDraftChange,
}: SplitPreviewWindowProps) {
  return (
    <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <PreviewTitleBar
        preview={preview}
        updateEnabled={updateEnabled}
        locale={locale}
        onDownloadPreview={onDownloadPreview}
        onSave={onSave}
        onRefresh={onRefresh}
        onMaximize={onMaximize}
        onClose={onClose}
        onSetEditing={onSetEditing}
      />
      <div className="min-h-0 flex-1 select-text overflow-hidden bg-card outline-none">
        <PreviewBody
          preview={preview}
          updateEnabled={updateEnabled}
          locale={locale}
          renderMarkdown={renderMarkdown}
          onDraftChange={onDraftChange}
          onRefresh={onRefresh}
        />
      </div>
    </div>
  );
}
