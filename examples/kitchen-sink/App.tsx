import { useState, useCallback } from 'react'
import { Finder } from '../../src'
import type { FileEntry, FinderLocale } from '../../src'
import { mockOpenFile, mockDelay } from '../mock-data'

const initialTree: Record<string, FileEntry[]> = {
  '/': [
    { name: 'Documents', path: '/Documents', type: 'directory', size: 0, lastModified: '2026-01-15T10:30:00Z' },
    { name: 'Photos', path: '/Photos', type: 'directory', size: 0, lastModified: '2026-01-14T08:00:00Z' },
    { name: 'Music', path: '/Music', type: 'directory', size: 0, lastModified: '2026-01-13T16:00:00Z' },
    { name: 'Projects', path: '/Projects', type: 'directory', size: 0, lastModified: '2026-01-12T12:00:00Z' },
    { name: 'README.md', path: '/README.md', type: 'file', size: 2048, mimeType: 'text/markdown', lastModified: '2026-01-15T10:30:00Z' },
    { name: 'config.json', path: '/config.json', type: 'file', size: 512, mimeType: 'application/json', lastModified: '2026-01-10T08:00:00Z' },
  ],
  '/Documents': [
    { name: 'Reports', path: '/Documents/Reports', type: 'directory', size: 0, lastModified: '2026-01-14T09:00:00Z' },
    { name: 'guide.md', path: '/Documents/guide.md', type: 'file', size: 4096, mimeType: 'text/markdown', lastModified: '2026-01-13T11:00:00Z' },
    { name: 'data.csv', path: '/Documents/data.csv', type: 'file', size: 8192, mimeType: 'text/csv', lastModified: '2026-01-12T15:00:00Z' },
    { name: 'settings.json', path: '/Documents/settings.json', type: 'file', size: 256, mimeType: 'application/json', lastModified: '2026-01-11T09:00:00Z' },
  ],
  '/Documents/Reports': [
    { name: 'annual-2025.md', path: '/Documents/Reports/annual-2025.md', type: 'file', size: 12000, mimeType: 'text/markdown', lastModified: '2026-01-10T10:00:00Z' },
    { name: 'quarterly.csv', path: '/Documents/Reports/quarterly.csv', type: 'file', size: 6000, mimeType: 'text/csv', lastModified: '2026-01-09T14:00:00Z' },
  ],
  '/Photos': [
    { name: 'Vacation', path: '/Photos/Vacation', type: 'directory', size: 0, lastModified: '2026-01-08T10:00:00Z' },
    { name: 'sunset.jpg', path: '/Photos/sunset.jpg', type: 'file', size: 2500000, mimeType: 'image/jpeg', lastModified: '2026-01-07T17:00:00Z' },
    { name: 'logo.png', path: '/Photos/logo.png', type: 'file', size: 45000, mimeType: 'image/png', lastModified: '2026-01-06T11:00:00Z' },
  ],
  '/Photos/Vacation': [
    { name: 'beach.jpg', path: '/Photos/Vacation/beach.jpg', type: 'file', size: 3200000, mimeType: 'image/jpeg', lastModified: '2026-01-05T09:00:00Z' },
  ],
  '/Music': [
    { name: 'song.mp3', path: '/Music/song.mp3', type: 'file', size: 4500000, mimeType: 'audio/mpeg', lastModified: '2026-01-04T20:00:00Z' },
    { name: 'playlist.m3u', path: '/Music/playlist.m3u', type: 'file', size: 128, mimeType: 'text/plain', lastModified: '2026-01-03T15:00:00Z' },
  ],
  '/Projects': [
    { name: 'web-app', path: '/Projects/web-app', type: 'directory', size: 0, lastModified: '2026-01-02T10:00:00Z' },
    { name: 'notes.md', path: '/Projects/notes.md', type: 'file', size: 1500, mimeType: 'text/markdown', lastModified: '2026-01-01T12:00:00Z' },
  ],
  '/Projects/web-app': [
    { name: 'package.json', path: '/Projects/web-app/package.json', type: 'file', size: 800, mimeType: 'application/json', lastModified: '2025-12-30T10:00:00Z' },
    { name: 'README.md', path: '/Projects/web-app/README.md', type: 'file', size: 2000, mimeType: 'text/markdown', lastModified: '2025-12-29T10:00:00Z' },
  ],
}

const zhCN: Partial<FinderLocale> = {
  search: '搜索', noFiles: '没有找到文件', tryDifferentSearch: '请尝试其他搜索词',
  failedToLoad: '加载文件失败', retry: '重试', name: '名称', dateModified: '修改日期',
  size: '大小', items: (c) => `${c} 个项目`, selected: (c) => `已选择 ${c} 个`,
  uploading: (c) => `正在上传 ${c} 个文件`, refreshing: '刷新中',
  dropFilesToUpload: '拖放文件到此处上传', open: '打开', download: '下载',
  downloadAll: '全部下载', uploadFiles: '上传文件', uploadFolder: '上传文件夹',
  refresh: '刷新', rename: '重命名', delete: '删除', newFolder: '新建文件夹',
  itemsSelected: (c) => `已选择 ${c} 个项目`,
  deleteConfirm: (n) => `确定删除"${n}"吗？`,
  deleteMultipleConfirm: (c) => `确定删除 ${c} 个项目吗？`,
}

