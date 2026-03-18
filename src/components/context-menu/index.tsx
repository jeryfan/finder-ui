import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFinderStore } from "@/store";
import { FolderOpenIcon, FolderIcon, UploadIcon } from "@/icons";
import { cn } from "@/utils";
import { Download, Eye, RefreshCwIcon, Pencil, Trash2, FolderPlus } from "lucide-react";

type MenuItem = {
  label: string;
  icon: React.ReactNode;
  action: () => void;
  divider?: boolean;
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

  // Close menu on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-context-menu="true"]')) {
        closeContextMenu();
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    document.addEventListener("contextmenu", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
      document.removeEventListener("contextmenu", handleClickOutside, true);
    };
  }, [isOpen, closeContextMenu]);

  // Adjust position to keep menu within viewport
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    const adjustedX =
      x + rect.width > window.innerWidth
        ? window.innerWidth - rect.width - 4
        : x;
    const adjustedY =
      y + rect.height > window.innerHeight
        ? window.innerHeight - rect.height - 4
        : y;
    if (adjustedX !== x || adjustedY !== y) {
      menuRef.current.style.left = `${Math.max(0, adjustedX)}px`;
      menuRef.current.style.top = `${Math.max(0, adjustedY)}px`;
    }
  }, [isOpen, x, y]);

  // Reset focused index and focus menu when it opens
  useEffect(() => {
    if (isOpen) {
      setFocusedItemIndex(-1);
      requestAnimationFrame(() => menuRef.current?.focus());
    }
  }, [isOpen]);

  // Keyboard close
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeContextMenu();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeContextMenu]);

  // Build menu items based on context
  const selectedFiles = files.filter((f) => selectedPaths.has(f.path));
  const selectedCount = selectedFiles.length;

  const menuItems: MenuItem[] = [];

  if (targetType === "file" && selectedCount > 1) {
    if (hasBatchDownload) {
      menuItems.push({
        label: locale.downloadAll,
        icon: <Download className="w-4 h-4" />,
        action: () => { onBatchDownload(selectedFiles); closeContextMenu(); },
      });
    }
    if (hasDelete) {
      menuItems.push({
        label: locale.delete,
        icon: <Trash2 className="w-4 h-4" />,
        action: () => {
          if (window.confirm(locale.deleteMultipleConfirm(selectedCount))) {
            onDelete(selectedFiles);
          }
          closeContextMenu();
        },
      });
    }
  }

  if (targetType === "file" && selectedCount <= 1 && targetFile) {
    menuItems.push({
      label: locale.open,
      icon: <Eye className="w-4 h-4" />,
      action: () => { onOpen(targetFile); closeContextMenu(); },
    });
    if (hasDownload) {
      menuItems.push({
        label: locale.download,
        icon: <Download className="w-4 h-4" />,
        action: () => { onDownload(targetFile); closeContextMenu(); },
      });
    }
    if (hasRename) {
      menuItems.push({
        label: locale.rename,
        icon: <Pencil className="w-4 h-4" />,
        action: () => { setRenamingPath(targetFile.path); closeContextMenu(); },
      });
    }
    if (hasDelete) {
      menuItems.push({
        label: locale.delete,
        icon: <Trash2 className="w-4 h-4" />,
        action: () => {
          if (window.confirm(locale.deleteConfirm(targetFile.name))) {
            onDelete([targetFile]);
          }
          closeContextMenu();
        },
      });
    }
  }

  if (targetType === "folder" && selectedCount > 1) {
    if (hasBatchDownload) {
      menuItems.push({
        label: locale.downloadAll,
        icon: <Download className="w-4 h-4" />,
        action: () => { onBatchDownload(selectedFiles); closeContextMenu(); },
      });
    }
    if (hasDelete) {
      menuItems.push({
        label: locale.delete,
        icon: <Trash2 className="w-4 h-4" />,
        action: () => {
          if (window.confirm(locale.deleteMultipleConfirm(selectedCount))) {
            onDelete(selectedFiles);
          }
          closeContextMenu();
        },
      });
    }
  }

  if (targetType === "folder" && selectedCount <= 1 && targetFile) {
    menuItems.push({
      label: locale.open,
      icon: <FolderOpenIcon className="w-4 h-4" />,
      action: () => { onOpen(targetFile); closeContextMenu(); },
    });
    if (hasUpload) {
      menuItems.push({
        label: locale.uploadFiles,
        icon: <UploadIcon className="w-4 h-4" />,
        action: () => { onUpload(false, targetFile.path); closeContextMenu(); },
      });
      menuItems.push({
        label: locale.uploadFolder,
        icon: <FolderIcon className="w-4 h-4" />,
        action: () => { onUpload(true, targetFile.path); closeContextMenu(); },
      });
    }
    if (hasRename) {
      menuItems.push({
        label: locale.rename,
        icon: <Pencil className="w-4 h-4" />,
        action: () => { setRenamingPath(targetFile.path); closeContextMenu(); },
      });
    }
    if (hasDelete) {
      menuItems.push({
        label: locale.delete,
        icon: <Trash2 className="w-4 h-4" />,
        action: () => {
          if (window.confirm(locale.deleteConfirm(targetFile.name))) {
            onDelete([targetFile]);
          }
          closeContextMenu();
        },
      });
    }
  }

  if (targetType === "empty") {
    if (hasCreateFolder) {
      menuItems.push({
        label: locale.newFolder,
        icon: <FolderPlus className="w-4 h-4" />,
        action: () => { setIsCreatingFolder(true); closeContextMenu(); },
      });
    }
    if (hasUpload) {
      menuItems.push({
        label: locale.uploadFiles,
        icon: <UploadIcon className="w-4 h-4" />,
        action: () => { onUpload(false); closeContextMenu(); },
      });
      menuItems.push({
        label: locale.uploadFolder,
        icon: <FolderIcon className="w-4 h-4" />,
        action: () => { onUpload(true); closeContextMenu(); },
      });
    }
    menuItems.push({
      label: locale.refresh,
      icon: <RefreshCwIcon className="w-4 h-4" />,
      action: () => { onRefresh(); closeContextMenu(); },
      divider: menuItems.length > 0,
    });
  }

  // Keyboard navigation for menu items
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        closeContextMenu();
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
  }, [closeContextMenu, focusedItemIndex, menuItems]);

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
      {menuItems.map((item, index) => (
        <div key={item.label}>
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
            {item.icon}
            {item.label}
          </button>
        </div>
      ))}
    </div>,
    document.body,
  );
}
