type AudioPreviewProps = {
  src: string;
  name: string;
};

export function AudioPreview({ src, name }: AudioPreviewProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
      <div className="text-sm font-medium text-[#2E2929] truncate max-w-full">
        {name}
      </div>
      <audio
        controls
        src={src}
        className="w-full max-w-md"
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
