import { ChevronDownIcon } from "@/icons";
import type { FinderLocale } from "@/locale";
import { cn } from "@/utils";
import type { FileSortField, FileSortOrder } from "./use-file-list-data";

export type FileListHeaderProps = {
  locale: FinderLocale;
  sortField: FileSortField;
  sortOrder: FileSortOrder;
  dateColumnClass: string;
  sizeColumnClass: string;
  onSort: (field: FileSortField) => void;
};

export function FileListHeader({
  locale,
  sortField,
  sortOrder,
  dateColumnClass,
  sizeColumnClass,
  onSort,
}: FileListHeaderProps) {
  const renderSortIcon = (field: FileSortField) => (
    sortField === field && (
      <ChevronDownIcon
        className={cn(
          "w-3 h-3",
          sortOrder === "desc" && "rotate-180",
        )}
      />
    )
  );

  return (
    <div className="flex items-center gap-2 px-2 py-1 text-[10px] leading-4 font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
      <button
        onClick={() => onSort("name")}
        className="flex-1 text-left flex items-center gap-1 hover:text-foreground"
      >
        {locale.name}
        {renderSortIcon("name")}
      </button>
      <button
        onClick={() => onSort("lastModified")}
        className={`${dateColumnClass} text-left flex items-center gap-1 hover:text-foreground`}
      >
        {locale.dateModified}
        {renderSortIcon("lastModified")}
      </button>
      <button
        onClick={() => onSort("size")}
        className={`${sizeColumnClass} text-right flex items-center justify-end gap-1 hover:text-foreground`}
      >
        {locale.size}
        {renderSortIcon("size")}
      </button>
    </div>
  );
}
