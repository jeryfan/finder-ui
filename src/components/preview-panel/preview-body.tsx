import { json as jsonLanguage } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { marked } from "marked";
import CodeMirror from "@uiw/react-codemirror";
import {
  extractExtension,
  isMarkdownFile,
  isCodeFile,
  isImageFile,
  isVideoFile,
  isAudioFile,
  isCsvFile,
  isPdfFile,
} from "@/utils";
import { ImagePreview } from "./image-preview";
import { VideoPreview } from "./video-preview";
import { AudioPreview } from "./audio-preview";
import { TablePreview } from "./table-preview";
import type { PreviewWindow } from "@/types";
import { Loader2 } from "lucide-react";

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
  renderMarkdown?: (content: string) => React.ReactNode;
  onDraftChange: (path: string, content: string) => void;
  onRefresh: (path: string) => void;
};

export function PreviewBody({
  preview,
  updateEnabled,
  renderMarkdown,
  onDraftChange,
  onRefresh,
}: PreviewBodyProps) {
  const isMarkdown = isMarkdownFile(preview.name);
  const isImage = isImageFile(preview.name);
  const isVideo = isVideoFile(preview.name);
  const isAudio = isAudioFile(preview.name);
  const isCsv = isCsvFile(preview.name);
  const isPdf = isPdfFile(preview.name);
  const isCode = isCodeFile(preview.name);
  const isMarkdownEditing = isMarkdown && preview.isEditing;
  const shouldUseCodeEditor = isCode || isMarkdownEditing;
  const codeExtension = extractExtension(preview.name);
  const codeMirrorExtensions = codeExtension === "json" ? [jsonLanguage()] : [];

  if (preview.isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  if (preview.error) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center">
        <div>
          <p className="text-sm text-red-600">{preview.error}</p>
          <button
            className="mt-2 text-xs text-primary hover:underline"
            onClick={() => onRefresh(preview.path)}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isImage) {
    return <ImagePreview src={preview.content} alt={preview.name} />;
  }

  if (isVideo) {
    return <VideoPreview src={preview.content} />;
  }

  if (isAudio) {
    return <AudioPreview src={preview.content} name={preview.name} />;
  }

  if (isPdf) {
    return (
      <div className="h-full w-full">
        <iframe
          src={preview.content}
          className="h-full w-full border-0"
          title={preview.name}
        />
      </div>
    );
  }

  if (isCsv) {
    return <TablePreview content={preview.draftContent} name={preview.name} />;
  }

  if (isMarkdown && !preview.isEditing) {
    const renderer = renderMarkdown ?? defaultRenderMarkdown;
    return (
      <div className="h-full overflow-auto bg-card p-6 text-sm leading-6 text-foreground">
        {renderer(preview.draftContent)}
      </div>
    );
  }

  if (shouldUseCodeEditor) {
    return (
      <div className="h-full overflow-auto bg-[#282C34] text-[13px] leading-[18.2px]">
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
          onChange={(value) => onDraftChange(preview.path, value)}
        />
      </div>
    );
  }

  return (
    <textarea
      className="h-full w-full resize-none border-0 bg-transparent p-4 font-mono text-[13px] leading-5 text-foreground focus:outline-none"
      value={preview.draftContent}
      onChange={(event) => onDraftChange(preview.path, event.target.value)}
      spellCheck={false}
      readOnly={!updateEnabled}
    />
  );
}