export default function KitchenSinkExample() {
  const [tree, setTree] = useState(initialTree)
  const [theme, setTheme] = useState<'default' | 'graphite' | 'minimal'>('default')
  const [lang, setLang] = useState<'en' | 'zh'>('en')

  const parentOf = (p: string) => {
    const parts = p.split('/')
    parts.pop()
    return parts.join('/') || '/'
  }

  const onFetchFiles = useCallback(
    async (path: string) => {
      await mockDelay(200)
      return tree[path] ?? []
    },
    [tree],
  )

  const onRename = useCallback(async (file: FileEntry, newName: string) => {
    await mockDelay(200)
    const parent = parentOf(file.path)
    const newPath = parent === '/' ? `/${newName}` : `${parent}/${newName}`
    console.log(`[rename] ${file.path} → ${newPath}`)
    setTree((prev) => {
      const next = { ...prev }
      next[parent] = (prev[parent] ?? []).map((f) =>
        f.path === file.path ? { ...f, name: newName, path: newPath } : f,
      )
      if (file.type === 'directory' && prev[file.path]) {
        next[newPath] = prev[file.path]
        delete next[file.path]
      }
      return next
    })
  }, [])

  const onDelete = useCallback(async (files: FileEntry[]) => {
    await mockDelay(200)
    console.log('[delete]', files.map((f) => f.path))
    setTree((prev) => {
      const next = { ...prev }
      for (const file of files) {
        const parent = parentOf(file.path)
        next[parent] = (next[parent] ?? []).filter((f) => f.path !== file.path)
        if (file.type === 'directory') delete next[file.path]
      }
      return next
    })
  }, [])

  const onCreateFolder = useCallback(async (parentPath: string, name: string) => {
    await mockDelay(200)
    const folderPath = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`
    console.log(`[createFolder] ${folderPath}`)
    setTree((prev) => ({
      ...prev,
      [parentPath]: [
        ...(prev[parentPath] ?? []),
        { name, path: folderPath, type: 'directory' as const, size: 0, lastModified: new Date().toISOString() },
      ],
      [folderPath]: [],
    }))
  }, [])

  const onUpload = useCallback(async (files: File[], targetPath?: string) => {
    await mockDelay(300)
    const dir = targetPath ?? '/'
    console.log(`[upload] ${files.length} files to ${dir}`)
    setTree((prev) => ({
      ...prev,
      [dir]: [
        ...(prev[dir] ?? []),
        ...files.map((f) => ({
          name: f.name,
          path: dir === '/' ? `/${f.name}` : `${dir}/${f.name}`,
          type: 'file' as const,
          size: f.size,
          mimeType: f.type,
          lastModified: new Date().toISOString(),
        })),
      ],
    }))
  }, [])

  const onSave = useCallback(async (path: string, content: string) => {
    await mockDelay(200)
    console.log(`[save] ${path} (${content.length} chars)`)
  }, [])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 12px', display: 'flex', gap: 8, borderBottom: '1px solid #eee', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: '#666' }}>Theme:</span>
        {(['default', 'graphite', 'minimal'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            style={{
              padding: '4px 10px', borderRadius: 4, border: '1px solid #ddd', fontSize: 13, cursor: 'pointer',
              background: theme === t ? '#333' : '#fff', color: theme === t ? '#fff' : '#333',
            }}
          >
            {t}
          </button>
        ))}
        <span style={{ width: 1, height: 20, background: '#ddd' }} />
        <span style={{ fontSize: 13, color: '#666' }}>Language:</span>
        {(['en', 'zh'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              padding: '4px 10px', borderRadius: 4, border: '1px solid #ddd', fontSize: 13, cursor: 'pointer',
              background: lang === l ? '#333' : '#fff', color: lang === l ? '#fff' : '#333',
            }}
          >
            {l === 'en' ? 'English' : '中文'}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Finder
          style={{ height: '100%' }}
          theme={theme}
          locale={lang === 'zh' ? zhCN : undefined}
          editable
          tabs={[
            { key: 'all', label: 'All Files', rootPath: '/' },
            { key: 'docs', label: 'Documents', rootPath: '/Documents' },
            { key: 'photos', label: 'Photos', rootPath: '/Photos' },
            { key: 'music', label: 'Music', rootPath: '/Music' },
            { key: 'projects', label: 'Projects', rootPath: '/Projects' },
          ]}
          onFetchFiles={onFetchFiles}
          onOpenFile={mockOpenFile}
          onRename={onRename}
          onDelete={onDelete}
          onCreateFolder={onCreateFolder}
          onUpload={onUpload}
          onSave={onSave}
        />
      </div>
    </div>
  )
}
