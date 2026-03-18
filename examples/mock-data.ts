import type { FileEntry } from '../src'

// ── Helpers ──────────────────────────────────────────────

export const mockDelay = (ms = 300) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

const entry = (
  name: string,
  path: string,
  type: 'file' | 'directory',
  size = 0,
  mimeType?: string,
  lastModified = '2026-01-15T10:30:00Z',
): FileEntry => ({ name, path, type, size, lastModified, mimeType })

// ── File Tree ────────────────────────────────────────────

const fileTree: Record<string, FileEntry[]> = {
  '/': [
    entry('Documents', '/Documents', 'directory'),
    entry('Photos', '/Photos', 'directory'),
    entry('Music', '/Music', 'directory'),
    entry('Projects', '/Projects', 'directory'),
    entry('README.md', '/README.md', 'file', 2048, 'text/markdown'),
    entry('config.json', '/config.json', 'file', 512, 'application/json'),
    entry('notes.txt', '/notes.txt', 'file', 1024, 'text/plain'),
  ],
  '/Documents': [
    entry('Reports', '/Documents/Reports', 'directory'),
    entry('guide.md', '/Documents/guide.md', 'file', 4096, 'text/markdown'),
    entry('data.csv', '/Documents/data.csv', 'file', 8192, 'text/csv'),
    entry('settings.json', '/Documents/settings.json', 'file', 256, 'application/json'),
    entry('todo.txt', '/Documents/todo.txt', 'file', 512, 'text/plain'),
  ],
  '/Documents/Reports': [
    entry('annual-2025.md', '/Documents/Reports/annual-2025.md', 'file', 12000, 'text/markdown'),
    entry('quarterly.csv', '/Documents/Reports/quarterly.csv', 'file', 6000, 'text/csv'),
    entry('summary.pdf', '/Documents/Reports/summary.pdf', 'file', 50000, 'application/pdf'),
  ],
  '/Photos': [
    entry('Vacation', '/Photos/Vacation', 'directory'),
    entry('sunset.jpg', '/Photos/sunset.jpg', 'file', 2500000, 'image/jpeg'),
    entry('logo.png', '/Photos/logo.png', 'file', 45000, 'image/png'),
    entry('banner.svg', '/Photos/banner.svg', 'file', 3200, 'image/svg+xml'),
  ],
  '/Photos/Vacation': [
    entry('beach.jpg', '/Photos/Vacation/beach.jpg', 'file', 3200000, 'image/jpeg'),
    entry('mountain.jpg', '/Photos/Vacation/mountain.jpg', 'file', 2800000, 'image/jpeg'),
  ],
  '/Music': [
    entry('playlist.m3u', '/Music/playlist.m3u', 'file', 128, 'text/plain'),
    entry('song.mp3', '/Music/song.mp3', 'file', 4500000, 'audio/mpeg'),
    entry('ambient.wav', '/Music/ambient.wav', 'file', 12000000, 'audio/wav'),
  ],
  '/Projects': [
    entry('web-app', '/Projects/web-app', 'directory'),
    entry('notes.md', '/Projects/notes.md', 'file', 1500, 'text/markdown'),
  ],
  '/Projects/web-app': [
    entry('src', '/Projects/web-app/src', 'directory'),
    entry('package.json', '/Projects/web-app/package.json', 'file', 800, 'application/json'),
    entry('tsconfig.json', '/Projects/web-app/tsconfig.json', 'file', 400, 'application/json'),
    entry('README.md', '/Projects/web-app/README.md', 'file', 2000, 'text/markdown'),
  ],
  '/Projects/web-app/src': [
    entry('index.ts', '/Projects/web-app/src/index.ts', 'file', 350, 'text/typescript'),
    entry('app.tsx', '/Projects/web-app/src/app.tsx', 'file', 1200, 'text/typescript'),
    entry('utils.ts', '/Projects/web-app/src/utils.ts', 'file', 600, 'text/typescript'),
  ],
}

// ── File Contents ────────────────────────────────────────

