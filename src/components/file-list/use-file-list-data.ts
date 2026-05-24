import { useEffect, useMemo, useState } from "react";
import type { FileEntry } from "@/types";

export type FileSortField = "name" | "lastModified" | "size";
export type FileSortOrder = "asc" | "desc";

export function useGridColumns(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [columns, setColumns] = useState(8);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculate = () => {
      const width = container.clientWidth - 24; // subtract padding
      const minColWidth = 90;
      const gap = 12;
      const cols = Math.max(1, Math.floor((width + gap) / (minColWidth + gap)));
      setColumns(cols);
    };

    calculate();
    const observer = new ResizeObserver(calculate);
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  return columns;
}

export function useSortedFiles(
  files: FileEntry[],
  searchQuery: string,
  sortField: FileSortField,
  sortOrder: FileSortOrder,
) {
  return useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filteredFiles = query
      ? files.filter((item) => item.name.toLowerCase().includes(query))
      : files;
    const direction = sortOrder === "asc" ? 1 : -1;

    return [...filteredFiles].sort((left, right) => {
      if (left.type !== right.type) return left.type === "directory" ? -1 : 1;
      if (sortField === "lastModified") {
        const leftTime = Date.parse(left.lastModified || "");
        const rightTime = Date.parse(right.lastModified || "");
        return (leftTime - rightTime) * direction;
      }
      if (sortField === "size") return (left.size - right.size) * direction;
      return left.name.localeCompare(right.name) * direction;
    });
  }, [files, searchQuery, sortField, sortOrder]);
}
