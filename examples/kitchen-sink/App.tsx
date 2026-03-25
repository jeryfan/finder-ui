import { useState, useCallback } from 'react'
import { Finder } from '../../src'
import type { FileEntry, FinderLocale } from '../../src'
import { fetchFiles, openFile, saveFile, uploadFiles } from '../api'

const zhCN: Partial<FinderLocale> = {
  search: '搜索', noFiles: '没有找到文件', tryDifferentSearch: '请尝试其他搜索词',
  failedToLoad: '加载文件失败', retry: '重试', name: '名称', dateModified: '修改日期',
  size: '大小', items: (c) => `${c} 个项目`, selected: (c) => `已选择 ${c} 个`,
  uploading: (c) => `正在上传 ${c} 个文件`, refreshing: '刷新中',
  dropFilesToUpload: '拖放文件到此处上传', open: '打开', download: '下载',
  downloadAll: '全部下载', uploadFiles: '上传文件', uploadFolder: '上传文件夹',
  refresh: '刷新', rename: '重命名', delete: '删除', newFolder: '新建文件夹',
  itemsSelected: (c) => `已选择 ${c} 个项目`,
  deleteConfirm: (n) => `确定删除"${n}"吗？`,
  deleteMultipleConfirm: (c) => `确定删除 ${c} 个项目吗？`,
}

export default function KitchenSinkExample() {
  const [theme, setTheme] = useState<'default' | 'graphite' | 'minimal'>('default')
  const [lang, setLang] = useState<'en' | 'zh'>('en')

  const onSave = useCallback(async (path: string, content: string) => {
    await saveFile(path, content)
    console.log(`[save] ${path} (${content.length} chars)`)
  }, [])

  const onUpload = useCallback(async (files: File[], targetPath?: string) => {
    await uploadFiles(files, targetPath ?? '/')
    console.log(`[upload] ${files.length} files to ${targetPath ?? '/'}`)
  }, [])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 12px', display: 'flex', gap: 8, borderBottom: '1px solid #eee', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: '#666' }}>Theme:</span>
        {(['default', 'graphite', 'minimal'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            style={{
              padding: '4px 10px', borderRadius: 4, border: '1px solid #ddd', fontSize: 13, cursor: 'pointer',
              background: theme === t ? '#333' : '#fff', color: theme === t ? '#fff' : '#333',
            }}
          >
            {t}
          </button>
        ))}
        <span style={{ width: 1, height: 20, background: '#ddd' }} />
        <span style={{ fontSize: 13, color: '#666' }}>Language:</span>
        {(['en', 'zh'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              padding: '4px 10px', borderRadius: 4, border: '1px solid #ddd', fontSize: 13, cursor: 'pointer',
              background: lang === l ? '#333' : '#fff', color: lang === l ? '#fff' : '#333',
            }}
          >
            {l === 'en' ? 'English' : '中文'}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Finder
          style={{ height: '100%' }}
          theme={theme}
          locale={lang === 'zh' ? zhCN : undefined}
          editable
          tabs={[
            { key: 'all', label: 'All Files', rootPath: '/' },
            { key: 'projects', label: 'Projects', rootPath: '/projects' },
            { key: 'docs', label: 'Documents', rootPath: '/projects/docs' },
            { key: 'notes', label: 'Notes', rootPath: '/notes' },
            { key: 'archives', label: 'Archives', rootPath: '/archives' },
          ]}
          onFetchFiles={fetchFiles}
          onOpenFile={openFile}
          onUpload={onUpload}
          onSave={onSave}
        />
      </div>
    </div>
  )
}
