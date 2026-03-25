import type { FileEntry } from '../src'
import { IMAGE_EXTENSIONS, VIDEO_EXTENSIONS, AUDIO_EXTENSIONS } from '../src/constants'

const API_BASE = '/api'

export async function fetchFiles(path: string): Promise<FileEntry[]> {
  const res = await fetch(`${API_BASE}/files?path=${encodeURIComponent(path)}`)
  const data = await res.json()
  return data.files
}

export async function openFile(file: FileEntry): Promise<string | void> {
  if (file.type !== 'file') return
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  const url = `${API_BASE}/files?fileName=${encodeURIComponent(file.path)}&t=${Date.now()}`

  if (IMAGE_EXTENSIONS.has(ext) || VIDEO_EXTENSIONS.has(ext) || AUDIO_EXTENSIONS.has(ext) || ext === 'pdf') {
    const res = await fetch(url)
    const blob = await res.blob()
    return URL.createObjectURL(blob)
  }

  const res = await fetch(url)
  const data = await res.json()
  return data.file.content
}

export async function saveFile(path: string, content: string): Promise<void> {
  const parentDir = path.substring(0, path.lastIndexOf('/'))
  const fileName = path.substring(path.lastIndexOf('/') + 1)
  const blob = new Blob([content], { type: 'text/plain' })
  const form = new FormData()
  form.append('path', parentDir)
  form.append('files', blob, fileName)
  await fetch(`${API_BASE}/files/upload`, { method: 'POST', body: form })
}

export async function uploadFiles(files: File[], targetPath = '/'): Promise<void> {
  const dir = targetPath
  const hasRelativePaths = files.some((f) => f.webkitRelativePath?.includes('/'))

  if (!hasRelativePaths) {
    const form = new FormData()
    form.append('path', dir)
    for (const f of files) form.append('files', f, f.name)
    await fetch(`${API_BASE}/files/upload`, { method: 'POST', body: form })
    return
  }

  const groups = new Map<string, File[]>()
  for (const file of files) {
    const parts = (file.webkitRelativePath || file.name).split('/')
    parts.pop()
    const dirKey = parts.join('/')
    if (!groups.has(dirKey)) groups.set(dirKey, [])
    groups.get(dirKey)!.push(file)
  }

  await Promise.all(
    Array.from(groups.entries()).map(([dirKey, groupFiles]) => {
      const targetDir = dir === '/' ? `/${dirKey}` : `${dir}/${dirKey}`
      const form = new FormData()
      form.append('path', targetDir)
      for (const f of groupFiles) form.append('files', f, f.name)
      return fetch(`${API_BASE}/files/upload`, { method: 'POST', body: form })
    }),
  )
}

export async function downloadFile(file: FileEntry): Promise<string> {
  const res = await fetch(
    `${API_BASE}/files?fileName=${encodeURIComponent(file.path)}&t=${Date.now()}`,
  )
  const data = await res.json()
  return data.file.content
}

export function triggerDownload(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
