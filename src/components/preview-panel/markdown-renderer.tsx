import DOMPurify from "dompurify";
import { marked } from "marked";

marked.setOptions({ breaks: true, gfm: true });

export const defaultRenderMarkdown = (content: string) => {
  const html = marked.parse(content);
  if (typeof html !== "string") return null;
  const safeHtml = DOMPurify.sanitize(html);

  return (
    <div
      className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
};
