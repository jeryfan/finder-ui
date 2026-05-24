import { useEffect, useRef } from 'react'
import { Sidebar } from '@/components/sidebar'
import { FileList } from '@/components/file-list'
import { ContextMenu } from '@/components/context-menu'
import { Toolbar } from '@/components/toolbar'
import { PreviewPanel } from '@/components/preview-panel'
import { getPreviewLeftPaneWidth } from '@/components/preview-panel/constants'
import { useFinderStore } from '@/store'
import { cn } from '@/utils'
import { enLocale } from '@/locale/en'
import type { FinderProps } from './index'
import { downloadPreviewContent } from './download-preview'
import { useActiveTabFiles } from './use-active-tab-files'
import { useFinderBreadcrumbs } from './use-finder-breadcrumbs'
import { useFinderCallbackRefs } from './use-finder-callback-refs'
import { useFinderFileLoader } from './use-finder-file-loader'
import { useFinderHandlers } from './use-finder-handlers'
import { useFinderInitialization } from './use-finder-initialization'
import { useFinderUpload } from './use-finder-upload'

export function FinderInner({
  tabs,
  defaultTab,
  onFetchFiles,
  onOpenFile,
  onDownload,
  onBatchDownload,
  onUpload,
  onSave,
  onRename,
  onDelete,
  onCreateFolder,
  editable = false,
  renderMarkdown,
  locale,
  className,
  style,
  theme = 'default',
}: FinderProps) {
  const {
    currentPath,
    historyStack,
    historyIndex,
    activeTab,
    viewMode,
    searchQuery,
    previews,
    locale: storeLocale,
    setTabs,
    setActiveTab,
    setUpdateEnabled,
    setHasRename,
    setHasDelete,
    setHasCreateFolder,
    setHasUpload,
    setHasDownload,
    setHasBatchDownload,
    setLocale,
    navigateTo,
    goBack,
    goForward,
    setViewMode,
    setSearchQuery,
  } = useFinderStore()

  const {
    fetchFilesRef,
    openFileRef,
    downloadRef,
    batchDownloadRef,
    uploadRef,
    saveRef,
    renameRef,
    deleteRef,
    createFolderRef,
  } = useFinderCallbackRefs({
    tabs,
    defaultTab,
    onFetchFiles,
    onOpenFile,
    onDownload,
    onBatchDownload,
    onUpload,
    onSave,
    onRename,
    onDelete,
    onCreateFolder,
    editable,
    renderMarkdown,
    locale,
    className,
    style,
    theme,
  })

  // Track previous tab to detect sidebar-initiated changes
  const prevTabRef = useRef<string | undefined>(undefined)

  const leftPaneWidth = getPreviewLeftPaneWidth(previews.length)

  const loadFiles = useFinderFileLoader(fetchFilesRef)
  const {
    fileInputRef,
    performUpload,
    requestUpload,
    handleFileInputChange,
  } = useFinderUpload({ uploadRef, loadFiles })

  useFinderHandlers({
    openFileRef,
    downloadRef,
    batchDownloadRef,
    saveRef,
    renameRef,
    deleteRef,
    createFolderRef,
    requestUpload,
    performUpload,
    loadFiles,
  })

  useFinderInitialization({
    tabs,
    defaultTab,
    editable,
    locale,
    capabilityFlags: {
      canRename: !!onRename,
      canDelete: !!onDelete,
      canCreateFolder: !!onCreateFolder,
      canUpload: !!onUpload,
      canDownload: !!onDownload,
      canBatchDownload: !!onBatchDownload,
    },
    previousTabRef: prevTabRef,
    loadFiles,
    setTabs,
    setActiveTab,
    setUpdateEnabled,
    setLocale,
    setHasRename,
    setHasDelete,
    setHasCreateFolder,
    setHasUpload,
    setHasDownload,
    setHasBatchDownload,
  })

  useActiveTabFiles({
    activeTab,
    tabs,
    previousTabRef: prevTabRef,
    navigateTo,
    loadFiles,
  })

  // --- Sync tabs prop ---
  useEffect(() => {
    setTabs(tabs)
  }, [tabs, setTabs])

  // --- Sync editable prop ---
  useEffect(() => {
    setUpdateEnabled(editable)
  }, [editable, setUpdateEnabled])

  // --- Sync locale prop ---
  useEffect(() => {
    setLocale(locale ? { ...enLocale, ...locale } : enLocale)
  }, [locale, setLocale])

  const breadcrumbs = useFinderBreadcrumbs({
    tabs,
    activeTab,
    currentPath,
    locale: storeLocale,
  })

  // --- Handlers ---
  const handleNavigate = (path: string) => {
    navigateTo(path)
    loadFiles(path)
  }

  const handleDownloadPreview = async (path: string) => {
    const preview = previews.find(p => p.path === path)
    if (!preview) return
    downloadPreviewContent(preview)
  }

  return (
    <div
      className={cn(
        'h-full w-full relative overflow-hidden select-none finder-ui-root bg-background',
        '[&_*]:[scrollbar-width:none] [&_*::-webkit-scrollbar]:hidden',
        className,
      )}
      data-finder-theme={theme}
      style={{
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        WebkitFontSmoothing: 'antialiased',
        ...style,
      }}
    >
      <div className="relative h-full flex">
        <div className="flex-1 min-w-0 h-full relative z-10 overflow-hidden">
          {/* Left pane — file list area */}
          <div
            className="overflow-hidden transition-all duration-300 ease-out absolute inset-0"
            style={previews.length > 0 ? { width: `${leftPaneWidth}px` } : undefined}
          >
            <div className="relative overflow-hidden bg-card rounded-2xl border border-border transition-all duration-300 ease-out flex-1 h-full">
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className="h-full flex bg-card text-foreground overflow-hidden select-none" data-finder-window="true">
                  <Sidebar tabs={tabs} />

                  <section className="flex-1 flex flex-col min-w-0">
                    <Toolbar
                      historyIndex={historyIndex}
                      historyStackLength={historyStack.length}
                      breadcrumbs={breadcrumbs}
                      viewMode={viewMode}
                      searchQuery={searchQuery}
                      locale={storeLocale}
                      onGoBack={goBack}
                      onGoForward={goForward}
                      onNavigate={handleNavigate}
                      onViewModeChange={setViewMode}
                      onSearchChange={setSearchQuery}
                    />
                    <FileList />
                  </section>
                </div>
              </div>
            </div>
          </div>

          {/* Preview panel */}
          <PreviewPanel
            leftPaneWidth={leftPaneWidth}
            renderMarkdown={renderMarkdown}
            onDownloadPreview={handleDownloadPreview}
          />
        </div>
      </div>

      <ContextMenu />

      {/* Hidden file input for native file picker */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />
    </div>
  )
}
