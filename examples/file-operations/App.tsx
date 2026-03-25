import { useCallback } from "react";
import { Finder } from "../../src";
import { fetchFiles, openFile, saveFile, uploadFiles } from "../api";

export default function FileOperationsExample() {
  const onSave = useCallback(async (path: string, content: string) => {
    await saveFile(path, content);
    console.log(`[save] ${path} (${content.length} chars)`);
  }, []);

  const onUpload = useCallback(async (files: File[], targetPath?: string) => {
    await uploadFiles(files, targetPath ?? "/");
    console.log(`[upload] ${files.length} files to ${targetPath ?? "/"}`);
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
          onFetchFiles={fetchFiles}
          onOpenFile={openFile}
          onUpload={onUpload}
          onSave={onSave}
          onDownload={() => {}}
          editable
        />
      </div>
    </div>
  );
}
