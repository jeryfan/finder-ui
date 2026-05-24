import { ChevronLeftIcon, ChevronRightIcon } from "@/icons";
import type { FinderLocale } from "@/locale";
import { cn } from "@/utils";

export type ToolbarNavigationProps = {
  historyIndex: number;
  historyStackLength: number;
  locale: FinderLocale;
  onGoBack: () => void;
  onGoForward: () => void;
};

export function ToolbarNavigation({
  historyIndex,
  historyStackLength,
  locale,
  onGoBack,
  onGoForward,
}: ToolbarNavigationProps) {
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < historyStackLength - 1;

  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <button
        onClick={onGoBack}
        disabled={!canGoBack}
        className={cn(
          "p-1 rounded hover:bg-muted transition-colors",
          !canGoBack && "cursor-not-allowed opacity-30",
        )}
        aria-label={locale.back}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>
      <button
        onClick={onGoForward}
        disabled={!canGoForward}
        className={cn(
          "p-1 rounded hover:bg-muted transition-colors",
          !canGoForward && "cursor-not-allowed opacity-30",
        )}
        aria-label={locale.forward}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
