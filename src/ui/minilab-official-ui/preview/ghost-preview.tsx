import { cn } from "../utils/cn";
import { StatusPill } from "../components/status";
import { PreviewHeader } from "./preview-header";
import { MissingFields } from "../register/missing-fields";
import type { Ghost } from "../types";

export function GhostPreview({
  ghost,
  onClose,
  className,
}: {
  ghost: Ghost;
  onClose: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <PreviewHeader
        kind="ghost"
        title={ghost.summary}
        subtitle={`reason · ${ghost.reason}`}
        status={
          <StatusPill tone="ghost">
            {ghost.status}
          </StatusPill>
        }
        actions={
          <>
            <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-violet-500/15 ring-1 ring-inset ring-violet-500/40 text-violet-200 hover:bg-violet-500/25">
              Adicionar evidência
            </button>
            <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-white/[0.04] ring-1 ring-inset ring-white/10 text-neutral-300 hover:bg-white/[0.08]">
              Refinar
            </button>
            <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-white/[0.04] ring-1 ring-inset ring-white/10 text-neutral-300 hover:bg-white/[0.08]">
              Rejeitar
            </button>
          </>
        }
        onClose={onClose}
      />
      <div className="p-4 space-y-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-500">criado em</div>
          <div className="text-[13px] text-neutral-100">{ghost.created_at}</div>
        </div>
        <MissingFields fields={ghost.missing} />
        <div className="rounded-md border border-violet-500/20 bg-violet-500/[0.05] p-3 text-[10.5px] text-violet-200">
          Ghost é incompletude honesta. Não é defeito. Não é registro válido. É lembrança operacional.
        </div>
      </div>
    </div>
  );
}
