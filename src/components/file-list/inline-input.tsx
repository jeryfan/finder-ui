import { useEffect, useRef, useState } from "react";

type InlineInputProps = {
  defaultValue: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  className?: string;
};

export function InlineInput({ defaultValue, onConfirm, onCancel, className }: InlineInputProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    // Select the name part without extension
    const dotIndex = defaultValue.lastIndexOf(".");
    if (dotIndex > 0) {
      input.setSelectionRange(0, dotIndex);
    } else {
      input.select();
    }
  }, [defaultValue]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      const trimmed = value.trim();
      if (trimmed && trimmed !== defaultValue) {
        onConfirm(trimmed);
      } else {
        onCancel();
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
    }
  };

  const handleBlur = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== defaultValue) {
      onConfirm(trimmed);
    } else {
      onCancel();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onClick={(e) => e.stopPropagation()}
      className={className ?? "flex-1 text-sm bg-card border border-primary rounded px-1 py-0 outline-none focus:ring-1 focus:ring-primary"}
    />
  );
}
