import type { FinderLocale } from "@/locale";

type AudioPreviewProps = {
  src: string;
  name: string;
  locale: FinderLocale;
};

export function AudioPreview({ src, name, locale }: AudioPreviewProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
      <div className="text-sm font-medium text-foreground truncate max-w-full">
        {name}
      </div>
      <audio
        controls
        src={src}
        className="w-full max-w-md"
      >
        {locale.audioNotSupported}
      </audio>
    </div>
  );
}
