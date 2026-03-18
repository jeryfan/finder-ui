import { useEffect, useRef, useState } from "react";
import { cn, isMarkdownFile, isImageFile, isVideoFile } from "@/utils";
import { getFileIcon } from "@/utils/file-icons";
import { PREVIEW_TOP_INSET, PREVIEW_BOTTOM_INSET } from "./constants";
import { PreviewBody } from "./preview-body";
import type { PreviewWindow, FileEntry } from "@/types";
import {
  Eye,
  Loader2,
  Minimize2,
  PenLine,
  Plus,
  RefreshCwIcon,
  Save,
  X,
} from "lucide-react";

export type GroupedModeProps = {
  previews: PreviewWindow[];
  activePreview: PreviewWindow;
  activePreviewPath: string | null;
  previewLeft: number;
  updateEnabled: boolean;
  files: FileEntry[];
  renderMarkdown?: (content: string) => React.ReactNode;
  onSave: (preview: PreviewWindow) => void;
  onRefresh: (path: string) => void;
  onClose: (path: string) => void;
  onSetEditing: (path: string, isEditing: boolean) => void;
  onDraftChange: (path: string, content: string) => void;
  onSetActivePreviewPath: (path: string) => void;
  onSetPreviewMode: (mode: "split" | "grouped") => void;
  onOpenFile: (file: FileEntry) => void;
};

export function GroupedMode({
  previews,
  activePreview,
  activePreviewPath,
  previewLeft,
  updateEnabled,
  files,
  renderMarkdown,
  onSave,
  onRefresh,
  onClose,
  onSetEditing,
  onDraftChange,
  onSetActivePreviewPath,
  onSetPreviewMode,
  onOpenFile,
}: GroupedModeProps) {
  const groupedTabsRef = useRef<HTMLDivElement | null>(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const addMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (previews.length === 0 || !activePreviewPath || !groupedTabsRef.current)
      return;
    const activeTab = Array.from(
      groupedTabsRef.current.querySelectorAll<HTMLElement>(
        "[data-preview-tab-path]",
      ),
    ).find((element) => element.dataset.previewTabPath === activePreviewPath);
    if (!activeTab) return;
    activeTab.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [activePreviewPath, previews.length]);

  useEffect(() => {
    if (!addMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        addMenuRef.current &&
        !addMenuRef.current.contains(e.target as Node)
      ) {
        setAddMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [addMenuOpen]);

  const handleSave = (preview: PreviewWindow) => {
    onSave(preview);
  };

  const openPaths = new Set(previews.map((p) => p.path));
  const availableFiles = files.filter(
    (f) => f.type === "file" && !openPaths.has(f.path),
  );

  return (
    <div
      className="absolute flex flex-col"
      style={{
        left: `${previewLeft}px`,
        right: "0px",
        top: `${PREVIEW_TOP_INSET}px`,
        bottom: `${PREVIEW_BOTTOM_INSET}px`,
      }}
    >
      {/* Tabs */}
      <div className="flex h-10 items-center gap-2 rounded-t-2xl border border-border border-b-0 bg-card px-3">
        <div
          ref={groupedTabsRef}
          className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto overflow-y-hidden whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {previews.map((preview) => {
            const isActiveTab = activePreview.path === preview.path;
            const isMarkdownTab = isMarkdownFile(preview.name);
            const isImageTab = isImageFile(preview.name);
            const isVideoTab = isVideoFile(preview.name);
            const isMarkdownPreviewTab = isMarkdownTab && !preview.isEditing;
            const isMarkdownEditTab = isMarkdownTab && preview.isEditing;
            const isEditableNonMarkdown =
              !isMarkdownTab && !isImageTab && !isVideoTab;
            const canSaveTab =
              updateEnabled &&
              preview.draftContent !== preview.content &&
              !preview.isSaving &&
              !preview.isLoading;

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
                {isActiveTab && updateEnabled && isMarkdownPreviewTab && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetActivePreviewPath(preview.path);
                      onSetEditing(preview.path, true);
                    }}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
                    title="Edit"
                  >
                    <PenLine className="h-3.5 w-3.5" />
                  </button>
                )}
                {isActiveTab && updateEnabled && isMarkdownEditTab && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetEditing(preview.path, false);
                      }}
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
                      title="Preview"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(preview);
                      }}
                      disabled={!canSaveTab && !preview.isSaving}
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors",
                        preview.isSaving
                          ? "pointer-events-none"
                          : canSaveTab
                            ? "hover:text-foreground"
                            : "cursor-not-allowed opacity-50",
                      )}
                      title="Save"
                    >
                      {preview.isSaving ? (
                        <Loader2 className="h-3.5 w-3.5" />
                      ) : (
                        <Save className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </>
                )}
                {isActiveTab && updateEnabled && isEditableNonMarkdown && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave(preview);
                    }}
                    disabled={!canSaveTab && !preview.isSaving}
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors",
                      preview.isSaving
                        ? "pointer-events-none"
                        : canSaveTab
                          ? "hover:text-foreground"
                          : "cursor-not-allowed opacity-50",
                    )}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose(preview.path);
                  }}
                  className={cn(
                    "h-3 w-3 shrink-0 cursor-pointer transition-opacity hover:text-[#DC2626]",
                    isActiveTab
                      ? "opacity-50 hover:opacity-100"
                      : "opacity-0 group-hover:opacity-100",
                  )}
                  title="Close"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <div className="relative" ref={addMenuRef}>
            <button
              onClick={() => setAddMenuOpen((prev) => !prev)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Add file"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            {addMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 max-h-60 min-w-[180px] overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-lg">
                {availableFiles.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-muted-foreground">
                    No files available
                  </div>
                ) : (
                  availableFiles.map((file) => (
                    <button
                      key={file.path}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted"
                      onClick={() => {
                        onOpenFile(file);
                        setAddMenuOpen(false);
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
            title="Refresh"
          >
            <RefreshCwIcon className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onSetPreviewMode("split")}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Ungroup windows"
          >
            <Minimize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden rounded-b-2xl border border-border bg-card">
        <div className="h-full select-text overflow-hidden bg-card outline-none">
          <PreviewBody
            preview={activePreview}
            updateEnabled={updateEnabled}
            renderMarkdown={renderMarkdown}
            onDraftChange={onDraftChange}
            onRefresh={onRefresh}
          />
        </div>
      </div>
    </div>
  );
}
