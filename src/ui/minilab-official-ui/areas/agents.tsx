import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { GhostCard, ReceiptCard } from "../evidence/cards";
import {
  AgentList,
  AgentRunHistory,
  AssignedWorkflows,
  AttendanceStatus,
  PermissionSummary,
  WorkflowRunList,
} from "../components/domain-composition";
import {
  STUB_AGENTS,
  STUB_GHOSTS,
  STUB_LLMS,
  STUB_RECEIPTS,
  STUB_SCHEDULES,
} from "./demo-data";
import type { Agent, Ghost, LLMItem, Receipt, Schedule } from "../types";
import type { PreviewApi } from "./use-preview";

export function AgentsPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.agents;
  const [selectedId, setSelectedId] = useState<string | undefined>(
    STUB_AGENTS.find((a) => a.status === "present")?.id ?? STUB_AGENTS[0]?.id
  );

  const selected = useMemo<Agent | undefined>(
    () => STUB_AGENTS.find((a) => a.id === selectedId),
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
  function openLLM(l: LLMItem) {
    preview.open({
      kind: "llm",
      id: l.id,
      title: l.name,
      subtitle: `${l.provider} · ${l.role}`,
      payload: l,
    });
  }
  function openSchedule(s: Schedule) {
    preview.open({
      kind: "json",
      id: s.id,
      title: s.title,
      subtitle: s.cadence,
      payload: s,
    });
  }

  function selectAgent(a: Agent) {
    setSelectedId(a.id);
    preview.open({
      kind: "agent",
      id: a.id,
      title: a.name,
      subtitle: a.role,
      payload: a,
    });
  }

  useEffect(() => {
    if (selected) selectAgent(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  function selectReceiptById(id: string) {
    const r = STUB_RECEIPTS.find((x) => x.id === id);
    if (r) openReceipt(r);
  }
  function selectGhostById(id: string) {
    const g = STUB_GHOSTS.find((x) => x.id === id);
    if (g) openGhost(g);
  }

  const selectedLLM =
    selected?.llm_id && STUB_LLMS.find((l) => l.id === selected.llm_id);
  const selectedGhost =
    selected?.ghost_id &&
    STUB_GHOSTS.find((g) => g.id === selected.ghost_id);

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <div className="rounded-md border border-blue-500/20 bg-blue-500/[0.04] px-3 py-2 text-[10.5px] text-blue-200/85">
        agent é papel operacional · LLM aparece como capacidade do agente, não
        como autoridade.
      </div>

      <AttendanceStatus agents={STUB_AGENTS} />

      <Section
        title="Agents"
        hint="agrupado por presença · clique abre detalhe"
      >
        <AgentList
          agents={STUB_AGENTS}
          selectedId={selected?.id}
          onSelect={selectAgent}
        />
      </Section>

      {selected && (
        <Section
          title={`Detalhe · ${selected.name}`}
          hint="papel, workflows, permissões e últimas ações"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AssignedWorkflows
              agent={selected}
              schedules={STUB_SCHEDULES}
              onSelect={openSchedule}
            />
            <PermissionSummary agent={selected} />
            <div className="md:col-span-2">
              <AgentRunHistory
                agent={selected}
                onSelectReceipt={selectReceiptById}
                onSelectGhost={selectGhostById}
              />
            </div>
            {selectedLLM && (
              <div className="md:col-span-2 rounded-md border border-white/10 bg-white/[0.03] p-3 space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                  capacidade · LLM associado
                </div>
                <button
                  type="button"
                  onClick={() => openLLM(selectedLLM)}
                  className="text-[12px] text-neutral-100 hover:text-blue-200 transition-colors"
                >
                  {selectedLLM.name}
                </button>
                <div className="text-[10.5px] text-neutral-500">
                  {selectedLLM.provider} · {selectedLLM.role}
                </div>
              </div>
            )}
            {selectedGhost && (
              <div className="md:col-span-2">
                <GhostCard
                  ghost={selectedGhost}
                  onClick={() => openGhost(selectedGhost)}
                />
              </div>
            )}
          </div>
        </Section>
      )}

      <Section title="Workflow runs" hint="execuções observadas pelos agentes">
        <WorkflowRunList
          schedules={STUB_SCHEDULES}
          onSelect={openSchedule}
        />
      </Section>

      <Section title="Permissions" hint="quem pode o quê">
        <ul className="space-y-1.5">
          {STUB_AGENTS.map((a) => (
            <li key={a.id} className="text-[11.5px]">
              <div className="flex items-center gap-2">
                <span className="text-neutral-100">{a.name}</span>
                <span className="text-neutral-500 text-[10.5px]">
                  · {a.role}
                </span>
              </div>
              <div className="ml-4 flex flex-wrap gap-1">
                {(a.permissions ?? []).map((p) => (
                  <span
                    key={p}
                    className="h-5 inline-flex items-center px-1.5 rounded text-[10px] border border-white/10 bg-white/[0.03] text-neutral-300 font-mono"
                  >
                    {p}
                  </span>
                ))}
                {(!a.permissions || a.permissions.length === 0) && (
                  <span className="text-[10.5px] text-neutral-500">
                    sem permissões
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </PageFrame>
  );
}
