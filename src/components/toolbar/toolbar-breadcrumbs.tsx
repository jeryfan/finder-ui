import { ChevronRightIcon as BreadcrumbSep } from "@/icons";
import { cn } from "@/utils";

export type BreadcrumbItem = {
  label: string;
  path: string;
};

export type ToolbarBreadcrumbsProps = {
  breadcrumbs: BreadcrumbItem[];
  onNavigate: (path: string) => void;
};

export function ToolbarBreadcrumbs({
  breadcrumbs,
  onNavigate,
}: ToolbarBreadcrumbsProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden whitespace-nowrap text-sm font-medium">
      {breadcrumbs.length === 1 ? (
        <span className="truncate font-semibold text-foreground">
          {breadcrumbs[0].label}
        </span>
      ) : (
        breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <div key={crumb.path} className="flex min-w-0 items-center gap-1">
              <button
                onClick={() => onNavigate(crumb.path)}
                className={cn(
                  "truncate text-sm transition-colors",
                  isLast
                    ? "font-semibold text-foreground"
                    : "font-medium text-foreground hover:text-foreground/80",
                )}
              >
                {crumb.label}
              </button>
              {!isLast && (
                <BreadcrumbSep className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
