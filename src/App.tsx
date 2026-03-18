import { useState } from 'react'
import { Finder, type SidebarTab, type FileEntry, type FinderLocale } from './'
import { IMAGE_EXTENSIONS, VIDEO_EXTENSIONS, AUDIO_EXTENSIONS } from './constants'
import { enLocale } from './locale/en'
import { zhCNLocale } from './locale/zh-CN'

// ── Icons ──────────────────────────────────────────────────────

const ProjectsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

const NotesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const ArchiveIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
)

// ── Tabs ───────────────────────────────────────────────────────

const TABS: SidebarTab[] = [
  { key: 'projects', label: 'Projects', rootPath: '/projects', icon: ProjectsIcon },
  { key: 'notes', label: 'Notes', rootPath: '/notes', icon: NotesIcon },
  { key: 'archives', label: 'Archives', rootPath: '/archives', icon: ArchiveIcon },
]

// ── Helpers ────────────────────────────────────────────────────

function triggerDownload(content: string, filename: string) {
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

const THEMES = ['target', 'graphite', 'clean'] as const
type Theme = (typeof THEMES)[number]

const LOCALES: Record<string, Partial<FinderLocale>> = {
  en: enLocale,
  'zh-CN': zhCNLocale,
}

// ── App ────────────────────────────────────────────────────────

function App() {
  const [theme, setTheme] = useState<Theme>('target')
  const [localeKey, setLocaleKey] = useState('en')

  const handleFetchFiles = async (path: string): Promise<FileEntry[]> => {
    const res = await fetch(`/api/files?path=${encodeURIComponent(path)}`)
    const data = await res.json()
    return data.files
  }

  const handleOpenFile = async (file: FileEntry): Promise<string | void> => {
    if (file.type !== 'file') return
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    const url = `/api/files?fileName=${encodeURIComponent(file.path)}&t=${Date.now()}`

    if (IMAGE_EXTENSIONS.has(ext) || VIDEO_EXTENSIONS.has(ext) || AUDIO_EXTENSIONS.has(ext) || ext === 'pdf') {
      const res = await fetch(url)
      const blob = await res.blob()
      return URL.createObjectURL(blob)
    }

    const res = await fetch(url)
    const data = await res.json()
    return data.file.content
  }

  const handleSave = async (path: string, content: string) => {
    const parentDir = path.substring(0, path.lastIndexOf('/'))
    const fileName = path.substring(path.lastIndexOf('/') + 1)
    const blob = new Blob([content], { type: 'text/plain' })
    const form = new FormData()
    form.append('path', parentDir)
    form.append('files', blob, fileName)
    await fetch('/api/files/upload', { method: 'POST', body: form })
  }

  const handleUpload = async (files: File[], targetPath = '/') => {
    const dir = targetPath
    const hasRelativePaths = files.some((f) => f.webkitRelativePath?.includes('/'))

    if (!hasRelativePaths) {
      const form = new FormData()
      form.append('path', dir)
      for (const f of files) form.append('files', f, f.name)
      await fetch('/api/files/upload', { method: 'POST', body: form })
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
        return fetch('/api/files/upload', { method: 'POST', body: form })
      }),
    )
  }

  const handleDownload = async (file: FileEntry) => {
    const res = await fetch(
      `/api/files?fileName=${encodeURIComponent(file.path)}&t=${Date.now()}`,
    )
    const data = await res.json()
    triggerDownload(data.file.content, file.name)
  }

  const handleBatchDownload = (files: FileEntry[]) => {
    for (const f of files) handleDownload(f)
  }

  return (
    <div
      className="h-screen w-screen flex bg-[#F9F6F1]"
      style={{
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* ── Outer App Sidebar ── */}
      <aside className="h-full w-64 flex-shrink-0 flex flex-col px-4">
        <div className="flex-shrink-0 pt-4 pb-1">
          <h2 className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-3">Demo Controls</h2>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-medium text-[#999] uppercase tracking-wider">Theme</label>
              <div className="flex gap-1 mt-1">
                {THEMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                      theme === t
                        ? 'bg-[#2E2929] text-white border-[#2E2929]'
                        : 'bg-white text-[#2E2929] border-[#EAE9E6] hover:bg-[#F6F5F4]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-medium text-[#999] uppercase tracking-wider">Locale</label>
              <div className="flex gap-1 mt-1">
                {Object.keys(LOCALES).map((key) => (
                  <button
                    key={key}
                    onClick={() => setLocaleKey(key)}
                    className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                      localeKey === key
                        ? 'bg-[#2E2929] text-white border-[#2E2929]'
                        : 'bg-white text-[#2E2929] border-[#EAE9E6] hover:bg-[#F6F5F4]'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-0" />
        <div className="pt-1 pb-4 flex-shrink-0" />
      </aside>

      {/* ── Content: Finder ── */}
      <div className="flex-1 min-w-0 h-full pt-4 pr-4 pb-4">
        <Finder
          tabs={TABS}
          defaultTab="projects"
          style={{ height: '100%', width: '100%' }}
          theme={theme}
          locale={LOCALES[localeKey]}
          onFetchFiles={handleFetchFiles}
          onOpenFile={handleOpenFile}
          onSave={handleSave}
          onUpload={handleUpload}
          onDownload={handleDownload}
          onBatchDownload={handleBatchDownload}
          editable
        />
      </div>
    </div>
  )
}

export default App
