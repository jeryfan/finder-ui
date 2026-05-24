import { useMemo } from "react";
import type { FinderLocale } from "@/locale";
import { parseCsv } from "./csv";

type TablePreviewProps = {
  content: string;
  locale: FinderLocale;
};

const MAX_ROWS = 100;

export function TablePreview({ content, locale }: TablePreviewProps) {
  const rows = useMemo(() => parseCsv(content), [content]);

  if (rows.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        {locale.emptyFile}
      </div>
    );
  }

  const header = rows[0];
  const body = rows.slice(1, MAX_ROWS + 1);
  const truncated = rows.length - 1 > MAX_ROWS;

  return (
    <div className="h-full overflow-auto p-4">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {header.map((cell, index) => (
              <th
                key={index}
                className="border border-border bg-muted px-3 py-1.5 text-left font-semibold text-foreground whitespace-nowrap"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-muted/50">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border border-border px-3 py-1 text-foreground whitespace-nowrap"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {truncated && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {locale.tableRowsTruncated(MAX_ROWS, rows.length - 1)}
        </p>
      )}
    </div>
  );
}
