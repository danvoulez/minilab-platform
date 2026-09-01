import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { MetricCard } from "../components/metric-card";
import { GhostCard, ReceiptCard } from "../evidence/cards";
import {
  ConfigGroups,
  InstallStatus,
  RuntimeHealth,
  RuntimeRows,
  VersionBadges,
} from "../components/domain-composition";
import {
  STUB_GHOSTS,
  STUB_MACHINES,
  STUB_RECEIPTS,
  STUB_RUNTIMES,
} from "./demo-data";
import type {
  Ghost,
  Machine,
  Receipt,
  RuntimeRecord,
  RuntimeState,
} from "../types";
import type { PreviewApi } from "./use-preview";

export function RuntimesPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.runtimes;
  const [selectedId, setSelectedId] = useState<string | undefined>(
    STUB_RUNTIMES.find((r) => r.state === "broken")?.id ?? STUB_RUNTIMES[0]?.id
  );

  const selected = useMemo<RuntimeRecord | undefined>(
    () => STUB_RUNTIMES.find((r) => r.id === selectedId),
    [selectedId]
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
  function openMachine(m: Machine) {
    preview.open({
      kind: "machine",
      id: m.id,
      title: m.label,
      subtitle: m.role,
      payload: m,
    });
  }

  function selectRuntime(r: RuntimeRecord) {
    setSelectedId(r.id);
    preview.open({
      kind: "runtime",
      id: r.id,
      title: r.name,
      subtitle: `v${r.version}${r.machine_id ? " · " + r.machine_id : ""}`,
      payload: r,
    });
  }

  useEffect(() => {
    if (selected) selectRuntime(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  const counts: Record<RuntimeState, number> = {
    running: 0,
    installed: 0,
    needs_update: 0,
    broken: 0,
    planned: 0,
  };
  for (const r of STUB_RUNTIMES) counts[r.state] += 1;

  const critical = STUB_RUNTIMES.filter((r) => r.critical);

  const selectedMachine =
    selected?.machine_id &&
    STUB_MACHINES.find((m) => m.id === selected.machine_id);
  const selectedReceipt =
    selected?.receipt_id &&
    STUB_RECEIPTS.find((r) => r.id === selected.receipt_id);
  const selectedGhost =
    selected?.ghost_id &&
    STUB_GHOSTS.find((g) => g.id === selected.ghost_id);

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MetricCard label="Running" value={counts.running} tone="good" />
        <MetricCard label="Installed" value={counts.installed} />
        <MetricCard
          label="Needs update"
          value={counts.needs_update}
          tone={counts.needs_update > 0 ? "warn" : "default"}
        />
        <MetricCard
          label="Broken"
          value={counts.broken}
          tone={counts.broken > 0 ? "warn" : "default"}
        />
        <MetricCard label="Planned" value={counts.planned} />
      </div>

      <Section title="Critical runtimes" hint="dependências do sistema operacional">
        {critical.length === 0 ? (
          <div className="text-[11.5px] text-neutral-500">
            nenhum runtime marcado como crítico.
          </div>
        ) : (
          <RuntimeRows
            runtimes={critical}
            selectedId={selected?.id}
            onSelect={selectRuntime}
            groupBy="none"
          />
        )}
      </Section>

      <Section title="Por estado" hint="agrupado por situação observada">
        <RuntimeRows
          runtimes={STUB_RUNTIMES}
          selectedId={selected?.id}
          onSelect={selectRuntime}
          groupBy="state"
        />
      </Section>

      <Section title="Por máquina">
        <RuntimeRows
          runtimes={STUB_RUNTIMES}
          selectedId={selected?.id}
          onSelect={selectRuntime}
          groupBy="machine"
        />
      </Section>

      {selected && (
        <Section
          title={`Detalhe · ${selected.name}`}
          hint="versão, health, configuração e vínculos"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-[12px] text-neutral-100">{selected.name}</div>
                <InstallStatus runtime={selected} />
              </div>
              <VersionBadges runtime={selected} />
              <div className="text-[10.5px] text-neutral-500 font-mono">
                last used · {selected.last_used_at ?? "—"}
              </div>
              {selectedMachine && (
                <button
                  type="button"
                  onClick={() => openMachine(selectedMachine)}
                  className="w-full text-left text-[10.5px] text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  → machine · {selectedMachine.label}
                </button>
              )}
            </div>
            <RuntimeHealth runtime={selected} />
            <div className="md:col-span-2">
              <ConfigGroups runtime={selected} />
            </div>
            {(selectedReceipt || selectedGhost) && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedReceipt && (
                  <ReceiptCard
                    receipt={selectedReceipt}
                    onClick={() => openReceipt(selectedReceipt)}
                  />
                )}
                {selectedGhost && (
                  <GhostCard
                    ghost={selectedGhost}
                    onClick={() => openGhost(selectedGhost)}
                  />
                )}
              </div>
            )}
          </div>
        </Section>
      )}
    </PageFrame>
  );
}
