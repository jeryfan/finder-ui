import { useState } from 'react'
import BasicExample from './basic/App'
import WithPreviewExample from './with-preview/App'
import FileOperationsExample from './file-operations/App'
import I18nExample from './i18n/App'
import CustomThemeExample from './custom-theme/App'
import MultipleInstancesExample from './multiple-instances/App'
import KitchenSinkExample from './kitchen-sink/App'

const examples = [
  { key: 'basic', label: 'Basic', desc: 'Minimal setup — one tab, file listing only', component: BasicExample },
  { key: 'with-preview', label: 'With Preview', desc: 'File preview for Markdown, code, CSV, and more', component: WithPreviewExample },
  { key: 'file-operations', label: 'File Operations', desc: 'Rename, delete, create folder, upload, and save', component: FileOperationsExample },
  { key: 'i18n', label: 'Internationalization', desc: 'Switch between English, Chinese, and Japanese', component: I18nExample },
  { key: 'custom-theme', label: 'Custom Theme', desc: 'Theme switching and CSS variable overrides', component: CustomThemeExample },
  { key: 'multiple-instances', label: 'Multiple Instances', desc: 'Two independent Finder instances side by side', component: MultipleInstancesExample },
  { key: 'kitchen-sink', label: 'Kitchen Sink', desc: 'All features combined in one demo', component: KitchenSinkExample },
] as const

export default function ExamplesApp() {
  const [active, setActive] = useState('basic')
  const current = examples.find((e) => e.key === active) ?? examples[0]
  const Component = current.component

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Sidebar */}
      <nav
        style={{
          width: 240,
          flexShrink: 0,
          borderRight: '1px solid #e5e5e5',
          background: '#fafafa',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '16px 16px 12px', fontWeight: 600, fontSize: 15, color: '#333' }}>
          finder-ui examples
        </div>
        {examples.map(({ key, label, desc }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '10px 16px',
              border: 'none',
              cursor: 'pointer',
              background: active === key ? '#e8e8e8' : 'transparent',
              borderLeft: active === key ? '3px solid #333' : '3px solid transparent',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: active === key ? 600 : 400, color: '#222' }}>{label}</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{desc}</div>
          </button>
        ))}
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
        <Component />
      </main>
    </div>
  )
}
