import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { defaultRenderMarkdown } from "./markdown-renderer";

describe("defaultRenderMarkdown", () => {
  it("renders markdown content", () => {
    const html = renderToStaticMarkup(defaultRenderMarkdown("# Title"));

    expect(html).toContain("<h1>Title</h1>");
  });

  it("sanitizes unsafe html from markdown files", () => {
    const html = renderToStaticMarkup(
      defaultRenderMarkdown('[x](javascript:alert(1))<img src=x onerror="alert(1)">'),
    );

    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("onerror");
  });
});
