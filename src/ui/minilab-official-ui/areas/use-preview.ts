import { useCallback } from "react";
import type { PreviewTarget } from "../types";

export interface PreviewApi {
  current: PreviewTarget | null;
  open: (target: PreviewTarget) => void;
  close: () => void;
  isSelected: (kind: PreviewTarget["kind"], id: string) => boolean;
}

export function usePreviewApi(
  current: PreviewTarget | null,
  setTarget: (t: PreviewTarget | null) => void
): PreviewApi {
  const open = useCallback((t: PreviewTarget) => setTarget(t), [setTarget]);
  const close = useCallback(() => setTarget(null), [setTarget]);
  const isSelected = useCallback(
    (kind: PreviewTarget["kind"], id: string) =>
      current?.kind === kind && current.id === id,
    [current]
  );
  return { current, open, close, isSelected };
}
