import { Plus } from "lucide-react";
import type { FinderLocale } from "@/locale";
import type { FileEntry } from "@/types";
import { getFileIcon } from "@/utils/file-icons";

export type GroupedAddFileMenuProps = {
  addMenuRef: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  availableFiles: FileEntry[];
  locale: FinderLocale;
  onToggle: () => void;
  onClose: () => void;
  onOpenFile: (file: FileEntry) => void;
};

export function GroupedAddFileMenu({
  addMenuRef,
  open,
  availableFiles,
  locale,
  onToggle,
  onClose,
  onOpenFile,
}: GroupedAddFileMenuProps) {
  return (
    <div className="relative" ref={addMenuRef}>
      <button
        onClick={onToggle}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title={locale.addFile}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 max-h-60 min-w-[180px] overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-lg">
          {availableFiles.length === 0 ? (
            <div className="px-3 py-2 text-xs text-muted-foreground">
              {locale.noFilesAvailable}
            </div>
          ) : (
            availableFiles.map((file) => (
              <button
                key={file.path}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted"
                onClick={() => {
                  onOpenFile(file);
                  onClose();
                }}
              >
                {getFileIcon(file, "h-3.5 w-3.5 shrink-0")}
                <span className="truncate">{file.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
