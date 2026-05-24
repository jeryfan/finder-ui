import type { Virtualizer } from "@tanstack/react-virtual";
import type { FileEntry } from "@/types";
import type {
  FileEntryContextHandler,
  FileEntryMouseHandler,
  UploadingFileItem,
} from "./file-list-row-types";

export type BaseVirtualizedFileViewProps = {
  files: FileEntry[];
  uploadingFiles: UploadingFileItem[];
  selectedPaths: Set<string>;
  focusedIndex: number;
  fileLoadingStates: Record<string, boolean>;
  renamingPath: string | null;
  onEntryClick: FileEntryMouseHandler;
  onEntryDoubleClick: FileEntryMouseHandler;
  onContextMenu: FileEntryContextHandler;
  onRename: (entry: FileEntry, newName: string) => void | Promise<void>;
  onSetRenamingPath: (path: string | null) => void;
};

export type FileViewVirtualizer = Virtualizer<HTMLDivElement, Element>;
