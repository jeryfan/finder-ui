import {
  FileGridRow,
  UploadingGridRow,
} from "./file-list-rows";
import type {
  BaseVirtualizedFileViewProps,
  FileViewVirtualizer,
} from "./virtualized-types";

export type VirtualizedGridViewProps = BaseVirtualizedFileViewProps & {
  virtualizer: FileViewVirtualizer;
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
