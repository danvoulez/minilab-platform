import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { MetricCard } from "../components/metric-card";
import { EvidenceBlock } from "../evidence/evidence-block";
import { GhostCard, ReceiptCard } from "../evidence/cards";
import {
  CleaningSchedule,
  EnforcementPanel,
  MaintenanceTaskRows,
  OfficialAddressCard,
  PhysicalAssetList,
  SpaceObservationFeed,
  SupplyList,
  WorkorderCard,
} from "../components/domain-composition";
import {
  STUB_ADDRESSES,
  STUB_CLEANING,
  STUB_ENFORCEMENT,
  STUB_GHOSTS,
  STUB_MAINTENANCE_TASKS,
  STUB_PHYSICAL_ASSETS,
  STUB_RECEIPTS,
  STUB_SPACE_OBSERVATIONS,
  STUB_SUPPLY_LIST,
  STUB_WORKORDERS,
} from "./demo-data";
import type {
  CleaningEntry,
  Ghost,
  MaintenanceTask,
  PhysicalAsset,
  Receipt,
  Workorder,
} from "../types";
import type { PreviewApi } from "./use-preview";

export function SantoAndrePage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY["santo-andre"];
  const [selectedAssetId, setSelectedAssetId] = useState<string | undefined>(
    STUB_PHYSICAL_ASSETS.find((a) => a.state !== "ok")?.id ??
      STUB_PHYSICAL_ASSETS[0]?.id
  );

  const selectedAsset = useMemo<PhysicalAsset | undefined>(
    () => STUB_PHYSICAL_ASSETS.find((a) => a.id === selectedAssetId),
    [selectedAssetId]
  );

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
  function openWorkorder(w: Workorder) {
    preview.open({
      kind: "workorder",
      id: w.id,
      title: w.title,
      subtitle: w.scope,
      payload: w,
    });
  }

  function selectAsset(a: PhysicalAsset) {
    setSelectedAssetId(a.id);
    if (a.workorder_id) {
      const w = STUB_WORKORDERS.find((x) => x.id === a.workorder_id);
      if (w) return openWorkorder(w);
    }
    if (a.ghost_id) {
      const g = STUB_GHOSTS.find((x) => x.id === a.ghost_id);
      if (g) return openGhost(g);
    }
    if (a.receipt_id) {
      const r = STUB_RECEIPTS.find((x) => x.id === a.receipt_id);
      if (r) return openReceipt(r);
    }
    preview.open({
      kind: "json",
      id: a.id,
      title: a.name,
      subtitle: `${a.kind} · ${a.location}`,
      payload: a,
    });
  }
  function selectMaintenance(t: MaintenanceTask) {
    if (t.workorder_id) {
      const w = STUB_WORKORDERS.find((x) => x.id === t.workorder_id);
      if (w) return openWorkorder(w);
    }
    if (t.ghost_id) {
      const g = STUB_GHOSTS.find((x) => x.id === t.ghost_id);
      if (g) return openGhost(g);
    }
    if (t.receipt_id) {
      const r = STUB_RECEIPTS.find((x) => x.id === t.receipt_id);
      if (r) return openReceipt(r);
    }
    preview.open({
      kind: "json",
      id: t.id,
      title: t.title,
      payload: t,
    });
  }
  function selectCleaning(c: CleaningEntry) {
    if (c.ghost_id) {
      const g = STUB_GHOSTS.find((x) => x.id === c.ghost_id);
      if (g) return openGhost(g);
    }
    if (c.receipt_id) {
      const r = STUB_RECEIPTS.find((x) => x.id === c.receipt_id);
      if (r) return openReceipt(r);
    }
    preview.open({
      kind: "json",
      id: c.id,
      title: c.area,
      subtitle: c.cadence,
      payload: c,
    });
  }

  useEffect(() => {
    if (selectedAsset) selectAsset(selectedAsset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset?.id]);

  const counts = useMemo(
    () => ({
      assets: STUB_PHYSICAL_ASSETS.length,
      needs_maintenance: STUB_PHYSICAL_ASSETS.filter(
        (a) => a.state !== "ok"
      ).length,
      cleaning_due: STUB_CLEANING.filter(
        (c) => c.status === "due" || c.status === "missed"
      ).length,
      missing_supplies: STUB_SUPPLY_LIST.filter(
        (s) => s.state === "missing" || s.state === "low"
      ).length,
    }),
    []
  );

  // Workorders relacionados ao espaço físico (scope contém santo-andre ou machines)
  const spaceWorkorders = STUB_WORKORDERS.filter(
    (w) =>
      w.scope.includes("santo-andre") ||
      w.scope.includes("machines") ||
      w.scope.includes("cleaning")
  );

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <OfficialAddressCard
        addresses={STUB_ADDRESSES.filter(
          (a) => a.purpose === "physical_lab"
        )}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Assets" value={counts.assets} />
        <MetricCard
          label="Maintenance"
          value={counts.needs_maintenance}
          tone={counts.needs_maintenance > 0 ? "warn" : "good"}
        />
        <MetricCard
          label="Cleaning open"
          value={counts.cleaning_due}
          tone={counts.cleaning_due > 0 ? "warn" : "good"}
        />
        <MetricCard
          label="Supply low / missing"
          value={counts.missing_supplies}
          tone={counts.missing_supplies > 0 ? "warn" : "good"}
        />
      </div>

      <Section title="Assets" hint="itens físicos do LAB">
        <PhysicalAssetList
          assets={STUB_PHYSICAL_ASSETS}
          selectedId={selectedAsset?.id}
          onSelect={selectAsset}
        />
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <MaintenanceTaskRows
          tasks={STUB_MAINTENANCE_TASKS}
          onSelect={selectMaintenance}
        />
        <CleaningSchedule
          entries={STUB_CLEANING}
          onSelect={selectCleaning}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SupplyList supplies={STUB_SUPPLY_LIST} />
        <EnforcementPanel rules={STUB_ENFORCEMENT} />
      </div>

      <SpaceObservationFeed observations={STUB_SPACE_OBSERVATIONS} />

      {selectedAsset && (
        <Section
          title={`Detalhe · ${selectedAsset.name}`}
          hint="estado, local, responsável e evidência"
        >
          <EvidenceBlock
            items={[
              { label: "kind", value: selectedAsset.kind },
              { label: "location", value: selectedAsset.location },
              { label: "state", value: selectedAsset.state },
              ...(selectedAsset.responsible
                ? [{ label: "responsible", value: selectedAsset.responsible }]
                : []),
              ...(selectedAsset.last_check
                ? [
                    {
                      label: "last_check",
                      value: selectedAsset.last_check,
                      mono: true,
                    },
                  ]
                : []),
            ]}
          />
        </Section>
      )}

      <Section
        title="Workorders relacionados"
        hint="trabalho físico planejado · estado real"
      >
        {spaceWorkorders.length === 0 ? (
          <div className="text-[11.5px] text-neutral-500">
            sem workorders para o espaço.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {spaceWorkorders.map((w) => (
              <WorkorderCard
                key={w.id}
                workorder={w}
                onClick={() => openWorkorder(w)}
              />
            ))}
          </div>
        )}
      </Section>

      <Section title="Needs attention" hint="o que está fora do estado ok">
        {STUB_PHYSICAL_ASSETS.filter((a) => a.state !== "ok").length === 0 ? (
          <div className="text-[11.5px] text-emerald-300/90">
            todos os assets estão ok.
          </div>
        ) : (
          <PhysicalAssetList
            assets={STUB_PHYSICAL_ASSETS.filter((a) => a.state !== "ok")}
            selectedId={selectedAsset?.id}
            onSelect={selectAsset}
          />
        )}
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {STUB_RECEIPTS.filter((r) =>
          r.scope.toLowerCase().includes("santo")
        ).map((r) => (
          <ReceiptCard
            key={r.id}
            receipt={r}
            onClick={() => openReceipt(r)}
          />
        ))}
        {STUB_GHOSTS.filter(
          (g) => g.id === "g_001" || g.id === "g_002"
        ).map((g) => (
          <GhostCard key={g.id} ghost={g} onClick={() => openGhost(g)} />
        ))}
      </div>
    </PageFrame>
  );
}
