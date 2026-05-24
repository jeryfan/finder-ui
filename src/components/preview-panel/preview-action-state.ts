import type { PreviewWindow } from "@/types";
import { isHtmlFile, isImageFile, isMarkdownFile, isVideoFile } from "@/utils";

export function getPreviewActionState(
  preview: PreviewWindow,
  updateEnabled: boolean,
  options?: { blockSaveWhileLoading?: boolean },
) {
  const isMarkdown = isMarkdownFile(preview.name);
  const isHtml = isHtmlFile(preview.name);
  const isImage = isImageFile(preview.name);
  const isVideo = isVideoFile(preview.name);
  const isPreviewable = isMarkdown || isHtml;
  const isPreviewMode = isPreviewable && !preview.isEditing;
  const isEditMode = isPreviewable && preview.isEditing;
  const isEditableFile = !isPreviewable && !isImage && !isVideo;
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
