import { json as jsonLanguage } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { Loader2 } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import type { FinderLocale } from "@/locale";
import type { PreviewWindow } from "@/types";

export function PreviewLoadingState() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export type PreviewErrorStateProps = {
  preview: PreviewWindow;
  locale: FinderLocale;
  onRefresh: (path: string) => void;
};

export function PreviewErrorState({
  preview,
  locale,
  onRefresh,
}: PreviewErrorStateProps) {
  return (
    <div className="flex h-full items-center justify-center p-4 text-center">
      <div>
        <p className="text-sm text-red-600">{preview.error}</p>
        <button
          className="mt-2 text-xs text-primary hover:underline"
          onClick={() => onRefresh(preview.path)}
        >
          {locale.retry}
        </button>
      </div>
    </div>
  );
}

export type PdfPreviewFrameProps = {
  preview: PreviewWindow;
};

export function PdfPreviewFrame({ preview }: PdfPreviewFrameProps) {
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

export type MarkdownPreviewContentProps = {
  preview: PreviewWindow;
  renderMarkdown: (content: string) => React.ReactNode;
};

export function MarkdownPreviewContent({
  preview,
  renderMarkdown,
}: MarkdownPreviewContentProps) {
  return (
    <div className="h-full overflow-auto bg-card p-6 text-sm leading-6 text-foreground">
      {renderMarkdown(preview.draftContent)}
    </div>
  );
}

export type HtmlPreviewFrameProps = {
  preview: PreviewWindow;
};

export function HtmlPreviewFrame({ preview }: HtmlPreviewFrameProps) {
  return (
    <div className="h-full w-full">
      <iframe
        srcDoc={preview.draftContent}
        className="h-full w-full border-0 bg-white"
        title={preview.name}
      />
    </div>
  );
}

export type CodePreviewEditorProps = {
  preview: PreviewWindow;
  updateEnabled: boolean;
  extension: string;
  onDraftChange: (path: string, content: string) => void;
};

export function CodePreviewEditor({
  preview,
  updateEnabled,
  extension,
  onDraftChange,
}: CodePreviewEditorProps) {
  const codeMirrorExtensions = extension === "json" ? [jsonLanguage()] : [];

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

export type PlainTextPreviewEditorProps = {
  preview: PreviewWindow;
  updateEnabled: boolean;
  onDraftChange: (path: string, content: string) => void;
};

export function PlainTextPreviewEditor({
  preview,
  updateEnabled,
  onDraftChange,
}: PlainTextPreviewEditorProps) {
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
