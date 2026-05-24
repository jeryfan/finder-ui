import { X } from "lucide-react";
import type { FinderLocale } from "@/locale";
import type { PreviewWindow } from "@/types";
import { cn } from "@/utils";
import { getFileIcon } from "@/utils/file-icons";
import { getPreviewActionState } from "./preview-action-state";
import { PreviewEditButton, PreviewSaveButton } from "./preview-controls";

export type GroupedPreviewTabProps = {
  preview: PreviewWindow;
  active: boolean;
  updateEnabled: boolean;
  locale: FinderLocale;
  onSave: (preview: PreviewWindow) => void;
  onClose: (path: string) => void;
  onSetEditing: (path: string, isEditing: boolean) => void;
  onSetActivePreviewPath: (path: string) => void;
};

export function GroupedPreviewTab({
  preview,
  active,
  updateEnabled,
  locale,
  onSave,
  onClose,
  onSetEditing,
  onSetActivePreviewPath,
}: GroupedPreviewTabProps) {
  const { isPreviewMode, isEditMode, canSave, shouldShowSave } =
    getPreviewActionState(preview, updateEnabled, {
      blockSaveWhileLoading: true,
    });

  return (
    <div
      data-preview-tab-path={preview.path}
      className={cn(
        "group flex h-7 shrink-0 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
      role="presentation"
    >
      <button
        role="tab"
        aria-selected={active}
        tabIndex={active ? 0 : -1}
        onClick={() => onSetActivePreviewPath(preview.path)}
        className="flex min-w-0 flex-1 items-center gap-1.5"
        title={preview.name}
      >
        {getFileIcon(preview, "h-3.5 w-3.5 shrink-0")}
        <span className="max-w-[100px] truncate">{preview.name}</span>
      </button>
      {active && updateEnabled && isPreviewMode && (
        <PreviewEditButton
          mode="edit"
          locale={locale}
          onClick={(event) => {
            event.stopPropagation();
            onSetActivePreviewPath(preview.path);
            onSetEditing(preview.path, true);
          }}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
          iconClassName="h-3.5 w-3.5"
        />
      )}
      {active && updateEnabled && isEditMode && (
        <>
          <PreviewEditButton
            mode="preview"
            locale={locale}
            onClick={(event) => {
              event.stopPropagation();
              onSetEditing(preview.path, false);
            }}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
            iconClassName="h-3.5 w-3.5"
          />
          <PreviewSaveButton
            preview={preview}
            canSave={canSave}
            locale={locale}
            onClick={(event) => {
              event.stopPropagation();
              onSave(preview);
            }}
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors",
              preview.isSaving
                ? "pointer-events-none"
                : canSave
                  ? "hover:text-foreground"
                  : "cursor-not-allowed opacity-50",
            )}
            iconClassName="h-3.5 w-3.5"
          />
        </>
      )}
      {active && shouldShowSave && !isEditMode && (
        <PreviewSaveButton
          preview={preview}
          canSave={canSave}
          locale={locale}
          onClick={(event) => {
            event.stopPropagation();
            onSave(preview);
          }}
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors",
            preview.isSaving
              ? "pointer-events-none"
              : canSave
                ? "hover:text-foreground"
                : "cursor-not-allowed opacity-50",
          )}
          iconClassName="h-3.5 w-3.5"
        />
      )}
      <button
        onClick={(event) => {
          event.stopPropagation();
          onClose(preview.path);
        }}
        className={cn(
          "h-3 w-3 shrink-0 cursor-pointer transition-opacity hover:text-[#DC2626]",
          active
            ? "opacity-50 hover:opacity-100"
            : "opacity-0 group-hover:opacity-100",
        )}
        title={locale.close}
        aria-label={locale.close}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
