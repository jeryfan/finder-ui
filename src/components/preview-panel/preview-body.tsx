import { ImagePreview } from "./image-preview";
import { VideoPreview } from "./video-preview";
import { AudioPreview } from "./audio-preview";
import { TablePreview } from "./table-preview";
import type { PreviewWindow } from "@/types";
import type { FinderLocale } from "@/locale";
import { defaultRenderMarkdown } from "./markdown-renderer";
import { getPreviewContentKind } from "./preview-content-kind";
import {
  CodePreviewEditor,
  HtmlPreviewFrame,
  MarkdownPreviewContent,
  PdfPreviewFrame,
  PlainTextPreviewEditor,
  PreviewErrorState,
  PreviewLoadingState,
} from "./preview-content";

export type PreviewBodyProps = {
  preview: PreviewWindow;
  updateEnabled: boolean;
  locale: FinderLocale;
  renderMarkdown?: (content: string) => React.ReactNode;
  onDraftChange: (path: string, content: string) => void;
  onRefresh: (path: string) => void;
};

export function PreviewBody({
  preview,
  updateEnabled,
  locale,
  renderMarkdown,
  onDraftChange,
  onRefresh,
}: PreviewBodyProps) {
  const contentKind = getPreviewContentKind(preview);

  if (preview.isLoading) {
    return <PreviewLoadingState />;
  }

  if (preview.error) {
    return (
      <PreviewErrorState
        preview={preview}
        locale={locale}
        onRefresh={onRefresh}
      />
    );
  }

  switch (contentKind.kind) {
    case "image":
      return <ImagePreview src={preview.content} alt={preview.name} locale={locale} />;
    case "video":
      return <VideoPreview src={preview.content} />;
    case "audio":
      return <AudioPreview src={preview.content} name={preview.name} locale={locale} />;
    case "pdf":
      return <PdfPreviewFrame preview={preview} />;
    case "csv":
      return <TablePreview content={preview.draftContent} locale={locale} />;
    case "markdown":
      return (
        <MarkdownPreviewContent
          preview={preview}
          renderMarkdown={renderMarkdown ?? defaultRenderMarkdown}
        />
      );
    case "html":
      return <HtmlPreviewFrame preview={preview} />;
    case "code":
      return (
        <CodePreviewEditor
          preview={preview}
          updateEnabled={updateEnabled}
          extension={contentKind.extension}
          onDraftChange={onDraftChange}
        />
      );
    case "text":
      return (
        <PlainTextPreviewEditor
          preview={preview}
          updateEnabled={updateEnabled}
          onDraftChange={onDraftChange}
        />
      );
  }
}
