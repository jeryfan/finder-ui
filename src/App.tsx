import { useEffect, useMemo } from 'react'
import {
  Sidebar,
  FileList,
  ContextMenu,
  useStore,
  type SidebarTab,
  type FileEntry,
} from './'
import { Toolbar } from '@/components/toolbar'
import { PreviewPanel, getPreviewLeftPaneWidth } from '@/components/preview-panel'

// 示例：自定义图标组件
const HomeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const WorkspaceIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

const SkillsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
)

// 模拟文件数据
const seedEntries: Record<string, FileEntry[]> = {
  '/root': [
    { name: '.cache', path: '/root/.cache', size: 0, type: 'directory', lastModified: new Date().toISOString() },
    { name: '.claude', path: '/root/.claude', size: 0, type: 'directory', lastModified: new Date().toISOString() },
    { name: '.claude.json', path: '/root/.claude.json', size: 702, type: 'file', lastModified: new Date().toISOString(), mimeType: 'application/json' },
    { name: 'README.md', path: '/root/README.md', size: 2048, type: 'file', lastModified: new Date().toISOString(), mimeType: 'text/markdown' },
    { name: 'package.json', path: '/root/package.json', size: 1536, type: 'file', lastModified: new Date().toISOString(), mimeType: 'application/json' },
    { name: 'app.tsx', path: '/root/app.tsx', size: 3072, type: 'file', lastModified: new Date().toISOString(), mimeType: 'text/typescript' },
    { name: 'styles.css', path: '/root/styles.css', size: 1024, type: 'file', lastModified: new Date().toISOString(), mimeType: 'text/css' },
  ],
  '/root/.claude': [
    { name: 'SKILL.md', path: '/root/.claude/SKILL.md', size: 321, type: 'file', lastModified: new Date().toISOString(), mimeType: 'text/markdown' },
    { name: 'skills', path: '/root/.claude/skills', size: 0, type: 'directory', lastModified: new Date().toISOString() },
  ],
  '/root/workspace': [
    { name: 'demo-session', path: '/root/workspace/demo-session', size: 0, type: 'directory', lastModified: new Date().toISOString() },
  ],
  '/root/.claude/skills': [
    { name: 'docx', path: '/root/.claude/skills/docx', size: 0, type: 'directory', lastModified: new Date().toISOString() },
    { name: 'pdf', path: '/root/.claude/skills/pdf', size: 0, type: 'directory', lastModified: new Date().toISOString() },
  ],
  '/root/.claude/skills/docx': [
    { name: 'SKILL.md', path: '/root/.claude/skills/docx/SKILL.md', size: 1000, type: 'file', lastModified: new Date().toISOString(), mimeType: 'text/markdown' },
  ],
}

const seedFileContents: Record<string, string> = {
  '/root/.claude.json': '{\n  "theme": "light",\n  "tabSize": 2\n}\n',
  '/root/.claude/SKILL.md': '# Demo Skill\n\nThis is a local preview for `finder-ui`.\n',
  '/root/.claude/skills/docx/SKILL.md': '# DOCX\n\nUse this skill to generate and edit Word documents.\n',
  '/root/README.md': '# Finder UI\n\nA file browser UI component library for React.\n\n## Features\n\n- File list with sort and search\n- Preview panel with code editor\n- Context menu\n- Sidebar navigation\n',
  '/root/package.json': JSON.stringify({ name: '@jeryfan/finder-ui', version: '0.1.0', description: 'Finder-style file browser UI', dependencies: { react: '^19.2.0', zustand: '^5.0.0' } }, null, 2),
  '/root/app.tsx': 'import React from \'react\';\nimport { useStore } from \'./store\';\n\nexport const App: React.FC = () => {\n  const { data, loading } = useStore();\n\n  if (loading) {\n    return <div>Loading...</div>;\n  }\n\n  return (\n    <div className="container">\n      <h1>{data.title}</h1>\n      <p>{data.description}</p>\n    </div>\n  );\n};\n',
  '/root/styles.css': '.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 20px;\n}\n\n.header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 1px solid #eae9e6;\n}\n',
}

