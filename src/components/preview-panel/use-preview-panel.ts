import { useMemo } from "react";
import { useFinderStore, useFinderStoreApi } from "@/store";
import type { PreviewWindow } from "@/types";
import { GROUPED_PREVIEW_GAP, PREVIEW_GAP } from "./constants";

export function usePreviewPanel(leftPaneWidth: number) {
  const {
    previews,
    activePreviewPath,
    previewMode,
    updateEnabled,
    files,
    locale,
    setActivePreviewPath,
    setPreviewMode,
    closePreview,
    updatePreviewDraft,
    setPreviewEditing,
    setPreviewSaving,
    refreshPreview,
    onSavePreview,
    onOpen,
  } = useFinderStore();

  const storeApi = useFinderStoreApi();

  const activePreview = useMemo(
    () => previews.find(item => item.path === activePreviewPath) ?? previews[previews.length - 1] ?? null,
    [activePreviewPath, previews],
  );

  const groupedMode = previewMode === "grouped" && previews.length > 0;
  const previewLeft = leftPaneWidth + (groupedMode ? GROUPED_PREVIEW_GAP : PREVIEW_GAP);

  const handleSave = async (preview: PreviewWindow) => {
    if (!updateEnabled) return;
    setPreviewSaving(preview.path, true);
    try {
      await onSavePreview(preview.path, preview.draftContent);
      refreshPreview(preview.path, preview.draftContent);
    } catch (err) {
      storeApi.getState().setPreviewError(
        preview.path,
        err instanceof Error ? err.message : locale.failedToSave,
      );
    } finally {
      setPreviewSaving(preview.path, false);
    }
  };

  const handleRefresh = (path: string) => {
    const preview = previews.find(p => p.path === path);
    if (!preview) return;
    onOpen({
      path: preview.path,
      name: preview.name,
      size: preview.size,
      type: "file",
      mimeType: preview.mimeType,
    });
  };

  const handleMaximize = (path: string) => {
    setActivePreviewPath(path);
    setPreviewMode("grouped");
  };

  return {
    previews,
    activePreview,
    activePreviewPath,
    groupedMode,
    previewLeft,
    updateEnabled,
    files,
    locale,
    closePreview,
    updatePreviewDraft,
    setPreviewEditing,
    setActivePreviewPath,
    setPreviewMode,
    onOpen,
    handleSave,
    handleRefresh,
    handleMaximize,
  };
}
