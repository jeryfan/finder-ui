import { useMemo, useRef, useCallback, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useFinderStore, useFinderStoreApi } from "@/store";
import type { FileEntry } from "@/types";
import { FileListHeader } from "./file-list-header";
import {
  FileDropOverlay,
  FileListEmptyState,
  FileListErrorState,
  GroupedSkeleton,
  ListSkeleton,
  NewFolderInput,
} from "./file-list-states";
import { FileListStatusBar } from "./file-list-status-bar";
import { VirtualizedGridView, VirtualizedListView } from "./file-list-virtualized";
import { useFileDrop } from "./use-file-drop";
import { useGridColumns, useSortedFiles } from "./use-file-list-data";
import { useKeyboardNavigation } from "./use-keyboard-nav";

const LIST_ROW_HEIGHT = 33.6;
const GRID_ROW_HEIGHT = 100;

export function FileList() {
  const {
    files,
    selectedPaths,
    loading,
    loadError,
    viewMode,
    sortField,
    sortOrder,
    searchQuery,
    fileLoadingStates,
    uploadingFiles,
    currentPath,
    setSort,
    setSelectedPaths,
    toggleSelection,
    selectRange,
    selectAll,
    clearSelection,
    openContextMenu,
    closeContextMenu,
    onOpen,
    navigateTo,
    onNavigateToPath,
    previews,
    setActivePreviewPath,
    onDropFiles,
    goBack,
    renamingPath,
    setRenamingPath,
    isCreatingFolder,
    setIsCreatingFolder,
    onRename,
    onCreateFolder,
    locale,
  } = useFinderStore();

  const storeApi = useFinderStoreApi();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = scrollContainerRef; // same ref for keyboard nav

  const gridColumns = useGridColumns(scrollContainerRef);

  const {
    isDragOver,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useFileDrop(currentPath, onDropFiles);

  const dateColumnClass = "w-32 shrink-0";
  const sizeColumnClass = "w-20 shrink-0";
  const listContentClass = "min-w-[360px]";

  const sortedFiles = useSortedFiles(files, searchQuery, sortField, sortOrder);

  // Virtual scrolling for list mode
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Virtual owns these imperative helpers; the component does not pass them through memoized boundaries.
  const listVirtualizer = useVirtualizer({
    count: sortedFiles.length + uploadingFiles.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => LIST_ROW_HEIGHT,
    overscan: 10,
  });

  // Virtual scrolling for grouped mode
  const gridRowCount = Math.ceil(sortedFiles.length / gridColumns) +
    (uploadingFiles.length > 0 ? Math.ceil(uploadingFiles.length / gridColumns) : 0);
  const gridVirtualizer = useVirtualizer({
    count: gridRowCount,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => GRID_ROW_HEIGHT,
    overscan: 5,
  });

  const handleOpenEntry = useCallback((entry: FileEntry) => {
    if (entry.type === "directory") {
      clearSelection();
      navigateTo(entry.path);
      onNavigateToPath(entry.path);
      return;
    }
    onOpen(entry);
  }, [clearSelection, navigateTo, onNavigateToPath, onOpen]);

  const handleNavigateBack = useCallback(() => {
    goBack();
    const state = storeApi.getState();
    const idx = state.historyIndex;
    if (idx > 0) {
      const prevPath = state.historyStack[idx - 1];
      if (prevPath) onNavigateToPath(prevPath);
    }
  }, [goBack, storeApi, onNavigateToPath]);

  const keyboardActions = useMemo(() => ({
    onOpenEntry: handleOpenEntry,
    onToggleSelection: toggleSelection,
    onSetSelection: setSelectedPaths,
    onSelectRange: selectRange,
    onSelectAll: selectAll,
    onClearSelection: clearSelection,
    onCloseContextMenu: closeContextMenu,
    onNavigateBack: handleNavigateBack,
  }), [handleOpenEntry, toggleSelection, setSelectedPaths, selectRange, selectAll, clearSelection, closeContextMenu, handleNavigateBack]);

  const { focusedIndex, setFocusedIndex } = useKeyboardNavigation({
    sortedFiles,
    viewMode,
    actions: keyboardActions,
    containerRef,
  });

  // Scroll to focused index in virtual list
  useEffect(() => {
    if (focusedIndex < 0) return;
    if (viewMode === 'list') {
      listVirtualizer.scrollToIndex(focusedIndex, { align: 'auto' });
    } else {
      const row = Math.floor(focusedIndex / gridColumns);
      gridVirtualizer.scrollToIndex(row, { align: 'auto' });
    }
  }, [focusedIndex, viewMode, listVirtualizer, gridVirtualizer, gridColumns]);

  const handleEntryClick = (entry: FileEntry, event: React.MouseEvent) => {
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

    // Sync keyboard focus so Enter works on the clicked item
    const clickedIndex = sortedFiles.findIndex((f) => f.path === entry.path);
    if (clickedIndex >= 0) {
      setFocusedIndex(clickedIndex);
    }

    if (previews.some((item) => item.path === entry.path)) {
      setActivePreviewPath(entry.path);
    }
  };

  const handleEntryDoubleClick = (
    entry: FileEntry,
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    handleOpenEntry(entry);
  };

  const handleContextMenu = (
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
  };

  const hasContent = sortedFiles.length > 0 || uploadingFiles.length > 0;
  const showListHeader = viewMode === "list" && (sortedFiles.length > 0 || loading);
  const showSkeleton = loading && sortedFiles.length === 0;

  return (
    <>
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto p-3 relative outline-none"
        tabIndex={0}
        role="listbox"
        aria-label={locale.fileListLabel}
        aria-multiselectable="true"
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest('[data-file-row="true"]')) return;
          if (!event.metaKey && !event.ctrlKey) {
            clearSelection();
            setFocusedIndex(-1);
          }
        }}
        onContextMenu={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest('[data-file-row="true"]')) return;
          handleContextMenu(event, null);
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragOver && <FileDropOverlay locale={locale} />}

        {/* List header */}
        {showListHeader && (
          <FileListHeader
            className={listContentClass}
            locale={locale}
            sortField={sortField}
            sortOrder={sortOrder}
            dateColumnClass={dateColumnClass}
            sizeColumnClass={sizeColumnClass}
            onSort={setSort}
          />
        )}

        {loadError && !loading && (
          <FileListErrorState
            locale={locale}
            onRetry={() => storeApi.getState().onRefresh()}
          />
        )}

        {viewMode === "grouped" && showSkeleton && (
          <GroupedSkeleton />
        )}

        {viewMode === "list" && showSkeleton && (
          <ListSkeleton />
        )}

        {sortedFiles.length === 0 &&
          uploadingFiles.length === 0 &&
          !loading &&
          !loadError && (
            <FileListEmptyState
              locale={locale}
              showSearchHint={!!searchQuery}
            />
          )}

        {isCreatingFolder && (
          <NewFolderInput
            locale={locale}
            currentPath={currentPath}
            viewMode={viewMode}
            onCreateFolder={onCreateFolder}
            onDone={() => setIsCreatingFolder(false)}
          />
        )}

        {viewMode === "grouped" && hasContent && (
          <VirtualizedGridView
            virtualizer={gridVirtualizer}
            files={sortedFiles}
            uploadingFiles={uploadingFiles}
            gridColumns={gridColumns}
            selectedPaths={selectedPaths}
            focusedIndex={focusedIndex}
            fileLoadingStates={fileLoadingStates}
            renamingPath={renamingPath}
            onEntryClick={handleEntryClick}
            onEntryDoubleClick={handleEntryDoubleClick}
            onContextMenu={handleContextMenu}
            onRename={onRename}
            onSetRenamingPath={setRenamingPath}
          />
        )}

        {viewMode === "list" && hasContent && (
          <VirtualizedListView
            className={listContentClass}
            virtualizer={listVirtualizer}
            files={sortedFiles}
            uploadingFiles={uploadingFiles}
            selectedPaths={selectedPaths}
            focusedIndex={focusedIndex}
            fileLoadingStates={fileLoadingStates}
            renamingPath={renamingPath}
            dateColumnClass={dateColumnClass}
            sizeColumnClass={sizeColumnClass}
            onEntryClick={handleEntryClick}
            onEntryDoubleClick={handleEntryDoubleClick}
            onContextMenu={handleContextMenu}
            onRename={onRename}
            onSetRenamingPath={setRenamingPath}
          />
        )}
      </div>

      <FileListStatusBar
        locale={locale}
        fileCount={sortedFiles.length}
        selectedCount={selectedPaths.size}
        uploadingCount={uploadingFiles.length}
        loading={loading}
      />
    </>
  );
}
