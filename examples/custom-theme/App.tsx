import { useState } from 'react'
import { Finder } from '../../src'
import { mockFetchFiles, mockOpenFile } from '../mock-data'

const themes = [
  { key: 'default' as const, label: 'Default (Amber)' },
  { key: 'graphite' as const, label: 'Graphite (Blue)' },
  { key: 'minimal' as const, label: 'Minimal (Green)' },
]

export default function CustomThemeExample() {
  const [theme, setTheme] = useState<'default' | 'graphite' | 'minimal'>('default')
  const [customBg, setCustomBg] = useState(false)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 12px', display: 'flex', gap: 8, borderBottom: '1px solid #eee', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: '#666' }}>Theme:</span>
        {themes.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            style={{
              padding: '4px 12px',
              borderRadius: 4,
              border: '1px solid #ddd',
              background: theme === key ? '#333' : '#fff',
              color: theme === key ? '#fff' : '#333',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {label}
          </button>
        ))}
        <span style={{ width: 1, height: 20, background: '#ddd' }} />
        <label style={{ fontSize: 13, color: '#666', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          <input type="checkbox" checked={customBg} onChange={(e) => setCustomBg(e.target.checked)} />
          Custom background (className override)
        </label>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <style>{`.custom-bg { --finder-bg: #f0e6ff; --finder-bg-sidebar: #e8dcf5; }`}</style>
        <Finder
          style={{ height: '100%' }}
          theme={theme}
          className={customBg ? 'custom-bg' : undefined}
          tabs={[
            { key: 'all', label: 'All Files', rootPath: '/' },
            { key: 'photos', label: 'Photos', rootPath: '/Photos' },
          ]}
          onFetchFiles={mockFetchFiles}
          onOpenFile={mockOpenFile}
        />
      </div>
    </div>
  )
}
