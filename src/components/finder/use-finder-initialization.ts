import { useEffect, useRef } from "react";
import type { FinderLocale } from "@/locale";
import { enLocale } from "@/locale/en";
import type { SidebarTab } from "@/types";

type FinderCapabilityFlags = {
  canRename: boolean;
  canDelete: boolean;
  canCreateFolder: boolean;
  canUpload: boolean;
  canDownload: boolean;
  canBatchDownload: boolean;
};

type UseFinderInitializationOptions = {
  tabs: SidebarTab[];
  defaultTab: string | undefined;
  editable: boolean;
  locale: Partial<FinderLocale> | undefined;
  capabilityFlags: FinderCapabilityFlags;
  previousTabRef: React.MutableRefObject<string | undefined>;
  loadFiles: (path: string) => Promise<void>;
  setTabs: (tabs: SidebarTab[]) => void;
  setActiveTab: (tab: string) => void;
  setUpdateEnabled: (enabled: boolean) => void;
  setLocale: (locale: FinderLocale) => void;
  setHasRename: (has: boolean) => void;
  setHasDelete: (has: boolean) => void;
  setHasCreateFolder: (has: boolean) => void;
  setHasUpload: (has: boolean) => void;
  setHasDownload: (has: boolean) => void;
  setHasBatchDownload: (has: boolean) => void;
};

export function useFinderInitialization({
  tabs,
  defaultTab,
  editable,
  locale,
  capabilityFlags,
  previousTabRef,
  loadFiles,
  setTabs,
  setActiveTab,
  setUpdateEnabled,
  setLocale,
  setHasRename,
  setHasDelete,
  setHasCreateFolder,
  setHasUpload,
  setHasDownload,
  setHasBatchDownload,
}: UseFinderInitializationOptions) {
  const initialConfigRef = useRef({
    tabs,
    defaultTab,
    editable,
    locale,
    capabilityFlags,
  });

  useEffect(() => {
    const initial = initialConfigRef.current;
    setTabs(initial.tabs);

    const initialTab = initial.defaultTab || initial.tabs[0]?.key;
    previousTabRef.current = initialTab;
    if (initialTab) setActiveTab(initialTab);

    setUpdateEnabled(initial.editable);
    if (initial.locale) {
      setLocale({ ...enLocale, ...initial.locale });
    }

    setHasRename(initial.capabilityFlags.canRename);
    setHasDelete(initial.capabilityFlags.canDelete);
    setHasCreateFolder(initial.capabilityFlags.canCreateFolder);
    setHasUpload(initial.capabilityFlags.canUpload);
    setHasDownload(initial.capabilityFlags.canDownload);
    setHasBatchDownload(initial.capabilityFlags.canBatchDownload);

    const initialRootPath =
      initial.tabs.find((tab) => tab.key === initialTab)?.rootPath ||
      initial.tabs[0]?.rootPath;
    if (initialRootPath) {
      loadFiles(initialRootPath);
    }
  }, [
    loadFiles,
    previousTabRef,
    setActiveTab,
    setHasBatchDownload,
    setHasCreateFolder,
    setHasDelete,
    setHasDownload,
    setHasRename,
    setHasUpload,
    setLocale,
    setTabs,
    setUpdateEnabled,
  ]);
}
