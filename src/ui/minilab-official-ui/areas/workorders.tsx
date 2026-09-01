import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { EmptyState } from "../layout/states";
import {
  ExecutionReadiness,
  NewWorkorderComposer,
  ScopeFilters,
  StatusPills,
  WorkorderList,
} from "../components/domain-composition";
import {
  STUB_GHOSTS,
  STUB_RECEIPTS,
  STUB_WORKORDERS,
} from "./demo-data";
import type { Workorder, WorkorderState } from "../types";
import type { PreviewApi } from "./use-preview";

export function WorkordersPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.workorders;
  const [stateFilter, setStateFilter] = useState<WorkorderState | null>(null);
  const [scopes, setScopes] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>(
    STUB_WORKORDERS[0]?.id
  );

  const allScopes = useMemo(
    () => Array.from(new Set(STUB_WORKORDERS.map((w) => w.scope))),
    []
  );

  const filtered = useMemo(
    () =>
      STUB_WORKORDERS.filter((w) => {
        if (stateFilter && w.state !== stateFilter) return false;
        if (scopes.length > 0 && !scopes.includes(w.scope)) return false;
        return true;
      }),
    [stateFilter, scopes]
  );

  const counts = useMemo(() => {
    const base: Record<WorkorderState, number> = {
      draft: 0,
      candidate: 0,
      waiting_approval: 0,
      running: 0,
      blocked: 0,
      closed: 0,
      ghosted: 0,
    };
    for (const w of STUB_WORKORDERS) base[w.state] += 1;
    return base;
  }, []);

  function openWorkorder(w: Workorder) {
    setSelectedId(w.id);
    preview.open({
      kind: "workorder",
      id: w.id,
      title: w.title,
      subtitle: w.scope,
      payload: w,
    });
  }

  const selected = useMemo<Workorder | undefined>(
    () => filtered.find((w) => w.id === selectedId) ?? filtered[0],
    [filtered, selectedId]
  );

  useEffect(() => {
    if (selected) openWorkorder(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  // Useful surface for the selected workorder: linked receipt / ghost summary
  const selectedReceipt = selected?.receipt_id
    ? STUB_RECEIPTS.find((r) => r.id === selected.receipt_id)
    : undefined;
  const selectedGhost = selected?.ghost_id
    ? STUB_GHOSTS.find((g) => g.id === selected.ghost_id)
    : undefined;

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <ExecutionReadiness workorders={STUB_WORKORDERS} />

      <Section
        title="Novo workorder"
        hint="linguagem natural cria draft; gate decide; nada executa fora de gate."
      >
        <NewWorkorderComposer
          onPropose={() => {
            /* stub · não persiste */
          }}
        />
      </Section>

      <Section title="Filtros" hint="estado + escopo">
        <div className="space-y-2">
          <StatusPills
            counts={counts}
            active={stateFilter}
            onSelect={setStateFilter}
          />
          <ScopeFilters
            scopes={allScopes}
            selected={scopes}
            onToggle={(id) =>
              setScopes((prev) =>
                prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
              )
            }
          />
        </div>
      </Section>

      <Section
        title="Workorders por estado"
        hint="clique abre detalhe à direita; gate-required ações são visíveis mas no-op."
      >
        {filtered.length === 0 ? (
          <EmptyState
            title="Sem workorders para esses filtros."
            hint="Workorder estrutura intenção antes da execução."
          />
        ) : (
          <WorkorderList
            workorders={filtered}
            selectedId={selected?.id}
            onSelect={openWorkorder}
          />
        )}
      </Section>

      {selected && (selectedReceipt || selectedGhost) && (
        <Section
          title={`Vínculos · ${selected.title}`}
          hint="receipts/ghosts conectados ao workorder selecionado"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedReceipt && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] p-3 space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-emerald-300/80">
                  receipt vinculado
                </div>
                <div className="text-[12px] text-neutral-100">
                  {selectedReceipt.scope}
                </div>
                <div className="text-[10.5px] text-neutral-400">
                  {selectedReceipt.evidence_summary}
                </div>
                <div className="text-[10.5px] text-emerald-200/70 font-mono">
                  {selectedReceipt.digest ?? selectedReceipt.id}
                </div>
              </div>
            )}
            {selectedGhost && (
              <div className="rounded-lg border border-violet-500/20 bg-violet-500/[0.05] p-3 space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-violet-300/80">
                  ghost vinculado
                </div>
                <div className="text-[12px] text-neutral-100">
                  {selectedGhost.summary}
                </div>
                <div className="text-[10.5px] text-violet-200/70">
                  reason · {selectedGhost.reason}
                </div>
                <div className="text-[10.5px] text-amber-200/80">
                  missing · {selectedGhost.missing.join(", ")}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}
    </PageFrame>
  );
}
