import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { GhostCard, ReceiptCard } from "../evidence/cards";
import {
  CostAllocationCards,
  CostAnomalyList,
  CostByEntity,
  CostTable,
  TrendCharts,
} from "../components/domain-composition";
import {
  STUB_BUDGET,
  STUB_COSTS,
  STUB_GHOSTS,
  STUB_RECEIPTS,
} from "./demo-data";
import type { CostRecord, Ghost, Receipt } from "../types";
import type { PreviewApi } from "./use-preview";

export function CostsPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.costs;
  const [selectedId, setSelectedId] = useState<string | undefined>(
    STUB_COSTS.find((c) => c.anomaly)?.id ?? STUB_COSTS[0]?.id
  );

  const selected = useMemo<CostRecord | undefined>(
    () => STUB_COSTS.find((c) => c.id === selectedId),
    [selectedId]
  );

  function openCost(c: CostRecord) {
    setSelectedId(c.id);
    preview.open({
      kind: "cost",
      id: c.id,
      title: c.cost_object_label,
      subtitle: `${c.cost_object_kind} · ${c.period}`,
      payload: c,
    });
  }

  function openReceipt(r: Receipt) {
    preview.open({
      kind: "receipt",
      id: r.id,
      title: r.scope,
      payload: r,
    });
  }
  function openGhost(g: Ghost) {
    preview.open({
      kind: "ghost",
      id: g.id,
      title: g.summary,
      payload: g,
    });
  }

  useEffect(() => {
    if (selected) openCost(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  const byKind = (kind: CostRecord["cost_object_kind"]) =>
    STUB_COSTS.filter((c) => c.cost_object_kind === kind);

  const linkedReceipt =
    selected?.receipt_id && STUB_RECEIPTS.find((r) => r.id === selected.receipt_id);
  const linkedGhost =
    selected?.ghost_id && STUB_GHOSTS.find((g) => g.id === selected.ghost_id);

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <CostAllocationCards costs={STUB_COSTS} />

      <Section title="Tabela de custos" hint="ordenado por valor · clique abre detalhe">
        <CostTable
          costs={STUB_COSTS}
          selectedId={selected?.id}
          onSelect={openCost}
        />
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <CostByEntity costs={STUB_COSTS} onSelect={openCost} />
        <CostAnomalyList costs={STUB_COSTS} onSelect={openCost} />
      </div>

      <Section title="By machine">
        <CostByEntity costs={byKind("machine")} onSelect={openCost} />
      </Section>

      <Section title="By LLM">
        <CostByEntity costs={byKind("llm")} onSelect={openCost} />
      </Section>

      <Section title="By project / workflow / benchmark">
        <CostByEntity
          costs={STUB_COSTS.filter(
            (c) =>
              c.cost_object_kind === "project" ||
              c.cost_object_kind === "workflow" ||
              c.cost_object_kind === "benchmark"
          )}
          onSelect={openCost}
        />
      </Section>

      <Section title="By month · tendência">
        <TrendCharts budget={STUB_BUDGET} />
      </Section>

      {selected && (linkedReceipt || linkedGhost) && (
        <Section title={`Evidência · ${selected.cost_object_label}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {linkedReceipt && (
              <ReceiptCard
                receipt={linkedReceipt}
                onClick={() => openReceipt(linkedReceipt)}
              />
            )}
            {linkedGhost && (
              <GhostCard
                ghost={linkedGhost}
                onClick={() => openGhost(linkedGhost)}
              />
            )}
          </div>
        </Section>
      )}
    </PageFrame>
  );
}
