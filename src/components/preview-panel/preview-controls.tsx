import { Eye, Loader2, PenLine, Save } from "lucide-react";
import type { FinderLocale } from "@/locale";
import type { PreviewWindow } from "@/types";
import { cn } from "@/utils";

export type PreviewSaveButtonProps = {
  preview: PreviewWindow;
  canSave: boolean;
  locale: FinderLocale;
  className: string;
  iconClassName: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export function PreviewSaveButton({
  preview,
  canSave,
  locale,
  className,
  iconClassName,
  onClick,
}: PreviewSaveButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={!canSave && !preview.isSaving}
      className={className}
      title={locale.save}
      aria-label={locale.save}
    >
      {preview.isSaving ? (
        <Loader2 className={cn(iconClassName, "animate-spin")} />
      ) : (
        <Save className={iconClassName} />
      )}
    </button>
  );
}

export type PreviewEditButtonProps = {
  locale: FinderLocale;
  className: string;
  iconClassName: string;
  mode: "edit" | "preview";
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export function PreviewEditButton({
  locale,
  className,
  iconClassName,
  mode,
  onClick,
}: PreviewEditButtonProps) {
  const isEditAction = mode === "edit";
  const Icon = isEditAction ? PenLine : Eye;

  return (
    <button
      onClick={onClick}
      className={className}
      title={isEditAction ? locale.edit : locale.preview}
      aria-label={isEditAction ? locale.edit : locale.preview}
    >
      <Icon className={iconClassName} />
    </button>
  );
}
