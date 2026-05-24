import { Minimize2, RefreshCwIcon } from "lucide-react";
import type { FinderLocale } from "@/locale";
import type { FileEntry, PreviewWindow } from "@/types";
import { GroupedAddFileMenu } from "./grouped-add-file-menu";
import { getNextPreviewTabIndex } from "./grouped-preview-keyboard";
import { GroupedPreviewTab } from "./grouped-preview-tab";

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
  const activeIndex = previews.findIndex((preview) => preview.path === activePreview.path);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const directionByKey = {
      ArrowRight: 'next',
      ArrowLeft: 'previous',
      Home: 'first',
      End: 'last',
    } as const;
    const direction = directionByKey[event.key as keyof typeof directionByKey];
    if (!direction) return;

    event.preventDefault();
    const nextIndex = getNextPreviewTabIndex({
      currentIndex: activeIndex,
      tabCount: previews.length,
      direction,
    });
    const nextPreview = previews[nextIndex];
    if (nextPreview) onSetActivePreviewPath(nextPreview.path);
  };

  return (
    <div
      ref={tabsRef}
      className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto overflow-y-hidden whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label={locale.preview}
      onKeyDown={handleKeyDown}
    >
      {previews.map((preview) => {
        return (
          <GroupedPreviewTab
            key={`tab-${preview.path}`}
            preview={preview}
            active={activePreview.path === preview.path}
            updateEnabled={updateEnabled}
            locale={locale}
            onSave={onSave}
            onClose={onClose}
            onSetEditing={onSetEditing}
            onSetActivePreviewPath={onSetActivePreviewPath}
          />
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
      <GroupedAddFileMenu
        addMenuRef={addMenuRef}
        open={addMenuOpen}
        availableFiles={availableFiles}
        locale={locale}
        onToggle={onToggleAddMenu}
        onClose={onCloseAddMenu}
        onOpenFile={onOpenFile}
      />
      <button
        onClick={() => onRefresh(activePreview.path)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
        title={locale.refresh}
        aria-label={locale.refresh}
      >
        <RefreshCwIcon className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => onSetPreviewMode("split")}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title={locale.ungroupWindows}
        aria-label={locale.ungroupWindows}
      >
        <Minimize2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
