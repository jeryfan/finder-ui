import { useCallback } from "react";
import { useFinderStore } from "@/store";
import type { FileEntry } from "@/types";

type UseFileListPointerInteractionsOptions = {
  sortedFiles: FileEntry[];
  selectedPaths: Set<string>;
  setFocusedIndex: (index: number) => void;
  openEntry: (entry: FileEntry) => void;
};

export function useFileListPointerInteractions({
  sortedFiles,
  selectedPaths,
  setFocusedIndex,
  openEntry,
}: UseFileListPointerInteractionsOptions) {
  const {
    previews,
    toggleSelection,
    setSelectedPaths,
    selectRange,
    clearSelection,
    openContextMenu,
    setActivePreviewPath,
  } = useFinderStore();

  const handleEntryClick = useCallback((entry: FileEntry, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const isMetaSelect = event.metaKey || event.ctrlKey;
    const isShiftSelect = event.shiftKey;

    if (isMetaSelect) {
      toggleSelection(entry.path);
    } else if (isShiftSelect && selectedPaths.size > 0) {
      selectRange(entry.path);
    } else {
      setSelectedPaths(new Set([entry.path]));
    }

    const clickedIndex = sortedFiles.findIndex((file) => file.path === entry.path);
    if (clickedIndex >= 0) {
      setFocusedIndex(clickedIndex);
    }

    if (previews.some((item) => item.path === entry.path)) {
      setActivePreviewPath(entry.path);
    }
  }, [
    previews,
    selectRange,
    selectedPaths.size,
    setActivePreviewPath,
    setFocusedIndex,
    setSelectedPaths,
    sortedFiles,
    toggleSelection,
  ]);

  const handleEntryDoubleClick = useCallback((
    entry: FileEntry,
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    openEntry(entry);
  }, [openEntry]);

  const handleContextMenu = useCallback((
    event: React.MouseEvent,
    entry: FileEntry | null,
  ) => {
    event.preventDefault();
    const targetType =
      entry?.type === "directory" ? "folder" : entry ? "file" : "empty";
    if (entry && !selectedPaths.has(entry.path)) {
      setSelectedPaths(new Set([entry.path]));
    }
    openContextMenu(event.clientX, event.clientY, entry, targetType);
  }, [openContextMenu, selectedPaths, setSelectedPaths]);

  const handleBackgroundClick = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-file-row="true"]')) return;
    if (!event.metaKey && !event.ctrlKey) {
      clearSelection();
      setFocusedIndex(-1);
    }
  }, [clearSelection, setFocusedIndex]);

  const handleBackgroundContextMenu = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-file-row="true"]')) return;
    handleContextMenu(event, null);
  }, [handleContextMenu]);

  return {
    handleEntryClick,
    handleEntryDoubleClick,
    handleContextMenu,
    handleBackgroundClick,
    handleBackgroundContextMenu,
  };
}
