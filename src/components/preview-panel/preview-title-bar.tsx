import { getFileIcon } from "@/utils/file-icons";
import type { PreviewWindow } from "@/types";
import type { FinderLocale } from "@/locale";
import { PreviewTitleActions } from "./preview-title-actions";

export type PreviewTitleBarProps = {
  preview: PreviewWindow;
  updateEnabled: boolean;
  locale: FinderLocale;
  onDownloadPreview?: (path: string) => void | Promise<void>;
  onSave: (preview: PreviewWindow) => void;
  onRefresh: (path: string) => void;
  onMaximize: (path: string) => void;
  onClose: (path: string) => void;
  onSetEditing: (path: string, isEditing: boolean) => void;
};

export function PreviewTitleBar({
  preview,
  updateEnabled,
  locale,
  onDownloadPreview,
  onSave,
  onRefresh,
  onMaximize,
  onClose,
  onSetEditing,
}: PreviewTitleBarProps) {
  return (
    <div className="flex h-10 cursor-default items-center gap-2 border-b border-border bg-card px-3">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {getFileIcon(preview, "h-3.5 w-3.5 shrink-0")}
        <span className="truncate text-sm font-medium text-foreground">
          {preview.name}
        </span>
      </div>
      <PreviewTitleActions
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
    </div>
  );
}
