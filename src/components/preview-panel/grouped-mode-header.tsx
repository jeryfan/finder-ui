import { Minimize2, Plus, RefreshCwIcon, X } from "lucide-react";
import type { FinderLocale } from "@/locale";
import type { FileEntry, PreviewWindow } from "@/types";
import { cn } from "@/utils";
import { getFileIcon } from "@/utils/file-icons";
import { getPreviewActionState } from "./preview-action-state";
import { PreviewEditButton, PreviewSaveButton } from "./preview-controls";

export type GroupedPreviewTabsProps = {
  tabsRef: React.RefObject<HTMLDivElement | null>;
  previews: PreviewWindow[];
  activePreview: PreviewWindow;
  updateEnabled: boolean;
  locale: FinderLocale;
  onSave: (preview: PreviewWindow) => void;
  onClose: (path: string) => void;
  onSetEditing: (path: string, isEditing: boolean) => void;
  onSetActivePreviewPath: (path: string) => void;
};

export function GroupedPreviewTabs({
  tabsRef,
  previews,
  activePreview,
  updateEnabled,
  locale,
  onSave,
  onClose,
  onSetEditing,
  onSetActivePreviewPath,
}: GroupedPreviewTabsProps) {
  return (
    <div
      ref={tabsRef}
      className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto overflow-y-hidden whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {previews.map((preview) => {
        const isActiveTab = activePreview.path === preview.path;
        const { isPreviewMode, isEditMode, canSave, shouldShowSave } =
          getPreviewActionState(preview, updateEnabled, {
            blockSaveWhileLoading: true,
          });

        return (
          <div
            key={`tab-${preview.path}`}
            data-preview-tab-path={preview.path}
            className={cn(
              "group flex h-7 shrink-0 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors",
              isActiveTab
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            <button
              onClick={() => onSetActivePreviewPath(preview.path)}
              className="flex min-w-0 flex-1 items-center gap-1.5"
              title={preview.name}
            >
              {getFileIcon(preview, "h-3.5 w-3.5 shrink-0")}
              <span className="max-w-[100px] truncate">{preview.name}</span>
            </button>
            {isActiveTab && updateEnabled && isPreviewMode && (
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
            {isActiveTab && updateEnabled && isEditMode && (
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
            {isActiveTab && shouldShowSave && !isEditMode && (
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
                isActiveTab
                  ? "opacity-50 hover:opacity-100"
                  : "opacity-0 group-hover:opacity-100",
              )}
              title={locale.close}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export type GroupedPreviewToolbarProps = {
  addMenuRef: React.RefObject<HTMLDivElement | null>;
  addMenuOpen: boolean;
  activePreview: PreviewWindow;
  availableFiles: FileEntry[];
  locale: FinderLocale;
  onToggleAddMenu: () => void;
  onCloseAddMenu: () => void;
  onRefresh: (path: string) => void;
  onSetPreviewMode: (mode: "split" | "grouped") => void;
  onOpenFile: (file: FileEntry) => void;
};

export function GroupedPreviewToolbar({
  addMenuRef,
  addMenuOpen,
  activePreview,
  availableFiles,
  locale,
  onToggleAddMenu,
  onCloseAddMenu,
  onRefresh,
  onSetPreviewMode,
  onOpenFile,
}: GroupedPreviewToolbarProps) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <div className="relative" ref={addMenuRef}>
        <button
          onClick={onToggleAddMenu}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title={locale.addFile}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
        {addMenuOpen && (
          <div className="absolute right-0 top-full z-50 mt-1 max-h-60 min-w-[180px] overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-lg">
            {availableFiles.length === 0 ? (
              <div className="px-3 py-2 text-xs text-muted-foreground">
                {locale.noFilesAvailable}
              </div>
            ) : (
              availableFiles.map((file) => (
                <button
                  key={file.path}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted"
                  onClick={() => {
                    onOpenFile(file);
                    onCloseAddMenu();
                  }}
                >
                  {getFileIcon(file, "h-3.5 w-3.5 shrink-0")}
                  <span className="truncate">{file.name}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
      <button
        onClick={() => onRefresh(activePreview.path)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
        title={locale.refresh}
      >
        <RefreshCwIcon className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => onSetPreviewMode("split")}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title={locale.ungroupWindows}
      >
        <Minimize2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
