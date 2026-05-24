import { Finder } from '@jeryfan/finder-ui'
import { fetchFiles, openFile } from '../../api'
import { ExampleFrame, ExampleNote } from '../shared'

export default function MultipleInstancesExample() {
  return (
    <ExampleFrame
      toolbar={
        <ExampleNote>
        Two independent Finder instances side by side. Each has its own state — navigating or selecting in one does not affect the other.
        </ExampleNote>
      }
    >
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
    </ExampleFrame>
  )
}
