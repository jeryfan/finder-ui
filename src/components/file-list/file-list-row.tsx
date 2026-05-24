import { Loader2 } from "lucide-react";
import type { FileEntry } from "@/types";
import { cn, formatDateTimeEN, formatFileSize } from "@/utils";
import { getFileIcon } from "@/utils/file-icons";
import { InlineInput } from "./inline-input";
import type {
  FileEntryContextHandler,
  FileEntryMouseHandler,
} from "./file-list-row-types";

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
      <span className="min-w-0 flex-1 text-sm truncate">
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
      <span className={`${dateColumnClass} text-xs text-muted-foreground truncate whitespace-nowrap`}>
        {entry.lastModified ? formatDateTimeEN(entry.lastModified) : "--"}
      </span>
      <span className={`${sizeColumnClass} text-xs text-muted-foreground text-right truncate whitespace-nowrap`}>
        {formatFileSize(entry.size || 0, entry.type)}
      </span>
    </button>
  );
}
