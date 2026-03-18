import { useState } from 'react'
import { Finder } from '../../src'
import type { FinderLocale } from '../../src'
import { mockFetchFiles, mockOpenFile } from '../mock-data'

const jaLocale: Partial<FinderLocale> = {
  search: '検索',
  noFiles: 'ファイルが見つかりません',
  tryDifferentSearch: '別の検索語をお試しください',
  failedToLoad: 'ファイルの読み込みに失敗しました',
  retry: '再試行',
  name: '名前',
  dateModified: '変更日',
  size: 'サイズ',
  items: (count) => `${count} 項目`,
  selected: (count) => `${count} 件選択`,
  uploading: (count) => `${count} ファイルをアップロード中`,
  refreshing: '更新中',
  dropFilesToUpload: 'ファイルをここにドロップしてアップロード',
  open: '開く',
  download: 'ダウンロード',
  downloadAll: 'すべてダウンロード',
  uploadFiles: 'ファイルをアップロード',
  uploadFolder: 'フォルダをアップロード',
  refresh: '更新',
  rename: '名前を変更',
  delete: '削除',
  newFolder: '新規フォルダ',
  itemsSelected: (count) => `${count} 件を選択中`,
  deleteConfirm: (name) => `「${name}」を削除しますか？`,
  deleteMultipleConfirm: (count) => `${count} 件を削除しますか？`,
}

const locales: Record<string, { label: string; value: Partial<FinderLocale> | undefined }> = {
  en: { label: 'English', value: undefined },
  'zh-CN': {
    label: '中文',
    value: {
      search: '搜索',
      noFiles: '没有找到文件',
      tryDifferentSearch: '请尝试其他搜索词',
      failedToLoad: '加载文件失败',
      retry: '重试',
      name: '名称',
      dateModified: '修改日期',
      size: '大小',
      items: (count) => `${count} 个项目`,
      selected: (count) => `已选择 ${count} 个`,
      uploading: (count) => `正在上传 ${count} 个文件`,
      refreshing: '刷新中',
      dropFilesToUpload: '拖放文件到此处上传',
      open: '打开',
      download: '下载',
      downloadAll: '全部下载',
      uploadFiles: '上传文件',
      uploadFolder: '上传文件夹',
      refresh: '刷新',
      rename: '重命名',
      delete: '删除',
      newFolder: '新建文件夹',
      itemsSelected: (count) => `已选择 ${count} 个项目`,
      deleteConfirm: (name) => `确定删除"${name}"吗？`,
      deleteMultipleConfirm: (count) => `确定删除 ${count} 个项目吗？`,
    },
  },
  ja: { label: '日本語', value: jaLocale },
}

export default function I18nExample() {
  const [localeKey, setLocaleKey] = useState('en')

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 12px', display: 'flex', gap: 8, borderBottom: '1px solid #eee', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: '#666' }}>Language:</span>
        {Object.entries(locales).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setLocaleKey(key)}
            style={{
              padding: '4px 12px',
              borderRadius: 4,
              border: '1px solid #ddd',
              background: localeKey === key ? '#333' : '#fff',
              color: localeKey === key ? '#fff' : '#333',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Finder
          style={{ height: '100%' }}
          tabs={[
            { key: 'docs', label: 'Documents', rootPath: '/Documents' },
            { key: 'all', label: 'All Files', rootPath: '/' },
          ]}
          onFetchFiles={mockFetchFiles}
          onOpenFile={mockOpenFile}
          locale={locales[localeKey].value}
        />
      </div>
    </div>
  )
}
