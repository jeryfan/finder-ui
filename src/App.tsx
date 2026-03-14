import { Finder, type SidebarTab, type FileEntry } from './'

// --- Demo icon components ---

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

// --- Demo data ---

const TABS: SidebarTab[] = [
  { key: 'home', label: 'Home', rootPath: '/root', icon: HomeIcon },
  { key: 'workspace', label: 'Workspace', rootPath: '/root/workspace', icon: WorkspaceIcon },
  { key: 'skills', label: 'Skills', rootPath: '/root/.claude/skills', icon: SkillsIcon },
]

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

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// --- Demo handlers ---

const handleFetchFiles = async (path: string): Promise<FileEntry[]> => {
  await wait(120)
  return seedEntries[path] || []
}

const handleOpenFile = async (file: FileEntry): Promise<string | void> => {
  if (file.type !== 'file') return
  return seedFileContents[file.path] || `File: ${file.name}\nSize: ${file.size} bytes\n`
}

const handleSave = async (path: string, content: string) => {
  console.log('Saving file:', path, 'Content length:', content.length)
  await wait(800)
}

// --- App ---

function App() {
  return (
    <main className="finder-ui-playground">
      <section className="finder-ui-canvas">
        <Finder
          tabs={TABS}
          defaultTab="home"
          onFetchFiles={handleFetchFiles}
          onOpenFile={handleOpenFile}
          onDownload={(file) => console.log('Downloading file:', file)}
          onBatchDownload={(files) => console.log('Batch downloading files:', files)}
          onUpload={(files, targetPath) => console.log('Upload:', files.length, 'files to:', targetPath)}
          onSave={handleSave}
          editable
        />
      </section>
    </main>
  )
}

export default App
