import type { FileEntry } from '@jeryfan/finder-ui'
import { downloadFile, triggerDownload } from '../api'

export async function downloadAndSave(file: FileEntry): Promise<void> {
  const blob = await downloadFile(file)
  triggerDownload(blob, file.name)
}
