import type { ReactNode } from "react";
import { BigComposer } from "../register/big-composer";
import { EntityRow, EntityTable } from "../components/entity";
import { FilterChips } from "../components/filter-chips";
import { MetricCard } from "../components/metric-card";
import { StatusDot, StatusPill, type StatusTone } from "../components/status";
import { Timeline, type TimelineEvent } from "../components/timeline";
import { SectionCard } from "../layout/section";
import { cn } from "../utils/cn";
import type {
  AddressItem,
  Agent,
  AgentRun,
  Appointment,
  AssetState,
  BudgetCategory,
  CareGroup,
  CareItem,
  CareStatus,
  CleaningEntry,
  ConnectionDomain,
  ConnectionItem,
  ConnectionState,
  CorrespondenceItem,
  CostRecord,
  DocStatus,
  DocumentItem,
  EnforcementRule,
  FinanceCategory,
  FinanceRecord,
  FinanceStatus,
  GateDecisionRecord,
  GateDecisionState,
  GentleAlertItem,
  Ghost,
  HumanCheckIn,
  KnowledgeItem,
  LLMItem,
  LLMRole,
  LegalKind,
  LegalRecord,
  LegalRiskLevel,
  Machine,
  MaintenanceTask,
  PhysicalAsset,
  PolicyItem,
  PolicyStatusKind,
  Receipt,
  RegistryEntity,
  ReviewItem,
  ReviewKind,
  ReviewStatus,
  RoutineEntry,
  RuntimeHealthSignal,
  RuntimeRecord,
  RuntimeState,
  Schedule,
  SecretReference,
  Sensor,
  SpaceObservation,
  SpendingEvent,
  SupplyEntry,
  SupplyNeed,
  VendorItem,
  VendorState,
  Workorder,
  WorkorderState,
} from "../types";

export interface RegistryTypeSummary {
  id: string;
  label: string;
  description: string;
  count?: number;
  status?: string;
  schemaVersion?: string;
}

export function LocalOperatorComposer({
  onPropose,
  value,
  onChange,
  focusToken = 0,
  selectedContract,
}: {
  onPropose: (text: string) => void;
  value?: string;
  onChange?: (value: string) => void;
  focusToken?: number;
  selectedContract?: string | null;
}) {
  return (
    <div className="space-y-2">
      <div className="rounded-md border border-blue-500/20 bg-blue-500/[0.04] px-3 py-2">
        <div className="text-[13px] text-blue-100">Assistente de proposta</div>
        <div className="mt-0.5 text-[10.5px] text-blue-200/70 leading-relaxed">
          Nesta build, a interpretação inicial é determinística no navegador. Nenhum modelo decide validade: o provider precisa satisfazer o contrato Minilab e devolver um recibo autoritativo.
          {selectedContract ? ` Contrato selecionado: ${selectedContract}.` : ""}
        </div>
      </div>
      <BigComposer
        value={value}
        onChange={onChange}
        focusToken={focusToken}
        onPropose={onPropose}
        placeholder='Ex: cadastrar máquina "LAB-256", um runtime Python, um sensor de temperatura ou uma expedição.'
      />
    </div>
  );
}

export function RegistryTypeTable({
  types,
  activeType,
  onSelect,
}: {
  types: RegistryTypeSummary[];
  activeType: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <EntityTable>
      {types.map((type) => (
        <EntityRow
          key={type.id}
          title={type.label}
          subtitle={type.description}
          meta={typeof type.count === "number" ? `${type.count} item(s) · ${type.status ?? "unknown"}` : `${type.status ?? "unknown"} · ${type.schemaVersion ?? "platform contract"}`}
          tone={activeType === type.id ? "info" : type.status === "available" ? "ok" : type.status === "degraded" ? "warn" : "muted"}
          selected={activeType === type.id}
          onClick={() => onSelect(type.id)}
        />
      ))}
    </EntityTable>
  );
}

export function EntityList({
  entities,
  selectedId,
  onSelect,
}: {
  entities: RegistryEntity[];
  selectedId?: string;
  onSelect: (entity: RegistryEntity) => void;
}) {
  return (
    <EntityTable>
      {entities.map((entity) => (
        <EntityRow
          key={entity.id}
          title={entity.name}
          subtitle={`${entity.entity_type} · ${entity.domain} · ${entity.role}`}
          meta={entity.updated_at}
          tone={entity.status === "active" ? "ok" : entity.status === "draft" ? "warn" : "muted"}
          selected={selectedId === entity.id}
          onClick={() => onSelect(entity)}
        />
      ))}
    </EntityTable>
  );
}

export function LabGreeting({
  name = "Daniel",
  dateLabel,
}: {
  name?: string;
  dateLabel: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="text-3xl font-semibold tracking-tight text-neutral-100">
        Hello {name}
      </div>
      <div className="mt-1 text-sm text-neutral-400">Today is {dateLabel}</div>
    </div>
  );
}

