import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FinderLocale } from "@/locale";
import type { FileEntry } from "@/types";
import { getFileIcon } from "@/utils/file-icons";
import { cn } from "@/utils";
import { getNextAddFileMenuIndex } from "./add-file-menu-keyboard";

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
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const activeFocusedIndex =
    open && focusedIndex >= 0 && focusedIndex < availableFiles.length
      ? focusedIndex
      : availableFiles.length > 0
        ? 0
        : -1;

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => menuRef.current?.focus());
  }, [open]);

  const handleOpenFile = (file: FileEntry) => {
    onOpenFile(file);
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();

    const directionByKey = {
      ArrowDown: 'next',
      ArrowUp: 'previous',
      Home: 'first',
      End: 'last',
    } as const;
    const direction = directionByKey[event.key as keyof typeof directionByKey];

    if (direction) {
      event.preventDefault();
      setFocusedIndex((currentIndex) => getNextAddFileMenuIndex({
        currentIndex: activeFocusedIndex >= 0 ? activeFocusedIndex : currentIndex,
        itemCount: availableFiles.length,
        direction,
      }));
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key === "Tab") {
      onClose();
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const focusedFile = availableFiles[activeFocusedIndex];
      if (focusedFile) handleOpenFile(focusedFile);
    }
  };

  return (
    <div className="relative" ref={addMenuRef}>
      <button
        onClick={onToggle}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title={locale.addFile}
        aria-label={locale.addFile}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full z-50 mt-1 max-h-60 min-w-[180px] overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-lg"
          role="menu"
          tabIndex={-1}
          aria-activedescendant={
            activeFocusedIndex >= 0 ? `finder-add-file-menu-item-${activeFocusedIndex}` : undefined
          }
          onKeyDown={handleKeyDown}
        >
          {availableFiles.length === 0 ? (
            <div className="px-3 py-2 text-xs text-muted-foreground">
              {locale.noFilesAvailable}
            </div>
          ) : (
            availableFiles.map((file, index) => (
              <button
                key={file.path}
                id={`finder-add-file-menu-item-${index}`}
                role="menuitem"
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted",
                  activeFocusedIndex === index && "bg-muted",
                )}
                onMouseEnter={() => setFocusedIndex(index)}
                onClick={() => handleOpenFile(file)}
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
