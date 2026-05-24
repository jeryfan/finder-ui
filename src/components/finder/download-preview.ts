import type { PreviewWindow } from "@/types";
import { getPreviewContentKind } from "@/components/preview-panel/preview-content-kind";

function triggerDownload(href: string, filename: string, revoke = false) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  if (revoke) URL.revokeObjectURL(href);
}

export function downloadPreviewContent(preview: PreviewWindow) {
  const contentKind = getPreviewContentKind(preview);

  if (
    contentKind.kind === "image" ||
    contentKind.kind === "video" ||
    contentKind.kind === "audio" ||
    contentKind.kind === "pdf"
  ) {
    triggerDownload(preview.content, preview.name);
    return;
  }

  const blob = new Blob([preview.draftContent], {
    type: preview.mimeType || "text/plain;charset=utf-8",
  });
  const href = URL.createObjectURL(blob);
  triggerDownload(href, preview.name, true);
}
