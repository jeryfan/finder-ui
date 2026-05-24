import { FolderIcon, UploadIcon } from "@/icons";
import type { FinderLocale } from "@/locale";
import { InlineInput } from "./inline-input";

export type FileDropOverlayProps = {
  locale: FinderLocale;
};

export function FileDropOverlay({ locale }: FileDropOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center rounded-xl border-2 border-dashed border-primary bg-primary/5">
      <div className="flex flex-col items-center gap-2 text-primary">
        <UploadIcon className="h-8 w-8" />
        <span className="text-sm font-medium">
          {locale.dropFilesToUpload}
        </span>
      </div>
    </div>
  );
}

export type FileListErrorStateProps = {
  locale: FinderLocale;
  onRetry: () => void;
};

export function FileListErrorState({ locale, onRetry }: FileListErrorStateProps) {
  return (
    <div className="h-full flex items-center justify-center p-4 text-center">
      <div>
        <p className="text-sm text-red-600">{locale.failedToLoad}</p>
        <button
          onClick={onRetry}
          className="mt-2 px-3 py-1 text-xs rounded-md bg-foreground text-white hover:opacity-90"
        >
          {locale.retry}
        </button>
      </div>
    </div>
  );
}

export function GroupedSkeleton() {
  return (
    <div className="grid grid-cols-8 gap-4 p-4">
      {Array.from({ length: 16 }).map((_, index) => (
        <div
          key={`grid-skeleton-${index}`}
          className="flex flex-col items-center gap-2 animate-pulse"
        >
          <div className="w-12 h-12 bg-muted rounded shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
          <div className="w-16 h-3 bg-muted rounded shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="p-4 space-y-1">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={`list-skeleton-${index}`}
          className="flex items-center gap-3 py-2 animate-pulse"
        >
          <div className="w-4 h-4 rounded bg-muted shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
          <div className="h-3 flex-1 rounded bg-muted shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
          <div className="w-16 h-3 rounded bg-muted shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
          <div className="w-10 h-3 rounded bg-muted shadow-[inset_0_0_0_1px_rgba(46,41,41,0.06)]" />
        </div>
      ))}
    </div>
  );
}

export type FileListEmptyStateProps = {
  locale: FinderLocale;
  showSearchHint: boolean;
};

export function FileListEmptyState({
  locale,
  showSearchHint,
}: FileListEmptyStateProps) {
  return (
    <div className="h-full flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <FolderIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">{locale.noFiles}</p>
        {showSearchHint && (
          <p className="text-xs mt-1">{locale.tryDifferentSearch}</p>
        )}
      </div>
    </div>
  );
}

export type NewFolderInputProps = {
  locale: FinderLocale;
  currentPath: string;
  viewMode: "list" | "grouped";
  onCreateFolder: (parentPath: string, name: string) => void | Promise<void>;
  onDone: () => void;
};

export function NewFolderInput({
  locale,
  currentPath,
  viewMode,
  onCreateFolder,
  onDone,
}: NewFolderInputProps) {
  const handleConfirm = (name: string) => {
    onCreateFolder(currentPath, name);
    onDone();
  };

  if (viewMode === "list") {
    return (
      <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted leading-[25.6px]">
        <FolderIcon className="w-4 h-4 shrink-0 text-primary" />
        <InlineInput
          defaultValue={locale.newFolder}
          onConfirm={handleConfirm}
          onCancel={onDone}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-2 rounded-lg bg-muted mb-3" style={{ width: 90 }}>
      <div className="w-14 h-14 mb-1 flex items-center justify-center">
        <FolderIcon className="w-8 h-8 text-primary" />
      </div>
      <InlineInput
        defaultValue={locale.newFolder}
        onConfirm={handleConfirm}
        onCancel={onDone}
        className="w-full text-[11px] text-center bg-card border border-primary rounded px-1 py-0 outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
