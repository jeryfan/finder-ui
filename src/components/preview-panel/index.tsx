import { useEffect, useMemo, useRef } from 'react'
import { json as jsonLanguage } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import CodeMirror from '@uiw/react-codemirror'
import { useStore } from '@/store'
import {
  FileIcon,
  FileCodeIcon,
  FileSpreadsheetIcon,
  PresentationIcon,
  ImageIcon,
  FileArchiveIcon,
  FilmIcon,
  LoaderIcon,
  DownloadIcon,
  SaveIcon,
  RefreshIcon,
  EditIcon,
  CloseIcon,
  MaximizeIcon,
  MinimizeIcon,
} from '@/icons'
import { cn, extractExtension } from '@/utils'
import type { PreviewWindow } from '@/types'
import {
  MARKDOWN_EXTENSIONS,
  CODE_EXTENSIONS,
  CODE_ICON_EXTENSIONS,
  BRACES_EXTENSIONS,
  SPREADSHEET_EXTENSIONS,
  TEXT_EXTENSIONS,
  ARCHIVE_EXTENSIONS,
  IMAGE_EXTENSIONS,
  VIDEO_EXTENSIONS,
} from '@/constants'

const PREVIEW_TOP_INSET = 0
const PREVIEW_BOTTOM_INSET = 0
const PREVIEW_GAP = 9
const GROUPED_PREVIEW_GAP = 9

export function getPreviewLeftPaneWidth(previewCount: number) {
  if (previewCount <= 1) return 515
  if (previewCount === 2) return 466
  return 392
}

const isMarkdownFile = (name: string) => MARKDOWN_EXTENSIONS.has(extractExtension(name))
const isCodeFile = (name: string) => CODE_EXTENSIONS.has(extractExtension(name))

const resolveMimeType = (preview: PreviewWindow) =>
  (preview.mimeType || preview.mimetype || '').toLowerCase()

const getFilePreviewType = (preview: PreviewWindow) => {
  const ext = extractExtension(preview.name)
  const mimeType = resolveMimeType(preview)

  if (SPREADSHEET_EXTENSIONS.has(ext) || mimeType.includes('spreadsheet') || mimeType.includes('csv'))
    return 'sheet'
  if (['doc', 'docx'].includes(ext) || mimeType.includes('word'))
    return 'doc'
  if (['ppt', 'pptx'].includes(ext) || mimeType.includes('presentation'))
    return 'presentation'
  if (MARKDOWN_EXTENSIONS.has(ext) || mimeType.includes('markdown'))
    return 'markdown'
  return null
}

const getPreviewFileIcon = (preview: PreviewWindow, className = 'w-3.5 h-3.5') => {
  const ext = extractExtension(preview.name)
  const mimeType = resolveMimeType(preview)
  const previewType = getFilePreviewType(preview)

  if (previewType === 'sheet') return <FileSpreadsheetIcon className={cn(className, 'text-green-600')} />
  if (previewType === 'doc') return <FileIcon className={cn(className, 'text-blue-600')} />
  if (previewType === 'presentation') return <PresentationIcon className={cn(className, 'text-orange-600')} />
  if (previewType === 'markdown') return <FileIcon className={cn(className, 'text-black')} />
  if (mimeType.startsWith('image/')) return <ImageIcon className={cn(className, 'text-green-500')} />
  if (mimeType.includes('archive') || mimeType.includes('zip')) return <FileArchiveIcon className={cn(className, 'text-yellow-600')} />
  if (IMAGE_EXTENSIONS.has(ext)) return <ImageIcon className={cn(className, 'text-green-500')} />
  if (VIDEO_EXTENSIONS.has(ext)) return <FilmIcon className={cn(className, 'text-purple-500')} />
  if (CODE_ICON_EXTENSIONS.has(ext)) return <FileCodeIcon className={cn(className, 'text-emerald-500')} />
  if (BRACES_EXTENSIONS.has(ext)) return <FileCodeIcon className={cn(className, 'text-yellow-600')} />
  if (SPREADSHEET_EXTENSIONS.has(ext)) return <FileSpreadsheetIcon className={cn(className, 'text-green-600')} />
  if (TEXT_EXTENSIONS.has(ext) || MARKDOWN_EXTENSIONS.has(ext)) return <FileIcon className={cn(className, 'text-black')} />
  if (ARCHIVE_EXTENSIONS.has(ext)) return <FileArchiveIcon className={cn(className, 'text-yellow-600')} />

  return <FileIcon className={cn(className, 'text-gray-600')} />
}

