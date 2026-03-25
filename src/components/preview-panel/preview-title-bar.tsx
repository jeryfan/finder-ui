import { isMarkdownFile, isHtmlFile, isImageFile, isVideoFile } from "@/utils";
import { getFileIcon } from "@/utils/file-icons";
import type { PreviewWindow } from "@/types";
import {
  Download,
  Eye,
  Loader2,
  Maximize2Icon,
  PenLine,
  RefreshCwIcon,
  Save,
  X,
} from "lucide-react";

export type PreviewTitleBarProps = {
  preview: PreviewWindow;
  updateEnabled: boolean;
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
  onDownloadPreview,
  onSave,
  onRefresh,
  onMaximize,
  onClose,
  onSetEditing,
}: PreviewTitleBarProps) {
  const isMarkdown = isMarkdownFile(preview.name);
  const isHtml = isHtmlFile(preview.name);
  const isImage = isImageFile(preview.name);
  const isVideo = isVideoFile(preview.name);
  const isPreviewable = isMarkdown || isHtml;
  const isPreviewMode = isPreviewable && !preview.isEditing;
  const isEditMode = isPreviewable && preview.isEditing;
  const hasChanges = preview.draftContent !== preview.content;
  const canSave = updateEnabled && hasChanges && !preview.isSaving;

  return (
    <div className="flex h-10 cursor-default items-center gap-2 border-b border-border bg-card px-3">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {getFileIcon(preview, "h-3.5 w-3.5 shrink-0")}
        <span className="truncate text-sm font-medium text-foreground">
          {preview.name}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {onDownloadPreview && (
          <button
            onClick={() => void onDownloadPreview(preview.path)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Download"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        )}
        {updateEnabled && isPreviewMode && (
          <button
            onClick={() => onSetEditing(preview.path, true)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Edit"
          >
            <PenLine className="h-3.5 w-3.5" />
          </button>
        )}
        {updateEnabled && isEditMode && (
          <button
            onClick={() => onSetEditing(preview.path, false)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Preview"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        )}
        {updateEnabled &&
          (isEditMode || (!isPreviewable && !isImage && !isVideo)) && (
            <button
              onClick={() => onSave(preview)}
              className={`flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors ${
                preview.isSaving
                  ? "pointer-events-none"
                  : canSave
                    ? "hover:bg-muted hover:text-foreground"
                    : "cursor-not-allowed opacity-50"
              }`}
              disabled={!canSave && !preview.isSaving}
              title="Save"
            >
              {preview.isSaving ? (
                <Loader2 className="h-3.5 w-3.5" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        <button
          onClick={() => onRefresh(preview.path)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Refresh"
        >
          <RefreshCwIcon className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onMaximize(preview.path)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Switch to grouped mode"
        >
          <Maximize2Icon className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onClose(preview.path)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
