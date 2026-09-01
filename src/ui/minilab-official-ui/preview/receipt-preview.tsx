import { cn } from "../utils/cn";
import { StatusPill } from "../components/status";
import { PreviewHeader } from "./preview-header";
import { EvidenceBlock } from "../evidence/evidence-block";
import type { Receipt } from "../types";

export function ReceiptPreview({
  receipt,
  onClose,
  className,
}: {
  receipt: Receipt;
  onClose: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <PreviewHeader
        kind="receipt"
        title={receipt.scope}
        subtitle={`closed_at ${receipt.closed_at}`}
        status={<StatusPill tone="ok">{receipt.status}</StatusPill>}
        actions={
          <>
            <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-white/[0.04] ring-1 ring-inset ring-white/10 text-neutral-300 hover:bg-white/[0.08]">
              Copiar digest
            </button>
            <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-white/[0.04] ring-1 ring-inset ring-white/10 text-neutral-300 hover:bg-white/[0.08]">
              Abrir evidência
            </button>
          </>
        }
        onClose={onClose}
      />
      <div className="p-4 space-y-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-500">
            evidence summary
          </div>
          <p className="text-[13px] text-neutral-100">{receipt.evidence_summary}</p>
        </div>

        <EvidenceBlock
          items={[
            { label: "scope", value: receipt.scope },
            { label: "closed_at", value: receipt.closed_at, mono: true },
            { label: "id", value: receipt.id, mono: true },
            ...(receipt.digest ? [{ label: "digest", value: receipt.digest, mono: true }] : []),
          ]}
        />

        <div className="rounded-md border border-emerald-500/20 bg-emerald-500/[0.05] p-3 text-[10.5px] text-emerald-200">
          Receipt = prova fechada. Não conta storytelling. O que está aqui está em bytes online.
        </div>
      </div>
    </div>
  );
}
