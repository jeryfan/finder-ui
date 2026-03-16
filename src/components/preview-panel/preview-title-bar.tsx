import { isMarkdownFile, isImageFile, isVideoFile } from "@/utils";
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
  const isImage = isImageFile(preview.name);
  const isVideo = isVideoFile(preview.name);
  const isMarkdownPreviewMode = isMarkdown && !preview.isEditing;
  const isMarkdownEditMode = isMarkdown && preview.isEditing;
  const hasChanges = preview.draftContent !== preview.content;
  const canSave = updateEnabled && hasChanges && !preview.isSaving;

  return (
    <div className="flex h-10 cursor-default items-center gap-2 border-b border-[#EAE9E6] bg-white px-3">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {getFileIcon(preview, "h-3.5 w-3.5 shrink-0")}
        <span className="truncate text-sm font-medium text-[#2E2929]">
          {preview.name}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {onDownloadPreview && (
          <button
            onClick={() => void onDownloadPreview(preview.path)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F6F5F4] hover:text-[#2E2929]"
            title="Download"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        )}
        {updateEnabled && isMarkdownPreviewMode && (
          <button
            onClick={() => onSetEditing(preview.path, true)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F6F5F4] hover:text-[#2E2929]"
            title="Edit"
          >
            <PenLine className="h-3.5 w-3.5" />
          </button>
        )}
        {updateEnabled && isMarkdownEditMode && (
          <button
            onClick={() => onSetEditing(preview.path, false)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F6F5F4] hover:text-[#2E2929]"
            title="Preview"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        )}
        {updateEnabled &&
          (isMarkdownEditMode || (!isMarkdown && !isImage && !isVideo)) && (
            <button
              onClick={() => onSave(preview)}
              className={`flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors ${
                preview.isSaving
                  ? "pointer-events-none"
                  : canSave
                    ? "hover:bg-[#F6F5F4] hover:text-[#2E2929]"
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
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F6F5F4] hover:text-[#2E2929]"
          title="Refresh"
        >
          <RefreshCwIcon className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onMaximize(preview.path)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F6F5F4] hover:text-[#2E2929]"
          title="Switch to grouped mode"
        >
          <Maximize2Icon className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onClose(preview.path)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F6F5F4] hover:text-[#2E2929]"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