export type PreviewPanelProps = {
  leftPaneWidth: number
  renderMarkdown?: (content: string) => React.ReactNode
  onDownloadPreview?: (path: string) => void | Promise<void>
}

export function PreviewPanel({
  leftPaneWidth,
  renderMarkdown,
  onDownloadPreview,
}: PreviewPanelProps) {
  const {
    previews,
    activePreviewPath,
    previewMode,
    updateEnabled,
    setActivePreviewPath,
    setPreviewMode,
    closePreview,
    updatePreviewDraft,
    setPreviewEditing,
    setPreviewSaving,
    onSavePreview,
  } = useStore()

  const groupedTabsRef = useRef<HTMLDivElement | null>(null)

  const activePreview = useMemo(
    () => previews.find(item => item.path === activePreviewPath) ?? previews[previews.length - 1] ?? null,
    [activePreviewPath, previews],
  )

  const groupedMode = previewMode === 'grouped' && previews.length > 0
  const previewLeft = leftPaneWidth + (groupedMode ? GROUPED_PREVIEW_GAP : PREVIEW_GAP)
  const splitPreviewColumns = previews.length >= 3 ? 2 : 1
  const splitPreviewRows = Math.ceil(Math.max(1, previews.length) / splitPreviewColumns)

  useEffect(() => {
    if (previewMode !== 'grouped' || previews.length === 0 || !activePreviewPath || !groupedTabsRef.current)
      return
    const activeTab = Array
      .from(groupedTabsRef.current.querySelectorAll<HTMLElement>('[data-preview-tab-path]'))
      .find(element => element.dataset.previewTabPath === activePreviewPath)
    if (!activeTab) return
    activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  }, [activePreviewPath, previewMode, previews.length])

  const handleSave = async (preview: PreviewWindow) => {
    if (!updateEnabled) return
    setPreviewSaving(preview.path, true)
    try {
      await onSavePreview(preview.path, preview.draftContent)
    } finally {
      setPreviewSaving(preview.path, false)
    }
  }

  const handleRefresh = (path: string) => {
    const { onRefresh } = useStore.getState()
    onRefresh()
  }

  const renderPreviewBody = (preview: PreviewWindow) => {
    const isMarkdown = isMarkdownFile(preview.name)
    const isCode = isCodeFile(preview.name)
    const isMarkdownEditing = isMarkdown && preview.isEditing
    const shouldUseCodeEditor = isCode || isMarkdownEditing
    const codeExtension = extractExtension(preview.name)
    const codeMirrorExtensions = codeExtension === 'json' ? [jsonLanguage()] : []

    if (preview.isLoading) {
      return (
        <div className="flex h-full items-center justify-center text-[#666666]">
          <div className="flex items-center gap-2">
            <LoaderIcon className="h-4 w-4" />
            <span className="text-xs">Loading file...</span>
          </div>
        </div>
      )
    }

    if (preview.error) {
      return (
        <div className="flex h-full items-center justify-center p-4 text-center">
          <div>
            <p className="text-sm text-red-600">{preview.error}</p>
            <button
              className="mt-2 text-xs text-[#F59E0B] hover:underline"
              onClick={() => handleRefresh(preview.path)}
            >
              Retry
            </button>
          </div>
        </div>
      )
    }

    if (isMarkdown && !preview.isEditing) {
      return (
        <div className="h-full overflow-auto p-4 text-sm leading-6 text-[#2E2929]">
          {renderMarkdown
            ? renderMarkdown(preview.draftContent)
            : <pre className="m-0 whitespace-pre-wrap break-words font-mono text-xs">{preview.draftContent}</pre>}
        </div>
      )
    }

    if (shouldUseCodeEditor) {
      return (
        <div className="h-full bg-[#282C34] text-[13px] leading-[18.2px]">
          <CodeMirror
            value={preview.draftContent}
            height="100%"
            theme={oneDark}
            extensions={codeMirrorExtensions}
            editable={updateEnabled}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              highlightActiveLine: true,
              highlightActiveLineGutter: true,
            }}
            onChange={value => updatePreviewDraft(preview.path, value)}
          />
        </div>
      )
    }

    return (
      <textarea
        className="h-full w-full resize-none border-0 bg-transparent p-4 font-mono text-[13px] leading-5 text-[#2E2929] focus:outline-none"
        value={preview.draftContent}
        onChange={event => updatePreviewDraft(preview.path, event.target.value)}
        spellCheck={false}
        readOnly={!updateEnabled}
      />
    )
  }

  if (!previews.length) return null

  return (
    <>
      {/* Split Mode */}
      {!groupedMode && (
        <div
          className="absolute grid"
          style={{
            left: `${previewLeft}px`,
            right: '0px',
            top: `${PREVIEW_TOP_INSET}px`,
            bottom: `${PREVIEW_BOTTOM_INSET}px`,
            gap: `${PREVIEW_GAP}px`,
            gridTemplateColumns: `repeat(${splitPreviewColumns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${splitPreviewRows}, minmax(0, 1fr))`,
          }}
        >
          {previews.map((preview) => {
            const isMarkdown = isMarkdownFile(preview.name)
            const secondaryActionIsEdit = updateEnabled && isMarkdown && !preview.isEditing
            const canSave = updateEnabled && preview.draftContent !== preview.content && !preview.isSaving

            return (
              <div
                key={preview.path}
                className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#EAE9E6] bg-white"
              >
                {/* Title Bar */}
                <div className="flex h-10 cursor-default items-center gap-2 border-b border-[#EAE9E6] bg-white px-3">
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="truncate text-sm font-medium text-[#2E2929]">{preview.name}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {onDownloadPreview && (
                      <button
                        onClick={() => void onDownloadPreview(preview.path)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F6F5F4] hover:text-[#2E2929]"
                        title="Download"
                      >
                        <DownloadIcon className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {updateEnabled && (
                      <button
                        onClick={() => {
                          if (secondaryActionIsEdit) {
                            setPreviewEditing(preview.path, true)
                            return
                          }
                          void handleSave(preview)
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F6F5F4] hover:text-[#2E2929] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={secondaryActionIsEdit ? false : !canSave}
                        title={secondaryActionIsEdit ? 'Edit' : 'Save'}
                      >
                        {secondaryActionIsEdit
                          ? <EditIcon className="h-3.5 w-3.5" />
                          : preview.isSaving
                            ? <LoaderIcon className="h-3.5 w-3.5" />
                            : <SaveIcon className="h-3.5 w-3.5" />}
                      </button>
                    )}
                    <button
                      onClick={() => handleRefresh(preview.path)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F6F5F4] hover:text-[#2E2929]"
                      title="Refresh"
                    >
                      <RefreshIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setActivePreviewPath(preview.path)
                        setPreviewMode('grouped')
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F6F5F4] hover:text-[#2E2929]"
                      title="Switch to grouped mode"
                    >
                      <MaximizeIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => closePreview(preview.path)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F6F5F4] hover:text-[#2E2929]"
                      title="Close"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="min-h-0 flex-1 select-text overflow-hidden bg-white outline-none">
                  {renderPreviewBody(preview)}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Grouped Mode */}
      {groupedMode && activePreview && (
        <div
          className="absolute flex flex-col"
          style={{
            left: `${previewLeft}px`,
            right: '0px',
            top: `${PREVIEW_TOP_INSET}px`,
            bottom: `${PREVIEW_BOTTOM_INSET}px`,
          }}
        >
          {/* Tabs */}
          <div className="flex h-10 items-center gap-2 rounded-t-2xl border border-[#EAE9E6] border-b-0 bg-white px-3">
            <div
              ref={groupedTabsRef}
              className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto overflow-y-hidden whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {previews.map((preview) => {
                const isActiveTab = activePreview.path === preview.path
                const isMarkdownTab = isMarkdownFile(preview.name)
                const tabActionIsEdit = updateEnabled && isMarkdownTab && !preview.isEditing
                const canSaveTab = updateEnabled && preview.draftContent !== preview.content && !preview.isSaving && !preview.isLoading

                return (
                  <div
                    key={`tab-${preview.path}`}
                    data-preview-tab-path={preview.path}
                    className={cn(
                      'group flex h-7 shrink-0 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors',
                      isActiveTab
                        ? 'bg-[#F6F5F4] text-[#2E2929]'
                        : 'text-[#666666] hover:bg-[#F6F5F480] hover:text-[#2E2929]',
                    )}
                  >
                    <button
                      onClick={() => setActivePreviewPath(preview.path)}
                      className="flex min-w-0 flex-1 items-center gap-1.5"
                      title={preview.name}
                    >
                      {getPreviewFileIcon(preview, 'h-3.5 w-3.5 shrink-0')}
                      <span className="max-w-[100px] truncate">{preview.name}</span>
                    </button>
                    {isActiveTab && updateEnabled && (
                      <div className="flex shrink-0 items-center gap-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (tabActionIsEdit) {
                              setActivePreviewPath(preview.path)
                              setPreviewEditing(preview.path, true)
                              return
                            }
                            void handleSave(preview)
                          }}
                          disabled={tabActionIsEdit ? false : !canSaveTab}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F6F5F4] hover:text-[#2E2929] disabled:cursor-not-allowed disabled:opacity-50"
                          title={tabActionIsEdit ? 'Edit' : 'Save'}
                        >
                          {tabActionIsEdit
                            ? <EditIcon className="h-3.5 w-3.5" />
                            : preview.isSaving
                              ? <LoaderIcon className="h-3.5 w-3.5" />
                              : <SaveIcon className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        closePreview(preview.path)
                      }}
                      className={cn(
                        'h-3 w-3 shrink-0 cursor-pointer transition-opacity hover:text-[#DC2626]',
                        isActiveTab ? 'opacity-50 hover:opacity-100' : 'opacity-0 group-hover:opacity-100',
                      )}
                      title="Close"
                    >
                      <CloseIcon className="h-3 w-3" />
                    </button>
                  </div>
                )
              })}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {updateEnabled && (
                <button
                  onClick={() => void handleSave(activePreview)}
                  disabled={activePreview.draftContent === activePreview.content || activePreview.isSaving}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F6F5F4] hover:text-[#2E2929] disabled:cursor-not-allowed disabled:opacity-50"
                  title="Save"
                >
                  {activePreview.isSaving ? <LoaderIcon className="h-3.5 w-3.5" /> : <SaveIcon className="h-3.5 w-3.5" />}
                </button>
              )}
              <button
                onClick={() => handleRefresh(activePreview.path)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F6F5F480] hover:text-[#2E2929]"
                title="Refresh"
              >
                <RefreshIcon className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setPreviewMode('split')}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F6F5F4] hover:text-[#2E2929]"
                title="Ungroup windows"
              >
                <MinimizeIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden rounded-b-2xl border border-[#EAE9E6] bg-white">
            <div className="h-full select-text overflow-hidden bg-white outline-none">
              {renderPreviewBody(activePreview)}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
