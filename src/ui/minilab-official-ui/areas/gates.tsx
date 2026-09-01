import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { MetricCard } from "../components/metric-card";
import { AuthorityBlock } from "../evidence/authority-block";
import { EvidenceBlock } from "../evidence/evidence-block";
import { GateDecisionCard } from "../evidence/cards";
import {
  ApprovalRequests,
  GateDecisionQueue,
  GateHistory,
  ReasonPanel,
} from "../components/domain-composition";
import {
  STUB_GATE_DECISIONS,
  STUB_WORKORDERS,
} from "./demo-data";
import type { GateDecisionRecord } from "../types";
import type { PreviewApi } from "./use-preview";

export function GatesPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.gates;
  const [selectedId, setSelectedId] = useState<string | undefined>(
    STUB_GATE_DECISIONS.find((d) => d.decision === "needs_approval")?.id ??
      STUB_GATE_DECISIONS[0]?.id
  );

  const selected = useMemo<GateDecisionRecord | undefined>(
    () => STUB_GATE_DECISIONS.find((d) => d.id === selectedId),
    [selectedId]
  );

  useEffect(() => {
    if (!selected) return;
    preview.open({
      kind: "gate",
      id: selected.id,
      title: selected.scope,
      subtitle: selected.policy_id,
      payload: selected,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  function selectDecision(d: GateDecisionRecord) {
    setSelectedId(d.id);
  }

  const counts = useMemo(() => {
    const base = { ok: 0, denied: 0, needs_approval: 0, ghost: 0, error: 0 };
    for (const d of STUB_GATE_DECISIONS) base[d.decision] += 1;
    return base;
  }, []);

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MetricCard
          label="Needs approval"
          value={counts.needs_approval}
          tone={counts.needs_approval > 0 ? "warn" : "default"}
        />
        <MetricCard label="OK" value={counts.ok} tone="good" />
        <MetricCard
          label="Denied"
          value={counts.denied}
          tone={counts.denied > 0 ? "warn" : "default"}
        />
        <MetricCard label="Ghosted" value={counts.ghost} />
        <MetricCard
          label="Errors"
          value={counts.error}
          tone={counts.error > 0 ? "warn" : "default"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ApprovalRequests
          decisions={STUB_GATE_DECISIONS}
          onSelect={selectDecision}
        />
        <GateHistory
          decisions={STUB_GATE_DECISIONS}
          onSelect={selectDecision}
        />
      </div>

      <Section
        title="Fila de decisões"
        hint="por estado · clique abre detalhe à direita"
      >
        <GateDecisionQueue
          decisions={STUB_GATE_DECISIONS}
          selectedId={selectedId}
          onSelect={selectDecision}
        />
      </Section>

      {selected && (
        <Section
          title={`Decisão · ${selected.scope}`}
          hint="razão, política, evidência e autoridade"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ReasonPanel decision={selected} />
            <AuthorityBlock
              authorities={[
                {
                  who: selected.authority ?? "—",
                  role: "approver",
                  can: ["approve", "deny", "ghost"],
                },
              ]}
            />
            <div className="md:col-span-2">
              <EvidenceBlock
                items={[
                  { label: "decision", value: selected.decision },
                  {
                    label: "policy",
                    value: selected.policy_id ?? "—",
                    mono: true,
                  },
                  ...(selected.workorder_id
                    ? [
                        {
                          label: "workorder",
                          value:
                            STUB_WORKORDERS.find(
                              (w) => w.id === selected.workorder_id
                            )?.title ?? selected.workorder_id,
                          mono: false,
                        },
                      ]
                    : []),
                  { label: "created_at", value: selected.created_at, mono: true },
                ]}
              />
            </div>
            <div className="md:col-span-2">
              <GateDecisionCard
                scope={selected.scope}
                decision={selected.decision}
                reason={selected.reason}
                policy={selected.policy_id}
              />
            </div>
          </div>
        </Section>
      )}
    </PageFrame>
  );
}
