/** Recursively read all files from a FileSystemEntry tree */
export const readEntryFiles = async (entry: FileSystemEntry): Promise<File[]> => {
  if (entry.isFile) {
    return new Promise((resolve) => {
      (entry as FileSystemFileEntry).file(
        (file) => resolve([file]),
        () => resolve([]),
      )
    })
  }
  if (entry.isDirectory) {
    const reader = (entry as FileSystemDirectoryEntry).createReader()
    const entries = await new Promise<FileSystemEntry[]>((resolve) => {
      const allEntries: FileSystemEntry[] = []
      const readBatch = () => {
        reader.readEntries(
          (batch) => {
            if (batch.length === 0) {
              resolve(allEntries)
            } else {
              allEntries.push(...batch)
              readBatch()
            }
          },
          () => resolve(allEntries),
        )
      }
      readBatch()
    })
    const nested = await Promise.all(entries.map(readEntryFiles))
    return nested.flat()
  }
  return []
}
