type UseFileListDisplayStateOptions = {
  fileCount: number;
  uploadingCount: number;
  loading: boolean;
  loadError: string | null;
  searchQuery: string;
  viewMode: "list" | "grouped";
};

export function useFileListDisplayState({
  fileCount,
  uploadingCount,
  loading,
  loadError,
  searchQuery,
  viewMode,
}: UseFileListDisplayStateOptions) {
  const hasContent = fileCount > 0 || uploadingCount > 0;
  const showListHeader = viewMode === "list" && (fileCount > 0 || loading);
  const showSkeleton = loading && fileCount === 0;

  return {
    hasContent,
    showEmptyState: fileCount === 0 && uploadingCount === 0 && !loading && !loadError,
    showGroupedSkeleton: viewMode === "grouped" && showSkeleton,
    showListHeader,
    showListSkeleton: viewMode === "list" && showSkeleton,
    showSearchHint: !!searchQuery,
  };
}