const TABS: SidebarTab[] = [
  { key: 'home', label: 'Home', rootPath: '/root', icon: HomeIcon },
  { key: 'workspace', label: 'Workspace', rootPath: '/root/workspace', icon: WorkspaceIcon },
  { key: 'skills', label: 'Skills', rootPath: '/root/.claude/skills', icon: SkillsIcon },
]

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function App() {
  const {
    currentPath,
    historyStack,
    historyIndex,
    activeTab,
    viewMode,
    searchQuery,
    previews,
    setTabs,
    setActiveTab,
    setFiles,
    setLoading,
    setUpdateEnabled,
    setOpenHandler,
    setDownloadHandler,
    setBatchDownloadHandler,
    setUploadHandler,
    setRefreshHandler,
    setSavePreviewHandler,
    setNavigateToPathHandler,
    setCurrentPath,
    navigateTo,
    goBack,
    goForward,
    setViewMode,
    setSearchQuery,
    openPreview,
  } = useStore()

  const leftPaneWidth = getPreviewLeftPaneWidth(previews.length)

  const loadFiles = async (path: string) => {
    setLoading(true)
    await wait(120)
    const entries = seedEntries[path] || []
    setFiles(entries)
    setCurrentPath(path)
    setLoading(false)
  }

  const breadcrumbs = useMemo(() => {
    const tab = TABS.find(t => t.key === activeTab)
    const tabLabel = tab?.label ?? 'Files'
    const rootPath = tab?.rootPath ?? '/root'
    const items: Array<{ label: string; path: string }> = [{ label: tabLabel, path: rootPath }]
    if (currentPath === rootPath) return items
    const relativePath = currentPath.startsWith(`${rootPath}/`) ? currentPath.slice(rootPath.length + 1) : currentPath.slice(1)
    const segments = relativePath.split('/').filter(Boolean)
    let cursor = rootPath
    segments.forEach((segment) => {
      cursor = `${cursor}/${segment}`
      items.push({ label: segment, path: cursor })
    })
    return items
  }, [activeTab, currentPath])

  useEffect(() => {
    setTabs(TABS)
    setActiveTab('home')
    setUpdateEnabled(true)

    setNavigateToPathHandler((path: string) => {
      loadFiles(path)
    })

    setOpenHandler((file: FileEntry) => {
      if (file.type === 'file') {
        const content = seedFileContents[file.path] || `File: ${file.name}\nSize: ${file.size} bytes\n`
        openPreview(file, content)
      }
    })

    setDownloadHandler((file: FileEntry) => {
      console.log('Downloading file:', file)
    })

    setBatchDownloadHandler((downloadFiles: FileEntry[]) => {
      console.log('Batch downloading files:', downloadFiles)
    })

    setUploadHandler((isFolder: boolean, targetPath?: string) => {
      console.log('Upload:', isFolder ? 'folder' : 'files', 'to:', targetPath)
    })

    setRefreshHandler(() => {
      loadFiles(useStore.getState().currentPath)
    })

    setSavePreviewHandler(async (path: string, content: string) => {
      console.log('Saving file:', path, 'Content length:', content.length)
      await wait(800)
    })

    loadFiles('/root')
  }, [])

  const handleTabChange = (tabKey: string) => {
    const tab = TABS.find(t => t.key === tabKey)
    if (!tab) return
    setActiveTab(tabKey)
    const rootPath = tab.rootPath
    navigateTo(rootPath)
    loadFiles(rootPath)
  }

  const handleNavigate = (path: string) => {
    navigateTo(path)
    loadFiles(path)
  }

  const handleDownloadPreview = async (path: string) => {
    const preview = previews.find(p => p.path === path)
    if (!preview) return
    const blob = new Blob([preview.content], { type: 'text/plain;charset=utf-8' })
    const href = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = href
    anchor.download = preview.name
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(href)
  }

  return (
    <main className="finder-ui-playground">
      <section className="finder-ui-canvas">
        <div
          className="h-full w-full relative overflow-hidden select-none finder-ui-root bg-[#F9F6F1] [&_*]:[scrollbar-width:none] [&_*::-webkit-scrollbar]:hidden"
          data-finder-theme="target"
          style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          <div className="relative h-full flex">
            {/* Main content area - both left pane and preview stack live here */}
            <div className="flex-1 min-w-0 h-full p-4 pl-0 relative z-10 overflow-hidden">
              {/* Left pane - file list area, with dynamic width when previews are open */}
              <div
                className="overflow-hidden transition-all duration-300 ease-out absolute inset-0"
                style={previews.length > 0 ? { width: `${leftPaneWidth}px` } : undefined}
              >
                <div className="relative overflow-hidden bg-white rounded-2xl transition-all duration-300 ease-out flex-1 h-full">
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="h-full flex bg-white text-[#2E2929] overflow-hidden select-none" data-finder-window="true">
                      <Sidebar tabs={TABS} />

                      <section className="flex-1 flex flex-col min-w-0">
                        <Toolbar
                          historyIndex={historyIndex}
                          historyStackLength={historyStack.length}
                          breadcrumbs={breadcrumbs}
                          viewMode={viewMode}
                          searchQuery={searchQuery}
                          onGoBack={goBack}
                          onGoForward={goForward}
                          onNavigate={handleNavigate}
                          onViewModeChange={setViewMode}
                          onSearchChange={setSearchQuery}
                        />
                        <FileList />
                      </section>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview stack - positioned to the right of the left pane */}
              <PreviewPanel
                leftPaneWidth={leftPaneWidth}
                onDownloadPreview={handleDownloadPreview}
              />
            </div>
          </div>

          <ContextMenu />
        </div>
      </section>
    </main>
  )
}

export default App
