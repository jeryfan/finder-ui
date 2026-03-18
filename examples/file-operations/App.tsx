import { useState, useCallback } from "react";
import { Finder } from "../../src";
import type { FileEntry } from "../../src";
import { mockOpenFile, mockDelay } from "../mock-data";

const initialTree: Record<string, FileEntry[]> = {
  "/": [
    {
      name: "Documents",
      path: "/Documents",
      type: "directory",
      size: 0,
      lastModified: "2026-01-15T10:30:00Z",
    },
    {
      name: "readme.md",
      path: "/readme.md",
      type: "file",
      size: 1024,
      mimeType: "text/markdown",
      lastModified: "2026-01-15T10:30:00Z",
    },
    {
      name: "config.json",
      path: "/config.json",
      type: "file",
      size: 256,
      mimeType: "application/json",
      lastModified: "2026-01-10T08:00:00Z",
    },
  ],
  "/Documents": [
    {
      name: "notes.txt",
      path: "/Documents/notes.txt",
      type: "file",
      size: 512,
      mimeType: "text/plain",
      lastModified: "2026-01-12T14:00:00Z",
    },
    {
      name: "data.csv",
      path: "/Documents/data.csv",
      type: "file",
      size: 2048,
      mimeType: "text/csv",
      lastModified: "2026-01-14T09:00:00Z",
    },
  ],
};

export default function FileOperationsExample() {
  const [tree, setTree] = useState(initialTree);

  const parentOf = (filePath: string) => {
    const parts = filePath.split("/");
    parts.pop();
    return parts.join("/") || "/";
  };

  const onFetchFiles = useCallback(
    async (path: string) => {
      await mockDelay(150);
      return tree[path] ?? [];
    },
    [tree],
  );

  const onRename = useCallback(async (file: FileEntry, newName: string) => {
    await mockDelay(200);
    const parent = parentOf(file.path);
    const newPath = parent === "/" ? `/${newName}` : `${parent}/${newName}`;
    console.log(`[rename] ${file.path} → ${newPath}`);

    setTree((prev) => {
      const next = { ...prev };
      // Update parent listing
      const parentFiles = prev[parent] ?? [];
      next[parent] = parentFiles.map((f) =>
        f.path === file.path ? { ...f, name: newName, path: newPath } : f,
      );
      // If directory, update its children key
      if (file.type === "directory" && prev[file.path]) {
        next[newPath] = prev[file.path];
        delete next[file.path];
      }
      return next;
    });
  }, []);

  const onDelete = useCallback(async (files: FileEntry[]) => {
    await mockDelay(200);
    const paths = files.map((f) => f.path);
    console.log("[delete]", paths);

    setTree((prev) => {
      const next = { ...prev };
      for (const file of files) {
        const parent = parentOf(file.path);
        next[parent] = (next[parent] ?? []).filter((f) => f.path !== file.path);
        // Remove directory children
        if (file.type === "directory") {
          delete next[file.path];
        }
      }
      return next;
    });
  }, []);

  const onCreateFolder = useCallback(
    async (parentPath: string, name: string) => {
      await mockDelay(200);
      const folderPath =
        parentPath === "/" ? `/${name}` : `${parentPath}/${name}`;
      console.log(`[createFolder] ${folderPath}`);

      setTree((prev) => {
        const parentFiles = prev[parentPath] ?? [];
        return {
          ...prev,
          [parentPath]: [
            ...parentFiles,
            {
              name,
              path: folderPath,
              type: "directory" as const,
              size: 0,
              lastModified: new Date().toISOString(),
            },
          ],
          [folderPath]: [],
        };
      });
    },
    [],
  );

  const onUpload = useCallback(async (files: File[], targetPath?: string) => {
    await mockDelay(300);
    const dir = targetPath ?? "/";
    console.log(`[upload] ${files.length} files to ${dir}`);

    setTree((prev) => {
      const dirFiles = prev[dir] ?? [];
      const newEntries: FileEntry[] = files.map((f) => ({
        name: f.name,
        path: dir === "/" ? `/${f.name}` : `${dir}/${f.name}`,
        type: "file" as const,
        size: f.size,
        mimeType: f.type,
        lastModified: new Date().toISOString(),
      }));
      return { ...prev, [dir]: [...dirFiles, ...newEntries] };
    });
  }, []);

  const onSave = useCallback(async (path: string, content: string) => {
    await mockDelay(200);
    console.log(`[save] ${path} (${content.length} chars)`);
  }, []);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "8px 12px",
          fontSize: 13,
          color: "#666",
          borderBottom: "1px solid #eee",
        }}
      >
        Open the browser console to see operation logs. Try right-click context
        menu for Rename / Delete / New Folder.
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Finder
          style={{ height: "100%" }}
          tabs={[{ key: "files", label: "Files", rootPath: "/" }]}
          onFetchFiles={onFetchFiles}
          onOpenFile={mockOpenFile}
          // onRename={onRename}
          // onDelete={onDelete}
          // onCreateFolder={onCreateFolder}
          onUpload={onUpload}
          onSave={onSave}
          onDownload={() => {}}
          editable
        />
      </div>
    </div>
  );
}
