import { Finder } from '../../src'
import { mockFetchFiles } from '../mock-data'

export default function BasicExample() {
  return (
    <Finder
      style={{ height: '100%' }}
      tabs={[{ key: 'files', label: 'Files', rootPath: '/' }]}
      onFetchFiles={mockFetchFiles}
    />
  )
}
