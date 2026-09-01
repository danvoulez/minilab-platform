import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "../utils/cn";

export function ResizableLayout({
  sidebar,
  middle,
  preview,
  previewOpen,
  className,
}: {
  sidebar: ReactNode;
  middle: ReactNode;
  preview: ReactNode;
  previewOpen: boolean;
  className?: string;
}) {
  const [previewWidth, setPreviewWidth] = useState<number>(420);
  const draggingRef = useRef(false);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!draggingRef.current) return;
      const next = Math.min(
        Math.max(window.innerWidth - e.clientX, 320),
        Math.max(360, Math.floor(window.innerWidth * 0.55))
      );
      setPreviewWidth(next);
    }
    function onUp() {
      draggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div className={cn("h-full w-full flex bg-page text-neutral-100", className)}>
      {sidebar}
      <main className="flex-1 min-w-0 flex">
        <div className="flex-1 min-w-0 overflow-y-auto scrollbar-thin">
          {middle}
        </div>
        {previewOpen && (
          <>
            <div
              role="separator"
              aria-orientation="vertical"
              onMouseDown={() => {
                draggingRef.current = true;
                document.body.style.cursor = "col-resize";
                document.body.style.userSelect = "none";
              }}
              className="w-px bg-white/10 hover:bg-blue-500/40 cursor-col-resize"
            />
            <aside
              style={{ width: previewWidth }}
              className="shrink-0 h-full overflow-y-auto scrollbar-thin bg-panel border-l border-white/10"
            >
              {preview}
            </aside>
          </>
        )}
      </main>
    </div>
  );
}
