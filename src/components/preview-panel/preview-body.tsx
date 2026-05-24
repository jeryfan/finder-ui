import { marked } from "marked";
import { ImagePreview } from "./image-preview";
import { VideoPreview } from "./video-preview";
import { AudioPreview } from "./audio-preview";
import { TablePreview } from "./table-preview";
import type { PreviewWindow } from "@/types";
import type { FinderLocale } from "@/locale";
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

marked.setOptions({ breaks: true, gfm: true });

const defaultRenderMarkdown = (content: string) => {
  const html = marked.parse(content);
  if (typeof html !== "string") return null;
  return (
    <div
      className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

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

  if (contentKind.isImage) {
    return <ImagePreview src={preview.content} alt={preview.name} locale={locale} />;
  }

  if (contentKind.isVideo) {
    return <VideoPreview src={preview.content} />;
  }

  if (contentKind.isAudio) {
    return <AudioPreview src={preview.content} name={preview.name} locale={locale} />;
  }

  if (contentKind.isPdf) {
    return <PdfPreviewFrame preview={preview} />;
  }

  if (contentKind.isCsv) {
    return <TablePreview content={preview.draftContent} locale={locale} />;
  }

  if (contentKind.isMarkdown && !preview.isEditing) {
    const renderer = renderMarkdown ?? defaultRenderMarkdown;
    return (
      <MarkdownPreviewContent
        preview={preview}
        renderMarkdown={renderer}
      />
    );
  }

  if (contentKind.isHtml && !preview.isEditing) {
    return <HtmlPreviewFrame preview={preview} />;
  }

  if (contentKind.shouldUseCodeEditor) {
    return (
      <CodePreviewEditor
        preview={preview}
        updateEnabled={updateEnabled}
        extension={contentKind.extension}
        onDraftChange={onDraftChange}
      />
    );
  }

  return (
    <PlainTextPreviewEditor
      preview={preview}
      updateEnabled={updateEnabled}
      onDraftChange={onDraftChange}
    />
  );
}
