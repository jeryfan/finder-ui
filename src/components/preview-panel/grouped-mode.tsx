import { useEffect, useRef } from 'react'
import { cn, isMarkdownFile } from '@/utils'
import { getFileIcon } from '@/utils/file-icons'
import {
  SaveIcon,
  RefreshIcon,
  EditIcon,
  EyeIcon,
  CloseIcon,
  MinimizeIcon,
  LoaderIcon,
} from '@/icons'
import { PREVIEW_TOP_INSET, PREVIEW_BOTTOM_INSET } from './constants'
import { PreviewBody } from './preview-body'
import type { PreviewWindow } from '@/types'

export type GroupedModeProps = {
  previews: PreviewWindow[]
  activePreview: PreviewWindow
  activePreviewPath: string | null
  previewLeft: number
  updateEnabled: boolean
  renderMarkdown?: (content: string) => React.ReactNode
  onSave: (preview: PreviewWindow) => void
  onRefresh: (path: string) => void
  onClose: (path: string) => void
  onSetEditing: (path: string, isEditing: boolean) => void
  onDraftChange: (path: string, content: string) => void
  onSetActivePreviewPath: (path: string) => void
  onSetPreviewMode: (mode: 'split' | 'grouped') => void
}

export function GroupedMode({
  previews,
  activePreview,
  activePreviewPath,
  previewLeft,
  updateEnabled,
  renderMarkdown,
  onSave,
  onRefresh,
  onClose,
  onSetEditing,
  onDraftChange,
  onSetActivePreviewPath,
  onSetPreviewMode,
}: GroupedModeProps) {
  const groupedTabsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (previews.length === 0 || !activePreviewPath || !groupedTabsRef.current)
      return
    const activeTab = Array
      .from(groupedTabsRef.current.querySelectorAll<HTMLElement>('[data-preview-tab-path]'))
      .find(element => element.dataset.previewTabPath === activePreviewPath)
    if (!activeTab) return
    activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  }, [activePreviewPath, previews.length])

  const handleSave = (preview: PreviewWindow) => {
    onSave(preview)
  }

  return (
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
            const isMarkdownPreviewTab = isMarkdownTab && !preview.isEditing
            const isMarkdownEditTab = isMarkdownTab && preview.isEditing
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
                  onClick={() => onSetActivePreviewPath(preview.path)}
                  className="flex min-w-0 flex-1 items-center gap-1.5"
                  title={preview.name}
                >
                  {getFileIcon(preview, 'h-3.5 w-3.5 shrink-0')}
                  <span className="max-w-[100px] truncate">{preview.name}</span>
                </button>
                {isActiveTab && updateEnabled && isMarkdownPreviewTab && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSetActivePreviewPath(preview.path)
                      onSetEditing(preview.path, true)
                    }}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[#666666] transition-colors hover:text-[#2E2929]"
                    title="Edit"
                  >
                    <EditIcon className="h-3.5 w-3.5" />
                  </button>
                )}
                {isActiveTab && updateEnabled && isMarkdownEditTab && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSetEditing(preview.path, false)
                      }}
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[#666666] transition-colors hover:text-[#2E2929]"
                      title="Preview"
                    >
                      <EyeIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSave(preview)
                      }}
                      disabled={!canSaveTab && !preview.isSaving}
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded text-[#666666] transition-colors',
                        preview.isSaving
                          ? 'pointer-events-none'
                          : canSaveTab
                            ? 'hover:text-[#2E2929]'
                            : 'cursor-not-allowed opacity-50',
                      )}
                      title="Save"
                    >
                      {preview.isSaving
                        ? <LoaderIcon className="h-3.5 w-3.5" />
                        : <SaveIcon className="h-3.5 w-3.5" />}
                    </button>
                  </>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onClose(preview.path)
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
          {updateEnabled && isMarkdownFile(activePreview.name) && !activePreview.isEditing && (
            <button
              onClick={() => onSetEditing(activePreview.path, true)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F6F5F4] hover:text-[#2E2929]"
              title="Edit"
            >
              <EditIcon className="h-3.5 w-3.5" />
            </button>
          )}
          {updateEnabled && isMarkdownFile(activePreview.name) && activePreview.isEditing && (
            <button
              onClick={() => onSetEditing(activePreview.path, false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F6F5F4] hover:text-[#2E2929]"
              title="Preview"
            >
              <EyeIcon className="h-3.5 w-3.5" />
            </button>
          )}
          {updateEnabled && (!isMarkdownFile(activePreview.name) || activePreview.isEditing) && (
            <button
              onClick={() => handleSave(activePreview)}
              disabled={activePreview.draftContent === activePreview.content && !activePreview.isSaving}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors',
                activePreview.isSaving
                  ? 'pointer-events-none'
                  : activePreview.draftContent !== activePreview.content
                    ? 'hover:bg-[#F6F5F4] hover:text-[#2E2929]'
                    : 'cursor-not-allowed opacity-50',
              )}
              title="Save"
            >
              {activePreview.isSaving ? <LoaderIcon className="h-3.5 w-3.5" /> : <SaveIcon className="h-3.5 w-3.5" />}
            </button>
          )}
          <button
            onClick={() => onRefresh(activePreview.path)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F6F5F480] hover:text-[#2E2929]"
            title="Refresh"
          >
            <RefreshIcon className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onSetPreviewMode('split')}
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
          <PreviewBody
            preview={activePreview}
            updateEnabled={updateEnabled}
            renderMarkdown={renderMarkdown}
            onDraftChange={onDraftChange}
            onRefresh={onRefresh}
          />
        </div>
      </div>
    </div>
  )
}
