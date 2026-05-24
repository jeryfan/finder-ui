import { Search } from "lucide-react";
import type { FinderLocale } from "@/locale";

export type ToolbarSearchProps = {
  searchQuery: string;
  locale: FinderLocale;
  onSearchChange: (value: string) => void;
};

export function ToolbarSearch({
  searchQuery,
  locale,
  onSearchChange,
}: ToolbarSearchProps) {
  return (
    <div className="relative flex min-w-0 shrink-0 items-center">
      <Search className="pointer-events-none absolute left-2 h-3.5 w-3.5 text-muted-foreground" />
      <input
        type="text"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={locale.search}
        className="h-7 w-[clamp(5rem,18vw,8rem)] min-w-0 rounded-md border border-border bg-muted/50 pl-7 pr-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
