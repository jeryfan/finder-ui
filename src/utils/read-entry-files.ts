/** Recursively read all files from a FileSystemEntry tree, preserving relative paths */
export const readEntryFiles = async (
  entry: FileSystemEntry,
  parentPath = '',
): Promise<File[]> => {
  if (entry.isFile) {
    return new Promise((resolve) => {
      (entry as FileSystemFileEntry).file(
        (file) => {
          const relativePath = parentPath
            ? `${parentPath}/${file.name}`
            : file.name
          const fileWithPath = new File([file], file.name, {
            type: file.type,
            lastModified: file.lastModified,
          })
          Object.defineProperty(fileWithPath, 'webkitRelativePath', {
            value: relativePath,
            writable: false,
          })
          resolve([fileWithPath])
        },
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
    const currentPath = parentPath ? `${parentPath}/${entry.name}` : entry.name
    const nested = await Promise.all(
      entries.map((e) => readEntryFiles(e, currentPath)),
    )
    return nested.flat()
  }
  return []
}
