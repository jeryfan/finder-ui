import { useMemo } from "react";
import type { FinderLocale } from "@/locale";
import type { SidebarTab } from "@/types";

type UseFinderBreadcrumbsOptions = {
  tabs: SidebarTab[];
  activeTab: string | undefined;
  currentPath: string;
  locale: FinderLocale;
};

export function useFinderBreadcrumbs({
  tabs,
  activeTab,
  currentPath,
  locale,
}: UseFinderBreadcrumbsOptions) {
  return useMemo(() => {
    const tab = tabs.find((item) => item.key === activeTab);
    const tabLabel = tab?.label ?? locale.sidebarTitle;
    const rootPath = tab?.rootPath ?? "/";
    const items: Array<{ label: string; path: string }> = [
      { label: tabLabel, path: rootPath },
    ];

    if (currentPath === rootPath) return items;

    const relativePath = currentPath.startsWith(`${rootPath}/`)
      ? currentPath.slice(rootPath.length + 1)
      : currentPath.slice(1);
    const segments = relativePath.split("/").filter(Boolean);
    let cursor = rootPath;

    for (const segment of segments) {
      cursor = `${cursor}/${segment}`;
      items.push({ label: segment, path: cursor });
    }

    return items;
  }, [activeTab, currentPath, locale.sidebarTitle, tabs]);
}
