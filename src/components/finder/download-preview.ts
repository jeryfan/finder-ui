import type { PreviewWindow } from "@/types";

export function downloadPreviewContent(preview: PreviewWindow) {
  const blob = new Blob([preview.content], { type: "text/plain;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = preview.name;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(href);
}
