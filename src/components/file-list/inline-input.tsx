import { useEffect, useId, useRef, useState } from "react";

type InlineInputProps = {
  defaultValue: string;
  onConfirm: (value: string) => void | Promise<void>;
  onCancel: () => void;
  className?: string;
  errorMessage?: string;
};

export function InlineInput({
  defaultValue,
  onConfirm,
  onCancel,
  className,
  errorMessage = "Operation failed",
}: InlineInputProps) {
  const [value, setValue] = useState(defaultValue);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);
  const errorId = `${useId()}-inline-input-error`;

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

  const confirmValue = async () => {
    if (submittingRef.current) return;
    const trimmed = value.trim();
    if (!trimmed || trimmed === defaultValue) {
      onCancel();
      return;
    }

    setError(null);
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await onConfirm(trimmed);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : errorMessage);
      inputRef.current?.focus();
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      void confirmValue();
    } else if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
    }
  };

  const handleBlur = () => {
    void confirmValue();
  };

  return (
    <span className="flex min-w-0 flex-1 flex-col">
      <input
        ref={inputRef}
        type="text"
        value={value}
        disabled={submitting}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        onChange={(e) => {
          setValue(e.target.value);
          setError(null);
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onClick={(e) => e.stopPropagation()}
        className={className ?? "flex-1 text-sm bg-card border border-primary rounded px-1 py-0 outline-none focus:ring-1 focus:ring-primary"}
      />
      {error && (
        <span id={errorId} role="alert" className="mt-0.5 truncate text-[10px] leading-3 text-red-600">
          {error}
        </span>
      )}
    </span>
  );
}
