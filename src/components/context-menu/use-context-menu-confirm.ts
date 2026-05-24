import { useCallback } from "react";

export function useContextMenuConfirm() {
  return useCallback((message: string) => window.confirm(message), []);
}
