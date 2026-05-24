import { Grid2X2, List } from "lucide-react";
import type { FinderLocale } from "@/locale";
import { cn } from "@/utils";

export type ToolbarViewMode = "list" | "grouped";

export type ToolbarViewToggleProps = {
  viewMode: ToolbarViewMode;
  locale: FinderLocale;
  onViewModeChange: (mode: ToolbarViewMode) => void;
};

export function ToolbarViewToggle({
  viewMode,
  locale,
  onViewModeChange,
}: ToolbarViewToggleProps) {
  return (
    <div className="flex shrink-0 items-center gap-0.5 rounded-md border border-border p-0.5">
      <button
        onClick={() => onViewModeChange("grouped")}
        className={cn(
          "p-1 rounded transition-colors",
          viewMode === "grouped" ? "bg-muted" : "hover:bg-muted/50",
        )}
        aria-label={locale.groupedView}
      >
        <Grid2X2 className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => onViewModeChange("list")}
        className={cn(
          "p-1 rounded transition-colors",
          viewMode === "list" ? "bg-muted" : "hover:bg-muted/50",
        )}
        aria-label={locale.listView}
      >
        <List className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
