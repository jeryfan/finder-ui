import { useCallback, useMemo } from "react";
import { useFinderStore, useFinderStoreApi } from "@/store";
import type { FileEntry } from "@/types";

export function useFileListKeyboardActions() {
  const {
    toggleSelection,
    setSelectedPaths,
    selectRange,
    selectAll,
    clearSelection,
    closeContextMenu,
    onOpen,
    navigateTo,
    onNavigateToPath,
    goBack,
  } = useFinderStore();
  const storeApi = useFinderStoreApi();

  const openEntry = useCallback((entry: FileEntry) => {
    if (entry.type === "directory") {
      clearSelection();
      navigateTo(entry.path);
      onNavigateToPath(entry.path);
      return;
    }
    onOpen(entry);
  }, [clearSelection, navigateTo, onNavigateToPath, onOpen]);

  const navigateBack = useCallback(() => {
    goBack();
    const state = storeApi.getState();
    const idx = state.historyIndex;
    if (idx > 0) {
      const prevPath = state.historyStack[idx - 1];
      if (prevPath) onNavigateToPath(prevPath);
    }
  }, [goBack, onNavigateToPath, storeApi]);

  const keyboardActions = useMemo(() => ({
    onOpenEntry: openEntry,
    onToggleSelection: toggleSelection,
    onSetSelection: setSelectedPaths,
    onSelectRange: selectRange,
    onSelectAll: selectAll,
    onClearSelection: clearSelection,
    onCloseContextMenu: closeContextMenu,
    onNavigateBack: navigateBack,
  }), [
    clearSelection,
    closeContextMenu,
    navigateBack,
    openEntry,
    selectAll,
    selectRange,
    setSelectedPaths,
    toggleSelection,
  ]);

  return { keyboardActions, openEntry };
}
