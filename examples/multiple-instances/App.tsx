import { Finder } from '../../src'
import { fetchFiles, openFile } from '../api'

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
            theme="default"
            tabs={[
              { key: 'docs', label: 'Documents', rootPath: '/projects/docs' },
              { key: 'projects', label: 'Projects', rootPath: '/projects' },
            ]}
            onFetchFiles={fetchFiles}
            onOpenFile={openFile}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Finder
            style={{ height: '100%' }}
            theme="graphite"
            tabs={[
              { key: 'notes', label: 'Notes', rootPath: '/notes' },
              { key: 'archives', label: 'Archives', rootPath: '/archives' },
            ]}
            onFetchFiles={fetchFiles}
            onOpenFile={openFile}
          />
        </div>
      </div>
    </div>
  )
}
