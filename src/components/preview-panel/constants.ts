export const PREVIEW_TOP_INSET = 0
export const PREVIEW_BOTTOM_INSET = 0
export const PREVIEW_GAP = 9
export const GROUPED_PREVIEW_GAP = 9

export function getPreviewLeftPaneWidth(previewCount: number) {
  if (previewCount <= 1) return 515
  if (previewCount === 2) return 466
  return 392
}
