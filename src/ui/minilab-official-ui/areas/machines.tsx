import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { MetricCard } from "../components/metric-card";
import {
  AccessHistory,
  ConnectivityPanel,
  JobActivityList,
  MachineCards,
  MachineReceipts,
  MaintenanceRows,
  ProtectedActions,
  RuntimeSummary,
  SecurityEvents,
} from "../components/domain-composition";
import { STUB_MACHINES, STUB_RECEIPTS } from "./demo-data";
import type { Machine } from "../types";
import type { PreviewApi } from "./use-preview";

export function MachinesPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.machines;
  const [selectedId, setSelectedId] = useState<string>(STUB_MACHINES[0]?.id);

  const selected = useMemo<Machine | undefined>(
    () => STUB_MACHINES.find((m) => m.id === selectedId),
    [selectedId]
  );

  // Auto-open preview for selected machine
  useEffect(() => {
    if (!selected) return;
    preview.open({
      kind: "machine",
      id: selected.id,
      title: selected.label,
      subtitle: selected.role,
      payload: selected,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const onlineCount = STUB_MACHINES.filter((m) => m.status === "online").length;
  const degradedCount = STUB_MACHINES.filter((m) => m.status === "degraded").length;
  const offlineCount = STUB_MACHINES.filter((m) => m.status === "offline").length;

  // Receipts derived for the selected machine label.
  const machineReceipts = useMemo(
    () =>
      selected
        ? STUB_RECEIPTS.filter(
            (r) =>
              r.scope.toLowerCase().includes(selected.label.toLowerCase()) ||
              r.evidence_summary.toLowerCase().includes(selected.label.toLowerCase())
          )
        : [],
    [selected]
  );

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Fleet" value={STUB_MACHINES.length} />
        <MetricCard label="Online" value={onlineCount} tone="good" />
        <MetricCard
          label="Degraded"
          value={degradedCount}
          tone={degradedCount > 0 ? "warn" : "default"}
        />
        <MetricCard
          label="Offline"
          value={offlineCount}
          tone={offlineCount > 0 ? "warn" : "default"}
        />
      </div>

      <Section
        title="LAB Santo Andre · 3 Mac minis"
        hint="Click em uma máquina abre observabilidade detalhada à direita."
      >
        <MachineCards
          machines={STUB_MACHINES}
          selectedId={selectedId}
          onSelect={(m) => setSelectedId(m.id)}
        />
      </Section>

      {selected && (
        <Section
          title={`Observabilidade · ${selected.label}`}
          hint="painéis de conectividade, acesso, jobs, manutenção, segurança, runtimes e receipts."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ConnectivityPanel machine={selected} />
            <AccessHistory machine={selected} />
            <JobActivityList machine={selected} />
            <MaintenanceRows machine={selected} />
            <SecurityEvents machine={selected} />
            <RuntimeSummary machine={selected} />
            <MachineReceipts receipts={machineReceipts} />
            <ProtectedActions />
          </div>
        </Section>
      )}
    </PageFrame>
  );
}
