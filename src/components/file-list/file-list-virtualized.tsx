import type { Virtualizer } from "@tanstack/react-virtual";
import type { FileEntry } from "@/types";
import {
  FileGridRow,
  FileListRow,
  type UploadingFileItem,
  UploadingGridRow,
  UploadingListRow,
} from "./file-list-rows";

type FileEntryMouseHandler = (
  entry: FileEntry,
  event: React.MouseEvent,
) => void;

type FileEntryContextHandler = (
  event: React.MouseEvent,
  entry: FileEntry | null,
) => void;

type BaseVirtualizedFileViewProps = {
  files: FileEntry[];
  uploadingFiles: UploadingFileItem[];
  selectedPaths: Set<string>;
  focusedIndex: number;
  fileLoadingStates: Record<string, boolean>;
  renamingPath: string | null;
  onEntryClick: FileEntryMouseHandler;
  onEntryDoubleClick: FileEntryMouseHandler;
  onContextMenu: FileEntryContextHandler;
  onRename: (entry: FileEntry, newName: string) => void | Promise<void>;
  onSetRenamingPath: (path: string | null) => void;
};

export type VirtualizedGridViewProps = BaseVirtualizedFileViewProps & {
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  gridColumns: number;
};

export function VirtualizedGridView({
  virtualizer,
  files,
  uploadingFiles,
  gridColumns,
  selectedPaths,
  focusedIndex,
  fileLoadingStates,
  renamingPath,
  onEntryClick,
  onEntryDoubleClick,
  onContextMenu,
  onRename,
  onSetRenamingPath,
}: VirtualizedGridViewProps) {
  return (
    <div
      style={{ height: `${virtualizer.getTotalSize()}px`, width: "100%", position: "relative" }}
      data-file-grid="true"
    >
      {virtualizer.getVirtualItems().map((virtualRow) => {
        const rowStartIndex = virtualRow.index * gridColumns;
        const isUploadingRow = rowStartIndex >= files.length;

        if (isUploadingRow) {
          const uploadStartIndex = rowStartIndex - files.length;
          const rowUploadItems = uploadingFiles.slice(
            uploadStartIndex,
            uploadStartIndex + gridColumns,
          );
          return (
            <UploadingGridRow
              key={virtualRow.key}
              virtualKey={virtualRow.key}
              virtualStart={virtualRow.start}
              virtualSize={virtualRow.size}
              uploadStartIndex={uploadStartIndex}
              items={rowUploadItems}
              gridColumns={gridColumns}
            />
          );
        }

        const rowEntries = files.slice(rowStartIndex, rowStartIndex + gridColumns);
        return (
          <FileGridRow
            key={virtualRow.key}
            virtualKey={virtualRow.key}
            virtualStart={virtualRow.start}
            virtualSize={virtualRow.size}
            rowStartIndex={rowStartIndex}
            entries={rowEntries}
            gridColumns={gridColumns}
            selectedPaths={selectedPaths}
            focusedIndex={focusedIndex}
            fileLoadingStates={fileLoadingStates}
            renamingPath={renamingPath}
            onEntryClick={onEntryClick}
            onEntryDoubleClick={onEntryDoubleClick}
            onContextMenu={onContextMenu}
            onRename={onRename}
            onSetRenamingPath={onSetRenamingPath}
          />
        );
      })}
    </div>
  );
}

export type VirtualizedListViewProps = BaseVirtualizedFileViewProps & {
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  dateColumnClass: string;
  sizeColumnClass: string;
};

export function VirtualizedListView({
  virtualizer,
  files,
  uploadingFiles,
  selectedPaths,
  focusedIndex,
  fileLoadingStates,
  renamingPath,
  dateColumnClass,
  sizeColumnClass,
  onEntryClick,
  onEntryDoubleClick,
  onContextMenu,
  onRename,
  onSetRenamingPath,
}: VirtualizedListViewProps) {
  return (
    <div
      className="mt-0.5"
      style={{ height: `${virtualizer.getTotalSize()}px`, width: "100%", position: "relative" }}
    >
      {virtualizer.getVirtualItems().map((virtualItem) => {
        const isUploading = virtualItem.index >= files.length;

        if (isUploading) {
          const uploadIndex = virtualItem.index - files.length;
          const item = uploadingFiles[uploadIndex];
          if (!item) return null;
          return (
            <UploadingListRow
              key={virtualItem.key}
              virtualKey={virtualItem.key}
              virtualStart={virtualItem.start}
              virtualSize={virtualItem.size}
              item={item}
              dateColumnClass={dateColumnClass}
              sizeColumnClass={sizeColumnClass}
            />
          );
        }

        const entry = files[virtualItem.index];
        return (
          <FileListRow
            key={virtualItem.key}
            virtualKey={virtualItem.key}
            virtualIndex={virtualItem.index}
            virtualStart={virtualItem.start}
            virtualSize={virtualItem.size}
            entry={entry}
            selectedPaths={selectedPaths}
            focusedIndex={focusedIndex}
            fileLoadingStates={fileLoadingStates}
            renamingPath={renamingPath}
            dateColumnClass={dateColumnClass}
            sizeColumnClass={sizeColumnClass}
            onEntryClick={onEntryClick}
            onEntryDoubleClick={onEntryDoubleClick}
            onContextMenu={onContextMenu}
            onRename={onRename}
            onSetRenamingPath={onSetRenamingPath}
          />
        );
      })}
    </div>
  );
}
