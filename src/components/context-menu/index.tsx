import { createPortal } from "react-dom";
import { useCallback, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useFinderStore } from "@/store";
import { FolderOpenIcon, FolderIcon, UploadIcon } from "@/icons";
import type { IconProps } from "@/icons";
import { cn } from "@/utils";
import { Download, Eye, RefreshCwIcon, Pencil, Trash2, FolderPlus } from "lucide-react";
import { buildContextMenuItems } from "./context-menu-items";
import type { ContextMenuIconName } from "./context-menu-items";
import { useContextMenuLayer } from "./use-context-menu-layer";

type ContextMenuIconComponent = (props: IconProps) => React.ReactNode;

const contextMenuIcons: Record<ContextMenuIconName, ContextMenuIconComponent> = {
  download: Download,
  openFile: Eye,
  openFolder: FolderOpenIcon,
  rename: Pencil,
  delete: Trash2,
  uploadFiles: UploadIcon,
  uploadFolder: FolderIcon,
  newFolder: FolderPlus,
  refresh: RefreshCwIcon,
};

export function ContextMenu() {
  const {
    contextMenu,
    closeContextMenu,
    onOpen,
    onDownload,
    onBatchDownload,
    onUpload,
    onRefresh,
    onDelete,
    hasRename,
    hasDelete,
    hasCreateFolder,
    hasUpload,
    hasDownload,
    hasBatchDownload,
    files,
    selectedPaths,
    setRenamingPath,
    setIsCreatingFolder,
    locale,
  } = useFinderStore();

  const { isOpen, x, y, targetFile, targetType } = contextMenu;
  const [focusedItemIndex, setFocusedItemIndex] = useState(-1);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleClose = useCallback(() => {
    setFocusedItemIndex(-1);
    closeContextMenu();
  }, [closeContextMenu]);

  useContextMenuLayer({ isOpen, x, y, menuRef, onClose: handleClose });

  const selectedFiles = useMemo(
    () => files.filter((f) => selectedPaths.has(f.path)),
    [files, selectedPaths],
  );
  const selectedCount = selectedFiles.length;

  const menuItems = useMemo(() => buildContextMenuItems({
    targetType,
    targetFile,
    selectedFiles,
    selectedCount,
    hasRename,
    hasDelete,
    hasCreateFolder,
    hasUpload,
    hasDownload,
    hasBatchDownload,
    locale,
    onOpen,
    onDownload,
    onBatchDownload,
    onUpload,
    onRefresh,
    onDelete,
    setRenamingPath,
    setIsCreatingFolder,
    closeMenu: handleClose,
    confirm: (message) => window.confirm(message),
  }), [
    handleClose,
    hasBatchDownload,
    hasCreateFolder,
    hasDelete,
    hasDownload,
    hasRename,
    hasUpload,
    locale,
    onBatchDownload,
    onDelete,
    onDownload,
    onOpen,
    onRefresh,
    onUpload,
    selectedCount,
    selectedFiles,
    setIsCreatingFolder,
    setRenamingPath,
    targetFile,
    targetType,
  ]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        handleClose();
        break;
      case 'ArrowDown':
        event.preventDefault();
        setFocusedItemIndex((prev) =>
          prev < menuItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedItemIndex((prev) =>
          prev > 0 ? prev - 1 : menuItems.length - 1
        );
        break;
      case 'Enter': {
        event.preventDefault();
        if (focusedItemIndex >= 0 && focusedItemIndex < menuItems.length) {
          menuItems[focusedItemIndex].action();
        }
        break;
      }
    }
  }, [focusedItemIndex, handleClose, menuItems]);

  if (!isOpen) return null;

  const hasHeader = (targetType === "file" || targetType === "folder") && selectedCount > 1;

  return createPortal(
    <div
      ref={menuRef}
      className="finder-ui-root fixed z-[9999] min-w-[180px] bg-card border border-border rounded-lg py-1 text-sm shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] outline-none"
      style={{ left: x, top: y }}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={handleKeyDown}
      data-context-menu="true"
      role="menu"
      tabIndex={-1}
    >
      {hasHeader && (
        <div className="px-3 py-1.5 text-xs text-muted-foreground border-b border-border">
          {locale.itemsSelected(selectedCount)}
        </div>
      )}
      {menuItems.map((item, index) => {
        const Icon = contextMenuIcons[item.icon];

        return (
          <div key={item.id}>
            {item.divider && (
              <div className="my-1 border-t border-border" />
            )}
            <button
              role="menuitem"
              onClick={item.action}
              onMouseEnter={() => setFocusedItemIndex(index)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-1.5 transition-colors text-left text-foreground border-0",
                focusedItemIndex === index ? "bg-muted" : "hover:bg-muted",
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
