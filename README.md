# finder-ui

A macOS Finder-style file browser component for React.

## Install

```bash
npm install finder-ui
```

## Quick Start

```tsx
import { Finder } from 'finder-ui'
import 'finder-ui/style.css'

function App() {
  return (
    <Finder
      style={{ height: '100vh' }}
      tabs={[
        { key: 'files', label: 'Files', rootPath: '/' },
      ]}
      onFetchFiles={async (path) => {
        const res = await fetch(`/api/files?path=${path}`)
        return (await res.json()).files
      }}
    />
  )
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `tabs` | `SidebarTab[]` | Yes | Tab configuration for sidebar navigation |
| `onFetchFiles` | `(path: string) => Promise<FileEntry[]>` | Yes | Fetch files for a directory path |
| `defaultTab` | `string` | No | Key of the initially active tab |
| `onOpenFile` | `(file: FileEntry) => Promise<string \| void>` | No | Handle file open; return content string to show in preview |
| `onDownload` | `(file: FileEntry) => void` | No | Handle single file download |
| `onBatchDownload` | `(files: FileEntry[]) => void` | No | Handle batch file download |
| `onUpload` | `(files: File[], targetPath?: string) => Promise<void>` | No | Handle file upload |
| `onSave` | `(path: string, content: string) => Promise<void>` | No | Handle save of edited file content |
| `editable` | `boolean` | No | Enable file editing in preview panel |
| `renderMarkdown` | `(content: string) => ReactNode` | No | Custom markdown renderer |
| `className` | `string` | No | Additional CSS class for root element |
| `style` | `CSSProperties` | No | Inline styles for root element (e.g. dimensions) |
| `theme` | `'target' \| 'graphite' \| 'clean'` | No | Theme variant (default: `'target'`) |

## Sizing

The component fills its parent by default (`width: 100%; height: 100%`). Use the `style` or `className` prop to set explicit dimensions:

```tsx
// Full viewport
<Finder style={{ height: '100vh' }} ... />

// Fixed height
<Finder style={{ height: 600 }} ... />

// Fill parent (parent must have explicit height)
<Finder ... />
```

## Multiple Instances

Each `<Finder>` creates an isolated store — multiple instances on the same page work independently with no shared state.

## Peer Dependencies

```json
{
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0",
  "zustand": "^5.0.0",
  "marked": "^17.0.0",
  "@codemirror/lang-json": "^6.0.0",
  "@codemirror/theme-one-dark": "^6.0.0",
  "@codemirror/state": "^6.0.0",
  "@codemirror/view": "^6.0.0",
  "@uiw/react-codemirror": "^4.20.0"
}
```

## License

[MIT](./LICENSE)
