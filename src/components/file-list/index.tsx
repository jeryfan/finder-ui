import { useRef } from "react";
import { useFinderStore, useFinderStoreApi } from "@/store";
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
import {
  useFileListKeyboardActions,
  useFileListPointerInteractions,
} from "./use-file-list-interactions";
import { useGridColumns, useSortedFiles } from "./use-file-list-data";
import { useFileListDisplayState } from "./use-file-list-display-state";
import { useFileListVirtualizers } from "./use-file-list-virtualizers";
import { useKeyboardNavigation } from "./use-keyboard-nav";
import { getFileOptionId } from "./file-list-row-types";

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
    onDropFiles,
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

  const { keyboardActions, openEntry } = useFileListKeyboardActions();
  const { focusedIndex, setFocusedIndex } = useKeyboardNavigation({
    sortedFiles,
    viewMode,
    actions: keyboardActions,
    containerRef,
  });

  const {
    handleEntryClick,
    handleEntryDoubleClick,
    handleContextMenu,
    handleBackgroundClick,
    handleBackgroundContextMenu,
  } = useFileListPointerInteractions({
    sortedFiles,
    selectedPaths,
    setFocusedIndex,
    openEntry,
  });

  const { gridVirtualizer, listVirtualizer } = useFileListVirtualizers({
    scrollContainerRef,
    sortedFiles,
    uploadingFiles,
    gridColumns,
    focusedIndex,
    viewMode,
  });
  const {
    hasContent,
    showEmptyState,
    showGroupedSkeleton,
    showListHeader,
    showListSkeleton,
    showSearchHint,
  } = useFileListDisplayState({
    fileCount: sortedFiles.length,
    uploadingCount: uploadingFiles.length,
    loading,
    loadError,
    searchQuery,
    viewMode,
  });

  return (
    <>
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto p-3 relative outline-none"
        tabIndex={0}
        role="listbox"
        aria-label={locale.fileListLabel}
        aria-multiselectable="true"
        aria-activedescendant={
          focusedIndex >= 0 ? getFileOptionId(focusedIndex) : undefined
        }
        onClick={handleBackgroundClick}
        onContextMenu={handleBackgroundContextMenu}
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

        {showGroupedSkeleton && (
          <GroupedSkeleton />
        )}

        {showListSkeleton && (
          <ListSkeleton />
        )}

        {showEmptyState && (
            <FileListEmptyState
              locale={locale}
              showSearchHint={showSearchHint}
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
