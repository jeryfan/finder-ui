import { useEffect, useState } from "react";
import type { PreviewWindow } from "@/types";
import type { PreviewContentKind } from "./preview-content-kind";

const TEXT_CONTENT_KINDS = new Set<PreviewContentKind["kind"]>([
  "csv",
  "markdown",
  "html",
  "code",
  "text",
]);

function isResolvableContentUrl(content: string) {
  return content.startsWith("blob:") || content.startsWith("data:");
}

function normalizeResolvableContentUrl(content: string) {
  const trimmed = content.trim();
  return isResolvableContentUrl(trimmed) ? trimmed : content;
}

function shouldResolveContentUrl(contentKind: PreviewContentKind) {
  return TEXT_CONTENT_KINDS.has(contentKind.kind);
}

export function useResolvedPreviewContent(
  preview: PreviewWindow,
  contentKind: PreviewContentKind,
) {
  const source = normalizeResolvableContentUrl(preview.draftContent || preview.content);
  const shouldResolve = shouldResolveContentUrl(contentKind);
  const [state, setState] = useState<{
    source: string;
    content?: string;
    isLoading: boolean;
    error?: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!shouldResolve || !isResolvableContentUrl(source)) {
      setState(null);
      return;
    }

    setState({ source, isLoading: true });
    fetch(source)
      .then((response) => response.text())
      .then(
        (content) => {
          if (!cancelled) setState({ source, content, isLoading: false });
        },
        (error) => {
          if (!cancelled) {
            setState({
              source,
              isLoading: false,
              error: error instanceof Error ? error.message : "Failed to load preview content",
            });
          }
        },
      );

    return () => {
      cancelled = true;
    };
  }, [shouldResolve, source]);

  if (!state) return preview;

  return {
    ...preview,
    content: state.content ?? preview.content,
    draftContent: state.content ?? preview.draftContent,
    isLoading: preview.isLoading || state.isLoading,
    error: preview.error ?? state.error,
  };
}
