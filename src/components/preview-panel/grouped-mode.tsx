import { useEffect, useRef, useState } from "react";
import { PREVIEW_TOP_INSET, PREVIEW_BOTTOM_INSET } from "./constants";
import { PreviewBody } from "./preview-body";
import type { PreviewWindow, FileEntry } from "@/types";
import type { FinderLocale } from "@/locale";
import {
  GroupedPreviewTabs,
  GroupedPreviewToolbar,
} from "./grouped-mode-header";

export type GroupedModeProps = {
  previews: PreviewWindow[];
  activePreview: PreviewWindow;
  activePreviewPath: string | null;
  previewLeft: number;
  updateEnabled: boolean;
  locale: FinderLocale;
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
  locale,
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
        <GroupedPreviewTabs
          tabsRef={groupedTabsRef}
          previews={previews}
          activePreview={activePreview}
          updateEnabled={updateEnabled}
          locale={locale}
          onSave={onSave}
          onClose={onClose}
          onSetEditing={onSetEditing}
          onSetActivePreviewPath={onSetActivePreviewPath}
        />
        <GroupedPreviewToolbar
          addMenuRef={addMenuRef}
          addMenuOpen={addMenuOpen}
          activePreview={activePreview}
          availableFiles={availableFiles}
          locale={locale}
          onToggleAddMenu={() => setAddMenuOpen((prev) => !prev)}
          onCloseAddMenu={() => setAddMenuOpen(false)}
          onRefresh={onRefresh}
          onSetPreviewMode={onSetPreviewMode}
          onOpenFile={onOpenFile}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden rounded-b-2xl border border-border bg-card">
        <div className="h-full select-text overflow-hidden bg-card outline-none">
          <PreviewBody
            preview={activePreview}
            updateEnabled={updateEnabled}
            locale={locale}
            renderMarkdown={renderMarkdown}
            onDraftChange={onDraftChange}
            onRefresh={onRefresh}
          />
        </div>
      </div>
    </div>
  );
}
