import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { MetricCard } from "../components/metric-card";
import {
  LinkedGates,
  PolicyEditorPreview,
  PolicyList,
} from "../components/domain-composition";
import { STUB_GATE_DECISIONS, STUB_POLICIES } from "./demo-data";
import type { GateDecisionRecord, PolicyItem } from "../types";
import type { PreviewApi } from "./use-preview";

export function PoliciesPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.policies;
  const [selectedId, setSelectedId] = useState<string | undefined>(
    STUB_POLICIES.find((p) => p.status === "active")?.id ?? STUB_POLICIES[0]?.id
  );

  const selected = useMemo<PolicyItem | undefined>(
    () => STUB_POLICIES.find((p) => p.id === selectedId),
    [selectedId]
  );

  useEffect(() => {
    if (!selected) return;
    preview.open({
      kind: "policy",
      id: selected.id,
      title: selected.name,
      subtitle: selected.scope.join(" · "),
      payload: selected,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  function selectPolicy(p: PolicyItem) {
    setSelectedId(p.id);
  }

  function openGate(d: GateDecisionRecord) {
    preview.open({
      kind: "gate",
      id: d.id,
      title: d.scope,
      subtitle: d.policy_id,
      payload: d,
    });
  }

  const counts = useMemo(
    () => ({
      active: STUB_POLICIES.filter((p) => p.status === "active").length,
      draft: STUB_POLICIES.filter((p) => p.status === "draft").length,
      needs_review: STUB_POLICIES.filter((p) => p.status === "needs_review").length,
      retired: STUB_POLICIES.filter((p) => p.status === "retired").length,
    }),
    []
  );

  // Recent decisions: latest 5 by created_at
  const recentDecisions = useMemo(
    () => [...STUB_GATE_DECISIONS].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5),
    []
  );

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Active" value={counts.active} tone="good" />
        <MetricCard label="Draft" value={counts.draft} />
        <MetricCard
          label="Needs review"
          value={counts.needs_review}
          tone={counts.needs_review > 0 ? "warn" : "default"}
        />
        <MetricCard label="Retired" value={counts.retired} />
      </div>

      <Section
        title="Regras"
        hint="agrupado por status · não são prompts; são regras operáveis."
      >
        <PolicyList
          policies={STUB_POLICIES}
          selectedId={selected?.id}
          onSelect={selectPolicy}
        />
      </Section>

      {selected && (
        <Section
          title={`Detalhe · ${selected.name}`}
          hint="aplicação, gates e edição em rascunho"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <PolicyEditorPreview policy={selected} />
            <LinkedGates
              policy={selected}
              decisions={STUB_GATE_DECISIONS}
              onSelect={openGate}
            />
          </div>
        </Section>
      )}

      <Section title="Recent decisions" hint="amostragem global">
        <ul className="space-y-1.5">
          {recentDecisions.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => openGate(d)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <span className="text-neutral-200 truncate">{d.scope}</span>
                <span className="text-neutral-500 text-[10.5px]">
                  · {d.decision.replace("_", " ")}
                </span>
                <span className="ml-auto text-neutral-500 text-[10.5px] font-mono">
                  {d.created_at}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Section>
    </PageFrame>
  );
}
