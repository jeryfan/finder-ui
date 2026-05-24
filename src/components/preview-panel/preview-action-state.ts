import type { PreviewWindow } from "@/types";
import { getPreviewContentKind } from "./preview-content-kind";

export function getPreviewActionState(
  preview: PreviewWindow,
  updateEnabled: boolean,
  options?: { blockSaveWhileLoading?: boolean },
) {
  const contentKind = getPreviewContentKind(preview);
  const previewEditableExtensions = new Set(["md", "markdown", "html", "htm"]);
  const isPreviewMode =
    contentKind.kind === "markdown" || contentKind.kind === "html";
  const isEditMode =
    contentKind.kind === "code" &&
    previewEditableExtensions.has(contentKind.extension);
  const isEditableFile = contentKind.kind === "code" || contentKind.kind === "text";
  const hasChanges = preview.draftContent !== preview.content;
  const blockedByLoading = options?.blockSaveWhileLoading && preview.isLoading;
  const canSave = updateEnabled && hasChanges && !preview.isSaving && !blockedByLoading;

  return {
    isPreviewMode,
    isEditMode,
    isEditableFile,
    canSave,
    shouldShowSave: updateEnabled && (isEditMode || isEditableFile),
  };
}
