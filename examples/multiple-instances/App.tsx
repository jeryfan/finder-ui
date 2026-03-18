import { Finder } from '../../src'
import { mockFetchFiles, mockOpenFile } from '../mock-data'

export default function MultipleInstancesExample() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 12px', fontSize: 13, color: '#666', borderBottom: '1px solid #eee' }}>
        Two independent Finder instances side by side. Each has its own state — navigating or selecting in one does not affect the other.
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 1, background: '#ddd' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Finder
            style={{ height: '100%' }}
            theme="target"
            tabs={[
              { key: 'docs', label: 'Documents', rootPath: '/Documents' },
              { key: 'projects', label: 'Projects', rootPath: '/Projects' },
            ]}
            onFetchFiles={mockFetchFiles}
            onOpenFile={mockOpenFile}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Finder
            style={{ height: '100%' }}
            theme="graphite"
            tabs={[
              { key: 'photos', label: 'Photos', rootPath: '/Photos' },
              { key: 'music', label: 'Music', rootPath: '/Music' },
            ]}
            onFetchFiles={mockFetchFiles}
            onOpenFile={mockOpenFile}
          />
        </div>
      </div>
    </div>
  )
}