const fileContents: Record<string, string> = {
  '/README.md': `# My Project

Welcome to the project! This is a **demo** file system.

## Getting Started

1. Browse the sidebar tabs
2. Click files to preview them
3. Use the toolbar for actions

## Features

- File browsing with directory navigation
- Markdown preview with syntax highlighting
- CSV table rendering
- Code file preview
`,
  '/config.json': JSON.stringify(
    {
      name: 'finder-ui-demo',
      version: '1.0.0',
      theme: 'default',
      features: { preview: true, upload: true, search: true },
    },
    null,
    2,
  ),
  '/notes.txt': `Meeting notes - January 2026
============================

- Discussed project timeline
- Reviewed Q4 performance
- Planned upcoming sprint
- Action items assigned to team leads
`,
  '/Documents/guide.md': `# User Guide

## Navigation

Use the **sidebar** to switch between tabs. Click any folder to navigate into it.

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| \`↑/↓\` | Navigate files |
| \`Enter\` | Open file / Enter folder |
| \`Backspace\` | Go back |
| \`⌘+A\` | Select all |
| \`Delete\` | Delete selected |

## File Preview

Supported preview formats:
- Markdown (rendered)
- Code files (syntax highlighted)
- CSV (table view)
- Images (inline)
- Audio (player)
`,
  '/Documents/data.csv': `Name,Department,Salary,Start Date
Alice Johnson,Engineering,95000,2023-03-15
Bob Smith,Marketing,72000,2022-08-01
Carol Williams,Engineering,105000,2021-01-20
David Brown,Design,82000,2023-11-10
Eva Martinez,Marketing,68000,2024-02-28
Frank Lee,Engineering,98000,2022-05-14
Grace Kim,Design,88000,2023-07-03`,
  '/Documents/settings.json': JSON.stringify(
    { editor: { tabSize: 2, wordWrap: true }, display: { showHidden: false, sortBy: 'name' } },
    null,
    2,
  ),
  '/Documents/todo.txt': `TODO List
=========
[x] Set up project structure
[x] Implement file browser
[ ] Add drag-and-drop upload
[ ] Write documentation
[ ] Add unit tests
`,
  '/Documents/Reports/annual-2025.md': `# Annual Report 2025

## Executive Summary

The year 2025 saw significant growth across all departments.

### Key Metrics

| Metric | Q1 | Q2 | Q3 | Q4 |
|--------|----|----|----|----|
| Revenue | $1.2M | $1.5M | $1.8M | $2.1M |
| Users | 10K | 15K | 22K | 35K |
| NPS | 72 | 75 | 78 | 82 |

## Highlights

- Launched v2.0 of the platform
- Expanded to 3 new markets
- Achieved 99.9% uptime
`,
  '/Documents/Reports/quarterly.csv': `Quarter,Revenue,Expenses,Profit,Growth
Q1 2025,1200000,800000,400000,15%
Q2 2025,1500000,900000,600000,25%
Q3 2025,1800000,1000000,800000,20%
Q4 2025,2100000,1100000,1000000,17%`,
  '/Projects/notes.md': `# Project Notes

## Architecture

- React frontend with TypeScript
- Zustand for state management
- Vite for building

## Tasks

- [x] Component scaffolding
- [x] Store setup
- [ ] API integration
- [ ] Testing
`,
  '/Projects/web-app/package.json': JSON.stringify(
    {
      name: 'web-app',
      version: '0.1.0',
      scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
      dependencies: { react: '^19.0.0', 'react-dom': '^19.0.0' },
    },
    null,
    2,
  ),
  '/Projects/web-app/tsconfig.json': JSON.stringify(
    { compilerOptions: { target: 'ES2023', module: 'ESNext', jsx: 'react-jsx', strict: true } },
    null,
    2,
  ),
  '/Projects/web-app/README.md': `# Web App

A simple web application scaffolded with Vite + React + TypeScript.

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`
`,
  '/Projects/web-app/src/index.ts': `export { App } from './app'
export { formatDate, clamp } from './utils'
`,
  '/Projects/web-app/src/app.tsx': `import { useState } from 'react'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Hello World</h1>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
    </div>
  )
}
`,
  '/Projects/web-app/src/utils.ts': `export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
`,
  '/Music/playlist.m3u': `#EXTM3U
#EXTINF:210,Song Title
song.mp3
#EXTINF:180,Ambient Track
ambient.wav
`,
}

// ── Public API ───────────────────────────────────────────

export async function mockFetchFiles(path: string): Promise<FileEntry[]> {
  await mockDelay(200)
  return fileTree[path] ?? []
}

export async function mockOpenFile(file: FileEntry): Promise<string | void> {
  await mockDelay(150)
  const content = fileContents[file.path]
  if (content !== undefined) return content
  // For images/audio/video, return nothing (no text preview)
}
