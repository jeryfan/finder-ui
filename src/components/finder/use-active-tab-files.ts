import { useEffect } from "react";
import type { SidebarTab } from "@/types";

type UseActiveTabFilesOptions = {
  activeTab: string | undefined;
  tabs: SidebarTab[];
  previousTabRef: React.MutableRefObject<string | undefined>;
  navigateTo: (path: string) => void;
  loadFiles: (path: string) => Promise<void>;
};

export function useActiveTabFiles({
  activeTab,
  tabs,
  previousTabRef,
  navigateTo,
  loadFiles,
}: UseActiveTabFilesOptions) {
  useEffect(() => {
    if (activeTab === previousTabRef.current) return;
    previousTabRef.current = activeTab;
    const tab = tabs.find((item) => item.key === activeTab);
    if (!tab) return;
    navigateTo(tab.rootPath);
    loadFiles(tab.rootPath);
  }, [activeTab, loadFiles, navigateTo, previousTabRef, tabs]);
}
