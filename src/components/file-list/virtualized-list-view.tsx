import {
  FileListRow,
  UploadingListRow,
} from "./file-list-rows";
import type {
  BaseVirtualizedFileViewProps,
  FileViewVirtualizer,
} from "./virtualized-types";

export type VirtualizedListViewProps = BaseVirtualizedFileViewProps & {
  virtualizer: FileViewVirtualizer;
  className?: string;
  dateColumnClass: string;
  sizeColumnClass: string;
};

export function VirtualizedListView({
  virtualizer,
  className,
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
      className={className}
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
