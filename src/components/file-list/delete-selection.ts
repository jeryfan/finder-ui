import type { FinderLocale } from '@/locale'
import type { FileEntry } from '@/types'

export type DeleteSelectionRequest = {
  files: FileEntry[]
  message: string
}

export function getDeleteSelectionRequest({
  files,
  selectedPaths,
  locale,
}: {
  files: FileEntry[]
  selectedPaths: Set<string>
  locale: FinderLocale
}): DeleteSelectionRequest | null {
  const selectedFiles = files.filter((file) => selectedPaths.has(file.path))
  if (!selectedFiles.length) return null

  return {
    files: selectedFiles,
    message: selectedFiles.length === 1
      ? locale.deleteConfirm(selectedFiles[0].name)
      : locale.deleteMultipleConfirm(selectedFiles.length),
  }
}
