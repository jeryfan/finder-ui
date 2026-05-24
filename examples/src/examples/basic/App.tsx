import { Finder } from '@jeryfan/finder-ui'
import { fetchFiles } from '../../api'

export default function BasicExample() {
  return (
    <Finder
      style={{ height: '100%' }}
      tabs={[{ key: 'files', label: 'Files', rootPath: '/' }]}
      onFetchFiles={fetchFiles}
    />
  )
}
