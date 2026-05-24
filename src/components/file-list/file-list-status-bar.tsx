import { Loader2 } from "lucide-react";
import type { FinderLocale } from "@/locale";

export type FileListStatusBarProps = {
  locale: FinderLocale;
  fileCount: number;
  selectedCount: number;
  uploadingCount: number;
  loading: boolean;
};

export function FileListStatusBar({
  locale,
  fileCount,
  selectedCount,
  uploadingCount,
  loading,
}: FileListStatusBarProps) {
  return (
    <div className="flex h-6 shrink-0 items-center gap-2 border-t border-border bg-muted/20 px-3 text-[10px] leading-4 text-muted-foreground">
      <span>{locale.items(fileCount)}</span>
      {selectedCount > 0 && <span>{locale.selected(selectedCount)}</span>}
      {uploadingCount > 0 && (
        <span className="flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin text-[#3B82F6]" />
          {locale.uploading(uploadingCount)}
        </span>
      )}
      {uploadingCount === 0 && loading && (
        <span className="flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin text-[#3B82F6]" />
          {locale.refreshing}
        </span>
      )}
    </div>
  );
}
