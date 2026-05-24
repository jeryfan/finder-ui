import type { FileEntry } from "@/types";

export const getFileOptionId = (index: number) => `finder-file-option-${index}`;

export type UploadingFileItem = {
  name: string;
  type: "file" | "directory";
};

export type FileEntryMouseHandler = (
  entry: FileEntry,
  event: React.MouseEvent,
) => void;

export type FileEntryContextHandler = (
  event: React.MouseEvent,
  entry: FileEntry | null,
) => void;
