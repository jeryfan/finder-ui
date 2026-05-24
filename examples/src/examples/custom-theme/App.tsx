import { useState } from 'react'
import { Finder } from '@jeryfan/finder-ui'
import { fetchFiles, openFile } from '../../api'
import { ExampleButton, ExampleDivider, ExampleFrame, ExampleNote } from '../shared'

const themes = [
  { key: 'default' as const, label: 'Default (Amber)' },
  { key: 'graphite' as const, label: 'Graphite (Blue)' },
  { key: 'minimal' as const, label: 'Minimal (Green)' },
]

export default function CustomThemeExample() {
  const [theme, setTheme] = useState<'default' | 'graphite' | 'minimal'>('default')
  const [customBg, setCustomBg] = useState(false)

  return (
    <ExampleFrame
      toolbar={
        <>
        <ExampleNote>Theme:</ExampleNote>
        {themes.map(({ key, label }) => (
          <ExampleButton
            key={key}
            onClick={() => setTheme(key)}
            active={theme === key}
          >
            {label}
          </ExampleButton>
        ))}
        <ExampleDivider />
        <label style={{ fontSize: 13, color: '#666', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          <input type="checkbox" checked={customBg} onChange={(e) => setCustomBg(e.target.checked)} />
          Custom background (className override)
        </label>
        </>
      }
    >
      <style>{`.custom-bg { --color-background: #f0e6ff; --color-sidebar: #e8dcf5; }`}</style>
      <Finder
        style={{ height: '100%' }}
        theme={theme}
        className={customBg ? 'custom-bg' : undefined}
        tabs={[
          { key: 'all', label: 'All Files', rootPath: '/' },
          { key: 'projects', label: 'Projects', rootPath: '/projects' },
        ]}
        onFetchFiles={fetchFiles}
        onOpenFile={openFile}
      />
    </ExampleFrame>
  )
}