export function MinilabMarkdown({ content }: { content: string }) {
  const blocks = parseMarkdown(content);
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4 space-y-3 text-[13px] text-neutral-300">
      {blocks.map((block, idx) => {
        if (block.kind === "h2") {
          return (
            <h2 key={idx} className="pt-1 text-lg font-semibold text-neutral-100">
              {block.text}
            </h2>
          );
        }
        if (block.kind === "h3") {
          return (
            <h3 key={idx} className="pt-1 text-[13px] font-medium uppercase tracking-wider text-neutral-400">
              {block.text}
            </h3>
          );
        }
        if (block.kind === "list") {
          return (
            <ul key={idx} className="space-y-1">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex gap-2 leading-relaxed">
                  <span className="mt-[0.55em] h-1 w-1 rounded-full bg-blue-300/70 shrink-0" />
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (block.kind === "table") {
          const [head, ...rows] = block.rows;
          return (
            <div key={idx} className="overflow-hidden rounded-lg border border-white/10">
              <table className="w-full text-left text-[11.5px]">
                <thead className="bg-white/[0.04] text-neutral-400">
                  <tr>
                    {head.map((cell, cellIdx) => (
                      <th key={cellIdx} className="px-2 py-1.5 font-medium">
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {rows.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-2 py-1.5 text-neutral-300">
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return (
          <p key={idx} className="leading-relaxed text-neutral-300">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

type ParsedBlock =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "table"; rows: string[][] };

function parseMarkdown(content: string): ParsedBlock[] {
  const lines = content.split("\n");
  const out: ParsedBlock[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i += 1;
      continue;
    }
    if (line.startsWith("## ")) {
      out.push({ kind: "h2", text: line.slice(3).trim() });
      i += 1;
      continue;
    }
    if (line.startsWith("### ")) {
      out.push({ kind: "h3", text: line.slice(4).trim() });
      i += 1;
      continue;
    }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2).trim());
        i += 1;
      }
      out.push({ kind: "list", items });
      continue;
    }
    if (line.startsWith("|") && line.endsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        const raw = lines[i].trim();
        if (!/^\|\s*-+/.test(raw)) {
          rows.push(raw.slice(1, -1).split("|").map((cell) => cell.trim()));
        }
        i += 1;
      }
      if (rows.length) out.push({ kind: "table", rows });
      continue;
    }
    out.push({ kind: "p", text: line });
    i += 1;
  }
  return out;
}

function renderInline(text: string) {
  const chunks = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {chunks.map((chunk, idx) =>
        chunk.startsWith("**") && chunk.endsWith("**") ? (
          <strong key={idx} className="font-medium text-neutral-100">
            {chunk.slice(2, -2)}
          </strong>
        ) : (
          <span key={idx}>{chunk}</span>
        )
      )}
    </>
  );
}

export function RealtimeLabReport({
  content,
}: {
  content: string;
}) {
  return <MinilabMarkdown content={content} />;
}

export function ReportActionButtons({
  actions,
}: {
  actions: { id: string; label: string; tone?: "primary" | "default" | "danger" }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          className={cn(
            "h-8 px-3 rounded-md text-[11.5px] font-medium ring-1 ring-inset transition-colors",
            action.tone === "primary" && "bg-blue-500/15 text-blue-200 ring-blue-500/40 hover:bg-blue-500/25",
            action.tone === "danger" && "bg-rose-500/10 text-rose-200 ring-rose-500/30 hover:bg-rose-500/15",
            (!action.tone || action.tone === "default") && "bg-white/[0.04] text-neutral-300 ring-white/10 hover:bg-white/[0.08]"
          )}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

export function SimplePanel({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <SectionCard>
      <div className="mb-3">
        <div className="text-[13px] font-medium text-neutral-100">{title}</div>
        {hint && <div className="mt-0.5 text-[10.5px] text-neutral-500">{hint}</div>}
      </div>
      {children}
    </SectionCard>
  );
}

export function KeyValueList({
  items,
}: {
  items: { label: string; value: ReactNode; tone?: StatusTone }[];
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between gap-3 text-[11.5px]">
          <span className="text-neutral-500">{item.label}</span>
          <span className="text-neutral-200 text-right">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ConnectivityPanel({ machine }: { machine: Machine }) {
  return (
    <SimplePanel title="Connectivity" hint="wifi, heartbeat e presença">
      <KeyValueList
        items={[
          { label: "status", value: machine.status },
          { label: "wifi", value: machine.wifi_status ?? "unknown" },
          { label: "last heartbeat", value: machine.last_heartbeat ?? "missing" },
          { label: "last boot", value: machine.last_boot ?? "unknown" },
        ]}
      />
    </SimplePanel>
  );
}

export function AccessHistory({ machine }: { machine: Machine }) {
  return (
    <SimplePanel title="Access" hint="quem acessou por último">
      <KeyValueList
        items={[
          { label: "last access", value: machine.last_access ?? "not observed" },
          { label: "security", value: machine.security ?? "normal" },
        ]}
      />
    </SimplePanel>
  );
}

export function JobActivityList({ machine }: { machine: Machine }) {
  const jobs = machine.jobs ?? [];
  return (
    <SimplePanel title="Jobs" hint="trabalho e eficiência">
      <div className="space-y-2">
        <KeyValueList
          items={[
            { label: "current", value: machine.current_job ?? "idle" },
            { label: "efficiency", value: machine.efficiency ?? "unknown" },
          ]}
        />
        {jobs.length > 0 && (
          <div className="pt-2 border-t border-white/[0.06] space-y-1">
            {jobs.slice(0, 3).map((job) => (
              <div key={job} className="text-[11.5px] text-neutral-300">
                {job}
              </div>
            ))}
          </div>
        )}
      </div>
    </SimplePanel>
  );
}

export function MaintenanceRows({ machine }: { machine: Machine }) {
  return (
    <SimplePanel title="Maintenance" hint="manutenção e pendências">
      <div className="text-[11.5px] text-neutral-300">
        {machine.maintenance ?? "sem manutenção pendente observada"}
      </div>
    </SimplePanel>
  );
}

export function SecurityEvents({ machine }: { machine: Machine }) {
  return (
    <SimplePanel title="Security" hint="acesso, risco e proteção">
      <div className="text-[11.5px] text-neutral-300">
        {machine.security ?? "sem evento crítico"}
      </div>
    </SimplePanel>
  );
}

export function RuntimeSummary({ machine }: { machine: Machine }) {
  const runtimes = machine.runtimes ?? [];
  return (
    <SimplePanel title="Runtimes" hint="software crítico observado">
      <div className="flex flex-wrap gap-1.5">
        {runtimes.length === 0 ? (
          <span className="text-[11.5px] text-neutral-500">nenhum runtime declarado</span>
        ) : (
          runtimes.map((runtime) => (
            <StatusPill key={runtime} tone="info">{runtime}</StatusPill>
          ))
        )}
      </div>
    </SimplePanel>
  );
}

export function MachineReceipts({ receipts }: { receipts: Receipt[] }) {
  return (
    <SimplePanel title="Receipts" hint="provas recentes vinculadas">
      <div className="space-y-1">
        {receipts.slice(0, 3).map((receipt) => (
          <div key={receipt.id} className="text-[11.5px] text-neutral-300">
            {receipt.scope}
          </div>
        ))}
      </div>
    </SimplePanel>
  );
}

export function SensorIntelligencePanel({
  conclusions,
}: {
  conclusions: string[];
}) {
  return (
    <SectionCard className="border-blue-500/20 bg-blue-500/[0.04]">
      <div className="text-[13px] text-blue-100">What the sensors are saying</div>
      <ul className="mt-2 space-y-1.5">
        {conclusions.map((c) => (
          <li key={c} className="flex gap-2 text-[12px] text-blue-100/85 leading-relaxed">
            <span className="mt-[0.55em] h-1 w-1 rounded-full bg-blue-300 shrink-0" />
            <span>{c}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

function sensorTone(status: Sensor["status"]): StatusTone {
  if (status === "alive" || status === "ok") return "ok";
  if (status === "degraded" || status === "silent") return "warn";
  if (status === "alert" || status === "ghost") return "bad";
  if (status === "unregistered") return "info";
  return "muted";
}

function sensorHumanStatus(status: Sensor["status"]) {
  const map: Record<string, string> = {
    alive: "Vivo",
    ok: "Vivo",
    silent: "Silencioso",
    degraded: "Com tropeço",
    unknown: "Desconhecido",
    unregistered: "Não cadastrado",
    ghost: "Faltou prova",
    alert: "Alerta",
  };
  return map[status] ?? status;
}

export function SensorAliveGrid({ sensors }: { sensors: Sensor[] }) {
  const alive = sensors.filter((s) => s.status === "alive" || s.status === "ok").length;
  const silent = sensors.filter((s) => s.status === "silent" || s.status === "degraded").length;
  const unregistered = sensors.filter((s) => s.status === "unregistered").length;
  const ghosts = sensors.filter((s) => s.status === "ghost").length;
  return (
    <div className="grid grid-cols-4 gap-3">
      <MetricCard label="Vivos" value={alive} tone="good" />
      <MetricCard label="Silenciosos / tropeço" value={silent} tone="warn" />
      <MetricCard label="Não cadastrados" value={unregistered} />
      <MetricCard label="Ghosts" value={ghosts} tone="warn" />
    </div>
  );
}

export function SensorDataTable({
  sensors,
  selectedId,
  onSelect,
}: {
  sensors: Sensor[];
  selectedId?: string;
  onSelect: (sensor: Sensor) => void;
}) {
  return (
    <EntityTable>
      {sensors.map((sensor) => (
        <EntityRow
          key={sensor.id}
          title={sensor.name}
          subtitle={`${sensor.kind} · ${sensorHumanStatus(sensor.status)}`}
          meta={sensor.last_reading?.value ?? sensor.sync_status ?? "sem leitura"}
          tone={sensorTone(sensor.status)}
          selected={selectedId === sensor.id}
          onClick={() => onSelect(sensor)}
        />
      ))}
    </EntityTable>
  );
}

export function SensorImportPanel({ failedRows = 0 }: { failedRows?: number }) {
  return (
    <SimplePanel title="Import" hint="entrada de leituras e sinais brutos">
      <KeyValueList
        items={[
          { label: "modo", value: "manual / backend import" },
          { label: "failed rows", value: failedRows },
        ]}
      />
    </SimplePanel>
  );
}

export function SensorSyncStatus({ lastSync }: { lastSync: string }) {
  return (
    <SimplePanel title="Sync" hint="sincronização de leituras">
      <KeyValueList
        items={[
          { label: "last sync", value: lastSync },
          { label: "status", value: "ok" },
        ]}
      />
    </SimplePanel>
  );
}

export function SupabaseSyncPanel({ lastSync }: { lastSync: string }) {
  return (
    <SimplePanel title="Supabase" hint="persistência e leitura online">
      <KeyValueList
        items={[
          { label: "target", value: "Supabase" },
          { label: "last sync", value: lastSync },
        ]}
      />
    </SimplePanel>
  );
}

export function SensorConclusionPanel({
  conclusions,
}: {
  conclusions: string[];
}) {
  return (
    <SimplePanel title="Conclusions" hint="candidatos derivados dos sensores">
      <div className="space-y-1.5">
        {conclusions.map((conclusion) => (
          <div key={conclusion} className="text-[11.5px] text-neutral-300">
            {conclusion}
          </div>
        ))}
      </div>
    </SimplePanel>
  );
}

export function SensorToRegistryAction({ count }: { count: number }) {
  return (
    <SimplePanel title="Registry candidates" hint="sinais que ainda não viraram entidade">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11.5px] text-neutral-300">{count} sensor(es) ou sinais não cadastrados</div>
        <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-blue-500/15 ring-1 ring-inset ring-blue-500/40 text-blue-200">
          Add to Registry
        </button>
      </div>
    </SimplePanel>
  );
}

export function GhostTriageSummary({ ghosts }: { ghosts: Ghost[] }) {
  const open = ghosts.filter((g) => g.status === "open");
  const missingEvidence = open.filter((g) => /evidence|attachment|proof/i.test(g.reason)).length;
  const missingAuthority = open.filter((g) => /authority|human|confirm/i.test(g.reason)).length;
  return (
    <div className="grid grid-cols-4 gap-3">
      <MetricCard label="Ghosts abertos" value={open.length} tone="warn" />
      <MetricCard label="Faltam prova" value={missingEvidence} />
      <MetricCard label="Faltam autoridade" value={missingAuthority} />
      <MetricCard label="Resolvíveis agora" value={Math.max(1, open.length - 1)} tone="good" />
    </div>
  );
}

export function GhostReasonTabs({
  reasons,
  selected,
  onToggle,
}: {
  reasons: string[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return <FilterChips chips={reasons.map((r) => ({ id: r, label: r }))} selected={selected} onToggle={onToggle} />;
}

export function MissingEvidenceMatrix({ ghosts }: { ghosts: Ghost[] }) {
  const rows = ghosts.slice(0, 4);
  return (
    <SimplePanel title="Missing evidence matrix" hint="o que falta para fechar">
      <div className="space-y-2">
        {rows.map((ghost) => (
          <div key={ghost.id} className="flex items-start justify-between gap-3 text-[11.5px]">
            <span className="text-neutral-300 line-clamp-1">{ghost.summary}</span>
            <span className="text-amber-200/80 font-mono shrink-0">{ghost.missing.join(", ")}</span>
          </div>
        ))}
      </div>
    </SimplePanel>
  );
}

export function ResolvableGhosts({ ghosts }: { ghosts: Ghost[] }) {
  return (
    <SimplePanel title="Resolvable now" hint="candidatos a virar receipt">
      <div className="space-y-1">
        {ghosts.slice(0, 3).map((ghost) => (
          <div key={ghost.id} className="text-[11.5px] text-neutral-300">
            {ghost.summary}
          </div>
        ))}
      </div>
    </SimplePanel>
  );
}

export function GhostDomainBreakdown({ ghosts }: { ghosts: Ghost[] }) {
  const domains = ["Santo Andre", "Machines", "Human", "Sensors"];
  return (
    <SimplePanel title="By domain" hint="onde a incompletude está aparecendo">
      <div className="grid grid-cols-2 gap-2">
        {domains.map((domain, idx) => (
          <div key={domain} className="rounded-md border border-white/[0.06] bg-black/10 px-2 py-1.5">
            <div className="text-[10.5px] text-neutral-500">{domain}</div>
            <div className="text-[13px] text-neutral-100">{idx === 0 ? ghosts.length - 1 : idx}</div>
          </div>
        ))}
      </div>
    </SimplePanel>
  );
}

export function ReceiptLedgerSummary({ receipts }: { receipts: Receipt[] }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      <MetricCard label="Receipts" value={receipts.length} tone="good" />
      <MetricCard label="Hoje" value={receipts.filter((r) => r.closed_at.includes("2026-05-19")).length} />
      <MetricCard label="Com digest" value={receipts.filter((r) => r.digest).length} />
      <MetricCard label="Inconclusivos" value={receipts.filter((r) => r.status !== "closed").length} />
    </div>
  );
}

export function ReceiptTimeline({ receipts }: { receipts: Receipt[] }) {
  const events: TimelineEvent[] = receipts.map((receipt) => ({
    id: receipt.id,
    when: receipt.closed_at.slice(11, 16) || receipt.closed_at,
    title: receipt.scope,
    detail: receipt.evidence_summary,
    tone: "ok",
  }));
  return <Timeline events={events} />;
}

export function ReceiptFilters({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Filtrar receipts por escopo, entidade ou evidência…"
      className="h-8 w-[280px] rounded-md bg-white/[0.04] border border-white/10 px-2.5 text-[11.5px] text-neutral-100 placeholder:text-neutral-600 outline-none focus:border-blue-500/40"
    />
  );
}

/* ─── LAB secondary panels ─────────────────────────────────────────────── */

export interface UrgencyItem {
  id: string;
  label: string;
  hint?: string;
  tone?: StatusTone;
  onClick?: () => void;
}

export function UrgencyList({ items }: { items: UrgencyItem[] }) {
  return (
    <SimplePanel title="This cannot wait" hint="ações urgentes geradas do report">
      {items.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">Nada urgente agora.</div>
      ) : (
        <ul className="space-y-1.5">
          {items.map((it) => (
            <li key={it.id} className="flex items-start gap-2 text-[11.5px]">
              <StatusDot tone={it.tone ?? "warn"} />
              <button
                type="button"
                onClick={it.onClick}
                className="text-left text-neutral-200 hover:text-neutral-100 transition-colors min-w-0"
              >
                <span>{it.label}</span>
                {it.hint && (
                  <span className="text-neutral-500"> · {it.hint}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function ProblemsList({ items }: { items: UrgencyItem[] }) {
  return (
    <SimplePanel title="Problems" hint="o que está degradado, silencioso ou inconsistente">
      {items.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">sem problemas observados.</div>
      ) : (
        <ul className="space-y-1.5">
          {items.map((it) => (
            <li key={it.id} className="flex items-start gap-2 text-[11.5px]">
              <StatusDot tone={it.tone ?? "warn"} />
              <button
                type="button"
                onClick={it.onClick}
                className="text-left text-neutral-200 hover:text-neutral-100 transition-colors min-w-0"
              >
                <span>{it.label}</span>
                {it.hint && (
                  <span className="text-neutral-500"> · {it.hint}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function AccomplishmentsFeed({ receipts }: { receipts: Receipt[] }) {
  return (
    <SimplePanel title="Accomplishments" hint="o que fechou hoje em bytes online">
      <ul className="space-y-1.5">
        {receipts.slice(0, 4).map((r) => (
          <li key={r.id} className="flex items-start gap-2 text-[11.5px]">
            <StatusDot tone="ok" />
            <div className="min-w-0">
              <div className="text-neutral-200">{r.scope}</div>
              <div className="text-neutral-500 line-clamp-1">
                {r.evidence_summary}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </SimplePanel>
  );
}

export function TodayAppointments({
  appointments = [],
}: {
  appointments?: { id: string; when: string; title: string; tone?: StatusTone }[];
}) {
  return (
    <SimplePanel title="Today" hint="compromissos e check-ins de hoje">
      {appointments.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">
          Nenhum compromisso registrado para hoje.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {appointments.map((a) => (
            <li key={a.id} className="flex items-center gap-2 text-[11.5px]">
              <span className="font-mono text-[10.5px] text-neutral-500 w-12">
                {a.when}
              </span>
              <StatusDot tone={a.tone ?? "muted"} />
              <span className="text-neutral-200 truncate">{a.title}</span>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function RecentReceipts({
  receipts,
  onSelect,
}: {
  receipts: Receipt[];
  onSelect?: (receipt: Receipt) => void;
}) {
  return (
    <SimplePanel title="Recent receipts" hint="provas mais recentes">
      <div className="space-y-1.5">
        {receipts.slice(0, 4).map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => onSelect?.(r)}
            className="w-full text-left flex items-start gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
          >
            <StatusDot tone="ok" />
            <div className="min-w-0 flex-1">
              <div className="text-neutral-200 truncate">{r.scope}</div>
              <div className="text-neutral-500 font-mono text-[10.5px]">
                {r.closed_at}
              </div>
            </div>
          </button>
        ))}
      </div>
    </SimplePanel>
  );
}

export function GhostSummary({
  ghosts,
  onSelect,
}: {
  ghosts: Ghost[];
  onSelect?: (ghost: Ghost) => void;
}) {
  const open = ghosts.filter((g) => g.status === "open");
  return (
    <SimplePanel title="Ghosts" hint="incompletudes que ainda importam">
      <div className="space-y-1.5">
        <div className="text-[11.5px] text-neutral-500">
          {open.length} ghost(s) abertos
        </div>
        {open.slice(0, 3).map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => onSelect?.(g)}
            className="w-full text-left flex items-start gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
          >
            <StatusDot tone="ghost" />
            <span className="text-neutral-200 line-clamp-1 min-w-0">
              {g.summary}
            </span>
          </button>
        ))}
      </div>
    </SimplePanel>
  );
}

/* ─── Machines ─────────────────────────────────────────────────────────── */

function machineTone(status: Machine["status"]): StatusTone {
  if (status === "online") return "ok";
  if (status === "degraded") return "warn";
  return "bad";
}

export function HeartbeatStatus({ machine }: { machine: Machine }) {
  const tone = machineTone(machine.status);
  return (
    <div className="flex items-center gap-2">
      <StatusDot tone={tone} pulse={machine.status === "online"} />
      <div className="text-[10.5px] text-neutral-500 font-mono">
        {machine.last_heartbeat ?? "sem heartbeat"}
      </div>
    </div>
  );
}

export function MachineCard({
  machine,
  selected,
  onClick,
}: {
  machine: Machine;
  selected?: boolean;
  onClick?: () => void;
}) {
  const tone = machineTone(machine.status);
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg border bg-white/[0.03] p-3 space-y-2 transition-colors",
        selected
          ? "border-blue-500/60 bg-white/[0.05]"
          : "border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[13px] text-neutral-100">{machine.label}</div>
          <div className="text-[10.5px] text-neutral-500 truncate">
            role · {machine.role}
          </div>
        </div>
        <StatusPill tone={tone}>{machine.status}</StatusPill>
      </div>
      <HeartbeatStatus machine={machine} />
      <div className="pt-1 border-t border-white/[0.06] grid grid-cols-2 gap-x-3 gap-y-1 text-[10.5px]">
        <div>
          <span className="text-neutral-500">job · </span>
          <span className="text-neutral-300">{machine.current_job ?? "idle"}</span>
        </div>
        <div>
          <span className="text-neutral-500">wifi · </span>
          <span className="text-neutral-300">
            {machine.wifi_status ?? "unknown"}
          </span>
        </div>
        <div>
          <span className="text-neutral-500">boot · </span>
          <span className="text-neutral-300 font-mono">
            {machine.last_boot ?? "—"}
          </span>
        </div>
        <div>
          <span className="text-neutral-500">eff · </span>
          <span className="text-neutral-300">
            {machine.efficiency ?? "—"}
          </span>
        </div>
      </div>
    </button>
  );
}

export function MachineCards({
  machines,
  selectedId,
  onSelect,
}: {
  machines: Machine[];
  selectedId?: string;
  onSelect: (machine: Machine) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {machines.map((m) => (
        <MachineCard
          key={m.id}
          machine={m}
          selected={selectedId === m.id}
          onClick={() => onSelect(m)}
        />
      ))}
    </div>
  );
}

export function ProtectedActions({
  actions = [
    { id: "restart", label: "Restart machine" },
    { id: "update-runtime", label: "Update runtime" },
    { id: "apply-policy", label: "Apply policy" },
  ],
}: {
  actions?: { id: string; label: string }[];
}) {
  return (
    <SimplePanel
      title="Protected actions"
      hint="executam apenas após gate. Esta UI observa; não executa."
    >
      <div className="flex flex-wrap gap-2">
        {actions.map((a) => (
          <button
            key={a.id}
            type="button"
            className="h-7 px-2.5 rounded-md text-[10.5px] bg-white/[0.04] ring-1 ring-inset ring-white/10 text-neutral-300 hover:bg-white/[0.08] transition-colors whitespace-nowrap"
          >
            {a.label}
          </button>
        ))}
      </div>
    </SimplePanel>
  );
}

/* ─── Sensors extras ───────────────────────────────────────────────────── */

export function SensorList({
  sensors,
  selectedId,
  onSelect,
}: {
  sensors: Sensor[];
  selectedId?: string;
  onSelect: (sensor: Sensor) => void;
}) {
  return (
    <EntityTable>
      {sensors.map((s) => (
        <EntityRow
          key={s.id}
          title={s.name}
          subtitle={`${s.kind} · ${sensorHumanStatus(s.status)}`}
          meta={s.last_reading?.value ?? s.sync_status ?? "—"}
          tone={sensorTone(s.status)}
          selected={selectedId === s.id}
          onClick={() => onSelect(s)}
        />
      ))}
    </EntityTable>
  );
}

export function SensorReadingCards({ sensors }: { sensors: Sensor[] }) {
  const withReading = sensors.filter((s) => s.last_reading);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {withReading.map((s) => (
        <div
          key={s.id}
          className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
        >
          <div className="flex items-center justify-between">
            <div className="text-[10.5px] uppercase tracking-wider text-neutral-500 truncate">
              {s.kind}
            </div>
            <StatusDot tone={sensorTone(s.status)} />
          </div>
          <div className="mt-1 text-lg font-medium tabular-nums text-neutral-100">
            {s.last_reading?.value}
          </div>
          <div className="text-[10.5px] text-neutral-500 font-mono truncate">
            {s.last_reading?.observed_at}
          </div>
          <div className="text-[10.5px] text-neutral-400 truncate">
            {s.name}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AlertRules({
  rules = [
    { id: "presence-quiet", label: "Sala sem movimento > 4h", tone: "warn" as StatusTone },
    { id: "temp-high", label: "Temperatura > 28 °C", tone: "bad" as StatusTone },
    { id: "humid-low", label: "Umidade < 30 %", tone: "warn" as StatusTone },
  ],
}: {
  rules?: { id: string; label: string; tone?: StatusTone }[];
}) {
  return (
    <SimplePanel title="Alert rules" hint="regras observadas, gate aplica a ação">
      <ul className="space-y-1.5">
        {rules.map((r) => (
          <li key={r.id} className="flex items-center gap-2 text-[11.5px]">
            <StatusDot tone={r.tone ?? "muted"} />
            <span className="text-neutral-200">{r.label}</span>
          </li>
        ))}
      </ul>
    </SimplePanel>
  );
}

/* ─── Ghosts extras ────────────────────────────────────────────────────── */

export function GhostList({
  ghosts,
  selectedId,
  onSelect,
}: {
  ghosts: Ghost[];
  selectedId?: string;
  onSelect: (ghost: Ghost) => void;
}) {
  return (
    <EntityTable>
      {ghosts.map((g) => (
        <EntityRow
          key={g.id}
          title={g.summary}
          subtitle={`reason · ${g.reason}`}
          meta={g.created_at}
          tone="ghost"
          selected={selectedId === g.id}
          onClick={() => onSelect(g)}
        />
      ))}
    </EntityTable>
  );
}

function ghostAgeBucket(createdAt: string, nowIso: string): string {
  // Compares date prefix; works with ISO-ish or "YYYY-MM-DD HH:mm".
  const created = createdAt.slice(0, 10);
  const now = nowIso.slice(0, 10);
  if (created === now) return "Hoje";
  const dCreated = new Date(created);
  const dNow = new Date(now);
  const diff = Math.round((dNow.getTime() - dCreated.getTime()) / 86400000);
  if (diff <= 7) return "Esta semana";
  if (diff <= 30) return "Este mês";
  return "Mais antigos";
}

export function GhostAgeBuckets({
  ghosts,
  now,
}: {
  ghosts: Ghost[];
  now: string;
}) {
  const buckets: Record<string, number> = {
    Hoje: 0,
    "Esta semana": 0,
    "Este mês": 0,
    "Mais antigos": 0,
  };
  for (const g of ghosts) {
    const b = ghostAgeBucket(g.created_at, now);
    buckets[b] = (buckets[b] ?? 0) + 1;
  }
  return (
    <SimplePanel title="By age" hint="quanto tempo o ghost está aberto">
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(buckets).map(([label, count]) => (
          <div
            key={label}
            className="rounded-md border border-white/[0.06] bg-black/10 px-2 py-1.5"
          >
            <div className="text-[10.5px] text-neutral-500">{label}</div>
            <div className="text-[13px] text-neutral-100">{count}</div>
          </div>
        ))}
      </div>
    </SimplePanel>
  );
}

/* ─── Receipts extras ──────────────────────────────────────────────────── */

export function ReceiptList({
  receipts,
  selectedId,
  onSelect,
}: {
  receipts: Receipt[];
  selectedId?: string;
  onSelect: (receipt: Receipt) => void;
}) {
  return (
    <EntityTable>
      {receipts.map((r) => (
        <EntityRow
          key={r.id}
          title={r.scope}
          subtitle={r.evidence_summary}
          meta={r.closed_at}
          tone="ok"
          selected={selectedId === r.id}
          onClick={() => onSelect(r)}
        />
      ))}
    </EntityTable>
  );
}

export function ReceiptDigest({ receipt }: { receipt: Receipt }) {
  if (!receipt.digest) {
    return (
      <span className="font-mono text-[10.5px] text-neutral-500">sem digest</span>
    );
  }
  return (
    <span className="font-mono text-[10.5px] text-emerald-200/90">
      {receipt.digest}
    </span>
  );
}

function GroupedReceipts({
  title,
  hint,
  groups,
  onSelect,
}: {
  title: string;
  hint: string;
  groups: { id: string; label: string; receipts: Receipt[] }[];
  onSelect: (receipt: Receipt) => void;
}) {
  if (groups.length === 0) {
    return (
      <SimplePanel title={title} hint={hint}>
        <div className="text-[11.5px] text-neutral-500">
          nenhum receipt vinculado.
        </div>
      </SimplePanel>
    );
  }
  return (
    <SimplePanel title={title} hint={hint}>
      <div className="space-y-2">
        {groups.map((g) => (
          <div key={g.id}>
            <div className="text-[10.5px] uppercase tracking-wider text-neutral-500 mb-1">
              {g.label}{" "}
              <span className="text-neutral-600">· {g.receipts.length}</span>
            </div>
            <div className="space-y-1">
              {g.receipts.slice(0, 3).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onSelect(r)}
                  className="w-full text-left text-[11.5px] text-neutral-300 hover:text-neutral-100 transition-colors truncate"
                >
                  · {r.scope}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SimplePanel>
  );
}

function groupReceiptsBy(
  receipts: Receipt[],
  derive: (r: Receipt) => { id: string; label: string } | null
): { id: string; label: string; receipts: Receipt[] }[] {
  const map = new Map<string, { id: string; label: string; receipts: Receipt[] }>();
  for (const r of receipts) {
    const k = derive(r);
    if (!k) continue;
    const bucket = map.get(k.id);
    if (bucket) bucket.receipts.push(r);
    else map.set(k.id, { id: k.id, label: k.label, receipts: [r] });
  }
  return [...map.values()];
}

export function ReceiptByEntity({
  receipts,
  entities,
  onSelect,
}: {
  receipts: Receipt[];
  entities: RegistryEntity[];
  onSelect: (receipt: Receipt) => void;
}) {
  const byEntity: { id: string; label: string }[] = entities.map((e) => ({
    id: e.name,
    label: e.name,
  }));
  const groups = groupReceiptsBy(receipts, (r) => {
    const hit = byEntity.find((e) =>
      r.scope.toLowerCase().includes(e.label.toLowerCase()) ||
      r.evidence_summary.toLowerCase().includes(e.label.toLowerCase())
    );
    return hit ?? null;
  });
  return (
    <GroupedReceipts
      title="By entity"
      hint="receipts associados a entidades do Registry"
      groups={groups}
      onSelect={onSelect}
    />
  );
}

export function ReceiptByMachine({
  receipts,
  machines,
  onSelect,
}: {
  receipts: Receipt[];
  machines: Machine[];
  onSelect: (receipt: Receipt) => void;
}) {
  const groups = groupReceiptsBy(receipts, (r) => {
    const hit = machines.find((m) =>
      r.scope.toLowerCase().includes(m.label.toLowerCase()) ||
      r.evidence_summary.toLowerCase().includes(m.label.toLowerCase())
    );
    return hit ? { id: hit.id, label: hit.label } : null;
  });
  return (
    <GroupedReceipts
      title="By machine"
      hint="receipts vinculados às máquinas"
      groups={groups}
      onSelect={onSelect}
    />
  );
}

export function ReceiptByWorkorder({
  receipts,
  onSelect,
}: {
  receipts: Receipt[];
  onSelect: (receipt: Receipt) => void;
}) {
  const groups = groupReceiptsBy(receipts, (r) => {
    if (r.scope.startsWith("workorder")) {
      return { id: r.id, label: r.scope.replace(/^workorder\s*·\s*/i, "") };
    }
    return null;
  });
  return (
    <GroupedReceipts
      title="By workorder"
      hint="receipts gerados via workorder"
      groups={groups}
      onSelect={onSelect}
    />
  );
}

/* ─── Wave 3 · Today ──────────────────────────────────────────────────── */

function appointmentTone(state: Appointment["state"]): StatusTone {
  if (state === "done") return "ok";
  if (state === "now") return "info";
  if (state === "missed") return "warn";
  return "muted";
}

export function DayTimeline({
  appointments,
  onSelect,
}: {
  appointments: Appointment[];
  onSelect?: (a: Appointment) => void;
}) {
  const events: TimelineEvent[] = appointments.map((a) => ({
    id: a.id,
    when: a.when,
    title: a.title,
    detail: a.domain,
    tone: appointmentTone(a.state),
    onClick: onSelect ? () => onSelect(a) : undefined,
  }));
  return <Timeline events={events} />;
}

export function AppointmentList({
  appointments,
  state,
  onSelect,
  emptyHint,
}: {
  appointments: Appointment[];
  state?: Appointment["state"];
  onSelect: (a: Appointment) => void;
  emptyHint?: string;
}) {
  const list = state ? appointments.filter((a) => a.state === state) : appointments;
  if (list.length === 0) {
    return (
      <div className="text-[11.5px] text-neutral-500 py-1">
        {emptyHint ?? "nada aqui."}
      </div>
    );
  }
  return (
    <ul className="space-y-1.5">
      {list.map((a) => (
        <li key={a.id}>
          <button
            type="button"
            onClick={() => onSelect(a)}
            className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
          >
            <span className="font-mono text-[10.5px] text-neutral-500 w-12 shrink-0">
              {a.when}
            </span>
            <StatusDot tone={appointmentTone(a.state)} pulse={a.state === "now"} />
            <span className="text-neutral-200 truncate">{a.title}</span>
            {a.domain && (
              <span className="text-neutral-600 text-[10.5px]">· {a.domain}</span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}

export interface PlannedVsActualRow {
  id: string;
  label: string;
  planned: string;
  actual: string;
  status: "done" | "missed" | "in_progress" | "ghost";
  onClick?: () => void;
}

const PLANNED_STATUS_TONE: Record<PlannedVsActualRow["status"], StatusTone> = {
  done: "ok",
  in_progress: "info",
  missed: "warn",
  ghost: "ghost",
};

export function PlannedVsActual({ rows }: { rows: PlannedVsActualRow[] }) {
  return (
    <SimplePanel title="Planned vs actual" hint="o que foi planejado e o que aconteceu">
      <div className="space-y-1.5">
        {rows.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={r.onClick}
            className="w-full text-left rounded-md hover:bg-white/[0.03] -mx-1 px-1 py-1 transition-colors"
          >
            <div className="flex items-center gap-2 text-[11.5px]">
              <StatusDot tone={PLANNED_STATUS_TONE[r.status]} />
              <span className="text-neutral-200 truncate">{r.label}</span>
            </div>
            <div className="ml-4 grid grid-cols-2 gap-x-3 text-[10.5px]">
              <div>
                <span className="text-neutral-500">planned · </span>
                <span className="text-neutral-300">{r.planned}</span>
              </div>
              <div>
                <span className="text-neutral-500">actual · </span>
                <span className="text-neutral-300">{r.actual}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </SimplePanel>
  );
}

export interface AttentionItem {
  id: string;
  label: string;
  hint?: string;
  tone?: StatusTone;
  onClick?: () => void;
}

export function MissedItems({ items }: { items: AttentionItem[] }) {
  return (
    <SimplePanel title="Missed" hint="o que não aconteceu hoje">
      {items.length === 0 ? (
        <div className="text-[11.5px] text-emerald-300/90">nada perdido hoje.</div>
      ) : (
        <ul className="space-y-1.5">
          {items.map((it) => (
            <li key={it.id} className="flex items-start gap-2 text-[11.5px]">
              <StatusDot tone={it.tone ?? "warn"} />
              <button
                type="button"
                onClick={it.onClick}
                className="text-left text-neutral-200 hover:text-neutral-100 transition-colors min-w-0"
              >
                <span>{it.label}</span>
                {it.hint && <span className="text-neutral-500"> · {it.hint}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function AttentionQueue({ items }: { items: AttentionItem[] }) {
  return (
    <SimplePanel title="Needs Daniel" hint="fila de atenção humana">
      {items.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">fila vazia.</div>
      ) : (
        <ul className="space-y-1.5">
          {items.map((it) => (
            <li key={it.id} className="flex items-start gap-2 text-[11.5px]">
              <StatusDot tone={it.tone ?? "warn"} />
              <button
                type="button"
                onClick={it.onClick}
                className="text-left text-neutral-200 hover:text-neutral-100 transition-colors min-w-0"
              >
                <span>{it.label}</span>
                {it.hint && <span className="text-neutral-500"> · {it.hint}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function ScheduleQuality({
  schedules,
}: {
  schedules: Schedule[];
}) {
  const known = schedules.filter((s) => typeof s.quality === "number");
  const avg =
    known.length > 0
      ? known.reduce((s, x) => s + (x.quality ?? 0), 0) / known.length
      : 0;
  const pct = Math.round(avg * 100);
  const tone: "good" | "warn" | "default" = pct >= 80 ? "good" : pct >= 50 ? "default" : "warn";
  const missed = schedules.filter((s) => s.status === "missed").length;
  return (
    <SimplePanel title="Schedule quality" hint="média ponderada de cumprimento">
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Score" value={`${pct}%`} tone={tone} />
        <MetricCard label="Missed" value={missed} tone={missed > 0 ? "warn" : "good"} />
      </div>
    </SimplePanel>
  );
}

/* ─── Wave 3 · Lab Routine ────────────────────────────────────────────── */

const ROUTINE_TONE: Record<RoutineEntry["status"], StatusTone> = {
  done: "ok",
  in_progress: "info",
  missed: "warn",
  ghost: "ghost",
};

function routineLabel(status: RoutineEntry["status"]): string {
  if (status === "done") return "fechado";
  if (status === "in_progress") return "em andamento";
  if (status === "missed") return "perdido";
  return "ghost";
}

export function RoutineChecklist({
  entries,
  onSelect,
}: {
  entries: RoutineEntry[];
  onSelect: (entry: RoutineEntry) => void;
}) {
  const groups = new Map<string, RoutineEntry[]>();
  for (const e of entries) {
    const arr = groups.get(e.group) ?? [];
    arr.push(e);
    groups.set(e.group, arr);
  }
  return (
    <div className="space-y-3">
      {[...groups.entries()].map(([group, items]) => (
        <SimplePanel key={group} title={group}>
          <ul className="space-y-1.5">
            {items.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => onSelect(e)}
                  className="w-full text-left rounded-md hover:bg-white/[0.03] -mx-1 px-1 py-1 transition-colors"
                >
                  <div className="flex items-center gap-2 text-[11.5px]">
                    <StatusDot tone={ROUTINE_TONE[e.status]} />
                    <span className="text-neutral-100 truncate">{e.title}</span>
                    <StatusPill tone={ROUTINE_TONE[e.status]}>
                      {routineLabel(e.status)}
                    </StatusPill>
                  </div>
                  <div className="ml-4 grid grid-cols-2 gap-x-3 text-[10.5px]">
                    <div>
                      <span className="text-neutral-500">expected · </span>
                      <span className="text-neutral-300">{e.expected}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">observed · </span>
                      <span className="text-neutral-300">{e.observed ?? "—"}</span>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </SimplePanel>
      ))}
    </div>
  );
}

export function QualityScoreCard({
  entries,
}: {
  entries: RoutineEntry[];
}) {
  const total = entries.length;
  const done = entries.filter((e) => e.status === "done").length;
  const missed = entries.filter((e) => e.status === "missed").length;
  const ghost = entries.filter((e) => e.status === "ghost").length;
  const inProgress = entries.filter((e) => e.status === "in_progress").length;
  const score = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <SimplePanel title="Daily quality" hint="qualidade observada das rotinas do dia">
      <div className="grid grid-cols-4 gap-3">
        <MetricCard label="Score" value={`${score}%`} tone={score >= 70 ? "good" : "warn"} />
        <MetricCard label="Done" value={done} tone="good" />
        <MetricCard
          label="Missed / ghost"
          value={missed + ghost}
          tone={missed + ghost > 0 ? "warn" : "good"}
        />
        <MetricCard label="In progress" value={inProgress} />
      </div>
    </SimplePanel>
  );
}

const AGENT_TONE: Record<Agent["status"], StatusTone> = {
  present: "ok",
  absent: "bad",
  degraded: "warn",
  paused: "muted",
  scheduled: "info",
  ghost: "ghost",
};

export function AgentAttendance({
  agents,
  onSelect,
}: {
  agents: Agent[];
  onSelect: (agent: Agent) => void;
}) {
  return (
    <SimplePanel title="Agents" hint="presença e papel observados">
      <ul className="space-y-1.5">
        {agents.map((a) => (
          <li key={a.id}>
            <button
              type="button"
              onClick={() => onSelect(a)}
              className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
            >
              <StatusDot tone={AGENT_TONE[a.status]} />
              <span className="text-neutral-100 truncate">{a.name}</span>
              <span className="text-neutral-500 text-[10.5px]">· {a.role}</span>
              <span className="ml-auto text-neutral-500 font-mono text-[10.5px]">
                {a.last_check_in ?? "—"}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </SimplePanel>
  );
}

const CHECKIN_TONE: Record<HumanCheckIn["status"], StatusTone> = {
  confirmed: "ok",
  missing: "warn",
  ghost: "ghost",
};

export function HumanAttendance({
  checkins,
}: {
  checkins: HumanCheckIn[];
}) {
  return (
    <SimplePanel title="Human" hint="check-ins humanos observados">
      <ul className="space-y-1.5">
        {checkins.map((c) => (
          <li key={c.id} className="flex items-center gap-2 text-[11.5px]">
            <StatusDot tone={CHECKIN_TONE[c.status]} />
            <span className="text-neutral-100">{c.who}</span>
            <span className="ml-auto text-neutral-500 font-mono text-[10.5px]">
              {c.when ?? "—"}
            </span>
            <StatusPill tone={CHECKIN_TONE[c.status]}>{c.status}</StatusPill>
          </li>
        ))}
      </ul>
    </SimplePanel>
  );
}

export function WorkflowRunList({
  schedules,
  onSelect,
}: {
  schedules: Schedule[];
  onSelect: (s: Schedule) => void;
}) {
  const runs = schedules.filter(
    (s) => s.status === "completed" || s.status === "recurring"
  );
  return (
    <SimplePanel title="Workflow runs" hint="rodadas observadas e recorrentes">
      {runs.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">sem rodadas observadas.</div>
      ) : (
        <ul className="space-y-1.5">
          {runs.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(s)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <StatusDot tone="ok" />
                <span className="text-neutral-100 truncate">{s.title}</span>
                <span className="text-neutral-500 text-[10.5px]">· {s.cadence}</span>
                <span className="ml-auto text-neutral-500 font-mono text-[10.5px]">
                  {s.last_run ?? "—"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function MissedRoutineList({
  entries,
  onSelect,
}: {
  entries: RoutineEntry[];
  onSelect: (e: RoutineEntry) => void;
}) {
  const missed = entries.filter((e) => e.status === "missed" || e.status === "ghost");
  return (
    <SimplePanel title="Missed routines" hint="rotinas que não fecharam">
      {missed.length === 0 ? (
        <div className="text-[11.5px] text-emerald-300/90">
          todas as rotinas observadas fecharam.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {missed.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => onSelect(e)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <StatusDot tone={ROUTINE_TONE[e.status]} />
                <span className="text-neutral-100 truncate">{e.title}</span>
                <span className="text-neutral-500 text-[10.5px]">· {e.group}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

/* ─── Wave 3 · Workorders ─────────────────────────────────────────────── */

export const WORKORDER_STATES: WorkorderState[] = [
  "draft",
  "candidate",
  "waiting_approval",
  "running",
  "blocked",
  "closed",
  "ghosted",
];

const WORKORDER_STATE_LABEL: Record<WorkorderState, string> = {
  draft: "Draft",
  candidate: "Candidate",
  waiting_approval: "Waiting approval",
  running: "Running",
  blocked: "Blocked",
  closed: "Closed",
  ghosted: "Ghosted",
};

const WORKORDER_STATE_TONE: Record<WorkorderState, StatusTone> = {
  draft: "muted",
  candidate: "info",
  waiting_approval: "warn",
  running: "info",
  blocked: "bad",
  closed: "ok",
  ghosted: "ghost",
};

export function StatusPills({
  counts,
  active,
  onSelect,
}: {
  counts: Record<WorkorderState, number>;
  active?: WorkorderState | null;
  onSelect: (state: WorkorderState | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          "h-7 px-2.5 rounded-full text-[10.5px] border transition-colors whitespace-nowrap",
          active === null || active === undefined
            ? "border-blue-500/60 bg-blue-500/10 text-blue-200"
            : "border-white/10 bg-white/[0.02] text-neutral-400 hover:text-neutral-100"
        )}
      >
        All ·{" "}
        {Object.values(counts).reduce((s, n) => s + n, 0)}
      </button>
      {WORKORDER_STATES.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onSelect(s)}
          className={cn(
            "h-7 px-2.5 rounded-full text-[10.5px] border transition-colors whitespace-nowrap",
            active === s
              ? "border-blue-500/60 bg-blue-500/10 text-blue-200"
              : "border-white/10 bg-white/[0.02] text-neutral-400 hover:text-neutral-100"
          )}
        >
          {WORKORDER_STATE_LABEL[s]} · {counts[s] ?? 0}
        </button>
      ))}
    </div>
  );
}

export function ScopeFilters({
  scopes,
  selected,
  onToggle,
}: {
  scopes: string[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <FilterChips
      chips={scopes.map((s) => ({ id: s, label: s }))}
      selected={selected}
      onToggle={onToggle}
    />
  );
}

export function WorkorderCard({
  workorder,
  selected,
  onClick,
}: {
  workorder: Workorder;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg border bg-white/[0.03] p-3 space-y-2 transition-colors",
        selected
          ? "border-blue-500/60 bg-white/[0.05]"
          : "border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[12px] text-neutral-100 line-clamp-2 leading-snug min-w-0">
          {workorder.title}
        </div>
        <StatusPill tone={WORKORDER_STATE_TONE[workorder.state]}>
          {WORKORDER_STATE_LABEL[workorder.state]}
        </StatusPill>
      </div>
      <div className="text-[10.5px] text-neutral-500 line-clamp-1">
        {workorder.intent}
      </div>
      <div className="text-[10.5px] text-neutral-500 font-mono">
        {workorder.scope}
      </div>
      {workorder.blocked_reason && (
        <div className="text-[10.5px] text-rose-300/90">
          bloqueado · {workorder.blocked_reason}
        </div>
      )}
      {workorder.gate_decision && (
        <div className="text-[10.5px] text-amber-200/90">
          gate · {workorder.gate_decision}
        </div>
      )}
    </button>
  );
}

export function WorkorderList({
  workorders,
  selectedId,
  onSelect,
}: {
  workorders: Workorder[];
  selectedId?: string;
  onSelect: (w: Workorder) => void;
}) {
  // Group by state, render section per state
  const byState = new Map<WorkorderState, Workorder[]>();
  for (const s of WORKORDER_STATES) byState.set(s, []);
  for (const w of workorders) {
    const arr = byState.get(w.state);
    if (arr) arr.push(w);
  }
  return (
    <div className="space-y-4">
      {WORKORDER_STATES.map((state) => {
        const arr = byState.get(state) ?? [];
        if (arr.length === 0) return null;
        return (
          <div key={state}>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                {WORKORDER_STATE_LABEL[state]}
              </div>
              <div className="text-[10.5px] text-neutral-600">· {arr.length}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {arr.map((w) => (
                <WorkorderCard
                  key={w.id}
                  workorder={w}
                  selected={selectedId === w.id}
                  onClick={() => onSelect(w)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function NewWorkorderComposer({
  onPropose,
}: {
  onPropose: (text: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="rounded-md border border-blue-500/20 bg-blue-500/[0.04] px-3 py-2">
        <div className="text-[12px] text-blue-100">Novo workorder</div>
        <div className="mt-0.5 text-[10.5px] text-blue-200/70 leading-relaxed">
          Linguagem natural cria um workorder draft. Nada executa: produz
          intenção, escopo, evidência necessária e gate. <em>stub · não persistido</em>.
        </div>
      </div>
      <BigComposer
        onPropose={onPropose}
        placeholder="ex: registrar door_contact_main como entidade do Registry com evidência foto"
      />
    </div>
  );
}

export function ExecutionReadiness({
  workorders,
}: {
  workorders: Workorder[];
}) {
  const total = workorders.length;
  const ready = workorders.filter(
    (w) => w.state === "candidate" || w.state === "running"
  ).length;
  const waiting = workorders.filter((w) => w.state === "waiting_approval").length;
  const blocked = workorders.filter((w) => w.state === "blocked").length;
  const closed = workorders.filter((w) => w.state === "closed").length;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <MetricCard label="Workorders" value={total} />
      <MetricCard label="Ready / running" value={ready} tone="good" />
      <MetricCard label="Awaiting gate" value={waiting} tone={waiting > 0 ? "warn" : "default"} />
      <MetricCard label="Blocked" value={blocked} tone={blocked > 0 ? "warn" : "default"} />
      <MetricCard label="Closed today" value={closed} tone="good" />
    </div>
  );
}

/* ─── Wave 3 · Schedules ──────────────────────────────────────────────── */

const SCHEDULE_TONE: Record<Schedule["status"], StatusTone> = {
  upcoming: "info",
  recurring: "ok",
  missed: "warn",
  completed: "ok",
};

export function ScheduleCalendar({
  schedules,
  onSelect,
}: {
  schedules: Schedule[];
  onSelect: (s: Schedule) => void;
}) {
  // Compact "calendar" — group by next_run prefix (date).
  const byDate = new Map<string, Schedule[]>();
  for (const s of schedules) {
    const key = (s.next_run ?? s.last_run ?? "—").slice(0, 10);
    const arr = byDate.get(key) ?? [];
    arr.push(s);
    byDate.set(key, arr);
  }
  const sorted = [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b));
  return (
    <SimplePanel title="Calendário compacto" hint="próximas execuções por dia">
      <div className="space-y-2">
        {sorted.map(([date, items]) => (
          <div key={date}>
            <div className="text-[10.5px] uppercase tracking-wider text-neutral-500">
              {date}
            </div>
            <ul className="mt-1 space-y-1">
              {items.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(s)}
                    className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
                  >
                    <span className="font-mono text-[10.5px] text-neutral-500 w-12 shrink-0">
                      {(s.next_run ?? s.last_run ?? "").slice(11, 16) || "—"}
                    </span>
                    <StatusDot tone={SCHEDULE_TONE[s.status]} />
                    <span className="text-neutral-200 truncate">{s.title}</span>
                    <span className="text-neutral-600 text-[10.5px]">
                      · {s.cadence}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SimplePanel>
  );
}

export function RecurringWorkflowRows({
  schedules,
  onSelect,
}: {
  schedules: Schedule[];
  onSelect: (s: Schedule) => void;
}) {
  const recurring = schedules.filter((s) => s.status === "recurring");
  return (
    <SimplePanel title="Recorrentes" hint="schedules que rodam em cadência fixa">
      {recurring.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">sem recorrentes ativos.</div>
      ) : (
        <ul className="space-y-1.5">
          {recurring.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(s)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <StatusDot tone="ok" />
                <span className="text-neutral-200 truncate">{s.title}</span>
                <span className="text-neutral-500 text-[10.5px]">· {s.cadence}</span>
                <span className="ml-auto text-neutral-500 font-mono text-[10.5px]">
                  next · {s.next_run ?? "—"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function UpcomingRuns({
  schedules,
  onSelect,
}: {
  schedules: Schedule[];
  onSelect: (s: Schedule) => void;
}) {
  const upcoming = schedules.filter((s) => s.status === "upcoming");
  return (
    <SimplePanel title="Upcoming" hint="próximas execuções planejadas">
      {upcoming.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">nada planejado adiante.</div>
      ) : (
        <ul className="space-y-1.5">
          {upcoming.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(s)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <StatusDot tone="info" />
                <span className="text-neutral-200 truncate">{s.title}</span>
                <span className="ml-auto text-neutral-500 font-mono text-[10.5px]">
                  {s.next_run ?? "—"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function MissedSchedules({
  schedules,
  onSelect,
}: {
  schedules: Schedule[];
  onSelect: (s: Schedule) => void;
}) {
  const missed = schedules.filter((s) => s.status === "missed");
  return (
    <SimplePanel title="Missed" hint="schedules que não fecharam; podem virar ghost">
      {missed.length === 0 ? (
        <div className="text-[11.5px] text-emerald-300/90">nenhum schedule perdido.</div>
      ) : (
        <ul className="space-y-1.5">
          {missed.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(s)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <StatusDot tone="warn" />
                <span className="text-neutral-200 truncate">{s.title}</span>
                <span className="text-neutral-500 text-[10.5px]">· {s.cadence}</span>
                {s.ghost_id && (
                  <StatusPill tone="ghost">ghost</StatusPill>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

/* ─── Wave 4 · Gates ──────────────────────────────────────────────────── */

export const GATE_STATES: GateDecisionState[] = [
  "needs_approval",
  "denied",
  "ok",
  "ghost",
  "error",
];

const GATE_TONE: Record<GateDecisionState, StatusTone> = {
  ok: "ok",
  denied: "bad",
  needs_approval: "warn",
  ghost: "ghost",
  error: "bad",
};

const GATE_LABEL: Record<GateDecisionState, string> = {
  ok: "OK",
  denied: "Denied",
  needs_approval: "Needs approval",
  ghost: "Ghost",
  error: "Error",
};

export function GateDecisionQueue({
  decisions,
  selectedId,
  onSelect,
}: {
  decisions: GateDecisionRecord[];
  selectedId?: string;
  onSelect: (d: GateDecisionRecord) => void;
}) {
  const byState = new Map<GateDecisionState, GateDecisionRecord[]>();
  for (const s of GATE_STATES) byState.set(s, []);
  for (const d of decisions) {
    const arr = byState.get(d.decision);
    if (arr) arr.push(d);
  }
  return (
    <div className="space-y-4">
      {GATE_STATES.map((state) => {
        const arr = byState.get(state) ?? [];
        if (arr.length === 0) return null;
        return (
          <div key={state}>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                {GATE_LABEL[state]}
              </div>
              <div className="text-[10.5px] text-neutral-600">· {arr.length}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {arr.map((d) => (
                <DecisionCards
                  key={d.id}
                  decision={d}
                  selected={selectedId === d.id}
                  onClick={() => onSelect(d)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DecisionCards({
  decision,
  selected,
  onClick,
}: {
  decision: GateDecisionRecord;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg border bg-white/[0.03] p-3 space-y-2 transition-colors",
        selected
          ? "border-blue-500/60 bg-white/[0.05]"
          : "border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[12px] text-neutral-100 line-clamp-2 leading-snug min-w-0">
          {decision.scope}
        </div>
        <StatusPill tone={GATE_TONE[decision.decision]}>
          {GATE_LABEL[decision.decision]}
        </StatusPill>
      </div>
      <div className="text-[10.5px] text-neutral-400 line-clamp-2">
        {decision.reason}
      </div>
      <div className="flex items-center gap-2 text-[10.5px] text-neutral-500">
        <span className="font-mono">{decision.created_at}</span>
        {decision.authority && <span>· {decision.authority}</span>}
        {decision.policy_id && (
          <span className="font-mono text-neutral-600">· {decision.policy_id}</span>
        )}
      </div>
    </button>
  );
}

export function ApprovalRequests({
  decisions,
  onSelect,
}: {
  decisions: GateDecisionRecord[];
  onSelect: (d: GateDecisionRecord) => void;
}) {
  const pending = decisions.filter((d) => d.decision === "needs_approval");
  return (
    <SimplePanel title="Approval requests" hint="aguardando confirmação humana">
      {pending.length === 0 ? (
        <div className="text-[11.5px] text-emerald-300/90">fila vazia.</div>
      ) : (
        <ul className="space-y-1.5">
          {pending.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => onSelect(d)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <StatusDot tone="warn" />
                <span className="text-neutral-100 truncate">{d.scope}</span>
                <span className="ml-auto text-neutral-500 font-mono text-[10.5px]">
                  {d.authority ?? "—"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function GateHistory({
  decisions,
  onSelect,
}: {
  decisions: GateDecisionRecord[];
  onSelect: (d: GateDecisionRecord) => void;
}) {
  const closed = decisions
    .filter(
      (d) =>
        d.decision === "ok" ||
        d.decision === "denied" ||
        d.decision === "ghost" ||
        d.decision === "error"
    )
    .slice(0, 8);
  return (
    <SimplePanel title="History" hint="decisões fechadas recentes">
      {closed.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">sem histórico.</div>
      ) : (
        <ul className="space-y-1.5">
          {closed.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => onSelect(d)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <StatusDot tone={GATE_TONE[d.decision]} />
                <span className="text-neutral-200 truncate">{d.scope}</span>
                <span className="ml-auto text-neutral-500 font-mono text-[10.5px]">
                  {d.created_at}
                </span>
                <StatusPill tone={GATE_TONE[d.decision]}>
                  {GATE_LABEL[d.decision]}
                </StatusPill>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function ReasonPanel({ decision }: { decision: GateDecisionRecord }) {
  return (
    <SimplePanel
      title="Reason"
      hint="por que a decisão foi essa"
    >
      <div className="space-y-2 text-[11.5px] text-neutral-300">
        <div>{decision.reason}</div>
        {decision.policy_id && (
          <div className="text-[10.5px] text-neutral-500">
            policy · <span className="font-mono">{decision.policy_id}</span>
          </div>
        )}
        {decision.evidence && decision.evidence.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
              evidência observada
            </div>
            <div className="flex flex-wrap gap-1.5">
              {decision.evidence.map((e) => (
                <span
                  key={e}
                  className="h-6 inline-flex items-center px-2 rounded text-[10.5px] border border-white/10 bg-white/[0.03] text-neutral-300 font-mono"
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </SimplePanel>
  );
}

/* ─── Wave 4 · Knowledge ──────────────────────────────────────────────── */

const KNOWLEDGE_KIND_LABEL = {
  playbook: "Playbook",
  context_pack: "Context pack",
  note: "Note",
  pinned: "Pinned",
} as const;

export function KnowledgeSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Buscar contexto, playbook ou nota…"
      className="h-9 w-full md:w-[420px] rounded-md bg-white/[0.04] border border-white/10 px-3 text-[12px] text-neutral-100 placeholder:text-neutral-600 outline-none focus:border-blue-500/40"
    />
  );
}

export function KnowledgeCards({
  items,
  selectedId,
  onSelect,
}: {
  items: KnowledgeItem[];
  selectedId?: string;
  onSelect: (item: KnowledgeItem) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="text-[11.5px] text-neutral-500">
        nada encontrado.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          onClick={() => onSelect(it)}
          className={cn(
            "w-full text-left rounded-lg border bg-white/[0.03] p-3 space-y-2 transition-colors",
            selectedId === it.id
              ? "border-blue-500/60 bg-white/[0.05]"
              : "border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-blue-300/90">
              {KNOWLEDGE_KIND_LABEL[it.kind]}
            </span>
            {it.pinned && <StatusPill tone="info">pinned</StatusPill>}
          </div>
          <div className="text-[12px] text-neutral-100 line-clamp-2 leading-snug">
            {it.title}
          </div>
          <div className="text-[10.5px] text-neutral-400 line-clamp-3">
            {it.summary}
          </div>
          <div className="flex items-center gap-2 text-[10.5px] text-neutral-500">
            <span className="font-mono">{it.domain}</span>
            {it.updated_at && <span>· {it.updated_at}</span>}
          </div>
        </button>
      ))}
    </div>
  );
}

export function PlaybookList({
  items,
  onSelect,
}: {
  items: KnowledgeItem[];
  onSelect: (item: KnowledgeItem) => void;
}) {
  const playbooks = items.filter((it) => it.kind === "playbook");
  return (
    <SimplePanel title="Playbooks" hint="sequências operacionais reusáveis">
      {playbooks.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">nenhum playbook.</div>
      ) : (
        <ul className="space-y-1.5">
          {playbooks.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => onSelect(it)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <StatusDot tone="info" />
                <span className="text-neutral-200 truncate">{it.title}</span>
                <span className="text-neutral-500 text-[10.5px]">· {it.domain}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function ContextPacks({
  items,
  onSelect,
}: {
  items: KnowledgeItem[];
  onSelect: (item: KnowledgeItem) => void;
}) {
  const packs = items.filter((it) => it.kind === "context_pack");
  return (
    <SimplePanel title="Context packs" hint="conjuntos de contexto consumidos por LLMs e agentes">
      {packs.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">sem packs.</div>
      ) : (
        <ul className="space-y-1.5">
          {packs.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => onSelect(it)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <StatusDot tone="ok" />
                <span className="text-neutral-200 truncate">{it.title}</span>
                {it.used_by && it.used_by.length > 0 && (
                  <span className="ml-auto text-neutral-500 text-[10.5px]">
                    {it.used_by.length} consumer(es)
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function PinnedKnowledge({
  items,
  onSelect,
}: {
  items: KnowledgeItem[];
  onSelect: (item: KnowledgeItem) => void;
}) {
  const pinned = items.filter((it) => it.pinned);
  return (
    <SimplePanel title="Pinned" hint="contexto sempre presente">
      {pinned.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">nada fixado.</div>
      ) : (
        <ul className="space-y-1.5">
          {pinned.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => onSelect(it)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <StatusDot tone="info" />
                <span className="text-neutral-100 truncate">{it.title}</span>
                <span className="text-neutral-500 text-[10.5px]">
                  · {KNOWLEDGE_KIND_LABEL[it.kind]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function EntityRelationList({
  items,
}: {
  items: KnowledgeItem[];
}) {
  // Aggregate usage by agent/llm id
  const usage = new Map<string, KnowledgeItem[]>();
  for (const it of items) {
    for (const consumer of it.used_by ?? []) {
      const arr = usage.get(consumer) ?? [];
      arr.push(it);
      usage.set(consumer, arr);
    }
  }
  const entries = [...usage.entries()];
  return (
    <SimplePanel title="Operational memory" hint="quem consome o quê">
      {entries.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">sem vínculos.</div>
      ) : (
        <ul className="space-y-2">
          {entries.map(([consumer, used]) => (
            <li key={consumer} className="text-[11.5px]">
              <div className="font-mono text-blue-300/90">{consumer}</div>
              <div className="text-neutral-400 text-[10.5px]">
                · {used.map((u) => u.title).join(", ")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

/* ─── Wave 4 · Docs ───────────────────────────────────────────────────── */

const DOC_STATUS_TONE: Record<DocStatus, StatusTone> = {
  draft: "muted",
  review: "warn",
  official: "ok",
  deprecated: "bad",
};

export function DocStatusBadge({ status }: { status: DocStatus }) {
  return <StatusPill tone={DOC_STATUS_TONE[status]}>{status}</StatusPill>;
}

export function DocSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Buscar runbook, plano, política ou relatório…"
      className="h-9 w-full md:w-[420px] rounded-md bg-white/[0.04] border border-white/10 px-3 text-[12px] text-neutral-100 placeholder:text-neutral-600 outline-none focus:border-blue-500/40"
    />
  );
}

export function DocGrid({
  docs,
  selectedId,
  onSelect,
}: {
  docs: DocumentItem[];
  selectedId?: string;
  onSelect: (doc: DocumentItem) => void;
}) {
  if (docs.length === 0) {
    return (
      <div className="text-[11.5px] text-neutral-500">nada encontrado.</div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {docs.map((d) => (
        <button
          key={d.id}
          type="button"
          onClick={() => onSelect(d)}
          className={cn(
            "w-full text-left rounded-lg border bg-white/[0.03] p-3 space-y-2 transition-colors",
            selectedId === d.id
              ? "border-blue-500/60 bg-white/[0.05]"
              : "border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase tracking-wider text-blue-300/90">
              {d.kind}
            </span>
            <DocStatusBadge status={d.status} />
          </div>
          <div className="text-[12px] text-neutral-100 line-clamp-2 leading-snug">
            {d.title}
          </div>
          <div className="flex items-center gap-2 text-[10.5px] text-neutral-500">
            <span className="font-mono">{d.domain}</span>
            {d.updated_at && <span>· {d.updated_at}</span>}
          </div>
        </button>
      ))}
    </div>
  );
}

export function PinnedDocs({
  docs,
  onSelect,
}: {
  docs: DocumentItem[];
  onSelect: (doc: DocumentItem) => void;
}) {
  const pinned = docs.filter((d) => d.pinned);
  return (
    <SimplePanel title="Pinned" hint="docs sempre acessíveis">
      {pinned.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">nada fixado.</div>
      ) : (
        <ul className="space-y-1.5">
          {pinned.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => onSelect(d)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <StatusDot tone={DOC_STATUS_TONE[d.status]} />
                <span className="text-neutral-100 truncate">{d.title}</span>
                <span className="text-neutral-500 text-[10.5px]">· {d.kind}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function MarkdownPreview({ content }: { content?: string }) {
  if (!content) {
    return (
      <SimplePanel title="Preview" hint="conteúdo do documento">
        <div className="text-[11.5px] text-neutral-500">
          este documento ainda não tem conteúdo embarcado. Conteúdo real virá do
          backend quando ligado.
        </div>
      </SimplePanel>
    );
  }
  return (
    <SimplePanel title="Preview" hint="conteúdo do documento · markdown">
      <MinilabMarkdown content={content} />
    </SimplePanel>
  );
}

/* ─── Wave 4 · LLMs ───────────────────────────────────────────────────── */

const BENCHMARK_TONE: Record<string, StatusTone> = {
  passing: "ok",
  regressed: "warn",
  unknown: "muted",
  scheduled: "info",
};

export function LLMEntityCards({
  llms,
  selectedId,
  onSelect,
}: {
  llms: LLMItem[];
  selectedId?: string;
  onSelect: (llm: LLMItem) => void;
}) {
  if (llms.length === 0) {
    return (
      <div className="text-[11.5px] text-neutral-500">nenhum LLM nesse filtro.</div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {llms.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => onSelect(l)}
          className={cn(
            "w-full text-left rounded-lg border bg-white/[0.03] p-3 space-y-2 transition-colors",
            selectedId === l.id
              ? "border-blue-500/60 bg-white/[0.05]"
              : "border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="text-[12px] text-neutral-100 leading-snug min-w-0 truncate">
              {l.name}
            </div>
            <StatusPill tone={l.tier === "premium" ? "warn" : "ok"}>
              {l.tier}
            </StatusPill>
          </div>
          <div className="text-[10.5px] text-neutral-500">
            role · {l.role}
          </div>
          <div className="flex flex-wrap gap-1">
            {l.capabilities.slice(0, 3).map((c) => (
              <span
                key={c}
                className="h-5 inline-flex items-center px-1.5 rounded text-[10px] border border-white/10 bg-white/[0.03] text-neutral-300 font-mono"
              >
                {c}
              </span>
            ))}
            {l.capabilities.length > 3 && (
              <span className="text-[10px] text-neutral-500">
                +{l.capabilities.length - 3}
              </span>
            )}
          </div>
          <div className="text-[10.5px] text-neutral-500 truncate">
            {l.cost_profile ?? "—"}
          </div>
        </button>
      ))}
    </div>
  );
}

export function CapabilityMatrix({ llms }: { llms: LLMItem[] }) {
  const allCaps = Array.from(
    new Set(llms.flatMap((l) => l.capabilities))
  ).sort();
  return (
    <SimplePanel title="Capability matrix" hint="quem faz o quê">
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-left text-[10.5px]">
          <thead className="text-neutral-500">
            <tr>
              <th className="px-2 py-1 font-medium sticky left-0 bg-panel">
                LLM
              </th>
              {allCaps.map((c) => (
                <th
                  key={c}
                  className="px-2 py-1 font-mono font-normal text-neutral-500 whitespace-nowrap"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {llms.map((l) => (
              <tr key={l.id}>
                <td className="px-2 py-1 text-neutral-200 sticky left-0 bg-panel whitespace-nowrap">
                  {l.name}
                </td>
                {allCaps.map((c) => (
                  <td key={c} className="px-2 py-1 text-center">
                    {l.capabilities.includes(c) ? (
                      <StatusDot tone="ok" />
                    ) : (
                      <span className="text-neutral-700">·</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SimplePanel>
  );
}

export function UsageRows({ llms }: { llms: LLMItem[] }) {
  return (
    <SimplePanel title="Usage today" hint="chamadas observadas hoje">
      <ul className="space-y-1.5">
        {llms.map((l) => (
          <li key={l.id} className="flex items-center gap-2 text-[11.5px]">
            <StatusDot tone={l.tier === "premium" ? "warn" : "ok"} />
            <span className="text-neutral-100 truncate">{l.name}</span>
            <span className="ml-auto text-neutral-500 font-mono text-[10.5px]">
              {l.usage_today ?? 0} call(s)
            </span>
          </li>
        ))}
      </ul>
    </SimplePanel>
  );
}

export function CostBadges({ llms }: { llms: LLMItem[] }) {
  return (
    <SimplePanel title="Cost profile" hint="custo declarado por modelo">
      <ul className="space-y-1.5">
        {llms.map((l) => (
          <li key={l.id} className="flex items-center gap-2 text-[11.5px]">
            <StatusPill tone={l.tier === "premium" ? "warn" : "ok"}>
              {l.tier}
            </StatusPill>
            <span className="text-neutral-200 truncate">{l.name}</span>
            <span className="ml-auto text-neutral-500 text-[10.5px]">
              {l.cost_profile ?? "—"}
            </span>
          </li>
        ))}
      </ul>
    </SimplePanel>
  );
}

export function BenchmarkStatus({ llms }: { llms: LLMItem[] }) {
  return (
    <SimplePanel title="Benchmark status" hint="qualidade observada por LLM">
      <ul className="space-y-1.5">
        {llms.map((l) => (
          <li key={l.id} className="flex items-center gap-2 text-[11.5px]">
            <StatusDot tone={BENCHMARK_TONE[l.benchmark_status ?? "unknown"]} />
            <span className="text-neutral-200 truncate">{l.name}</span>
            <span className="ml-auto text-neutral-500 text-[10.5px]">
              {l.benchmark_status ?? "unknown"}
            </span>
          </li>
        ))}
      </ul>
    </SimplePanel>
  );
}

export const LLM_ROLES: LLMRole[] = [
  "operator",
  "translator",
  "mini",
  "agent",
  "chatbot",
  "transistor",
  "judge",
];

export function RoleFilters({
  active,
  onToggle,
}: {
  active: LLMRole[];
  onToggle: (role: LLMRole) => void;
}) {
  return (
    <FilterChips
      chips={LLM_ROLES.map((r) => ({ id: r, label: r }))}
      selected={active}
      onToggle={(id) => onToggle(id as LLMRole)}
    />
  );
}

export function PremiumCallMeter({
  llms,
  budget,
}: {
  llms: LLMItem[];
  budget: number;
}) {
  const used = llms
    .filter((l) => l.tier === "premium")
    .reduce((s, l) => s + (l.usage_today ?? 0), 0);
  const pct = Math.min(100, Math.round((used / Math.max(1, budget)) * 100));
  const tone: "good" | "warn" | "default" =
    pct >= 80 ? "warn" : pct >= 50 ? "default" : "good";
  return (
    <SimplePanel title="Premium call meter" hint="premium é recurso escasso">
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-3">
          <MetricCard label="Used" value={used} tone={tone} />
          <MetricCard label="Budget" value={budget} />
          <MetricCard label="%" value={`${pct}%`} tone={tone} />
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              pct >= 80
                ? "bg-rose-400/80"
                : pct >= 50
                  ? "bg-amber-400/80"
                  : "bg-emerald-400/80"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </SimplePanel>
  );
}

/* ─── Wave 5a · Reviews ───────────────────────────────────────────────── */

const REVIEW_STATUS_TONE: Record<ReviewStatus, StatusTone> = {
  queued: "muted",
  in_review: "info",
  blocked: "bad",
  ready_to_close: "ok",
  closed: "ok",
};

const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
  queued: "Queued",
  in_review: "In review",
  blocked: "Blocked",
  ready_to_close: "Ready to close",
  closed: "Closed",
};

const REVIEW_KIND_LABEL: Record<ReviewKind, string> = {
  code: "Code",
  workorder: "Workorder",
  policy: "Policy",
  document: "Document",
  legal: "Legal",
  gate: "Gate",
  diff: "Diff",
};

export function ReviewQueue({
  reviews,
  selectedId,
  onSelect,
}: {
  reviews: ReviewItem[];
  selectedId?: string;
  onSelect: (r: ReviewItem) => void;
}) {
  const order: ReviewStatus[] = [
    "in_review",
    "blocked",
    "ready_to_close",
    "queued",
    "closed",
  ];
  const byStatus = new Map<ReviewStatus, ReviewItem[]>();
  for (const s of order) byStatus.set(s, []);
  for (const r of reviews) {
    const arr = byStatus.get(r.status);
    if (arr) arr.push(r);
  }
  return (
    <div className="space-y-4">
      {order.map((status) => {
        const arr = byStatus.get(status) ?? [];
        if (arr.length === 0) return null;
        return (
          <div key={status}>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                {REVIEW_STATUS_LABEL[status]}
              </div>
              <div className="text-[10.5px] text-neutral-600">· {arr.length}</div>
            </div>
            <EntityTable>
              {arr.map((r) => (
                <EntityRow
                  key={r.id}
                  title={r.title}
                  subtitle={`${REVIEW_KIND_LABEL[r.kind]} · ${r.scope}`}
                  meta={r.created_at}
                  tone={REVIEW_STATUS_TONE[r.status]}
                  selected={selectedId === r.id}
                  onClick={() => onSelect(r)}
                />
              ))}
            </EntityTable>
          </div>
        );
      })}
    </div>
  );
}

export function DiffReview({ review }: { review: ReviewItem }) {
  if (review.kind !== "diff" && review.kind !== "code") {
    return (
      <SimplePanel title="Diff review" hint="aplicável a code e diff">
        <div className="text-[11.5px] text-neutral-500">
          este review não é de código.
        </div>
      </SimplePanel>
    );
  }
  return (
    <SimplePanel title="Diff review" hint="mudança proposta · sumário">
      <div className="space-y-2 text-[11.5px] text-neutral-300">
        <div className="font-mono text-[11px] rounded-md border border-white/10 bg-black/30 px-3 py-2 text-neutral-300">
          {review.diff_summary ?? "diff sumário não disponível"}
        </div>
        {review.risks && review.risks.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-amber-300/80 mb-1">
              risks
            </div>
            <ul className="space-y-1">
              {review.risks.map((r) => (
                <li key={r} className="flex gap-2">
                  <StatusDot tone="warn" />
                  <span className="text-neutral-300">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </SimplePanel>
  );
}

export function GateDecisionPanel({
  review,
  decisions,
  onSelectDecision,
}: {
  review: ReviewItem;
  decisions: GateDecisionRecord[];
  onSelectDecision: (d: GateDecisionRecord) => void;
}) {
  const linked = decisions.find((d) => d.id === review.gate_id);
  return (
    <SimplePanel title="Gate" hint="decisão de admissão vinculada">
      {linked ? (
        <button
          type="button"
          onClick={() => onSelectDecision(linked)}
          className="w-full text-left rounded-md border border-white/10 bg-white/[0.03] p-2 hover:bg-white/[0.05] transition-colors space-y-1"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11.5px] text-neutral-100 truncate">
              {linked.scope}
            </span>
            <StatusPill tone="warn">{linked.decision.replace("_", " ")}</StatusPill>
          </div>
          <div className="text-[10.5px] text-neutral-500 truncate">{linked.reason}</div>
        </button>
      ) : (
        <div className="text-[11.5px] text-neutral-500">
          este review não tem gate vinculado.
        </div>
      )}
    </SimplePanel>
  );
}

export function CommentThread({
  review,
}: {
  review: ReviewItem;
}) {
  const count = review.comments ?? 0;
  return (
    <SimplePanel title="Comments" hint="discussão do review">
      {count === 0 ? (
        <div className="text-[11.5px] text-neutral-500">sem comentários ainda.</div>
      ) : (
        <div className="space-y-2 text-[11.5px] text-neutral-300">
          <div className="text-[10.5px] text-neutral-500">
            {count} comentário(s) · stub · histórico não persistido
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.03] p-2 text-neutral-300">
            <div className="text-[10.5px] text-neutral-500">Daniel</div>
            <div className="text-[11.5px]">
              precisamos garantir que validators continuam verdes antes de fechar.
            </div>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.03] p-2 text-neutral-300">
            <div className="text-[10.5px] text-neutral-500">LAB Keeper</div>
            <div className="text-[11.5px]">
              checks 2/3 OK; falta smoke manual.
            </div>
          </div>
        </div>
      )}
    </SimplePanel>
  );
}

export function ReviewChecklist({ review }: { review: ReviewItem }) {
  const items = review.checks ?? [];
  return (
    <SimplePanel title="Checklist" hint="checks obrigatórios antes de fechar">
      {items.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">
          este review não tem checks declarados.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {items.map((c) => (
            <li key={c.label} className="flex items-center gap-2 text-[11.5px]">
              <StatusDot tone={c.passed ? "ok" : "warn"} />
              <span className={cn(c.passed ? "text-neutral-200" : "text-neutral-400")}>
                {c.label}
              </span>
              <span className="ml-auto text-[10.5px] text-neutral-500">
                {c.passed ? "ok" : "pending"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

/* ─── Wave 5a · Policies ──────────────────────────────────────────────── */

const POLICY_STATUS_TONE: Record<PolicyStatusKind, StatusTone> = {
  active: "ok",
  draft: "info",
  needs_review: "warn",
  retired: "muted",
};

const POLICY_STATUS_LABEL: Record<PolicyStatusKind, string> = {
  active: "Active",
  draft: "Draft",
  needs_review: "Needs review",
  retired: "Retired",
};

export function PolicyScopeBadges({ scope }: { scope: string[] }) {
  if (scope.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {scope.map((s) => (
        <span
          key={s}
          className="h-5 inline-flex items-center px-1.5 rounded text-[10px] border border-white/10 bg-white/[0.03] text-neutral-300 font-mono"
        >
          {s}
        </span>
      ))}
    </div>
  );
}

export function PolicyStatus({ status }: { status: PolicyStatusKind }) {
  return (
    <StatusPill tone={POLICY_STATUS_TONE[status]}>
      {POLICY_STATUS_LABEL[status]}
    </StatusPill>
  );
}

export function PolicyRow({
  policy,
  selected,
  onClick,
}: {
  policy: PolicyItem;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group w-full flex items-start gap-3 px-3 py-2 text-left",
        "border-b border-white/[0.06] last:border-b-0",
        "hover:bg-white/[0.03] transition-colors",
        selected && "bg-white/[0.04] ring-1 ring-inset ring-blue-500/40"
      )}
    >
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11.5px] text-neutral-100 truncate">
            {policy.name}
          </span>
          <PolicyStatus status={policy.status} />
        </div>
        <div className="text-[10.5px] text-neutral-400 line-clamp-2">
          {policy.rule_summary}
        </div>
        <PolicyScopeBadges scope={policy.scope} />
      </div>
      <div className="shrink-0 text-[10.5px] text-neutral-500 font-mono text-right">
        {policy.updated_at ?? "—"}
      </div>
    </button>
  );
}

export function PolicyList({
  policies,
  selectedId,
  onSelect,
  groupByStatus = true,
}: {
  policies: PolicyItem[];
  selectedId?: string;
  onSelect: (p: PolicyItem) => void;
  groupByStatus?: boolean;
}) {
  if (!groupByStatus) {
    return (
      <EntityTable>
        {policies.map((p) => (
          <PolicyRow
            key={p.id}
            policy={p}
            selected={selectedId === p.id}
            onClick={() => onSelect(p)}
          />
        ))}
      </EntityTable>
    );
  }
  const order: PolicyStatusKind[] = ["active", "draft", "needs_review", "retired"];
  const byStatus = new Map<PolicyStatusKind, PolicyItem[]>();
  for (const s of order) byStatus.set(s, []);
  for (const p of policies) {
    const arr = byStatus.get(p.status);
    if (arr) arr.push(p);
  }
  return (
    <div className="space-y-4">
      {order.map((status) => {
        const arr = byStatus.get(status) ?? [];
        if (arr.length === 0) return null;
        return (
          <div key={status}>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                {POLICY_STATUS_LABEL[status]}
              </div>
              <div className="text-[10.5px] text-neutral-600">· {arr.length}</div>
            </div>
            <EntityTable>
              {arr.map((p) => (
                <PolicyRow
                  key={p.id}
                  policy={p}
                  selected={selectedId === p.id}
                  onClick={() => onSelect(p)}
                />
              ))}
            </EntityTable>
          </div>
        );
      })}
    </div>
  );
}

export function PolicyEditorPreview({ policy }: { policy: PolicyItem }) {
  return (
    <SimplePanel title="Editor preview" hint="rascunho · stub · não persistido">
      <div className="space-y-2 text-[11.5px] text-neutral-300">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
            name
          </div>
          <div className="font-mono text-[12px]">{policy.name}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
            rule
          </div>
          <div className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-neutral-200">
            {policy.rule_summary}
          </div>
        </div>
        {policy.applies_to && policy.applies_to.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
              applies to
            </div>
            <div className="flex flex-wrap gap-1.5">
              {policy.applies_to.map((a) => (
                <span
                  key={a}
                  className="h-6 inline-flex items-center px-2 rounded text-[10.5px] border border-white/10 bg-white/[0.03] text-neutral-300 font-mono"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </SimplePanel>
  );
}

export function LinkedGates({
  policy,
  decisions,
  onSelect,
}: {
  policy: PolicyItem;
  decisions: GateDecisionRecord[];
  onSelect: (d: GateDecisionRecord) => void;
}) {
  const linked = decisions.filter((d) =>
    (policy.linked_gates ?? []).includes(d.id) || d.policy_id === policy.id
  );
  return (
    <SimplePanel title="Linked gates" hint="decisões observadas sob esta policy">
      {linked.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">
          nenhum gate ligado ainda.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {linked.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => onSelect(d)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <StatusDot
                  tone={
                    d.decision === "ok"
                      ? "ok"
                      : d.decision === "denied" || d.decision === "error"
                        ? "bad"
                        : d.decision === "needs_approval"
                          ? "warn"
                          : "ghost"
                  }
                />
                <span className="text-neutral-200 truncate">{d.scope}</span>
                <span className="ml-auto text-neutral-500 text-[10.5px]">
                  {d.decision.replace("_", " ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

/* ─── Wave 5a · Connections ───────────────────────────────────────────── */

const CONNECTION_STATE_TONE: Record<ConnectionState, StatusTone> = {
  connected: "ok",
  degraded: "warn",
  missing: "bad",
  configuring: "info",
};

const CONNECTION_STATE_LABEL: Record<ConnectionState, string> = {
  connected: "connected",
  degraded: "degraded",
  missing: "missing",
  configuring: "configuring",
};

const CONNECTION_DOMAIN_LABEL: Record<ConnectionDomain, string> = {
  runtime: "Runtime",
  communication: "Communication",
  storage: "Storage",
  code: "Code",
  finance: "Finance",
  legal: "Legal",
};

export function ConnectedBadges({ state }: { state: ConnectionState }) {
  return (
    <StatusPill tone={CONNECTION_STATE_TONE[state]}>
      {CONNECTION_STATE_LABEL[state]}
    </StatusPill>
  );
}

export function ProviderRows({
  connections,
  selectedId,
  onSelect,
}: {
  connections: ConnectionItem[];
  selectedId?: string;
  onSelect: (c: ConnectionItem) => void;
}) {
  return (
    <EntityTable>
      {connections.map((c) => (
        <EntityRow
          key={c.id}
          title={c.name}
          subtitle={`${c.provider} · ${c.scope ?? "—"}`}
          meta={c.last_sync ?? "—"}
          tone={CONNECTION_STATE_TONE[c.state]}
          selected={selectedId === c.id}
          onClick={() => onSelect(c)}
        />
      ))}
    </EntityTable>
  );
}

export function ConnectionGroups({
  connections,
  selectedId,
  onSelect,
}: {
  connections: ConnectionItem[];
  selectedId?: string;
  onSelect: (c: ConnectionItem) => void;
}) {
  const order: ConnectionDomain[] = [
    "runtime",
    "communication",
    "storage",
    "code",
    "finance",
    "legal",
  ];
  const byDomain = new Map<ConnectionDomain, ConnectionItem[]>();
  for (const d of order) byDomain.set(d, []);
  for (const c of connections) {
    const arr = byDomain.get(c.domain);
    if (arr) arr.push(c);
  }
  return (
    <div className="space-y-4">
      {order.map((domain) => {
        const arr = byDomain.get(domain) ?? [];
        if (arr.length === 0) return null;
        return (
          <div key={domain}>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                {CONNECTION_DOMAIN_LABEL[domain]}
              </div>
              <div className="text-[10.5px] text-neutral-600">· {arr.length}</div>
            </div>
            <ProviderRows
              connections={arr}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          </div>
        );
      })}
    </div>
  );
}

export function ConfigureActions({
  connection,
}: {
  connection: ConnectionItem;
}) {
  return (
    <SimplePanel title="Actions" hint="visíveis · stub · não executam">
      <div className="flex flex-wrap gap-2">
        <button className="h-7 px-2.5 rounded-md text-[10.5px] bg-blue-500/15 ring-1 ring-inset ring-blue-500/40 text-blue-200 hover:bg-blue-500/25 transition-colors whitespace-nowrap">
          Configure
        </button>
        <button className="h-7 px-2.5 rounded-md text-[10.5px] bg-white/[0.04] ring-1 ring-inset ring-white/10 text-neutral-300 hover:bg-white/[0.08] transition-colors whitespace-nowrap">
          Sync now
        </button>
        <button className="h-7 px-2.5 rounded-md text-[10.5px] bg-white/[0.04] ring-1 ring-inset ring-white/10 text-neutral-300 hover:bg-white/[0.08] transition-colors whitespace-nowrap">
          Rotate secret
        </button>
        <button className="h-7 px-2.5 rounded-md text-[10.5px] bg-rose-500/[0.08] ring-1 ring-inset ring-rose-500/30 text-rose-200 hover:bg-rose-500/[0.15] transition-colors whitespace-nowrap">
          Disable
        </button>
      </div>
      <div className="mt-2 text-[10.5px] text-neutral-500">
        atalho visual. {connection.name} continua exatamente como está.
      </div>
    </SimplePanel>
  );
}

export interface MCPMarketplaceItem {
  id: string;
  name: string;
  description: string;
  state: "installed" | "available";
}

export function MCPMarketplaceLikeList({
  items,
}: {
  items: ReadonlyArray<MCPMarketplaceItem>;
}) {
  return (
    <SimplePanel
      title="MCP marketplace (preview)"
      hint="tools instaláveis · stub · não persistido"
    >
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li
            key={it.id}
            className="flex items-start gap-2 text-[11.5px]"
          >
            <StatusDot tone={it.state === "installed" ? "ok" : "muted"} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-neutral-100 truncate">{it.name}</span>
                <StatusPill tone={it.state === "installed" ? "ok" : "muted"}>
                  {it.state}
                </StatusPill>
              </div>
              <div className="text-[10.5px] text-neutral-500 line-clamp-1">
                {it.description}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </SimplePanel>
  );
}

/* ─── Wave 5a · Secrets ───────────────────────────────────────────────── */

const SECRET_PRESENCE_TONE = {
  present: "ok" as StatusTone,
  missing: "bad" as StatusTone,
  stale: "warn" as StatusTone,
} as const;

export function SecretReferenceRows({
  secrets,
  selectedId,
  onSelect,
}: {
  secrets: SecretReference[];
  selectedId?: string;
  onSelect: (s: SecretReference) => void;
}) {
  return (
    <EntityTable>
      {secrets.map((s) => (
        <EntityRow
          key={s.id}
          title={s.logical_name}
          subtitle={`${s.provider} · ${s.scope}`}
          meta={s.last_rotation ?? "—"}
          tone={SECRET_PRESENCE_TONE[s.presence]}
          selected={selectedId === s.id}
          onClick={() => onSelect(s)}
        />
      ))}
    </EntityTable>
  );
}

export function ProviderStatus({
  secrets,
}: {
  secrets: SecretReference[];
}) {
  const byProvider = new Map<string, SecretReference[]>();
  for (const s of secrets) {
    const arr = byProvider.get(s.provider) ?? [];
    arr.push(s);
    byProvider.set(s.provider, arr);
  }
  return (
    <SimplePanel title="Providers" hint="saúde por provedor">
      <ul className="space-y-1.5">
        {[...byProvider.entries()].map(([provider, items]) => {
          const present = items.filter((i) => i.presence === "present").length;
          const missing = items.filter((i) => i.presence === "missing").length;
          const stale = items.filter((i) => i.presence === "stale").length;
          const tone: StatusTone =
            missing > 0 ? "bad" : stale > 0 ? "warn" : "ok";
          return (
            <li
              key={provider}
              className="flex items-center gap-2 text-[11.5px]"
            >
              <StatusDot tone={tone} />
              <span className="text-neutral-100">{provider}</span>
              <span className="ml-auto text-[10.5px] text-neutral-500 font-mono">
                {present} present · {stale} stale · {missing} missing
              </span>
            </li>
          );
        })}
      </ul>
    </SimplePanel>
  );
}

export function MissingSecretWarnings({
  secrets,
  onSelect,
}: {
  secrets: SecretReference[];
  onSelect: (s: SecretReference) => void;
}) {
  const missing = secrets.filter((s) => s.presence !== "present");
  return (
    <SimplePanel title="Missing / stale" hint="referências sem valor presente ou com rotação atrasada">
      {missing.length === 0 ? (
        <div className="text-[11.5px] text-emerald-300/90">
          todas as referências estão presentes e em dia.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {missing.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(s)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <StatusDot tone={SECRET_PRESENCE_TONE[s.presence]} />
                <span className="text-neutral-100 truncate">
                  {s.logical_name}
                </span>
                <span className="text-neutral-500 text-[10.5px]">
                  · {s.provider}
                </span>
                <StatusPill tone={SECRET_PRESENCE_TONE[s.presence]}>
                  {s.presence}
                </StatusPill>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function AccessPolicyLinks({
  secret,
  policies,
  onSelect,
}: {
  secret: SecretReference;
  policies: PolicyItem[];
  onSelect: (p: PolicyItem) => void;
}) {
  const linked = policies.filter((p) => (secret.policy_ids ?? []).includes(p.id));
  return (
    <SimplePanel title="Access policies" hint="regras que governam essa referência">
      {linked.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">sem policy ligada.</div>
      ) : (
        <ul className="space-y-1.5">
          {linked.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onSelect(p)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <PolicyStatus status={p.status} />
                <span className="font-mono text-neutral-200 truncate">
                  {p.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

/* ─── Wave 5b · Financeiro ────────────────────────────────────────────── */

function formatEUR(n: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

const FINANCE_STATUS_TONE: Record<FinanceStatus, StatusTone> = {
  paid: "ok",
  scheduled: "info",
  due: "warn",
  missing_evidence: "ghost",
  needs_approval: "warn",
  denied: "bad",
};

const FINANCE_STATUS_LABEL: Record<FinanceStatus, string> = {
  paid: "paid",
  scheduled: "scheduled",
  due: "due",
  missing_evidence: "missing evidence",
  needs_approval: "needs approval",
  denied: "denied",
};

const FINANCE_CATEGORY_LABEL: Record<FinanceCategory, string> = {
  infra: "Infra",
  subscriptions: "Subscriptions",
  supplies: "Supplies",
  vendors: "Vendors",
  legal: "Legal & Tax",
  people: "People",
  research: "Research",
  other: "Other",
};

export function FinanceOverviewCards({
  records,
  budget,
}: {
  records: FinanceRecord[];
  budget: BudgetCategory[];
}) {
  const totalSpent = budget.reduce((s, b) => s + b.spent, 0);
  const totalBudget = budget.reduce((s, b) => s + b.budget, 0);
  const dueCount = records.filter((r) => r.status === "due").length;
  const needsApproval = records.filter((r) => r.status === "needs_approval").length;
  const ghostCount = records.filter((r) => r.status === "missing_evidence").length;
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <MetricCard
        label="Spent · este mês"
        value={formatEUR(totalSpent)}
        hint={`de ${formatEUR(totalBudget)}`}
        tone={totalSpent > totalBudget ? "warn" : "default"}
      />
      <MetricCard label="Due bills" value={dueCount} tone={dueCount > 0 ? "warn" : "default"} />
      <MetricCard
        label="Needs approval"
        value={needsApproval}
        tone={needsApproval > 0 ? "warn" : "default"}
      />
      <MetricCard
        label="Sem comprovante"
        value={ghostCount}
        tone={ghostCount > 0 ? "warn" : "default"}
      />
      <MetricCard
        label="Recurring"
        value={records.filter((r) => r.recurring).length}
      />
    </div>
  );
}

export function DueBills({
  records,
  onSelect,
}: {
  records: FinanceRecord[];
  onSelect: (r: FinanceRecord) => void;
}) {
  const due = records.filter(
    (r) =>
      r.status === "due" ||
      r.status === "scheduled" ||
      r.status === "missing_evidence" ||
      r.status === "needs_approval" ||
      r.status === "denied"
  );
  return (
    <SimplePanel title="Due / open" hint="contas em aberto, esperando algo">
      {due.length === 0 ? (
        <div className="text-[11.5px] text-emerald-300/90">
          nada em aberto no momento.
        </div>
      ) : (
        <ul className="divide-y divide-white/[0.06]">
          {due.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => onSelect(r)}
                className="w-full text-left flex items-center gap-2 py-1.5 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 rounded transition-colors"
              >
                <StatusDot tone={FINANCE_STATUS_TONE[r.status]} />
                <span className="text-neutral-100 truncate">{r.title}</span>
                <span className="text-neutral-500 text-[10.5px]">
                  · {FINANCE_CATEGORY_LABEL[r.category]}
                </span>
                <span className="ml-auto text-neutral-300 font-mono tabular-nums">
                  {formatEUR(r.amount)}
                </span>
                <span className="text-neutral-500 text-[10.5px] font-mono">
                  · {r.due_date ?? "—"}
                </span>
                <StatusPill tone={FINANCE_STATUS_TONE[r.status]}>
                  {FINANCE_STATUS_LABEL[r.status]}
                </StatusPill>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function BudgetProgress({ budget }: { budget: BudgetCategory[] }) {
  return (
    <SimplePanel title="Budget" hint="orçamento vs gasto · maio">
      <ul className="space-y-2">
        {budget.map((b) => {
          const pct =
            b.budget === 0 ? 0 : Math.min(100, Math.round((b.spent / b.budget) * 100));
          const over = b.spent > b.budget;
          return (
            <li key={b.category} className="space-y-1">
              <div className="flex items-center gap-2 text-[11.5px]">
                <span className="text-neutral-200">{b.label}</span>
                <span className="ml-auto text-neutral-500 font-mono tabular-nums text-[10.5px]">
                  {formatEUR(b.spent)} / {formatEUR(b.budget)}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    over
                      ? "bg-rose-400/80"
                      : pct >= 80
                        ? "bg-amber-400/80"
                        : "bg-emerald-400/80"
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </SimplePanel>
  );
}

export function SpendingTimeline({
  events,
  onSelect,
}: {
  events: SpendingEvent[];
  onSelect?: (e: SpendingEvent) => void;
}) {
  const sorted = [...events].sort((a, b) => b.when.localeCompare(a.when));
  const timelineEvents: TimelineEvent[] = sorted.map((e) => ({
    id: e.id,
    when: e.when.slice(5), // MM-DD
    title: e.title,
    detail: `${formatEUR(e.amount)} · ${FINANCE_CATEGORY_LABEL[e.category]}`,
    tone: e.ghost_id ? "ghost" : e.receipt_id ? "ok" : "info",
    onClick: onSelect ? () => onSelect(e) : undefined,
  }));
  return (
    <SimplePanel title="Spending timeline" hint="o que saiu, quando e com que prova">
      <Timeline events={timelineEvents} />
    </SimplePanel>
  );
}

export function CategoryBreakdown({ budget }: { budget: BudgetCategory[] }) {
  const total = budget.reduce((s, b) => s + b.spent, 0);
  const sorted = [...budget].sort((a, b) => b.spent - a.spent);
  return (
    <SimplePanel title="By category" hint="composição do gasto deste mês">
      <ul className="space-y-1.5">
        {sorted.map((b) => {
          const pct = total === 0 ? 0 : Math.round((b.spent / total) * 100);
          return (
            <li key={b.category} className="flex items-center gap-2 text-[11.5px]">
              <StatusDot tone={b.spent > b.budget ? "warn" : "info"} />
              <span className="text-neutral-200 truncate">{b.label}</span>
              <span className="ml-auto text-neutral-500 font-mono tabular-nums text-[10.5px]">
                {formatEUR(b.spent)} · {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </SimplePanel>
  );
}

/* ─── Wave 5b · Costs ─────────────────────────────────────────────────── */

const COST_KIND_LABEL = {
  machine: "Machine",
  llm: "LLM",
  vendor: "Vendor",
  project: "Project",
  workflow: "Workflow",
  benchmark: "Benchmark",
  other: "Other",
} as const;

export function CostTable({
  costs,
  selectedId,
  onSelect,
}: {
  costs: CostRecord[];
  selectedId?: string;
  onSelect: (c: CostRecord) => void;
}) {
  const sorted = [...costs].sort((a, b) => b.amount_eur - a.amount_eur);
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11.5px]">
          <thead className="text-neutral-500 bg-white/[0.02]">
            <tr>
              <th className="px-3 py-2 font-medium text-[10px] uppercase tracking-wider">
                Object
              </th>
              <th className="px-3 py-2 font-medium text-[10px] uppercase tracking-wider">
                Kind
              </th>
              <th className="px-3 py-2 font-medium text-[10px] uppercase tracking-wider">
                Period
              </th>
              <th className="px-3 py-2 font-medium text-[10px] uppercase tracking-wider text-right">
                Amount
              </th>
              <th className="px-3 py-2 font-medium text-[10px] uppercase tracking-wider">
                Evidence
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {sorted.map((c) => (
              <tr
                key={c.id}
                onClick={() => onSelect(c)}
                className={cn(
                  "cursor-pointer hover:bg-white/[0.03] transition-colors",
                  selectedId === c.id && "bg-white/[0.04]"
                )}
              >
                <td className="px-3 py-2 text-neutral-100 truncate">
                  {c.cost_object_label}
                </td>
                <td className="px-3 py-2 text-neutral-500 text-[10.5px]">
                  {COST_KIND_LABEL[c.cost_object_kind]}
                </td>
                <td className="px-3 py-2 text-neutral-500 font-mono text-[10.5px]">
                  {c.period}
                </td>
                <td className="px-3 py-2 text-right font-mono tabular-nums">
                  <span
                    className={cn(
                      c.anomaly ? "text-amber-300" : "text-neutral-200"
                    )}
                  >
                    {formatEUR(c.amount_eur)}
                  </span>
                  {typeof c.delta_from_avg_pct === "number" && c.anomaly && (
                    <span className="ml-1 text-[10px] text-amber-400/80">
                      +{c.delta_from_avg_pct}%
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {c.receipt_id ? (
                    <StatusPill tone="ok">receipt</StatusPill>
                  ) : c.ghost_id ? (
                    <StatusPill tone="ghost">ghost</StatusPill>
                  ) : (
                    <span className="text-neutral-500 text-[10.5px]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CostAllocationCards({ costs }: { costs: CostRecord[] }) {
  const byKind = new Map<CostRecord["cost_object_kind"], number>();
  for (const c of costs) {
    byKind.set(
      c.cost_object_kind,
      (byKind.get(c.cost_object_kind) ?? 0) + c.amount_eur
    );
  }
  const order: CostRecord["cost_object_kind"][] = [
    "machine",
    "llm",
    "vendor",
    "project",
    "workflow",
    "benchmark",
    "other",
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {order.map((k) => {
        const v = byKind.get(k) ?? 0;
        if (v === 0 && k !== "machine" && k !== "llm") return null;
        return (
          <MetricCard
            key={k}
            label={COST_KIND_LABEL[k]}
            value={formatEUR(v)}
            tone="default"
          />
        );
      })}
    </div>
  );
}

export function CostByEntity({
  costs,
  onSelect,
}: {
  costs: CostRecord[];
  onSelect: (c: CostRecord) => void;
}) {
  // Group by cost_object_id
  const map = new Map<
    string,
    { label: string; kind: CostRecord["cost_object_kind"]; total: number; items: CostRecord[] }
  >();
  for (const c of costs) {
    const slot = map.get(c.cost_object_id);
    if (slot) {
      slot.total += c.amount_eur;
      slot.items.push(c);
    } else {
      map.set(c.cost_object_id, {
        label: c.cost_object_label,
        kind: c.cost_object_kind,
        total: c.amount_eur,
        items: [c],
      });
    }
  }
  const sorted = [...map.entries()].sort(([, a], [, b]) => b.total - a.total);
  return (
    <SimplePanel title="By entity" hint="custo total atribuído a cada objeto">
      <ul className="space-y-1.5">
        {sorted.map(([id, slot]) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => onSelect(slot.items[0])}
              className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
            >
              <StatusDot tone={slot.items.some((i) => i.anomaly) ? "warn" : "info"} />
              <span className="text-neutral-100 truncate">{slot.label}</span>
              <span className="text-neutral-500 text-[10.5px]">
                · {COST_KIND_LABEL[slot.kind]}
              </span>
              <span className="ml-auto text-neutral-300 font-mono tabular-nums">
                {formatEUR(slot.total)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </SimplePanel>
  );
}

export function TrendCharts({ budget }: { budget: BudgetCategory[] }) {
  // Stub: render a tiny "bar chart" comparing budget and spent per category.
  return (
    <SimplePanel title="Tendência" hint="orçamento vs gasto · stub visual">
      <ul className="space-y-1.5">
        {budget.map((b) => {
          const max = Math.max(b.budget, b.spent, 1);
          const budgetPct = Math.round((b.budget / max) * 100);
          const spentPct = Math.round((b.spent / max) * 100);
          return (
            <li key={b.category} className="text-[11.5px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-neutral-200">{b.label}</span>
                <span className="text-neutral-500 text-[10.5px] font-mono tabular-nums">
                  {formatEUR(b.spent)} / {formatEUR(b.budget)}
                </span>
              </div>
              <div className="space-y-0.5">
                <div className="h-1 rounded bg-white/[0.04] overflow-hidden">
                  <div
                    className="h-full bg-blue-400/60"
                    style={{ width: `${budgetPct}%` }}
                  />
                </div>
                <div className="h-1 rounded bg-white/[0.04] overflow-hidden">
                  <div
                    className={cn(
                      "h-full",
                      b.spent > b.budget ? "bg-rose-400/80" : "bg-emerald-400/70"
                    )}
                    style={{ width: `${spentPct}%` }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-2 text-[10.5px] text-neutral-500">
        azul = budget, verde/vermelho = spent · stub
      </div>
    </SimplePanel>
  );
}

export function CostAnomalyList({
  costs,
  onSelect,
}: {
  costs: CostRecord[];
  onSelect: (c: CostRecord) => void;
}) {
  const anomalies = costs.filter((c) => c.anomaly);
  return (
    <SimplePanel title="Anomalies" hint="custos fora da curva ou sem evidência">
      {anomalies.length === 0 ? (
        <div className="text-[11.5px] text-emerald-300/90">
          nada anômalo este mês.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {anomalies.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <StatusDot tone="warn" />
                <span className="text-neutral-100 truncate">
                  {c.cost_object_label}
                </span>
                <span className="text-neutral-500 text-[10.5px]">
                  · {c.source}
                </span>
                <span className="ml-auto text-amber-300 font-mono tabular-nums">
                  {formatEUR(c.amount_eur)}
                </span>
                {typeof c.delta_from_avg_pct === "number" && (
                  <span className="text-[10px] text-amber-400/80">
                    +{c.delta_from_avg_pct}%
                  </span>
                )}
                {c.ghost_id && <StatusPill tone="ghost">ghost</StatusPill>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

/* ─── Wave 5b · Vendors ───────────────────────────────────────────────── */

const VENDOR_STATE_TONE: Record<VendorState, StatusTone> = {
  active: "ok",
  recurring: "info",
  pending: "warn",
  legal_attention: "warn",
  payment_issue: "bad",
};

const VENDOR_STATE_LABEL: Record<VendorState, string> = {
  active: "Active",
  recurring: "Recurring",
  pending: "Pending",
  legal_attention: "Legal attention",
  payment_issue: "Payment issue",
};

const VENDOR_PAYMENT_TONE = {
  ok: "ok" as StatusTone,
  late: "warn" as StatusTone,
  blocked: "bad" as StatusTone,
  missing_invoice: "ghost" as StatusTone,
};

export function VendorList({
  vendors,
  selectedId,
  onSelect,
  groupByState = true,
}: {
  vendors: VendorItem[];
  selectedId?: string;
  onSelect: (v: VendorItem) => void;
  groupByState?: boolean;
}) {
  if (!groupByState) {
    return (
      <EntityTable>
        {vendors.map((v) => (
          <EntityRow
            key={v.id}
            title={v.name}
            subtitle={`${v.service}`}
            meta={
              typeof v.monthly_cost_eur === "number" ? formatEUR(v.monthly_cost_eur) : "—"
            }
            tone={VENDOR_STATE_TONE[v.state]}
            selected={selectedId === v.id}
            onClick={() => onSelect(v)}
          />
        ))}
      </EntityTable>
    );
  }
  const order: VendorState[] = [
    "active",
    "recurring",
    "pending",
    "legal_attention",
    "payment_issue",
  ];
  const byState = new Map<VendorState, VendorItem[]>();
  for (const s of order) byState.set(s, []);
  for (const v of vendors) {
    const arr = byState.get(v.state);
    if (arr) arr.push(v);
  }
  return (
    <div className="space-y-4">
      {order.map((state) => {
        const arr = byState.get(state) ?? [];
        if (arr.length === 0) return null;
        return (
          <div key={state}>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                {VENDOR_STATE_LABEL[state]}
              </div>
              <div className="text-[10.5px] text-neutral-600">· {arr.length}</div>
            </div>
            <EntityTable>
              {arr.map((v) => (
                <EntityRow
                  key={v.id}
                  title={v.name}
                  subtitle={v.service}
                  meta={
                    typeof v.monthly_cost_eur === "number"
                      ? formatEUR(v.monthly_cost_eur)
                      : "—"
                  }
                  tone={VENDOR_STATE_TONE[v.state]}
                  selected={selectedId === v.id}
                  onClick={() => onSelect(v)}
                />
              ))}
            </EntityTable>
          </div>
        );
      })}
    </div>
  );
}

export function SubscriptionRows({
  vendors,
  onSelect,
}: {
  vendors: VendorItem[];
  onSelect: (v: VendorItem) => void;
}) {
  const recurring = vendors.filter((v) => v.state === "recurring");
  return (
    <SimplePanel title="Recurring subscriptions" hint="o que sai todo mês">
      {recurring.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">
          nenhuma assinatura recorrente.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {recurring.map((v) => (
            <li key={v.id}>
              <button
                type="button"
                onClick={() => onSelect(v)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <StatusDot tone="info" />
                <span className="text-neutral-100 truncate">{v.name}</span>
                <span className="text-neutral-500 text-[10.5px]">
                  · {v.service}
                </span>
                <span className="ml-auto text-neutral-300 font-mono tabular-nums text-[10.5px]">
                  {typeof v.monthly_cost_eur === "number"
                    ? formatEUR(v.monthly_cost_eur) + "/m"
                    : "—"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function ContractLinks({
  vendor,
  legal,
  onSelect,
}: {
  vendor: VendorItem;
  legal: LegalRecord[];
  onSelect: (l: LegalRecord) => void;
}) {
  const linked = legal.filter((l) => (vendor.contract_ids ?? []).includes(l.id));
  return (
    <SimplePanel title="Contracts" hint="contratos vinculados ao vendor">
      {linked.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">sem contrato registrado.</div>
      ) : (
        <ul className="space-y-1.5">
          {linked.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => onSelect(l)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <StatusDot tone="info" />
                <span className="text-neutral-100 truncate">{l.title}</span>
                <span className="text-neutral-500 text-[10.5px]">· {l.kind}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function PaymentStatus({ vendor }: { vendor: VendorItem }) {
  if (!vendor.payment_status) {
    return (
      <SimplePanel title="Payment" hint="estado financeiro do vendor">
        <div className="text-[11.5px] text-neutral-500">
          sem informação financeira.
        </div>
      </SimplePanel>
    );
  }
  const tone = VENDOR_PAYMENT_TONE[vendor.payment_status];
  const label =
    vendor.payment_status === "missing_invoice"
      ? "fatura ausente"
      : vendor.payment_status;
  return (
    <SimplePanel title="Payment" hint="estado financeiro do vendor">
      <div className="space-y-2 text-[11.5px] text-neutral-300">
        <div className="flex items-center gap-2">
          <StatusDot tone={tone} />
          <StatusPill tone={tone}>{label}</StatusPill>
          <span className="ml-auto text-neutral-500 font-mono text-[10.5px]">
            {vendor.last_payment_at ?? "—"}
          </span>
        </div>
        {typeof vendor.monthly_cost_eur === "number" && (
          <div className="text-[10.5px] text-neutral-500">
            custo mensal estimado · {formatEUR(vendor.monthly_cost_eur)}
          </div>
        )}
      </div>
    </SimplePanel>
  );
}

export function ContactInfo({ vendor }: { vendor: VendorItem }) {
  const c = vendor.contact;
  return (
    <SimplePanel title="Contact" hint="pontos de contato">
      {!c ? (
        <div className="text-[11.5px] text-neutral-500">sem contato registrado.</div>
      ) : (
        <KeyValueList
          items={[
            { label: "name", value: c.name ?? "—" },
            { label: "email", value: c.email ?? "—" },
            { label: "phone", value: c.phone ?? "—" },
            { label: "site", value: c.site ?? "—" },
          ]}
        />
      )}
    </SimplePanel>
  );
}

/* ─── Wave 5b · Legal ─────────────────────────────────────────────────── */

const LEGAL_KIND_LABEL: Record<LegalKind, string> = {
  contract: "Contract",
  obligation: "Obligation",
  lease: "Lease",
  policy: "Policy",
  compliance: "Compliance",
  license: "License",
  correspondence: "Correspondence",
};

const LEGAL_RISK_TONE: Record<LegalRiskLevel, StatusTone> = {
  low: "ok",
  medium: "info",
  high: "warn",
  critical: "bad",
};

export function RiskBadges({ risk }: { risk?: LegalRiskLevel }) {
  if (!risk) return <span className="text-neutral-500 text-[10.5px]">—</span>;
  return <StatusPill tone={LEGAL_RISK_TONE[risk]}>{risk}</StatusPill>;
}

export function LegalObligationRows({
  records,
  selectedId,
  onSelect,
}: {
  records: LegalRecord[];
  selectedId?: string;
  onSelect: (r: LegalRecord) => void;
}) {
  // Obligations + leases + compliance — anything with a next_obligation.
  const rows = records.filter((r) => r.next_obligation && r.next_obligation !== "—");
  return (
    <SimplePanel title="Obligations" hint="prazos a cumprir">
      {rows.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">
          nenhuma obrigação ativa registrada.
        </div>
      ) : (
        <EntityTable>
          {rows.map((r) => (
            <EntityRow
              key={r.id}
              title={r.title}
              subtitle={`${LEGAL_KIND_LABEL[r.kind]} · ${r.next_obligation}`}
              meta={r.end_at ?? r.start_at ?? "—"}
              tone={
                r.risk
                  ? LEGAL_RISK_TONE[r.risk]
                  : r.status === "expiring"
                    ? "warn"
                    : "info"
              }
              selected={selectedId === r.id}
              onClick={() => onSelect(r)}
            />
          ))}
        </EntityTable>
      )}
    </SimplePanel>
  );
}

export function ContractCards({
  records,
  selectedId,
  onSelect,
}: {
  records: LegalRecord[];
  selectedId?: string;
  onSelect: (r: LegalRecord) => void;
}) {
  const contracts = records.filter(
    (r) => r.kind === "contract" || r.kind === "lease" || r.kind === "license"
  );
  if (contracts.length === 0) {
    return (
      <SimplePanel title="Contracts" hint="contratos em vigor ou rascunho">
        <div className="text-[11.5px] text-neutral-500">sem contratos.</div>
      </SimplePanel>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {contracts.map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => onSelect(r)}
          className={cn(
            "w-full text-left rounded-lg border bg-white/[0.03] p-3 space-y-2 transition-colors",
            selectedId === r.id
              ? "border-blue-500/60 bg-white/[0.05]"
              : "border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="text-[12px] text-neutral-100 line-clamp-2 leading-snug">
              {r.title}
            </div>
            <RiskBadges risk={r.risk} />
          </div>
          <div className="text-[10.5px] text-neutral-500">
            {LEGAL_KIND_LABEL[r.kind]} · {r.status}
          </div>
          {(r.start_at || r.end_at) && (
            <div className="text-[10.5px] text-neutral-500 font-mono">
              {r.start_at ?? "—"} → {r.end_at ?? "—"}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

export function OfficialAddressCard({ addresses }: { addresses: AddressItem[] }) {
  return (
    <SimplePanel title="Official addresses" hint="endereço comercial e endereço físico do LAB">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {addresses.map((a) => (
          <div
            key={a.id}
            className="rounded-md border border-white/10 bg-white/[0.03] p-3 space-y-1"
          >
            <div className="text-[10px] uppercase tracking-wider text-neutral-500">
              {a.label}
            </div>
            <div className="text-[11.5px] text-neutral-100 font-mono leading-snug">
              {a.lines.map((line) => (
                <div key={line}>{line}</div>
              ))}
              <div className="text-neutral-400">{a.country}</div>
            </div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
              purpose · {a.purpose.replace("_", " ")}
            </div>
          </div>
        ))}
      </div>
    </SimplePanel>
  );
}

/* ─── Wave 6a · Human ─────────────────────────────────────────────────── */

const CARE_STATUS_TONE: Record<CareStatus, StatusTone> = {
  ok: "ok",
  due: "info",
  missing: "warn",
  ghost: "ghost",
};

const CARE_GROUP_LABEL: Record<CareGroup, string> = {
  hydration: "Hydration",
  food: "Food",
  hygiene: "Hygiene",
  mental: "Mental",
  social: "Social",
  peace: "Peace",
};

export function CareChecklist({
  items,
  onSelect,
  group,
}: {
  items: CareItem[];
  onSelect: (it: CareItem) => void;
  group?: CareGroup;
}) {
  const filtered = group ? items.filter((i) => i.group === group) : items;
  if (filtered.length === 0) {
    return (
      <div className="text-[11.5px] text-neutral-500">nada listado neste grupo.</div>
    );
  }
  // If filtering by group, render bare list. Else group by group label.
  if (group) {
    return (
      <ul className="space-y-1.5">
        {filtered.map((it) => (
          <li key={it.id}>
            <button
              type="button"
              onClick={() => onSelect(it)}
              className="w-full text-left rounded-md hover:bg-white/[0.03] -mx-1 px-1 py-1 transition-colors"
            >
              <div className="flex items-center gap-2 text-[11.5px]">
                <StatusDot tone={CARE_STATUS_TONE[it.status]} />
                <span className="text-neutral-100 truncate">{it.title}</span>
                <span className="ml-auto text-[10.5px] text-neutral-500">
                  {it.status === "ok"
                    ? "ok"
                    : it.status === "due"
                      ? "pendente"
                      : it.status === "missing"
                        ? "faltou"
                        : "ghost"}
                </span>
              </div>
              <div className="ml-4 text-[10.5px] text-neutral-500 line-clamp-1">
                {it.observed ?? it.expected}
              </div>
            </button>
          </li>
        ))}
      </ul>
    );
  }
  const groups = new Map<CareGroup, CareItem[]>();
  for (const it of filtered) {
    const arr = groups.get(it.group) ?? [];
    arr.push(it);
    groups.set(it.group, arr);
  }
  return (
    <div className="space-y-3">
      {[...groups.entries()].map(([g, list]) => (
        <SimplePanel key={g} title={CARE_GROUP_LABEL[g]}>
          <CareChecklist items={list} onSelect={onSelect} group={g} />
        </SimplePanel>
      ))}
    </div>
  );
}

export function HumanCheckInCard({
  checkins,
}: {
  checkins: HumanCheckIn[];
}) {
  return (
    <SimplePanel title="Check-in humano" hint="presença observada · sem cobrança">
      {checkins.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">sem check-ins.</div>
      ) : (
        <ul className="space-y-1.5">
          {checkins.map((c) => (
            <li key={c.id} className="flex items-center gap-2 text-[11.5px]">
              <StatusDot
                tone={
                  c.status === "confirmed"
                    ? "ok"
                    : c.status === "missing"
                      ? "warn"
                      : "ghost"
                }
              />
              <span className="text-neutral-100">{c.who}</span>
              <span className="ml-auto text-neutral-500 font-mono text-[10.5px]">
                {c.when ?? "—"}
              </span>
              <StatusPill
                tone={
                  c.status === "confirmed"
                    ? "ok"
                    : c.status === "missing"
                      ? "warn"
                      : "ghost"
                }
              >
                {c.status}
              </StatusPill>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

const ALERT_TONE: Record<GentleAlertItem["tone"], StatusTone> = {
  info: "info",
  soft_warn: "warn",
  soft_bad: "warn",
};

export function GentleAlerts({ alerts }: { alerts: GentleAlertItem[] }) {
  if (alerts.length === 0) {
    return (
      <SimplePanel title="Gentle alerts" hint="tom calmo · sem alarmismo">
        <div className="text-[11.5px] text-emerald-300/90">nenhum alerta agora.</div>
      </SimplePanel>
    );
  }
  return (
    <SimplePanel title="Gentle alerts" hint="tom calmo · sem alarmismo">
      <ul className="space-y-2">
        {alerts.map((a) => (
          <li
            key={a.id}
            className="rounded-md border border-white/10 bg-white/[0.03] p-2 space-y-1"
          >
            <div className="flex items-center gap-2 text-[11.5px]">
              <StatusDot tone={ALERT_TONE[a.tone]} />
              <span className="text-neutral-100">{a.message}</span>
            </div>
            {a.suggestion && (
              <div className="ml-4 text-[10.5px] text-neutral-500">
                {a.suggestion}
              </div>
            )}
          </li>
        ))}
      </ul>
    </SimplePanel>
  );
}

const SUPPLY_NEED_TONE: Record<SupplyNeed["status"], StatusTone> = {
  stocked: "ok",
  low: "warn",
  missing: "bad",
};

export function SupplyNeeds({ needs }: { needs: SupplyNeed[] }) {
  return (
    <SimplePanel title="Supply needs" hint="o que pode acabar antes da hora">
      {needs.length === 0 ? (
        <div className="text-[11.5px] text-emerald-300/90">
          tudo em estoque humano básico.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {needs.map((n) => (
            <li key={n.id} className="flex items-center gap-2 text-[11.5px]">
              <StatusDot tone={SUPPLY_NEED_TONE[n.status]} />
              <span className="text-neutral-100 truncate">{n.what}</span>
              <span className="text-neutral-500 text-[10.5px]">· {n.category}</span>
              {n.needed_by && (
                <span className="ml-auto text-neutral-500 font-mono text-[10.5px]">
                  {n.needed_by}
                </span>
              )}
              <StatusPill tone={SUPPLY_NEED_TONE[n.status]}>{n.status}</StatusPill>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function RoutineQuality({ items }: { items: CareItem[] }) {
  const total = items.length;
  const ok = items.filter((i) => i.status === "ok").length;
  const due = items.filter((i) => i.status === "due").length;
  const missing = items.filter((i) => i.status === "missing").length;
  const ghost = items.filter((i) => i.status === "ghost").length;
  const score = total === 0 ? 0 : Math.round((ok / total) * 100);
  return (
    <SimplePanel
      title="Routine quality"
      hint="observação calma · sem cobrança"
    >
      <div className="grid grid-cols-4 gap-3">
        <MetricCard
          label="Score"
          value={`${score}%`}
          tone={score >= 70 ? "good" : "default"}
        />
        <MetricCard label="OK" value={ok} tone="good" />
        <MetricCard label="Pendentes" value={due} />
        <MetricCard
          label="Faltou / ghost"
          value={missing + ghost}
          tone={missing + ghost > 0 ? "warn" : "default"}
        />
      </div>
    </SimplePanel>
  );
}

/* ─── Wave 6a · Santo Andre ───────────────────────────────────────────── */

const ASSET_STATE_TONE: Record<AssetState, StatusTone> = {
  ok: "ok",
  needs_maintenance: "warn",
  broken: "bad",
  missing: "warn",
};

const ASSET_STATE_LABEL: Record<AssetState, string> = {
  ok: "ok",
  needs_maintenance: "needs maintenance",
  broken: "broken",
  missing: "missing",
};

export function PhysicalAssetList({
  assets,
  selectedId,
  onSelect,
}: {
  assets: PhysicalAsset[];
  selectedId?: string;
  onSelect: (a: PhysicalAsset) => void;
}) {
  return (
    <EntityTable>
      {assets.map((a) => (
        <EntityRow
          key={a.id}
          title={a.name}
          subtitle={`${a.kind} · ${a.location}`}
          meta={a.last_check ?? "—"}
          tone={ASSET_STATE_TONE[a.state]}
          selected={selectedId === a.id}
          onClick={() => onSelect(a)}
        />
      ))}
    </EntityTable>
  );
}

const MAINT_STATUS_TONE: Record<MaintenanceTask["status"], StatusTone> = {
  scheduled: "info",
  in_progress: "warn",
  done: "ok",
  ghost: "ghost",
};

export function MaintenanceTaskRows({
  tasks,
  onSelect,
}: {
  tasks: MaintenanceTask[];
  onSelect: (t: MaintenanceTask) => void;
}) {
  return (
    <SimplePanel title="Maintenance" hint="manutenção pendente, em curso e fechada">
      {tasks.length === 0 ? (
        <div className="text-[11.5px] text-emerald-300/90">
          sem manutenção pendente.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {tasks.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onSelect(t)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <StatusDot tone={MAINT_STATUS_TONE[t.status]} />
                <span className="text-neutral-100 truncate">{t.title}</span>
                <span className="ml-auto text-neutral-500 font-mono text-[10.5px]">
                  {t.due_at ?? "—"}
                </span>
                <StatusPill tone={MAINT_STATUS_TONE[t.status]}>
                  {t.status}
                </StatusPill>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

const CLEAN_STATUS_TONE: Record<CleaningEntry["status"], StatusTone> = {
  done: "ok",
  due: "info",
  missed: "warn",
  ghost: "ghost",
};

export function CleaningSchedule({
  entries,
  onSelect,
}: {
  entries: CleaningEntry[];
  onSelect: (c: CleaningEntry) => void;
}) {
  return (
    <SimplePanel title="Cleaning schedule" hint="cadências diárias, semanais e mensais">
      {entries.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">sem rotinas registradas.</div>
      ) : (
        <ul className="space-y-1.5">
          {entries.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <StatusDot tone={CLEAN_STATUS_TONE[c.status]} />
                <span className="text-neutral-100 truncate">{c.area}</span>
                <span className="text-neutral-500 text-[10.5px]">· {c.cadence}</span>
                <span className="ml-auto text-neutral-500 font-mono text-[10.5px]">
                  next · {c.next_due ?? "—"}
                </span>
                <StatusPill tone={CLEAN_STATUS_TONE[c.status]}>{c.status}</StatusPill>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

const SUPPLY_STATE_TONE = {
  stocked: "ok" as StatusTone,
  low: "warn" as StatusTone,
  missing: "bad" as StatusTone,
};

export function SupplyList({ supplies }: { supplies: SupplyEntry[] }) {
  return (
    <SimplePanel title="Supply list" hint="suprimentos físicos do LAB">
      {supplies.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">vazio.</div>
      ) : (
        <ul className="space-y-1.5">
          {supplies.map((s) => (
            <li key={s.id} className="flex items-center gap-2 text-[11.5px]">
              <StatusDot tone={SUPPLY_STATE_TONE[s.state]} />
              <span className="text-neutral-100 truncate">{s.name}</span>
              <span className="text-neutral-500 text-[10.5px]">· {s.category}</span>
              <StatusPill tone={SUPPLY_STATE_TONE[s.state]}>{s.state}</StatusPill>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

const OBS_TONE: Record<SpaceObservation["tone"], StatusTone> = {
  info: "info",
  warn: "warn",
  bad: "bad",
};

export function SpaceObservationFeed({
  observations,
}: {
  observations: SpaceObservation[];
}) {
  const sorted = [...observations].sort((a, b) => b.when.localeCompare(a.when));
  return (
    <SimplePanel title="Observation feed" hint="o que foi visto no espaço">
      {sorted.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">sem observações.</div>
      ) : (
        <ul className="space-y-2">
          {sorted.map((o) => (
            <li key={o.id} className="text-[11.5px]">
              <div className="flex items-center gap-2 text-[10.5px] text-neutral-500 font-mono">
                <StatusDot tone={OBS_TONE[o.tone]} />
                <span>{o.when}</span>
                <span>· {o.area}</span>
              </div>
              <div className="ml-4 text-neutral-200 line-clamp-2">
                {o.message}
              </div>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

const ENFORCEMENT_TONE: Record<EnforcementRule["status"], StatusTone> = {
  active: "ok",
  draft: "info",
  violated: "warn",
};

export function EnforcementPanel({
  rules,
}: {
  rules: EnforcementRule[];
}) {
  return (
    <SimplePanel title="Enforcement" hint="regras físicas observadas">
      {rules.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">sem regras registradas.</div>
      ) : (
        <ul className="space-y-1.5">
          {rules.map((r) => (
            <li key={r.id} className="text-[11.5px]">
              <div className="flex items-center gap-2">
                <StatusDot tone={ENFORCEMENT_TONE[r.status]} />
                <span className="text-neutral-100 truncate">{r.rule}</span>
                <StatusPill tone={ENFORCEMENT_TONE[r.status]}>{r.status}</StatusPill>
              </div>
              {r.last_violation_at && (
                <div className="ml-4 text-[10.5px] text-neutral-500 font-mono">
                  última violação · {r.last_violation_at}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

/* ─── Wave 6a · Runtimes ──────────────────────────────────────────────── */

const RUNTIME_STATE_TONE: Record<RuntimeState, StatusTone> = {
  running: "ok",
  installed: "info",
  needs_update: "warn",
  broken: "bad",
  planned: "muted",
};

const RUNTIME_STATE_LABEL: Record<RuntimeState, string> = {
  running: "Running",
  installed: "Installed",
  needs_update: "Needs update",
  broken: "Broken",
  planned: "Planned",
};

export function VersionBadges({
  runtime,
}: {
  runtime: RuntimeRecord;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-[10.5px] text-neutral-300">
        v{runtime.version}
      </span>
      {runtime.critical && <StatusPill tone="info">critical</StatusPill>}
    </div>
  );
}

export function InstallStatus({
  runtime,
}: {
  runtime: RuntimeRecord;
}) {
  return (
    <StatusPill tone={RUNTIME_STATE_TONE[runtime.state]}>
      {RUNTIME_STATE_LABEL[runtime.state]}
    </StatusPill>
  );
}

export function RuntimeRows({
  runtimes,
  selectedId,
  onSelect,
  groupBy = "state",
}: {
  runtimes: RuntimeRecord[];
  selectedId?: string;
  onSelect: (r: RuntimeRecord) => void;
  groupBy?: "state" | "machine" | "none";
}) {
  if (groupBy === "none") {
    return (
      <EntityTable>
        {runtimes.map((r) => (
          <EntityRow
            key={r.id}
            title={r.name}
            subtitle={`v${r.version}${r.machine_id ? " · " + r.machine_id : ""}`}
            meta={r.last_used_at ?? "—"}
            tone={RUNTIME_STATE_TONE[r.state]}
            selected={selectedId === r.id}
            onClick={() => onSelect(r)}
          />
        ))}
      </EntityTable>
    );
  }
  if (groupBy === "machine") {
    const byMachine = new Map<string, RuntimeRecord[]>();
    for (const r of runtimes) {
      const key = r.machine_id ?? "—";
      const arr = byMachine.get(key) ?? [];
      arr.push(r);
      byMachine.set(key, arr);
    }
    return (
      <div className="space-y-4">
        {[...byMachine.entries()].map(([machine, arr]) => (
          <div key={machine}>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                {machine === "—" ? "sem máquina" : machine}
              </div>
              <div className="text-[10.5px] text-neutral-600">· {arr.length}</div>
            </div>
            <RuntimeRows
              runtimes={arr}
              selectedId={selectedId}
              onSelect={onSelect}
              groupBy="none"
            />
          </div>
        ))}
      </div>
    );
  }
  // by state
  const order: RuntimeState[] = [
    "running",
    "installed",
    "needs_update",
    "broken",
    "planned",
  ];
  const byState = new Map<RuntimeState, RuntimeRecord[]>();
  for (const s of order) byState.set(s, []);
  for (const r of runtimes) {
    const arr = byState.get(r.state);
    if (arr) arr.push(r);
  }
  return (
    <div className="space-y-4">
      {order.map((state) => {
        const arr = byState.get(state) ?? [];
        if (arr.length === 0) return null;
        return (
          <div key={state}>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                {RUNTIME_STATE_LABEL[state]}
              </div>
              <div className="text-[10.5px] text-neutral-600">· {arr.length}</div>
            </div>
            <RuntimeRows
              runtimes={arr}
              selectedId={selectedId}
              onSelect={onSelect}
              groupBy="none"
            />
          </div>
        );
      })}
    </div>
  );
}

const HEALTH_TONE: Record<RuntimeHealthSignal["status"], StatusTone> = {
  ok: "ok",
  warn: "warn",
  bad: "bad",
  unknown: "muted",
};

export function RuntimeHealth({
  runtime,
}: {
  runtime: RuntimeRecord;
}) {
  const signals = runtime.health ?? [];
  return (
    <SimplePanel title="Runtime health" hint="sinais observados">
      {signals.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">
          sem sinais coletados.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {signals.map((h) => (
            <li key={h.label} className="flex items-center gap-2 text-[11.5px]">
              <StatusDot tone={HEALTH_TONE[h.status]} />
              <span className="text-neutral-100">{h.label}</span>
              {h.detail && (
                <span className="text-neutral-500 text-[10.5px]">· {h.detail}</span>
              )}
              <span className="ml-auto text-[10.5px] text-neutral-500">
                {h.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function ConfigGroups({
  runtime,
}: {
  runtime: RuntimeRecord;
}) {
  const groups = runtime.config_groups ?? [];
  return (
    <SimplePanel title="Config" hint="configuração observada · segredos só como referência">
      {groups.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">
          sem configuração declarada.
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((g) => (
            <div key={g.label}>
              <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                {g.label}
              </div>
              <ul className="space-y-1">
                {g.entries.map((e) => (
                  <li
                    key={e.key}
                    className="grid grid-cols-[120px_1fr] gap-3 text-[11.5px]"
                  >
                    <span className="text-neutral-500 font-mono text-[10.5px]">
                      {e.key}
                    </span>
                    <span
                      className={cn(
                        "text-neutral-200 font-mono text-[10.5px]",
                        e.secret_ref && "text-amber-200/90"
                      )}
                    >
                      {e.secret_ref ? "[secret ref]" : e.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </SimplePanel>
  );
}

/* ─── Wave 6a · Agents (extras) ───────────────────────────────────────── */

const AGENT_STATUS_LABEL: Record<Agent["status"], string> = {
  present: "Present",
  absent: "Absent",
  degraded: "Degraded",
  paused: "Paused",
  scheduled: "Scheduled",
  ghost: "Ghost",
};

export function AttendanceStatus({
  agents,
}: {
  agents: Agent[];
}) {
  const counts: Record<Agent["status"], number> = {
    present: 0,
    absent: 0,
    degraded: 0,
    paused: 0,
    scheduled: 0,
    ghost: 0,
  };
  for (const a of agents) counts[a.status] += 1;
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {(Object.keys(counts) as Agent["status"][]).map((s) => (
        <MetricCard
          key={s}
          label={AGENT_STATUS_LABEL[s]}
          value={counts[s]}
          tone={
            s === "present"
              ? "good"
              : s === "absent" || s === "degraded" || s === "ghost"
                ? "warn"
                : "default"
          }
        />
      ))}
    </div>
  );
}

export function AgentList({
  agents,
  selectedId,
  onSelect,
  groupByStatus = true,
}: {
  agents: Agent[];
  selectedId?: string;
  onSelect: (a: Agent) => void;
  groupByStatus?: boolean;
}) {
  function row(a: Agent) {
    return (
      <EntityRow
        key={a.id}
        title={a.name}
        subtitle={`${a.role}${a.llm_id ? " · " + a.llm_id : ""}`}
        meta={a.last_check_in ?? "—"}
        tone={AGENT_TONE[a.status]}
        selected={selectedId === a.id}
        onClick={() => onSelect(a)}
      />
    );
  }
  if (!groupByStatus) {
    return <EntityTable>{agents.map(row)}</EntityTable>;
  }
  const order: Agent["status"][] = [
    "present",
    "scheduled",
    "degraded",
    "paused",
    "absent",
    "ghost",
  ];
  const byStatus = new Map<Agent["status"], Agent[]>();
  for (const s of order) byStatus.set(s, []);
  for (const a of agents) {
    const arr = byStatus.get(a.status);
    if (arr) arr.push(a);
  }
  return (
    <div className="space-y-4">
      {order.map((s) => {
        const arr = byStatus.get(s) ?? [];
        if (arr.length === 0) return null;
        return (
          <div key={s}>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                {AGENT_STATUS_LABEL[s]}
              </div>
              <div className="text-[10.5px] text-neutral-600">· {arr.length}</div>
            </div>
            <EntityTable>{arr.map(row)}</EntityTable>
          </div>
        );
      })}
    </div>
  );
}

export function AssignedWorkflows({
  agent,
  schedules,
  onSelect,
}: {
  agent: Agent;
  schedules: Schedule[];
  onSelect: (s: Schedule) => void;
}) {
  const linked = schedules.filter((s) =>
    (agent.assigned_workflows ?? []).includes(s.id)
  );
  return (
    <SimplePanel title="Assigned workflows" hint="schedules vinculados ao agente">
      {linked.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">
          sem workflows atribuídos.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {linked.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(s)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <StatusDot tone="info" />
                <span className="text-neutral-200 truncate">{s.title}</span>
                <span className="text-neutral-500 text-[10.5px]">
                  · {s.cadence}
                </span>
                <span className="ml-auto text-neutral-500 font-mono text-[10.5px]">
                  {s.next_run ?? "—"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function PermissionSummary({ agent }: { agent: Agent }) {
  const perms = agent.permissions ?? [];
  return (
    <SimplePanel title="Permissions" hint="o que o agente pode fazer">
      {perms.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">
          sem permissões declaradas.
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {perms.map((p) => (
            <span
              key={p}
              className="h-6 inline-flex items-center px-2 rounded text-[10.5px] border border-white/10 bg-white/[0.03] text-neutral-300 font-mono"
            >
              {p}
            </span>
          ))}
        </div>
      )}
    </SimplePanel>
  );
}

const AGENT_RUN_TONE: Record<AgentRun["status"], StatusTone> = {
  ok: "ok",
  warn: "warn",
  bad: "bad",
  ghost: "ghost",
};

export function AgentRunHistory({
  agent,
  onSelectReceipt,
  onSelectGhost,
}: {
  agent: Agent;
  onSelectReceipt?: (id: string) => void;
  onSelectGhost?: (id: string) => void;
}) {
  const runs = agent.recent_runs ?? [];
  return (
    <SimplePanel title="Recent runs" hint="últimas ações observadas">
      {runs.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">
          sem ações recentes.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {runs.map((r) => (
            <li key={r.id} className="text-[11.5px]">
              <div className="flex items-center gap-2">
                <StatusDot tone={AGENT_RUN_TONE[r.status]} />
                <span className="text-neutral-500 font-mono text-[10.5px]">
                  {r.when}
                </span>
                <span className="text-neutral-100 truncate">{r.what}</span>
              </div>
              <div className="ml-4 flex items-center gap-2 text-[10.5px]">
                {r.receipt_id && (
                  <button
                    type="button"
                    onClick={() => onSelectReceipt?.(r.receipt_id!)}
                    className="text-emerald-300/90 hover:text-emerald-200 transition-colors"
                  >
                    → {r.receipt_id}
                  </button>
                )}
                {r.ghost_id && (
                  <button
                    type="button"
                    onClick={() => onSelectGhost?.(r.ghost_id!)}
                    className="text-violet-300/90 hover:text-violet-200 transition-colors"
                  >
                    → {r.ghost_id}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}

export function CorrespondenceLog({
  items,
  onSelect,
}: {
  items: CorrespondenceItem[];
  onSelect?: (it: CorrespondenceItem) => void;
}) {
  const sorted = [...items].sort((a, b) => b.when.localeCompare(a.when));
  return (
    <SimplePanel title="Correspondence" hint="histórico seco, auditável">
      {sorted.length === 0 ? (
        <div className="text-[11.5px] text-neutral-500">sem correspondência.</div>
      ) : (
        <ul className="space-y-2">
          {sorted.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => onSelect?.(it)}
                className="w-full text-left rounded-md hover:bg-white/[0.03] -mx-1 px-1 py-1 transition-colors"
              >
                <div className="flex items-center gap-2 text-[10.5px] text-neutral-500 font-mono">
                  <span>{it.when}</span>
                  <span>· {it.channel}</span>
                  <span className="text-neutral-400 truncate">· {it.party}</span>
                </div>
                <div className="text-[11.5px] text-neutral-100 line-clamp-1">
                  {it.subject}
                </div>
                <div className="text-[10.5px] text-neutral-500 line-clamp-2">
                  {it.summary}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </SimplePanel>
  );
}
