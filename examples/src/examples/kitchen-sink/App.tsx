import { useState, useCallback } from 'react'
import { Finder } from '@jeryfan/finder-ui'
import type { FileEntry, FinderLocale } from '@jeryfan/finder-ui'
import { fetchFiles, openFile, saveFile, uploadFiles } from '../../api'
import { downloadAndSave } from '../download'
import {
  ExampleButton,
  ExampleDivider,
  ExampleFrame,
  ExampleNote,
} from '../shared'

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

  const onDownload = useCallback(async (file: FileEntry) => {
    await downloadAndSave(file)
    console.log(`[download] ${file.name}`)
  }, [])

  const onBatchDownload = useCallback(async (files: FileEntry[]) => {
    await Promise.all(files.map(onDownload))
  }, [onDownload])

  return (
    <ExampleFrame
      toolbar={
        <>
        <ExampleNote>Theme:</ExampleNote>
        {(['default', 'graphite', 'minimal'] as const).map((t) => (
          <ExampleButton
            key={t}
            onClick={() => setTheme(t)}
            active={theme === t}
          >
            {t}
          </ExampleButton>
        ))}
        <ExampleDivider />
        <ExampleNote>Language:</ExampleNote>
        {(['en', 'zh'] as const).map((l) => (
          <ExampleButton
            key={l}
            onClick={() => setLang(l)}
            active={lang === l}
          >
            {l === 'en' ? 'English' : '中文'}
          </ExampleButton>
        ))}
        </>
      }
    >
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
        onDownload={onDownload}
        onBatchDownload={onBatchDownload}
      />
    </ExampleFrame>
  )
}
