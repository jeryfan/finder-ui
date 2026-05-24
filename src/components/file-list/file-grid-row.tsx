import { Loader2 } from "lucide-react";
import type { FileEntry } from "@/types";
import { cn } from "@/utils";
import { getFileIcon } from "@/utils/file-icons";
import { InlineInput } from "./inline-input";
import type {
  FileEntryContextHandler,
  FileEntryMouseHandler,
} from "./file-list-row-types";
import { getFileOptionId } from "./file-list-row-types";

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
              id={getFileOptionId(flatIndex)}
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
                    onConfirm={async (newName) => {
                      await onRename(entry, newName);
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
