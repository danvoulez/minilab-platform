import { PreviewHeader } from "./preview-header";
import { StatusPill } from "../components/status";
import { EvidenceBlock } from "../evidence/evidence-block";
import type { AIProposal } from "../register/ai-proposal-card";
import type { RegistryAdmissionResult } from "../lib/registry-api";

export type RegistryAdmissionPreviewPayload = {
  result: RegistryAdmissionResult;
  proposal: AIProposal;
};

export function RegistryAdmissionPreview({
  payload,
  onClose,
}: {
  payload: RegistryAdmissionPreviewPayload;
  onClose: () => void;
}) {
  const { result, proposal } = payload;
  return (
    <div className="flex flex-col">
      <PreviewHeader
        kind="registry_admission"
        title={String(proposal.payload.name ?? result.entity_id)}
        subtitle={`${proposal.entity_kind ?? "entity"} · ${proposal.schema_version ?? "unknown schema"}`}
        status={<StatusPill tone={result.deduped ? "info" : "ok"}>{result.deduped ? "deduped" : "admitted"}</StatusPill>}
        onClose={onClose}
      />
      <div className="p-4 space-y-4 text-[11.5px] text-neutral-300">
        <EvidenceBlock
          items={[
            { label: "entity_id", value: result.entity_id, mono: true },
            { label: "admission_id", value: result.admission_id, mono: true },
            { label: "state_cid", value: result.state_cid, mono: true },
            { label: "content_cid", value: result.content_cid, mono: true },
            { label: "previous_state_cid", value: result.previous_state_cid ?? "first admitted state", mono: true },
          ]}
        />
        <div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1.5">admitted candidate</div>
          <pre className="rounded-md border border-white/10 bg-black/20 p-3 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[10.5px] leading-relaxed text-neutral-300">
            {JSON.stringify(proposal.payload, null, 2)}
          </pre>
        </div>
        <div className="rounded-md border border-emerald-500/20 bg-emerald-500/[0.05] p-3 text-[10.5px] text-emerald-100/80">
          Estes identificadores vieram da admissão da engine. A proposta do navegador não é a prova; este resultado é o recibo do estado aceito.
        </div>
      </div>
    </div>
  );
}
