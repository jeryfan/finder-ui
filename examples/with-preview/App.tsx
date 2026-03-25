import { Finder } from '../../src'
import { fetchFiles, openFile } from '../api'

export default function WithPreviewExample() {
  return (
    <Finder
      style={{ height: '100%' }}
      tabs={[
        { key: 'docs', label: 'Documents', rootPath: '/projects/docs' },
        { key: 'projects', label: 'Projects', rootPath: '/projects' },
        { key: 'all', label: 'All Files', rootPath: '/' },
      ]}
      onFetchFiles={fetchFiles}
      onOpenFile={openFile}
    />
  )
}
