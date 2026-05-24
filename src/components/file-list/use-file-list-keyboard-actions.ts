import { useCallback, useMemo } from "react";
import { useFinderStore, useFinderStoreApi } from "@/store";
import type { FileEntry } from "@/types";
import { getDeleteSelectionRequest } from "./delete-selection";

export function useFileListKeyboardActions() {
  const {
    toggleSelection,
    setSelectedPaths,
    selectRange,
    selectAll,
    clearSelection,
    closeContextMenu,
    onOpen,
    onDelete,
    onConfirmDelete,
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

  const deleteSelected = useCallback(async () => {
    const state = storeApi.getState();
    if (!state.hasDelete || state.selectedPaths.size === 0) return;

    const request = getDeleteSelectionRequest({
      files: state.files,
      selectedPaths: state.selectedPaths,
      locale: state.locale,
    });
    if (!request) return;

    if (await onConfirmDelete(request.files, request.message)) {
      await onDelete(request.files);
      clearSelection();
    }
  }, [clearSelection, onConfirmDelete, onDelete, storeApi]);

  const keyboardActions = useMemo(() => ({
    onOpenEntry: openEntry,
    onToggleSelection: toggleSelection,
    onSetSelection: setSelectedPaths,
    onSelectRange: selectRange,
    onSelectAll: selectAll,
    onClearSelection: clearSelection,
    onCloseContextMenu: closeContextMenu,
    onNavigateBack: navigateBack,
    onDeleteSelected: () => void deleteSelected(),
  }), [
    clearSelection,
    closeContextMenu,
    deleteSelected,
    navigateBack,
    openEntry,
    selectAll,
    selectRange,
    setSelectedPaths,
    toggleSelection,
  ]);

  return { keyboardActions, openEntry };
}
