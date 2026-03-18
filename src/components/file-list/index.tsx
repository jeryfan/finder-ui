import { useMemo, useRef, useCallback, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useFinderStore, useFinderStoreApi } from "@/store";
import { FolderIcon, ChevronDownIcon, UploadIcon } from "@/icons";
import { cn, formatDateTimeEN, formatFileSize } from "@/utils";
import { getFileIcon } from "@/utils/file-icons";
import type { FileEntry } from "@/types";
import { useFileDrop } from "./use-file-drop";
import { useKeyboardNavigation } from "./use-keyboard-nav";
import { InlineInput } from "./inline-input";
import { Loader2 } from "lucide-react";

const LIST_ROW_HEIGHT = 33.6;
const GRID_ROW_HEIGHT = 100;

function useGridColumns(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [columns, setColumns] = useState(8);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculate = () => {
      const width = container.clientWidth - 24; // subtract padding
      const minColWidth = 90;
      const gap = 12;
      const cols = Math.max(1, Math.floor((width + gap) / (minColWidth + gap)));
      setColumns(cols);
    };

    calculate();
    const observer = new ResizeObserver(calculate);
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  return columns;
}

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

  const dateColumnClass = "w-32";
  const sizeColumnClass = "w-20";

  const filteredFiles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return files;
    return files.filter((item) => item.name.toLowerCase().includes(query));
  }, [files, searchQuery]);

  const sortedFiles = useMemo(() => {
    const direction = sortOrder === "asc" ? 1 : -1;
    return [...filteredFiles].sort((left, right) => {
      if (left.type !== right.type) return left.type === "directory" ? -1 : 1;
      if (sortField === "lastModified") {
        const leftTime = Date.parse(left.lastModified || "");
        const rightTime = Date.parse(right.lastModified || "");
        return (leftTime - rightTime) * direction;
      }
      if (sortField === "size") return (left.size - right.size) * direction;
      return left.name.localeCompare(right.name) * direction;
    });
  }, [filteredFiles, sortField, sortOrder]);

  // Virtual scrolling for list mode
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
        aria-label="File list"
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
        {/* Drop overlay */}
        {isDragOver && (
          <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center rounded-xl border-2 border-dashed border-primary bg-primary/5">
            <div className="flex flex-col items-center gap-2 text-primary">
              <UploadIcon className="h-8 w-8" />
              <span className="text-sm font-medium">
                {locale.dropFilesToUpload}
              </span>
            </div>
          </div>
        )}

        {/* List header */}
        {showListHeader && (
          <div className="flex items-center gap-2 px-2 py-1 text-[10px] leading-4 font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
            <button
              onClick={() => setSort("name")}
              className="flex-1 text-left flex items-center gap-1 hover:text-foreground"
            >
              {locale.name}
              {sortField === "name" && (
                <ChevronDownIcon
                  className={cn(
                    "w-3 h-3",
                    sortOrder === "desc" && "rotate-180",
                  )}
                />
              )}
            </button>
            <button
              onClick={() => setSort("lastModified")}
              className={`${dateColumnClass} text-left flex items-center gap-1 hover:text-foreground`}
            >
              {locale.dateModified}
              {sortField === "lastModified" && (
                <ChevronDownIcon
                  className={cn(
                    "w-3 h-3",
                    sortOrder === "desc" && "rotate-180",
                  )}
                />
              )}
            </button>
            <button
              onClick={() => setSort("size")}
              className={`${sizeColumnClass} text-right flex items-center justify-end gap-1 hover:text-foreground`}
            >
              {locale.size}
              {sortField === "size" && (
                <ChevronDownIcon
                  className={cn(
                    "w-3 h-3",
                    sortOrder === "desc" && "rotate-180",
                  )}
                />
              )}
            </button>
          </div>
        )}

        {/* Error state */}
        {loadError && !loading && (
          <div className="h-full flex items-center justify-center p-4 text-center">
            <div>
              <p className="text-sm text-red-600">{locale.failedToLoad}</p>
              <button
                onClick={() => storeApi.getState().onRefresh()}
                className="mt-2 px-3 py-1 text-xs rounded-md bg-foreground text-white hover:opacity-90"
              >
                {locale.retry}
              </button>
            </div>
          </div>
        )}

        {/* Grouped skeleton */}
        {viewMode === "grouped" && showSkeleton && (
          <div className="grid grid-cols-8 gap-4 p-4">
            {Array.from({ length: 16 }).map((_, index) => (
              <div
                key={`grid-skeleton-${index}`}
                className="flex flex-col items-center gap-2 animate-pulse"
              >
                <div className="w-12 h-12 bg-muted rounded shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
                <div className="w-16 h-3 bg-muted rounded shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
              </div>
            ))}
          </div>
        )}

        {/* List skeleton */}
        {viewMode === "list" && showSkeleton && (
          <div className="p-4 space-y-1">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`list-skeleton-${index}`}
                className="flex items-center gap-3 py-2 animate-pulse"
              >
                <div className="w-4 h-4 rounded bg-muted shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
                <div className="h-3 flex-1 rounded bg-muted shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
                <div className="w-16 h-3 rounded bg-muted shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
                <div className="w-10 h-3 rounded bg-muted shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {sortedFiles.length === 0 &&
          uploadingFiles.length === 0 &&
          !loading &&
          !loadError && (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FolderIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{locale.noFiles}</p>
                {!!searchQuery && (
                  <p className="text-xs mt-1">{locale.tryDifferentSearch}</p>
                )}
              </div>
            </div>
          )}

        {/* New folder input - list mode */}
        {viewMode === "list" && isCreatingFolder && (
          <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted leading-[25.6px]">
            <FolderIcon className="w-4 h-4 flex-shrink-0 text-primary" />
            <InlineInput
              defaultValue="New Folder"
              onConfirm={(name) => {
                onCreateFolder(currentPath, name);
                setIsCreatingFolder(false);
              }}
              onCancel={() => setIsCreatingFolder(false)}
            />
          </div>
        )}

        {/* New folder input - grouped mode */}
        {viewMode === "grouped" && isCreatingFolder && (
          <div className="flex flex-col items-center p-2 rounded-lg bg-muted mb-3" style={{ width: 90 }}>
            <div className="w-14 h-14 mb-1 flex items-center justify-center">
              <FolderIcon className="w-8 h-8 text-primary" />
            </div>
            <InlineInput
              defaultValue="New Folder"
              onConfirm={(name) => {
                onCreateFolder(currentPath, name);
                setIsCreatingFolder(false);
              }}
              onCancel={() => setIsCreatingFolder(false)}
              className="w-full text-[11px] text-center bg-card border border-primary rounded px-1 py-0 outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        {/* Grouped mode with virtual scrolling */}
        {viewMode === "grouped" && hasContent && (
          <div
            style={{ height: `${gridVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}
            data-file-grid="true"
          >
            {gridVirtualizer.getVirtualItems().map((virtualRow) => {
              const rowStartIndex = virtualRow.index * gridColumns;
              const isUploadingRow = rowStartIndex >= sortedFiles.length;

              if (isUploadingRow) {
                const uploadStartIndex = rowStartIndex - sortedFiles.length;
                const rowUploadItems = uploadingFiles.slice(uploadStartIndex, uploadStartIndex + gridColumns);
                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <div
                      className="grid gap-3"
                      style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
                    >
                      {rowUploadItems.map((item, idx) => (
                        <div
                          key={`uploading-${uploadStartIndex + idx}`}
                          className="flex flex-col items-center p-2 rounded-lg bg-muted/50 animate-pulse"
                        >
                          <div className="w-14 h-14 mb-1 flex items-center justify-center">
                            {item.type === "directory" ? (
                              <FolderIcon className="w-8 h-8 text-muted-foreground/40" />
                            ) : (
                              <div className="w-10 h-10 rounded bg-muted-foreground/10" />
                            )}
                          </div>
                          <span className="text-[11px] leading-tight line-clamp-2 w-full break-all text-muted-foreground text-center">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              const rowEntries = sortedFiles.slice(rowStartIndex, rowStartIndex + gridColumns);
              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div
                    className="grid gap-3"
                    style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
                  >
                    {rowEntries.map((entry, colIndex) => {
                      const flatIndex = rowStartIndex + colIndex;
                      return (
                        <button
                          key={entry.path}
                          data-file-row="true"
                          data-file-path={entry.path}
                          data-file-index={flatIndex}
                          data-focused={focusedIndex === flatIndex || undefined}
                          role="option"
                          aria-selected={selectedPaths.has(entry.path)}
                          onClick={(event) => handleEntryClick(entry, event)}
                          onDoubleClick={(event) => handleEntryDoubleClick(entry, event)}
                          onContextMenu={(event) => handleContextMenu(event, entry)}
                          className={cn(
                            "flex flex-col items-center p-2 rounded-lg transition-colors text-center group cursor-pointer",
                            selectedPaths.has(entry.path)
                              ? "bg-black/5 outline outline-1 outline-black/30 relative z-10"
                              : "hover:bg-muted",
                            focusedIndex === flatIndex && !selectedPaths.has(entry.path) && "ring-2 ring-primary/50",
                          )}
                        >
                          <div className="w-14 h-14 mb-1 flex items-center justify-center">
                            {fileLoadingStates[entry.path] ? (
                              <Loader2 className="w-8 h-8 text-blue-600" />
                            ) : (
                              getFileIcon(entry, "w-8 h-8")
                            )}
                          </div>
                          <span className="text-[11px] leading-tight line-clamp-2 w-full break-all">
                            {renamingPath === entry.path ? (
                              <InlineInput
                                defaultValue={entry.name}
                                onConfirm={(newName) => {
                                  onRename(entry, newName);
                                  setRenamingPath(null);
                                }}
                                onCancel={() => setRenamingPath(null)}
                                className="w-full text-[11px] bg-card border border-primary rounded px-1 py-0 outline-none focus:ring-1 focus:ring-primary"
                              />
                            ) : entry.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List mode with virtual scrolling */}
        {viewMode === "list" && hasContent && (
          <div
            className="mt-0.5"
            style={{ height: `${listVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}
          >
            {listVirtualizer.getVirtualItems().map((virtualItem) => {
              const isUploading = virtualItem.index >= sortedFiles.length;

              if (isUploading) {
                const uploadIndex = virtualItem.index - sortedFiles.length;
                const item = uploadingFiles[uploadIndex];
                if (!item) return null;
                return (
                  <div
                    key={virtualItem.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1 rounded-md bg-muted/50 animate-pulse leading-[25.6px]"
                  >
                    {item.type === "directory" ? (
                      <FolderIcon className="w-4 h-4 flex-shrink-0 text-muted-foreground/40" />
                    ) : (
                      <div className="w-4 h-4 flex-shrink-0 rounded bg-muted-foreground/10" />
                    )}
                    <span className="flex-1 text-sm truncate text-muted-foreground">
                      {item.name}
                    </span>
                    <span className={`${dateColumnClass} text-xs text-muted-foreground`}>--</span>
                    <span className={`${sizeColumnClass} text-xs text-muted-foreground text-right`}>--</span>
                  </div>
                );
              }

              const entry = sortedFiles[virtualItem.index];
              return (
                <button
                  key={virtualItem.key}
                  data-file-row="true"
                  data-file-path={entry.path}
                  data-file-index={virtualItem.index}
                  data-focused={focusedIndex === virtualItem.index || undefined}
                  role="option"
                  aria-selected={selectedPaths.has(entry.path)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                    zIndex: selectedPaths.has(entry.path) ? 1 : undefined,
                  }}
                  onClick={(event) => handleEntryClick(entry, event)}
                  onDoubleClick={(event) => handleEntryDoubleClick(entry, event)}
                  onContextMenu={(event) => handleContextMenu(event, entry)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1 rounded-md transition-colors text-left leading-[25.6px] group cursor-pointer",
                    selectedPaths.has(entry.path)
                      ? "bg-black/5 ring-1 ring-black/30"
                      : "hover:bg-muted",
                    focusedIndex === virtualItem.index && !selectedPaths.has(entry.path) && "ring-2 ring-primary/50",
                  )}
                >
                  <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                    {fileLoadingStates[entry.path] ? (
                      <Loader2 className="w-4 h-4 text-blue-600" />
                    ) : (
                      getFileIcon(entry)
                    )}
                  </div>
                  <span className="flex-1 text-sm truncate">
                    {renamingPath === entry.path ? (
                      <InlineInput
                        defaultValue={entry.name}
                        onConfirm={(newName) => {
                          onRename(entry, newName);
                          setRenamingPath(null);
                        }}
                        onCancel={() => setRenamingPath(null)}
                      />
                    ) : entry.name}
                  </span>
                  <span className={`${dateColumnClass} text-xs text-muted-foreground truncate`}>
                    {entry.lastModified ? formatDateTimeEN(entry.lastModified) : "--"}
                  </span>
                  <span className={`${sizeColumnClass} text-xs text-muted-foreground text-right`}>
                    {formatFileSize(entry.size || 0, entry.type)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex h-6 shrink-0 items-center gap-2 border-t border-border bg-muted/20 px-3 text-[10px] leading-4 text-muted-foreground">
        <span>{locale.items(sortedFiles.length)}</span>
        {selectedPaths.size > 0 && <span>{locale.selected(selectedPaths.size)}</span>}
        {uploadingFiles.length > 0 && (
          <span className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 text-[#3B82F6]" />
            {locale.uploading(uploadingFiles.length)}
          </span>
        )}
        {uploadingFiles.length === 0 && loading && (
          <span className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 text-[#3B82F6]" />
            {locale.refreshing}
          </span>
        )}
      </div>
    </>
  );
}
