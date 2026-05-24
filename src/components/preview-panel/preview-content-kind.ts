import {
  extractExtension,
  isAudioFile,
  isCodeFile,
  isCsvFile,
  isHtmlFile,
  isImageFile,
  isMarkdownFile,
  isPdfFile,
  isVideoFile,
} from "@/utils";
import type { PreviewWindow } from "@/types";

export function getPreviewContentKind(preview: PreviewWindow) {
  const isMarkdown = isMarkdownFile(preview.name);
  const isHtml = isHtmlFile(preview.name);
  const isMarkdownEditing = isMarkdown && preview.isEditing;
  const isHtmlEditing = isHtml && preview.isEditing;
  const isCode = isCodeFile(preview.name);

  return {
    extension: extractExtension(preview.name),
    isMarkdown,
    isHtml,
    isImage: isImageFile(preview.name),
    isVideo: isVideoFile(preview.name),
    isAudio: isAudioFile(preview.name),
    isCsv: isCsvFile(preview.name),
    isPdf: isPdfFile(preview.name),
    shouldUseCodeEditor: isCode || isMarkdownEditing || isHtmlEditing,
  };
}
