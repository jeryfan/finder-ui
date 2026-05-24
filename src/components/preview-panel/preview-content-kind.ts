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

export type PreviewContentKind =
  | { kind: "image"; extension: string }
  | { kind: "video"; extension: string }
  | { kind: "audio"; extension: string }
  | { kind: "pdf"; extension: string }
  | { kind: "csv"; extension: string }
  | { kind: "markdown"; extension: string }
  | { kind: "html"; extension: string }
  | { kind: "code"; extension: string }
  | { kind: "text"; extension: string };

export function getPreviewContentKind(preview: PreviewWindow) {
  const extension = extractExtension(preview.name);
  const isMarkdown = isMarkdownFile(preview.name);
  const isHtml = isHtmlFile(preview.name);

  if (isImageFile(preview.name)) return { kind: "image", extension };
  if (isVideoFile(preview.name)) return { kind: "video", extension };
  if (isAudioFile(preview.name)) return { kind: "audio", extension };
  if (isPdfFile(preview.name)) return { kind: "pdf", extension };
  if (isCsvFile(preview.name)) return { kind: "csv", extension };
  if (isMarkdown && !preview.isEditing) return { kind: "markdown", extension };
  if (isHtml && !preview.isEditing) return { kind: "html", extension };
  if (isCodeFile(preview.name) || isMarkdown || isHtml) return { kind: "code", extension };

  return { kind: "text", extension };
}
