import { FolderIcon } from "@/icons";
import type { UploadingFileItem } from "./file-list-row-types";

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
      <span className="min-w-0 flex-1 text-sm truncate text-muted-foreground">
        {item.name}
      </span>
      <span className={`${dateColumnClass} text-xs text-muted-foreground truncate whitespace-nowrap`}>--</span>
      <span className={`${sizeColumnClass} text-xs text-muted-foreground text-right truncate whitespace-nowrap`}>--</span>
    </div>
  );
}
