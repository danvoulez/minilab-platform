import { useEffect, useState } from "react";
import { MinilabShell } from "./shell/minilab-shell";
import { ResizableLayout } from "./shell/resizable-layout";
import { LeftRail } from "./shell/left-rail";
import { AreaRouter } from "./shell/area-router";
import { InspectorPreview } from "./preview/inspector-preview";
import { usePreviewApi } from "./areas/use-preview";
import { NAVIGATION, SHELL_IDENTITY } from "./navigation";
import type { AreaId, PreviewTarget } from "./types";

const VALID_AREAS = new Set<AreaId>(
  NAVIGATION.flatMap((g) => g.items.map((i) => i.id))
);

function readAreaFromHash(): AreaId | null {
  const raw = window.location.hash.replace(/^#/, "").split("?")[0]?.trim() ?? "";
  if (!raw) return null;
  return VALID_AREAS.has(raw as AreaId) ? (raw as AreaId) : null;
}

export function MinilabOfficialUI() {
  const [area, setArea] = useState<AreaId>(() => readAreaFromHash() ?? "lab-today");
  const [collapsed, setCollapsed] = useState(false);
  const [target, setTarget] = useState<PreviewTarget | null>(null);
  const preview = usePreviewApi(target, setTarget);

  // Hash routing: react to back/forward and external hash changes.
  useEffect(() => {
    function onHash() {
      const next = readAreaFromHash();
      if (next && next !== area) {
        setArea(next);
        setTarget(null);
      }
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [area]);

  // Esc closes preview.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && target !== null) {
        e.preventDefault();
        setTarget(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [target]);

  function selectArea(id: AreaId) {
    setArea(id);
    setTarget(null);
    // Avoid clobbering #showcase or other reserved hashes.
    if (window.location.hash !== `#${id}`) {
      history.replaceState(null, "", `#${id}`);
    }
  }

  return (
    <MinilabShell>
      <ResizableLayout
        previewOpen={target !== null}
        sidebar={
          <LeftRail
            active={area}
            collapsed={collapsed}
            onSelect={selectArea}
            onToggleCollapsed={() => setCollapsed((v) => !v)}
            onPrimaryAction={() => {
              const id = SHELL_IDENTITY.primaryAction.target as AreaId;
              setArea(id);
              setTarget(null);
              history.replaceState(null, "", `#${id}?new`);
              window.dispatchEvent(new Event("minilab:open-register"));
            }}
          />
        }
        middle={<AreaRouter area={area} preview={preview} />}
        preview={
          <InspectorPreview target={target} onClose={() => setTarget(null)} />
        }
      />
    </MinilabShell>
  );
}
