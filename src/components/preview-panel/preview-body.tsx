import { ImagePreview } from "./image-preview";
import { VideoPreview } from "./video-preview";
import { AudioPreview } from "./audio-preview";
import { TablePreview } from "./table-preview";
import type { PreviewWindow } from "@/types";
import type { FinderLocale } from "@/locale";
import { defaultRenderMarkdown } from "./markdown-renderer";
import { getPreviewContentKind } from "./preview-content-kind";
import { useResolvedPreviewContent } from "./use-resolved-preview-content";
import {
  CodePreviewEditor,
  HtmlPreviewFrame,
  MarkdownPreviewContent,
  PdfPreviewFrame,
  PlainTextPreviewEditor,
  PreviewErrorState,
  PreviewLoadingState,
} from "./preview-content";

export type PreviewContentProps = {
  preview: PreviewWindow;
  updateEnabled?: boolean;
  locale: FinderLocale;
  renderMarkdown?: (content: string) => React.ReactNode;
  onDraftChange?: (path: string, content: string) => void;
  onRefresh?: (path: string) => void;
};

const noop = () => {};

export function PreviewContent({
  preview,
  updateEnabled = false,
  locale,
  renderMarkdown,
  onDraftChange = noop,
  onRefresh = noop,
}: PreviewContentProps) {
  const contentKind = getPreviewContentKind(preview);
  const resolvedPreview = useResolvedPreviewContent(preview, contentKind);

  if (resolvedPreview.isLoading) {
    return <PreviewLoadingState />;
  }

  if (resolvedPreview.error) {
    return (
      <PreviewErrorState
        preview={resolvedPreview}
        locale={locale}
        onRefresh={onRefresh}
      />
    );
  }

  switch (contentKind.kind) {
    case "image":
      return <ImagePreview src={resolvedPreview.content} alt={resolvedPreview.name} locale={locale} />;
    case "video":
      return <VideoPreview src={resolvedPreview.content} />;
    case "audio":
      return <AudioPreview src={resolvedPreview.content} name={resolvedPreview.name} locale={locale} />;
    case "pdf":
      return <PdfPreviewFrame preview={resolvedPreview} />;
    case "csv":
      return <TablePreview content={resolvedPreview.draftContent} locale={locale} />;
    case "markdown":
      return (
        <MarkdownPreviewContent
          preview={resolvedPreview}
          renderMarkdown={renderMarkdown ?? defaultRenderMarkdown}
        />
      );
    case "html":
      return <HtmlPreviewFrame preview={resolvedPreview} />;
    case "code":
      return (
        <CodePreviewEditor
          preview={resolvedPreview}
          updateEnabled={updateEnabled}
          extension={contentKind.extension}
          onDraftChange={onDraftChange}
        />
      );
    case "text":
      return (
        <PlainTextPreviewEditor
          preview={resolvedPreview}
          updateEnabled={updateEnabled}
          onDraftChange={onDraftChange}
        />
      );
  }
}

export type PreviewBodyProps = PreviewContentProps;

export const PreviewBody = PreviewContent;
