import { Finder } from '../../src'
import { mockFetchFiles, mockOpenFile } from '../mock-data'

export default function WithPreviewExample() {
  return (
    <Finder
      style={{ height: '100%' }}
      tabs={[
        { key: 'docs', label: 'Documents', rootPath: '/Documents' },
        { key: 'projects', label: 'Projects', rootPath: '/Projects' },
        { key: 'all', label: 'All Files', rootPath: '/' },
      ]}
      onFetchFiles={mockFetchFiles}
      onOpenFile={mockOpenFile}
    />
  )
}
