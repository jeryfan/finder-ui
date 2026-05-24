import {
  Download,
  Maximize2Icon,
  RefreshCwIcon,
  X,
} from "lucide-react";
import type { FinderLocale } from "@/locale";
import type { PreviewWindow } from "@/types";
import { getPreviewActionState } from "./preview-action-state";
import { PreviewEditButton, PreviewSaveButton } from "./preview-controls";

export type PreviewTitleActionsProps = {
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

export function PreviewTitleActions({
  preview,
  updateEnabled,
  locale,
  onDownloadPreview,
  onSave,
  onRefresh,
  onMaximize,
  onClose,
  onSetEditing,
}: PreviewTitleActionsProps) {
  const { isPreviewMode, isEditMode, canSave, shouldShowSave } =
    getPreviewActionState(preview, updateEnabled);

  return (
    <div className="flex shrink-0 items-center gap-1">
      {onDownloadPreview && (
        <button
          onClick={() => void onDownloadPreview(preview.path)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title={locale.download}
        >
          <Download className="h-3.5 w-3.5" />
        </button>
      )}
      {updateEnabled && isPreviewMode && (
        <PreviewEditButton
          mode="edit"
          locale={locale}
          onClick={() => onSetEditing(preview.path, true)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          iconClassName="h-3.5 w-3.5"
        />
      )}
      {updateEnabled && isEditMode && (
        <PreviewEditButton
          mode="preview"
          locale={locale}
          onClick={() => onSetEditing(preview.path, false)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          iconClassName="h-3.5 w-3.5"
        />
      )}
      {shouldShowSave && (
        <PreviewSaveButton
          preview={preview}
          canSave={canSave}
          locale={locale}
          onClick={() => onSave(preview)}
          className={`flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors ${
            preview.isSaving
              ? "pointer-events-none"
              : canSave
                ? "hover:bg-muted hover:text-foreground"
                : "cursor-not-allowed opacity-50"
          }`}
          iconClassName="h-3.5 w-3.5"
        />
      )}
      <button
        onClick={() => onRefresh(preview.path)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title={locale.refresh}
      >
        <RefreshCwIcon className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => onMaximize(preview.path)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title={locale.switchToGroupedMode}
      >
        <Maximize2Icon className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => onClose(preview.path)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title={locale.close}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
