import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Sidebar } from '@/components/sidebar'
import { FileList } from '@/components/file-list'
import { ContextMenu } from '@/components/context-menu'
import { Toolbar } from '@/components/toolbar'
import { PreviewPanel, getPreviewLeftPaneWidth } from '@/components/preview-panel'
import { useFinderStore, useFinderStoreApi } from '@/store'
import { cn } from '@/utils'
import type { FileEntry } from '@/types'
import type { FinderProps } from './index'

export function FinderInner({
  tabs,
  defaultTab,
  onFetchFiles,
  onOpenFile,
  onDownload,
  onBatchDownload,
  onUpload,
  onSave,
  editable = false,
  renderMarkdown,
  className,
  theme = 'target',
}: FinderProps) {
  const {
    currentPath,
    historyStack,
    historyIndex,
    activeTab,
    viewMode,
    searchQuery,
    previews,
    setTabs,
    setActiveTab,
    setFiles,
    setLoading,
    setLoadError,
    setUpdateEnabled,
    setOpenHandler,
    setDownloadHandler,
    setBatchDownloadHandler,
    setUploadHandler,
    setRefreshHandler,
    setSavePreviewHandler,
    setNavigateToPathHandler,
    setDropFilesHandler,
    setCurrentPath,
    navigateTo,
    goBack,
    goForward,
    setViewMode,
    setSearchQuery,
    setUploadingFiles,
  } = useFinderStore()

  const storeApi = useFinderStoreApi()

  // Stable refs for callback props so handlers always use the latest version
  const fetchFilesRef = useRef(onFetchFiles)
  const openFileRef = useRef(onOpenFile)
  const downloadRef = useRef(onDownload)
  const batchDownloadRef = useRef(onBatchDownload)
  const uploadRef = useRef(onUpload)
  const saveRef = useRef(onSave)
  fetchFilesRef.current = onFetchFiles
  openFileRef.current = onOpenFile
  downloadRef.current = onDownload
  batchDownloadRef.current = onBatchDownload
  uploadRef.current = onUpload
  saveRef.current = onSave

  // Hidden file input for triggering native file picker
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const uploadTargetPathRef = useRef<string | undefined>(undefined)

  // Track previous tab to detect sidebar-initiated changes
  const prevTabRef = useRef<string | undefined>(undefined)
  // AbortController to cancel stale fetch requests on rapid navigation
  const fetchAbortRef = useRef<AbortController | null>(null)

  const leftPaneWidth = getPreviewLeftPaneWidth(previews.length)

  // Stable loadFiles — zustand setters are referentially stable
  const loadFiles = useCallback(async (path: string) => {
    // Cancel any in-flight request
    fetchAbortRef.current?.abort()
    const controller = new AbortController()
    fetchAbortRef.current = controller

    // Immediately show loading in the new directory
    setFiles([])
    setCurrentPath(path)
    setLoading(true)
    setLoadError(null)
    try {
      const entries = await fetchFilesRef.current(path)
      if (controller.signal.aborted) return
      setFiles(entries)
    } catch (err) {
      if (controller.signal.aborted) return
      setLoadError(err instanceof Error ? err.message : 'Failed to load files')
      setFiles([])
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [setLoading, setLoadError, setFiles, setCurrentPath])

  // Upload wrapper — manages uploadingFiles state and auto-refreshes
  const performUpload = useCallback(async (files: File[], targetPath?: string) => {
    const resolvedPath = targetPath ?? storeApi.getState().currentPath

    // Detect folder upload via webkitRelativePath
    const hasRelativePaths = files.some(f => f.webkitRelativePath?.includes('/'))
    let uploadingItems: Array<{ name: string; type: 'file' | 'directory' }>

    if (hasRelativePaths) {
      // Extract unique top-level folder names
      const folderNames = new Set<string>()
      for (const f of files) {
        const topDir = f.webkitRelativePath.split('/')[0]
        if (topDir) folderNames.add(topDir)
      }
      uploadingItems = Array.from(folderNames).map(name => ({ name, type: 'directory' }))
    } else {
      uploadingItems = files.map(f => ({ name: f.name, type: 'file' as const }))
    }

    setUploadingFiles(uploadingItems)
    try {
      await uploadRef.current?.(files, resolvedPath)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploadingFiles([])
      loadFiles(storeApi.getState().currentPath)
    }
  }, [storeApi, setUploadingFiles, setLoadError, loadFiles])

  // --- Initialization ---
  useEffect(() => {
    setTabs(tabs)

    const initialTab = defaultTab || tabs[0]?.key
    prevTabRef.current = initialTab
    if (initialTab) setActiveTab(initialTab)

    setUpdateEnabled(editable)

    // Navigation handler — used by goBack/goForward and directory double-click
    setNavigateToPathHandler((path: string) => {
      loadFiles(path)
    })

    // Open handler — show loading preview first, then fill content
    setOpenHandler(async (file: FileEntry) => {
      const handler = openFileRef.current
      if (!handler) return
      storeApi.getState().openPreviewLoading(file)
      try {
        const result = await handler(file)
        if (typeof result === 'string') {
          storeApi.getState().openPreview(file, result)
        } else {
          // Handler didn't return content — close the loading preview
          storeApi.getState().closePreview(file.path)
        }
      } catch {
        storeApi.getState().setPreviewError(file.path, 'Failed to load file')
      }
    })

    // Delegate to latest callback refs so prop changes are respected
    setDownloadHandler((file) => downloadRef.current?.(file))
    setBatchDownloadHandler((files) => batchDownloadRef.current?.(files))
    setUploadHandler((isFolder, targetPath) => {
      uploadTargetPathRef.current = targetPath
      const input = fileInputRef.current
      if (!input) return
      // Reset so the same file can be re-selected
      input.value = ''
      // webkitdirectory for folder selection
      if (isFolder) {
        input.setAttribute('webkitdirectory', '')
      } else {
        input.removeAttribute('webkitdirectory')
      }
      input.click()
    })
    setSavePreviewHandler(async (path, content) => {
      await saveRef.current?.(path, content)
    })
    setDropFilesHandler((files, targetPath) => {
      performUpload(files, targetPath)
    })

    setRefreshHandler(() => {
      loadFiles(storeApi.getState().currentPath)
    })

    // Load initial files
    const initialRootPath = tabs.find(t => t.key === initialTab)?.rootPath || tabs[0]?.rootPath
    if (initialRootPath) {
      loadFiles(initialRootPath)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --- React to sidebar tab changes ---
  useEffect(() => {
    if (activeTab === prevTabRef.current) return
    prevTabRef.current = activeTab
    const tab = tabs.find(t => t.key === activeTab)
    if (!tab) return
    navigateTo(tab.rootPath)
    loadFiles(tab.rootPath)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  // --- Sync tabs prop ---
  useEffect(() => {
    setTabs(tabs)
  }, [tabs, setTabs])

  // --- Sync editable prop ---
  useEffect(() => {
    setUpdateEnabled(editable)
  }, [editable, setUpdateEnabled])

  // --- Breadcrumbs ---
  const breadcrumbs = useMemo(() => {
    const tab = tabs.find(t => t.key === activeTab)
    const tabLabel = tab?.label ?? 'Files'
    const rootPath = tab?.rootPath ?? '/'
    const items: Array<{ label: string; path: string }> = [{ label: tabLabel, path: rootPath }]
    if (currentPath === rootPath) return items

    const relativePath = currentPath.startsWith(`${rootPath}/`)
      ? currentPath.slice(rootPath.length + 1)
      : currentPath.slice(1)
    const segments = relativePath.split('/').filter(Boolean)
    let cursor = rootPath
    for (const segment of segments) {
      cursor = `${cursor}/${segment}`
      items.push({ label: segment, path: cursor })
    }
    return items
  }, [activeTab, currentPath, tabs])

  // --- Handlers ---
  const handleNavigate = (path: string) => {
    navigateTo(path)
    loadFiles(path)
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (!selectedFiles || selectedFiles.length === 0) return
    performUpload(Array.from(selectedFiles), uploadTargetPathRef.current)
  }

  const handleDownloadPreview = async (path: string) => {
    const preview = previews.find(p => p.path === path)
    if (!preview) return
    const blob = new Blob([preview.content], { type: 'text/plain;charset=utf-8' })
    const href = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = href
    anchor.download = preview.name
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(href)
  }

  return (
    <div
      className={cn(
        'h-full w-full relative overflow-hidden select-none finder-ui-root bg-[#F9F6F1]',
        '[&_*]:[scrollbar-width:none] [&_*::-webkit-scrollbar]:hidden',
        className,
      )}
      data-finder-theme={theme}
      style={{
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <div className="relative h-full flex">
        <div className="flex-1 min-w-0 h-full p-4 pl-0 relative z-10 overflow-hidden">
          {/* Left pane — file list area */}
          <div
            className="overflow-hidden transition-all duration-300 ease-out absolute inset-0"
            style={previews.length > 0 ? { width: `${leftPaneWidth}px` } : undefined}
          >
            <div className="relative overflow-hidden bg-white rounded-2xl transition-all duration-300 ease-out flex-1 h-full">
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className="h-full flex bg-white text-[#2E2929] overflow-hidden select-none" data-finder-window="true">
                  <Sidebar tabs={tabs} />

                  <section className="flex-1 flex flex-col min-w-0">
                    <Toolbar
                      historyIndex={historyIndex}
                      historyStackLength={historyStack.length}
                      breadcrumbs={breadcrumbs}
                      viewMode={viewMode}
                      searchQuery={searchQuery}
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
