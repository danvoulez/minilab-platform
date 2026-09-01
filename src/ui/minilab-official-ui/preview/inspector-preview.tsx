import { EntityPreview } from "./entity-preview";
import { GhostPreview } from "./ghost-preview";
import { ReceiptPreview } from "./receipt-preview";
import { JsonPreview } from "./json-preview";
import { RegistryAdmissionPreview, type RegistryAdmissionPreviewPayload } from "./registry-admission-preview";
import { RegistryProviderPreview } from "./registry-provider-preview";
import type { RegistryEntityDetail } from "../lib/registry-api";
import { PreviewHeader } from "./preview-header";
import type {
  Agent,
  CostRecord,
  DocumentItem,
  GateDecisionRecord,
  Ghost,
  KnowledgeItem,
  LLMItem,
  LegalRecord,
  Machine,
  PolicyItem,
  PreviewTarget,
  Receipt,
  RegistryEntity,
  RuntimeRecord,
  RuntimeState,
  Sensor,
  VendorItem,
  Workorder,
  WorkorderState,
} from "../types";
import { StatusPill, type StatusTone } from "../components/status";
import { EvidenceBlock } from "../evidence/evidence-block";
import { GateDecisionCard } from "../evidence/cards";
import { MinilabMarkdown } from "../components/domain-composition";

