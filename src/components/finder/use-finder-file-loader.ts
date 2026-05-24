import { useCallback, useRef } from 'react'
import type { RefObject } from 'react'
import { useFinderStore, useFinderStoreApi } from '@/store'
import type { FinderProps } from './index'

export function useFinderFileLoader(
  fetchFilesRef: RefObject<FinderProps['onFetchFiles']>,
) {
  const {
    setFiles,
    setLoading,
    setLoadError,
    setCurrentPath,
  } = useFinderStore()
  const storeApi = useFinderStoreApi()
  const fetchAbortRef = useRef<AbortController | null>(null)

  return useCallback(async (path: string) => {
    fetchAbortRef.current?.abort()
    const controller = new AbortController()
    fetchAbortRef.current = controller

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
      setLoadError(err instanceof Error ? err.message : storeApi.getState().locale.failedToLoad)
      setFiles([])
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [fetchFilesRef, setCurrentPath, setFiles, setLoadError, setLoading, storeApi])
}
