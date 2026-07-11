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

export function getPreviewContentKind(preview: PreviewWindow): PreviewContentKind {
  const extension = extractExtension(preview.name);
  const mimeType = preview.mimeType?.toLowerCase() ?? "";
  const isMarkdown = isMarkdownFile(preview.name) || mimeType === "text/markdown";
  const isHtml = isHtmlFile(preview.name) || mimeType === "text/html";
  const isCsv = isCsvFile(preview.name) || mimeType === "text/csv";
  const isCode =
    isCodeFile(preview.name) ||
    mimeType === "application/json" ||
    mimeType.endsWith("+json") ||
    mimeType === "application/xml" ||
    mimeType.endsWith("+xml");

  if (isImageFile(preview.name) || mimeType.startsWith("image/")) return { kind: "image", extension };
  if (isVideoFile(preview.name) || mimeType.startsWith("video/")) return { kind: "video", extension };
  if (isAudioFile(preview.name) || mimeType.startsWith("audio/")) return { kind: "audio", extension };
  if (isPdfFile(preview.name) || mimeType === "application/pdf") return { kind: "pdf", extension };
  if (isCsv) return { kind: "csv", extension };
  if (isMarkdown && !preview.isEditing) return { kind: "markdown", extension };
  if (isHtml && !preview.isEditing) return { kind: "html", extension };
  if (isCode || isMarkdown || isHtml) return { kind: "code", extension };

  return { kind: "text", extension };
}