export function InspectorPreview({
  target,
  onClose,
}: {
  target: PreviewTarget | null;
  onClose: () => void;
}) {
  if (!target) {
    return (
      <div className="p-6 text-[11.5px] text-neutral-500">
        Selecione um item no painel central para inspecionar aqui.
      </div>
    );
  }

  switch (target.kind) {
    case "entity":
      return (
        <EntityPreview
          entity={target.payload as RegistryEntity}
          onClose={onClose}
        />
      );
    case "ghost":
      return <GhostPreview ghost={target.payload as Ghost} onClose={onClose} />;
    case "receipt":
      return (
        <ReceiptPreview
          receipt={target.payload as Receipt}
          onClose={onClose}
        />
      );
    case "registry_admission":
      return (
        <RegistryAdmissionPreview
          payload={target.payload as RegistryAdmissionPreviewPayload}
          onClose={onClose}
        />
      );
    case "registry_record":
      return (
        <RegistryProviderPreview
          detail={target.payload as RegistryEntityDetail}
          onClose={onClose}
        />
      );
    case "machine": {
      const m = target.payload as Machine;
      return (
        <div className="flex flex-col">
          <PreviewHeader
            kind="machine"
            title={m.label}
            subtitle={`role · ${m.role}`}
            status={
              <StatusPill tone={m.status === "online" ? "ok" : m.status === "degraded" ? "warn" : "bad"}>
                {m.status}
              </StatusPill>
            }
            onClose={onClose}
          />
          <div className="p-4 space-y-3 text-[11.5px] text-neutral-300">
            <EvidenceBlock
              items={[
                { label: "id", value: m.id, mono: true },
                { label: "wifi", value: m.wifi_status ?? "unknown" },
                { label: "last heartbeat", value: m.last_heartbeat ?? "missing", mono: true },
                { label: "last boot", value: m.last_boot ?? "unknown", mono: true },
                { label: "last access", value: m.last_access ?? "not observed" },
                { label: "current job", value: m.current_job ?? "idle" },
                { label: "efficiency", value: m.efficiency ?? "unknown" },
                { label: "maintenance", value: m.maintenance ?? "none" },
                { label: "security", value: m.security ?? "normal" },
              ]}
            />
            {m.runtimes && m.runtimes.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  runtimes
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {m.runtimes.map((runtime) => (
                    <StatusPill key={runtime} tone="info">{runtime}</StatusPill>
                  ))}
                </div>
              </div>
            )}
            <div className="rounded-md border border-white/10 bg-black/20 p-3 text-[10.5px] text-neutral-500">
              Ações protegidas requerem gate. Esta UI observa; não executa.
            </div>
          </div>
        </div>
      );
    }
    case "sensor": {
      const s = target.payload as Sensor;
      const tone =
        s.status === "ok" || s.status === "alive"
          ? "ok"
          : s.status === "alert" || s.status === "ghost"
            ? "bad"
            : s.status === "unregistered"
              ? "info"
              : "warn";
      return (
        <div className="flex flex-col">
          <PreviewHeader
            kind="sensor"
            title={s.name}
            subtitle={`kind · ${s.kind}`}
            status={<StatusPill tone={tone}>{s.status}</StatusPill>}
            actions={
              <>
                <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-blue-500/15 ring-1 ring-inset ring-blue-500/40 text-blue-200 hover:bg-blue-500/25">
                  Add to Registry
                </button>
                <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-white/[0.04] ring-1 ring-inset ring-white/10 text-neutral-300 hover:bg-white/[0.08]">
                  Sync now
                </button>
              </>
            }
            onClose={onClose}
          />
          <div className="p-4 space-y-3 text-[11.5px] text-neutral-300">
            <EvidenceBlock
              items={[
                { label: "source", value: s.source ?? "unknown" },
                { label: "registry", value: s.registry_status ?? "unknown" },
                { label: "sync", value: s.sync_status ?? "unknown" },
                { label: "last sync", value: s.last_sync ?? "never", mono: true },
                { label: "entity", value: s.entity_id ?? "not linked", mono: true },
                { label: "last reading", value: s.last_reading?.value ?? "none" },
                { label: "observed at", value: s.last_reading?.observed_at ?? "—", mono: true },
              ]}
            />
            {s.conclusions && s.conclusions.length > 0 && (
              <div className="rounded-md border border-blue-500/20 bg-blue-500/[0.04] p-3">
                <div className="text-[10px] uppercase tracking-wider text-blue-200/70 mb-1">
                  conclusions
                </div>
                <ul className="space-y-1">
                  {s.conclusions.map((c) => (
                    <li key={c} className="text-blue-100/85">{c}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="text-[10.5px] text-neutral-500">
              Leituras chegam do backend. Conclusões viram candidatos, ghosts ou receipts.
            </div>
          </div>
        </div>
      );
    }
    case "workorder": {
      const w = target.payload as Workorder;
      const tone: StatusTone = WORKORDER_PREVIEW_TONE[w.state];
      return (
        <div className="flex flex-col">
          <PreviewHeader
            kind="workorder"
            title={w.title}
            subtitle={w.scope}
            status={<StatusPill tone={tone}>{w.state.replace("_", " ")}</StatusPill>}
            actions={
              <>
                <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-blue-500/15 ring-1 ring-inset ring-blue-500/40 text-blue-200 hover:bg-blue-500/25">
                  Send to gate
                </button>
                <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-white/[0.04] ring-1 ring-inset ring-white/10 text-neutral-300 hover:bg-white/[0.08]">
                  Refine
                </button>
                <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-violet-500/[0.08] ring-1 ring-inset ring-violet-500/30 text-violet-200 hover:bg-violet-500/[0.15]">
                  Ghost
                </button>
              </>
            }
            onClose={onClose}
          />
          <div className="p-4 space-y-3 text-[11.5px] text-neutral-300">
            <EvidenceBlock
              items={[
                { label: "intent", value: w.intent },
                { label: "scope", value: w.scope, mono: true },
                { label: "authority", value: w.authority ?? "—" },
                { label: "created_at", value: w.created_at, mono: true },
                ...(w.blocked_reason
                  ? [{ label: "blocked", value: w.blocked_reason }]
                  : []),
                ...(w.receipt_id
                  ? [{ label: "receipt", value: w.receipt_id, mono: true }]
                  : []),
                ...(w.ghost_id ? [{ label: "ghost", value: w.ghost_id, mono: true }] : []),
              ]}
            />
            {w.required_evidence && w.required_evidence.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  required evidence
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {w.required_evidence.map((e) => (
                    <span
                      key={e}
                      className="h-6 inline-flex items-center px-2 rounded text-[10.5px] border border-amber-500/30 bg-amber-500/[0.08] text-amber-200"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {w.linked_entities && w.linked_entities.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  linked entities
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {w.linked_entities.map((id) => (
                    <span
                      key={id}
                      className="h-6 inline-flex items-center px-2 rounded text-[10.5px] border border-white/10 bg-white/[0.03] text-neutral-300 font-mono"
                    >
                      {id}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {w.gate_decision && (
              <GateDecisionCard
                scope={w.title}
                decision={w.gate_decision}
                reason={w.gate_reason ?? "—"}
              />
            )}
            <div className="rounded-md border border-white/10 bg-black/20 p-3 text-[10.5px] text-neutral-500">
              Workorder estrutura trabalho. Esta UI observa e propõe; nada
              executa fora de gate.
            </div>
          </div>
        </div>
      );
    }
    case "gate": {
      const d = target.payload as GateDecisionRecord;
      const tone: StatusTone = GATE_PREVIEW_TONE[d.decision];
      return (
        <div className="flex flex-col">
          <PreviewHeader
            kind="gate"
            title={d.scope}
            subtitle={d.policy_id ?? "—"}
            status={<StatusPill tone={tone}>{d.decision.replace("_", " ")}</StatusPill>}
            actions={
              d.decision === "needs_approval" ? (
                <>
                  <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-emerald-500/15 ring-1 ring-inset ring-emerald-500/40 text-emerald-200 hover:bg-emerald-500/25">
                    Approve
                  </button>
                  <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-rose-500/[0.08] ring-1 ring-inset ring-rose-500/30 text-rose-200 hover:bg-rose-500/[0.15]">
                    Deny
                  </button>
                  <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-violet-500/[0.08] ring-1 ring-inset ring-violet-500/30 text-violet-200 hover:bg-violet-500/[0.15]">
                    Ghost
                  </button>
                </>
              ) : undefined
            }
            onClose={onClose}
          />
          <div className="p-4 space-y-3 text-[11.5px] text-neutral-300">
            <EvidenceBlock
              items={[
                { label: "decision", value: d.decision },
                { label: "reason", value: d.reason },
                { label: "policy", value: d.policy_id ?? "—", mono: true },
                { label: "authority", value: d.authority ?? "—" },
                { label: "created_at", value: d.created_at, mono: true },
                ...(d.workorder_id
                  ? [{ label: "workorder", value: d.workorder_id, mono: true }]
                  : []),
              ]}
            />
            {d.evidence && d.evidence.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  evidência
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {d.evidence.map((e) => (
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
            <div className="rounded-md border border-white/10 bg-black/20 p-3 text-[10.5px] text-neutral-500">
              Gate decide admissão. Esta UI mostra a decisão; nada executa
              fora do gate.
            </div>
          </div>
        </div>
      );
    }
    case "document": {
      const d = target.payload as DocumentItem;
      const tone: StatusTone =
        d.status === "official"
          ? "ok"
          : d.status === "review"
            ? "warn"
            : d.status === "deprecated"
              ? "bad"
              : "muted";
      return (
        <div className="flex flex-col">
          <PreviewHeader
            kind="document"
            title={d.title}
            subtitle={`${d.kind} · ${d.domain}`}
            status={<StatusPill tone={tone}>{d.status}</StatusPill>}
            onClose={onClose}
          />
          <div className="p-4 space-y-3 text-[11.5px] text-neutral-300">
            <EvidenceBlock
              items={[
                { label: "kind", value: d.kind },
                { label: "domain", value: d.domain },
                { label: "status", value: d.status },
                ...(d.updated_at
                  ? [{ label: "updated_at", value: d.updated_at, mono: true }]
                  : []),
              ]}
            />
            {d.content ? (
              <MinilabMarkdown content={d.content} />
            ) : (
              <div className="rounded-md border border-white/10 bg-black/20 p-3 text-[10.5px] text-neutral-500">
                conteúdo embarcado ainda não disponível · backend fornecerá.
              </div>
            )}
            <div className="text-[10.5px] text-neutral-500">
              Documento não é registro válido por si. Validade só com LogLine online.
            </div>
          </div>
        </div>
      );
    }
    case "knowledge": {
      const k = target.payload as KnowledgeItem;
      return (
        <div className="flex flex-col">
          <PreviewHeader
            kind="document"
            title={k.title}
            subtitle={`${k.kind} · ${k.domain}`}
            status={k.pinned ? <StatusPill tone="info">pinned</StatusPill> : undefined}
            onClose={onClose}
          />
          <div className="p-4 space-y-3 text-[11.5px] text-neutral-300">
            <div>{k.summary}</div>
            <EvidenceBlock
              items={[
                { label: "kind", value: k.kind },
                { label: "domain", value: k.domain },
                ...(k.source ? [{ label: "source", value: k.source }] : []),
                ...(k.updated_at
                  ? [{ label: "updated_at", value: k.updated_at, mono: true }]
                  : []),
              ]}
            />
            {k.used_by && k.used_by.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  used by
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {k.used_by.map((u) => (
                    <span
                      key={u}
                      className="h-6 inline-flex items-center px-2 rounded text-[10.5px] border border-white/10 bg-white/[0.03] text-neutral-300 font-mono"
                    >
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {k.tags && k.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {k.tags.map((t) => (
                  <StatusPill key={t} tone="muted">{t}</StatusPill>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
    case "llm": {
      const l = target.payload as LLMItem;
      return (
        <div className="flex flex-col">
          <PreviewHeader
            kind="llm"
            title={l.name}
            subtitle={`${l.provider} · ${l.role}`}
            status={<StatusPill tone={l.tier === "premium" ? "warn" : "ok"}>{l.tier}</StatusPill>}
            actions={
              <>
                <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-blue-500/15 ring-1 ring-inset ring-blue-500/40 text-blue-200 hover:bg-blue-500/25">
                  Run benchmark
                </button>
                <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-white/[0.04] ring-1 ring-inset ring-white/10 text-neutral-300 hover:bg-white/[0.08]">
                  Open policy
                </button>
              </>
            }
            onClose={onClose}
          />
          <div className="p-4 space-y-3 text-[11.5px] text-neutral-300">
            <EvidenceBlock
              items={[
                { label: "tier", value: l.tier },
                { label: "role", value: l.role },
                { label: "provider", value: l.provider },
                { label: "cost", value: l.cost_profile ?? "—" },
                { label: "benchmark", value: l.benchmark_status ?? "unknown" },
                { label: "usage today", value: String(l.usage_today ?? 0) },
                ...(l.limits ? [{ label: "limits", value: l.limits }] : []),
              ]}
            />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                capabilities
              </div>
              <div className="flex flex-wrap gap-1.5">
                {l.capabilities.map((c) => (
                  <span
                    key={c}
                    className="h-6 inline-flex items-center px-2 rounded text-[10.5px] border border-white/10 bg-white/[0.03] text-neutral-300 font-mono"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            {l.policy_ids && l.policy_ids.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  policies
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {l.policy_ids.map((p) => (
                    <StatusPill key={p} tone="info">{p}</StatusPill>
                  ))}
                </div>
              </div>
            )}
            <div className="text-[10.5px] text-neutral-500">
              LLM é capacidade, não autoridade. Toda chamada premium passa por gate.
            </div>
          </div>
        </div>
      );
    }
    case "policy": {
      const p = target.payload as PolicyItem;
      const tone: StatusTone =
        p.status === "active"
          ? "ok"
          : p.status === "needs_review"
            ? "warn"
            : p.status === "retired"
              ? "muted"
              : "info";
      return (
        <div className="flex flex-col">
          <PreviewHeader
            kind="policy"
            title={p.name}
            subtitle={p.scope.join(" · ")}
            status={<StatusPill tone={tone}>{p.status.replace("_", " ")}</StatusPill>}
            actions={
              <>
                <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-blue-500/15 ring-1 ring-inset ring-blue-500/40 text-blue-200 hover:bg-blue-500/25">
                  Edit (draft)
                </button>
                <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-white/[0.04] ring-1 ring-inset ring-white/10 text-neutral-300 hover:bg-white/[0.08]">
                  Retire
                </button>
              </>
            }
            onClose={onClose}
          />
          <div className="p-4 space-y-3 text-[11.5px] text-neutral-300">
            <EvidenceBlock
              items={[
                { label: "name", value: p.name, mono: true },
                { label: "status", value: p.status },
                { label: "scope", value: p.scope.join(", ") },
                { label: "rule", value: p.rule_summary },
                ...(p.last_decision
                  ? [{ label: "last decision", value: p.last_decision }]
                  : []),
                ...(p.updated_at
                  ? [{ label: "updated_at", value: p.updated_at, mono: true }]
                  : []),
              ]}
            />
            {p.applies_to && p.applies_to.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  applies to
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.applies_to.map((a) => (
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
            {p.linked_gates && p.linked_gates.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  linked gates
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.linked_gates.map((g) => (
                    <span
                      key={g}
                      className="h-6 inline-flex items-center px-2 rounded text-[10.5px] border border-amber-500/30 bg-amber-500/[0.08] text-amber-200 font-mono"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="rounded-md border border-white/10 bg-black/20 p-3 text-[10.5px] text-neutral-500">
              Policy é regra operável. Esta UI mostra texto e vínculos; aplicação
              acontece via gate.
            </div>
          </div>
        </div>
      );
    }
    case "cost": {
      const c = target.payload as CostRecord;
      return (
        <div className="flex flex-col">
          <PreviewHeader
            kind="cost"
            title={c.cost_object_label}
            subtitle={`${c.cost_object_kind} · ${c.period}`}
            status={
              c.anomaly ? (
                <StatusPill tone="warn">anomaly</StatusPill>
              ) : (
                <StatusPill tone="ok">normal</StatusPill>
              )
            }
            onClose={onClose}
          />
          <div className="p-4 space-y-3 text-[11.5px] text-neutral-300">
            <EvidenceBlock
              items={[
                { label: "amount (eur)", value: String(c.amount_eur), mono: true },
                { label: "period", value: c.period, mono: true },
                { label: "kind", value: c.cost_object_kind },
                { label: "object", value: c.cost_object_label },
                { label: "source", value: c.source },
                ...(typeof c.delta_from_avg_pct === "number"
                  ? [{ label: "delta vs avg", value: `${c.delta_from_avg_pct}%` }]
                  : []),
                ...(c.receipt_id
                  ? [{ label: "receipt", value: c.receipt_id, mono: true }]
                  : []),
                ...(c.ghost_id ? [{ label: "ghost", value: c.ghost_id, mono: true }] : []),
              ]}
            />
            <div className="rounded-md border border-white/10 bg-black/20 p-3 text-[10.5px] text-neutral-500">
              Custo é atribuído a um objeto e a um período. Sem evidência, vira
              ghost.
            </div>
          </div>
        </div>
      );
    }
    case "vendor": {
      const v = target.payload as VendorItem;
      const tone: StatusTone =
        v.state === "active" || v.state === "recurring"
          ? "ok"
          : v.state === "payment_issue"
            ? "bad"
            : "warn";
      return (
        <div className="flex flex-col">
          <PreviewHeader
            kind="vendor"
            title={v.name}
            subtitle={v.service}
            status={<StatusPill tone={tone}>{v.state.replace("_", " ")}</StatusPill>}
            actions={
              <>
                <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-white/[0.04] ring-1 ring-inset ring-white/10 text-neutral-300 hover:bg-white/[0.08]">
                  Open contract
                </button>
                <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-blue-500/15 ring-1 ring-inset ring-blue-500/40 text-blue-200 hover:bg-blue-500/25">
                  Register payment
                </button>
              </>
            }
            onClose={onClose}
          />
          <div className="p-4 space-y-3 text-[11.5px] text-neutral-300">
            <EvidenceBlock
              items={[
                { label: "kind", value: v.kind },
                { label: "service", value: v.service },
                { label: "state", value: v.state },
                ...(typeof v.monthly_cost_eur === "number"
                  ? [{ label: "monthly cost (eur)", value: String(v.monthly_cost_eur) }]
                  : []),
                ...(v.last_payment_at
                  ? [{ label: "last_payment_at", value: v.last_payment_at, mono: true }]
                  : []),
                ...(v.payment_status
                  ? [{ label: "payment", value: v.payment_status }]
                  : []),
                ...(v.contact?.email
                  ? [{ label: "email", value: v.contact.email }]
                  : []),
                ...(v.contact?.phone
                  ? [{ label: "phone", value: v.contact.phone }]
                  : []),
                ...(v.contact?.site
                  ? [{ label: "site", value: v.contact.site }]
                  : []),
              ]}
            />
            {(v.contract_ids?.length || v.document_ids?.length) && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  linked
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(v.contract_ids ?? []).map((c) => (
                    <span
                      key={c}
                      className="h-6 inline-flex items-center px-2 rounded text-[10.5px] border border-white/10 bg-white/[0.03] text-neutral-300 font-mono"
                    >
                      {c}
                    </span>
                  ))}
                  {(v.document_ids ?? []).map((d) => (
                    <span
                      key={d}
                      className="h-6 inline-flex items-center px-2 rounded text-[10.5px] border border-white/10 bg-white/[0.03] text-neutral-300 font-mono"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {(v.receipt_ids?.length || v.ghost_ids?.length) && (
              <div className="rounded-md border border-white/10 bg-black/20 p-3 text-[10.5px] text-neutral-500">
                receipts · {v.receipt_ids?.length ?? 0} · ghosts ·{" "}
                {v.ghost_ids?.length ?? 0}
              </div>
            )}
          </div>
        </div>
      );
    }
    case "legal": {
      const l = target.payload as LegalRecord;
      const tone: StatusTone =
        l.status === "in_force"
          ? "ok"
          : l.status === "expiring"
            ? "warn"
            : l.status === "expired" || l.status === "ghost"
              ? "bad"
              : "muted";
      return (
        <div className="flex flex-col">
          <PreviewHeader
            kind="legal"
            title={l.title}
            subtitle={`${l.kind}${l.vendor_id ? " · " + l.vendor_id : ""}`}
            status={<StatusPill tone={tone}>{l.status}</StatusPill>}
            actions={
              <>
                <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-white/[0.04] ring-1 ring-inset ring-white/10 text-neutral-300 hover:bg-white/[0.08]">
                  Open doc
                </button>
                <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-emerald-500/15 ring-1 ring-inset ring-emerald-500/40 text-emerald-200 hover:bg-emerald-500/25">
                  Mark reviewed
                </button>
              </>
            }
            onClose={onClose}
          />
          <div className="p-4 space-y-3 text-[11.5px] text-neutral-300">
            <EvidenceBlock
              items={[
                { label: "kind", value: l.kind },
                { label: "status", value: l.status },
                ...(l.start_at
                  ? [{ label: "start_at", value: l.start_at, mono: true }]
                  : []),
                ...(l.end_at
                  ? [{ label: "end_at", value: l.end_at, mono: true }]
                  : []),
                ...(l.next_obligation
                  ? [{ label: "next obligation", value: l.next_obligation }]
                  : []),
                ...(l.vendor_id
                  ? [{ label: "vendor", value: l.vendor_id, mono: true }]
                  : []),
                ...(l.document_id
                  ? [{ label: "document", value: l.document_id, mono: true }]
                  : []),
                ...(l.risk ? [{ label: "risk", value: l.risk }] : []),
              ]}
            />
            {l.evidence && l.evidence.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  evidência declarada
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {l.evidence.map((e) => (
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
            <div className="rounded-md border border-white/10 bg-black/20 p-3 text-[10.5px] text-neutral-500">
              Legal é seco e auditável. Obrigação sem prova vira ghost.
            </div>
          </div>
        </div>
      );
    }
    case "runtime": {
      const r = target.payload as RuntimeRecord;
      const tone: StatusTone = RUNTIME_PREVIEW_TONE[r.state];
      return (
        <div className="flex flex-col">
          <PreviewHeader
            kind="runtime"
            title={r.name}
            subtitle={`v${r.version}${r.machine_id ? " · " + r.machine_id : ""}`}
            status={<StatusPill tone={tone}>{r.state.replace("_", " ")}</StatusPill>}
            actions={
              <>
                <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-blue-500/15 ring-1 ring-inset ring-blue-500/40 text-blue-200 hover:bg-blue-500/25">
                  Update (gate)
                </button>
                <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-white/[0.04] ring-1 ring-inset ring-white/10 text-neutral-300 hover:bg-white/[0.08]">
                  Inspect
                </button>
              </>
            }
            onClose={onClose}
          />
          <div className="p-4 space-y-3 text-[11.5px] text-neutral-300">
            <EvidenceBlock
              items={[
                { label: "name", value: r.name, mono: true },
                { label: "version", value: r.version, mono: true },
                { label: "state", value: r.state },
                ...(r.machine_id
                  ? [{ label: "machine", value: r.machine_id, mono: true }]
                  : []),
                ...(r.last_used_at
                  ? [{ label: "last_used_at", value: r.last_used_at, mono: true }]
                  : []),
                ...(r.critical
                  ? [{ label: "critical", value: "yes" }]
                  : []),
              ]}
            />
            {r.health && r.health.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  health signals
                </div>
                <ul className="space-y-1">
                  {r.health.map((h) => (
                    <li
                      key={h.label}
                      className="flex items-center gap-2 text-[11.5px]"
                    >
                      <StatusPill
                        tone={
                          h.status === "ok"
                            ? "ok"
                            : h.status === "warn"
                              ? "warn"
                              : h.status === "bad"
                                ? "bad"
                                : "muted"
                        }
                      >
                        {h.status}
                      </StatusPill>
                      <span className="text-neutral-200">{h.label}</span>
                      {h.detail && (
                        <span className="text-neutral-500 text-[10.5px]">
                          · {h.detail}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {r.dependencies && r.dependencies.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  dependencies
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {r.dependencies.map((d) => (
                    <span
                      key={d}
                      className="h-6 inline-flex items-center px-2 rounded text-[10.5px] border border-white/10 bg-white/[0.03] text-neutral-300 font-mono"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="rounded-md border border-white/10 bg-black/20 p-3 text-[10.5px] text-neutral-500">
              Runtime é infraestrutura executável. Atualização passa por gate +
              checagem de hash assinada.
            </div>
          </div>
        </div>
      );
    }
    case "agent": {
      const a = target.payload as Agent;
      return (
        <div className="flex flex-col">
          <PreviewHeader
            kind="agent"
            title={a.name}
            subtitle={a.role}
            status={
              <StatusPill
                tone={
                  a.status === "present"
                    ? "ok"
                    : a.status === "scheduled" || a.status === "paused"
                      ? "info"
                      : a.status === "ghost"
                        ? "ghost"
                        : "warn"
                }
              >
                {a.status}
              </StatusPill>
            }
            actions={
              <>
                <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-white/[0.04] ring-1 ring-inset ring-white/10 text-neutral-300 hover:bg-white/[0.08]">
                  Pause
                </button>
                <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-blue-500/15 ring-1 ring-inset ring-blue-500/40 text-blue-200 hover:bg-blue-500/25">
                  Assign workflow
                </button>
              </>
            }
            onClose={onClose}
          />
          <div className="p-4 space-y-3 text-[11.5px] text-neutral-300">
            <EvidenceBlock
              items={[
                { label: "role", value: a.role },
                { label: "status", value: a.status },
                ...(a.last_check_in
                  ? [{ label: "last_check_in", value: a.last_check_in, mono: true }]
                  : []),
                ...(a.llm_id ? [{ label: "llm", value: a.llm_id, mono: true }] : []),
                ...(a.runtime_id
                  ? [{ label: "runtime", value: a.runtime_id, mono: true }]
                  : []),
              ]}
            />
            {a.permissions && a.permissions.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  permissions
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {a.permissions.map((p) => (
                    <span
                      key={p}
                      className="h-6 inline-flex items-center px-2 rounded text-[10.5px] border border-white/10 bg-white/[0.03] text-neutral-300 font-mono"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {a.assigned_workflows && a.assigned_workflows.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  assigned workflows
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {a.assigned_workflows.map((w) => (
                    <span
                      key={w}
                      className="h-6 inline-flex items-center px-2 rounded text-[10.5px] border border-white/10 bg-white/[0.03] text-neutral-300 font-mono"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="rounded-md border border-white/10 bg-black/20 p-3 text-[10.5px] text-neutral-500">
              Agent é papel operacional, não LLM. LLM aparece como capacidade do
              agente, não como autoridade.
            </div>
          </div>
        </div>
      );
    }
    case "json":
    default:
      return (
        <div className="flex flex-col">
          <PreviewHeader
            kind="json"
            title={target.title}
            subtitle={target.subtitle}
            onClose={onClose}
          />
          <div className="p-4">
            <JsonPreview value={target.payload ?? null} />
          </div>
        </div>
      );
  }
}

const RUNTIME_PREVIEW_TONE: Record<RuntimeState, StatusTone> = {
  running: "ok",
  installed: "info",
  needs_update: "warn",
  broken: "bad",
  planned: "muted",
};

const GATE_PREVIEW_TONE: Record<GateDecisionRecord["decision"], StatusTone> = {
  ok: "ok",
  denied: "bad",
  needs_approval: "warn",
  ghost: "ghost",
  error: "bad",
};

const WORKORDER_PREVIEW_TONE: Record<WorkorderState, StatusTone> = {
  draft: "muted",
  candidate: "info",
  waiting_approval: "warn",
  running: "info",
  blocked: "bad",
  closed: "ok",
  ghosted: "ghost",
};
