import { useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { FileEntry } from "@/types";
import type { UploadingFileItem } from "./file-list-row-types";

const LIST_ROW_HEIGHT = 33.6;
const GRID_ROW_HEIGHT = 100;

type UseFileListVirtualizersOptions = {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  sortedFiles: FileEntry[];
  uploadingFiles: UploadingFileItem[];
  gridColumns: number;
  focusedIndex: number;
  viewMode: "list" | "grouped";
};

export function useFileListVirtualizers({
  scrollContainerRef,
  sortedFiles,
  uploadingFiles,
  gridColumns,
  focusedIndex,
  viewMode,
}: UseFileListVirtualizersOptions) {
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Virtual owns these imperative helpers; callers only consume the virtualizer instances.
  const listVirtualizer = useVirtualizer({
    count: sortedFiles.length + uploadingFiles.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => LIST_ROW_HEIGHT,
    overscan: 10,
  });

  const gridRowCount =
    Math.ceil(sortedFiles.length / gridColumns) +
    (uploadingFiles.length > 0
      ? Math.ceil(uploadingFiles.length / gridColumns)
      : 0);

  const gridVirtualizer = useVirtualizer({
    count: gridRowCount,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => GRID_ROW_HEIGHT,
    overscan: 5,
  });

  useEffect(() => {
    if (focusedIndex < 0) return;
    if (viewMode === "list") {
      listVirtualizer.scrollToIndex(focusedIndex, { align: "auto" });
      return;
    }

    const row = Math.floor(focusedIndex / gridColumns);
    gridVirtualizer.scrollToIndex(row, { align: "auto" });
  }, [focusedIndex, gridColumns, gridVirtualizer, listVirtualizer, viewMode]);

  return {
    gridVirtualizer,
    listVirtualizer,
  };
}
