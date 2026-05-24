import { Loader2 } from "lucide-react";
import { FolderIcon } from "@/icons";
import type { FileEntry } from "@/types";
import { cn, formatDateTimeEN, formatFileSize } from "@/utils";
import { getFileIcon } from "@/utils/file-icons";
import { InlineInput } from "./inline-input";

export type UploadingFileItem = {
  name: string;
  type: "file" | "directory";
};

type FileEntryMouseHandler = (
  entry: FileEntry,
  event: React.MouseEvent,
) => void;

type FileEntryContextHandler = (
  event: React.MouseEvent,
  entry: FileEntry | null,
) => void;

export type UploadingGridRowProps = {
  virtualKey: React.Key;
  virtualStart: number;
  virtualSize: number;
  uploadStartIndex: number;
  items: UploadingFileItem[];
  gridColumns: number;
};

export function UploadingGridRow({
  virtualKey,
  virtualStart,
  virtualSize,
  uploadStartIndex,
  items,
  gridColumns,
}: UploadingGridRowProps) {
  return (
    <div
      key={virtualKey}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${virtualSize}px`,
        transform: `translateY(${virtualStart}px)`,
      }}
    >
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
      >
        {items.map((item, idx) => (
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

export type FileGridRowProps = {
  virtualKey: React.Key;
  virtualStart: number;
  virtualSize: number;
  rowStartIndex: number;
  entries: FileEntry[];
  gridColumns: number;
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

export function FileGridRow({
  virtualKey,
  virtualStart,
  virtualSize,
  rowStartIndex,
  entries,
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
}: FileGridRowProps) {
  return (
    <div
      key={virtualKey}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${virtualSize}px`,
        transform: `translateY(${virtualStart}px)`,
      }}
    >
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
      >
        {entries.map((entry, colIndex) => {
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
              onClick={(event) => onEntryClick(entry, event)}
              onDoubleClick={(event) => onEntryDoubleClick(entry, event)}
              onContextMenu={(event) => onContextMenu(event, entry)}
              className={cn(
                "flex flex-col items-center p-2 rounded-lg transition-colors text-center group cursor-pointer",
                selectedPaths.has(entry.path)
                  ? "bg-black/5 outline outline-1 outline-black/30 relative z-10"
                  : "hover:bg-muted",
                focusedIndex === flatIndex &&
                  !selectedPaths.has(entry.path) &&
                  "ring-2 ring-primary/50",
              )}
            >
              <div className="w-14 h-14 mb-1 flex items-center justify-center">
                {fileLoadingStates[entry.path] ? (
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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
                      onSetRenamingPath(null);
                    }}
                    onCancel={() => onSetRenamingPath(null)}
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
}

export type UploadingListRowProps = {
  virtualKey: React.Key;
  virtualStart: number;
  virtualSize: number;
  item: UploadingFileItem;
  dateColumnClass: string;
  sizeColumnClass: string;
};

export function UploadingListRow({
  virtualKey,
  virtualStart,
  virtualSize,
  item,
  dateColumnClass,
  sizeColumnClass,
}: UploadingListRowProps) {
  return (
    <div
      key={virtualKey}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${virtualSize}px`,
        transform: `translateY(${virtualStart}px)`,
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

export type FileListRowProps = {
  virtualKey: React.Key;
  virtualIndex: number;
  virtualStart: number;
  virtualSize: number;
  entry: FileEntry;
  selectedPaths: Set<string>;
  focusedIndex: number;
  fileLoadingStates: Record<string, boolean>;
  renamingPath: string | null;
  dateColumnClass: string;
  sizeColumnClass: string;
  onEntryClick: FileEntryMouseHandler;
  onEntryDoubleClick: FileEntryMouseHandler;
  onContextMenu: FileEntryContextHandler;
  onRename: (entry: FileEntry, newName: string) => void | Promise<void>;
  onSetRenamingPath: (path: string | null) => void;
};

export function FileListRow({
  virtualKey,
  virtualIndex,
  virtualStart,
  virtualSize,
  entry,
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
}: FileListRowProps) {
  return (
    <button
      key={virtualKey}
      data-file-row="true"
      data-file-path={entry.path}
      data-file-index={virtualIndex}
      data-focused={focusedIndex === virtualIndex || undefined}
      role="option"
      aria-selected={selectedPaths.has(entry.path)}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${virtualSize}px`,
        transform: `translateY(${virtualStart}px)`,
        zIndex: selectedPaths.has(entry.path) ? 1 : undefined,
      }}
      onClick={(event) => onEntryClick(entry, event)}
      onDoubleClick={(event) => onEntryDoubleClick(entry, event)}
      onContextMenu={(event) => onContextMenu(event, entry)}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1 rounded-md transition-colors text-left leading-[25.6px] group cursor-pointer",
        selectedPaths.has(entry.path)
          ? "bg-black/5 ring-1 ring-black/30"
          : "hover:bg-muted",
        focusedIndex === virtualIndex &&
          !selectedPaths.has(entry.path) &&
          "ring-2 ring-primary/50",
      )}
    >
      <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
        {fileLoadingStates[entry.path] ? (
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
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
              onSetRenamingPath(null);
            }}
            onCancel={() => onSetRenamingPath(null)}
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
}
