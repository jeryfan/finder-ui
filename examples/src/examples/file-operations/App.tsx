import { useCallback } from "react";
import { Finder } from "@jeryfan/finder-ui";
import type { FileEntry } from "@jeryfan/finder-ui";
import {
  fetchFiles,
  openFile,
  saveFile,
  uploadFiles,
} from "../../api";
import { downloadAndSave } from "../download";
import { ExampleFrame, ExampleNote } from "../shared";

export default function FileOperationsExample() {
  const onSave = useCallback(async (path: string, content: string) => {
    await saveFile(path, content);
    console.log(`[save] ${path} (${content.length} chars)`);
  }, []);

  const onUpload = useCallback(async (files: File[], targetPath?: string) => {
    await uploadFiles(files, targetPath ?? "/");
    console.log(`[upload] ${files.length} files to ${targetPath ?? "/"}`);
  }, []);

  const onDownload = useCallback(async (file: FileEntry) => {
    await downloadAndSave(file);
    console.log(`[download] ${file.name}`);
  }, []);

  return (
    <ExampleFrame
      toolbar={
        <ExampleNote>
        Open the browser console to see save, upload, and download operation logs.
        </ExampleNote>
      }
    >
      <Finder
        style={{ height: "100%" }}
        tabs={[{ key: "files", label: "Files", rootPath: "/" }]}
        onFetchFiles={fetchFiles}
        onOpenFile={openFile}
        onUpload={onUpload}
        onSave={onSave}
        onDownload={onDownload}
        editable
      />
    </ExampleFrame>
  );
}
