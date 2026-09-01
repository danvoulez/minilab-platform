import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "../utils/cn";
import { StatusPill } from "../components/status";
import { MissingFields } from "./missing-fields";

export interface AIProposal {
  intent: string;
  summary: string;
  entity_kind: string | null;
  schema_version: string | null;
  payload: Record<string, unknown>;
  missing: string[];
  rule_check?: { passed: boolean; note?: string };
}

export function AIProposalCard({
  proposal,
  actions,
  className,
}: {
  proposal: AIProposal;
  actions?: ReactNode;
  className?: string;
}) {
  const isComplete = proposal.missing.length === 0;
  const ruleOk = proposal.rule_check?.passed ?? isComplete;
  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-white/[0.03] p-4 space-y-3",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-wider text-blue-300/90">
          <Sparkles size={12} strokeWidth={1.5} />
          <span>registry proposal · draft</span>
        </div>
        <StatusPill tone={isComplete && ruleOk ? "info" : "warn"}>
          {isComplete && ruleOk ? "ready for review" : "incomplete"}
        </StatusPill>
      </div>

      <div>
        <div className="text-[10.5px] text-neutral-500">Intenção</div>
        <div className="text-[13px] text-neutral-100">{proposal.intent}</div>
      </div>

      <div>
        <div className="text-[10.5px] text-neutral-500">Resumo proposto</div>
        <div className="text-[13px] text-neutral-200">{proposal.summary}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <ContractField label="entity_kind" value={proposal.entity_kind ?? "—"} />
        <ContractField label="schema_version" value={proposal.schema_version ?? "—"} mono />
      </div>

      <div>
        <div className="text-[10.5px] uppercase tracking-wider text-neutral-500 mb-1.5">payload canônico candidato</div>
        <pre className="rounded-md border border-white/10 bg-black/20 p-3 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[10.5px] leading-relaxed text-neutral-300">
          {JSON.stringify(proposal.payload, null, 2)}
        </pre>
      </div>

      <MissingFields fields={proposal.missing} />

      {proposal.rule_check?.note && (
        <div className="text-[10.5px] text-neutral-500 italic">
          regra: {proposal.rule_check.note}
        </div>
      )}

      {actions && <div className="pt-1 flex items-center justify-end gap-2">{actions}</div>}

      <div className="pt-2 border-t border-white/[0.06] text-[10.5px] text-neutral-600">
        Esta proposta não altera o Registry. Estado válido só nasce quando o provider aceita o contrato da plataforma e devolve identificadores autoritativos de conteúdo, estado e proveniência.
      </div>
    </div>
  );
}

function ContractField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-md border border-white/[0.08] bg-black/10 px-3 py-2 min-w-0">
      <div className="text-[10px] uppercase tracking-wider text-neutral-600">{label}</div>
      <div className={cn("mt-0.5 text-[11.5px] text-neutral-200 truncate", mono && "font-mono text-[10.5px]")}>{value}</div>
    </div>
  );
}
