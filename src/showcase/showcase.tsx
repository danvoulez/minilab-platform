import { useState } from "react";

// shell + layout
import { MinilabShell } from "@/ui/minilab-official-ui/shell/minilab-shell";
import { RailCollapseButton } from "@/ui/minilab-official-ui/shell/rail-collapse-button";
import { PageHeader } from "@/ui/minilab-official-ui/layout/page-header";
import { Section, SectionCard } from "@/ui/minilab-official-ui/layout/section";
import { EmptyState, LoadingState, ErrorState } from "@/ui/minilab-official-ui/layout/states";

// nav + data primitives
import { SegmentedTabs } from "@/ui/minilab-official-ui/components/segmented-tabs";
import { FilterChips } from "@/ui/minilab-official-ui/components/filter-chips";
import { SearchInput } from "@/ui/minilab-official-ui/components/search-input";
import { StatusPill, StatusDot } from "@/ui/minilab-official-ui/components/status";
import { MetricCard } from "@/ui/minilab-official-ui/components/metric-card";
import { Timeline } from "@/ui/minilab-official-ui/components/timeline";
import {
  EntityRow,
  EntityTable,
  EntityCard,
} from "@/ui/minilab-official-ui/components/entity";

// register
import { BigComposer } from "@/ui/minilab-official-ui/register/big-composer";
import { AttachmentDropzone } from "@/ui/minilab-official-ui/register/attachment-dropzone";
import { MissingFields } from "@/ui/minilab-official-ui/register/missing-fields";
import { LogLineShapePreview } from "@/ui/minilab-official-ui/register/logline-shape-preview";
import { AIProposalCard } from "@/ui/minilab-official-ui/register/ai-proposal-card";
import { RegisterActions } from "@/ui/minilab-official-ui/register/register-actions";

// preview
import { PreviewHeader } from "@/ui/minilab-official-ui/preview/preview-header";
import { JsonPreview } from "@/ui/minilab-official-ui/preview/json-preview";
import { EntityPreview } from "@/ui/minilab-official-ui/preview/entity-preview";
import { ReceiptPreview } from "@/ui/minilab-official-ui/preview/receipt-preview";
import { GhostPreview } from "@/ui/minilab-official-ui/preview/ghost-preview";

// evidence
import {
  ReceiptCard,
  GhostCard,
  GateDecisionCard,
  LogLineRecordCard,
} from "@/ui/minilab-official-ui/evidence/cards";
import { EvidenceBlock } from "@/ui/minilab-official-ui/evidence/evidence-block";
import { AuthorityBlock } from "@/ui/minilab-official-ui/evidence/authority-block";

// nav model
import { NAVIGATION } from "@/ui/minilab-official-ui/navigation";
import { NavIcon } from "@/ui/minilab-official-ui/icons";

// wave 3 — operations
import {
  DayTimeline,
  MissedSchedules,
  PlannedVsActual,
  QualityScoreCard,
  RoutineChecklist,
  ScheduleCalendar,
  WorkorderCard,
} from "@/ui/minilab-official-ui/components/domain-composition";

// wave 4 — gates / knowledge / docs / llms
import {
  ApprovalRequests,
  CapabilityMatrix,
  DocGrid,
  GateDecisionQueue,
  KnowledgeCards,
  LLMEntityCards,
  MarkdownPreview,
  PlaybookList,
  PremiumCallMeter,
} from "@/ui/minilab-official-ui/components/domain-composition";

// wave 5a — governance bridge
import {
  AccessPolicyLinks,
  ConnectionGroups,
  MissingSecretWarnings,
  PolicyList,
  ProviderRows,
  ProviderStatus,
  ReviewChecklist,
  ReviewQueue,
  SecretReferenceRows,
} from "@/ui/minilab-official-ui/components/domain-composition";

// wave 5b — institutional backoffice
import {
  BudgetProgress,
  CategoryBreakdown,
  ContactInfo,
  ContractCards,
  CorrespondenceLog,
  CostAllocationCards,
  CostAnomalyList,
  CostByEntity,
  CostTable,
  DueBills,
  FinanceOverviewCards,
  LegalObligationRows,
  OfficialAddressCard,
  PaymentStatus,
  RiskBadges,
  SpendingTimeline,
  SubscriptionRows,
  TrendCharts,
  VendorList,
} from "@/ui/minilab-official-ui/components/domain-composition";

// wave 6a — operational world
import {
  AgentList,
  AgentRunHistory,
  AssignedWorkflows,
  AttendanceStatus,
  CareChecklist,
  CleaningSchedule,
  EnforcementPanel,
  GentleAlerts,
  HumanCheckInCard,
  MaintenanceTaskRows,
  PermissionSummary,
  PhysicalAssetList,
  RoutineQuality,
  RuntimeHealth,
  RuntimeRows,
  SpaceObservationFeed,
  SupplyList,
  SupplyNeeds,
} from "@/ui/minilab-official-ui/components/domain-composition";

// stub data
import {
  PREMIUM_BUDGET_TODAY,
  STUB_ADDRESSES,
  STUB_AGENTS,
  STUB_APPOINTMENTS,
  STUB_BUDGET,
  STUB_CARE_ITEMS,
  STUB_CLEANING,
  STUB_CONNECTIONS,
  STUB_CORRESPONDENCE,
  STUB_COSTS,
  STUB_DOCUMENTS,
  STUB_ENFORCEMENT,
  STUB_ENTITIES,
  STUB_FINANCE_RECORDS,
  STUB_GATE_DECISIONS,
  STUB_GENTLE_ALERTS,
  STUB_GHOSTS,
  STUB_HUMAN_CHECKINS,
  STUB_KNOWLEDGE,
  STUB_LEGAL,
  STUB_LLMS,
  STUB_MACHINES,
  STUB_MAINTENANCE_TASKS,
  STUB_PHYSICAL_ASSETS,
  STUB_POLICIES,
  STUB_RECEIPTS,
  STUB_REVIEWS,
  STUB_ROUTINE_ENTRIES,
  STUB_RUNTIMES,
  STUB_SCHEDULES,
  STUB_SECRETS,
  STUB_SPACE_OBSERVATIONS,
  STUB_SPENDING_EVENTS,
  STUB_SUPPLY_LIST,
  STUB_SUPPLY_NEEDS,
  STUB_VENDORS,
  STUB_WORKORDERS,
} from "@/ui/minilab-official-ui/areas/demo-data";

import { cn } from "@/ui/minilab-official-ui/utils/cn";

const FAMILIES = [
  { id: "shell", label: "Shell", count: 4 },
  { id: "layout", label: "Layout", count: 6 },
  { id: "nav-data", label: "Nav + Data", count: 8 },
  { id: "register", label: "Register", count: 6 },
  { id: "preview", label: "Preview", count: 5 },
  { id: "evidence", label: "Evidence", count: 6 },
  { id: "operations", label: "Operations", count: 7 },
  { id: "knowledge", label: "Knowledge", count: 9 },
  { id: "governance", label: "Governance", count: 8 },
  { id: "institutional", label: "Institutional", count: 10 },
  { id: "world", label: "Operational world", count: 10 },
] as const;
type FamilyId = (typeof FAMILIES)[number]["id"];

const DEMO_COUNT = FAMILIES.reduce((s, f) => s + f.count, 0);

export function Showcase() {
  const [family, setFamily] = useState<FamilyId | "all">("all");
  const [q, setQ] = useState("");
  const [chips, setChips] = useState<string[]>(["dark"]);
  const [tab, setTab] = useState<"overview" | "rows" | "cards">("overview");

  const visible = (id: FamilyId) => family === "all" || family === id;

  return (
    <MinilabShell>
      <div className="h-full w-full overflow-y-auto scrollbar-thin">
        <Hero />

        <div className="max-w-[1240px] mx-auto px-8 pb-24">
          <FamilyNav value={family} onChange={setFamily} />

          {/* SHELL */}
          {visible("shell") && (
            <Family
              id="shell"
              title="Shell"
              kicker="Sidebar orients · middle operates · preview details"
              note="LeftRail · RailContext · RailCollapseButton · ResizableLayout. Os wrappers (MinilabOfficialUI, MinilabShell, LeftRailItem, AreaRouter) são estruturais e não têm demo isolado."
            >
              <Demo name="LeftRail (preview render)" span={2} center>
                <FauxRail />
              </Demo>
              <Demo name="RailContext (mini)" center>
                <FauxRailContext />
              </Demo>
              <Demo name="RailCollapseButton" center>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <RailCollapseButton collapsed={false} onToggle={() => {}} />
                    <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                      expandido
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <RailCollapseButton collapsed={true} onToggle={() => {}} />
                    <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                      colapsado
                    </div>
                  </div>
                </div>
              </Demo>
              <Demo name="ResizableLayout (concept)" span={3}>
                <LayoutDiagram />
              </Demo>
            </Family>
          )}

          {/* LAYOUT */}
          {visible("layout") && (
            <Family
              id="layout"
              title="Layout"
              kicker="PageFrame · PageHeader · MiddlePanel · Section · SectionCard · States"
              note="Toda página começa com PageHeader (title + lede). Regra dura."
            >
              <Demo name="PageHeader" span={3}>
                <SectionCard>
                  <PageHeader
                    title="LAB"
                    lede="Relatório vivo do laboratório físico e digital."
                    actions={
                      <button className="h-8 px-3 rounded-md text-[11.5px] bg-blue-500/15 ring-1 ring-inset ring-blue-500/40 text-blue-200 whitespace-nowrap hover:bg-blue-500/25 transition-colors">
                        Abrir composer
                      </button>
                    }
                  />
                </SectionCard>
              </Demo>

              <Demo name="PageFrame + MiddlePanel" span={3}>
                <PageFrameDiagram />
              </Demo>

              <Demo name="SectionCard">
                <SectionCard>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[11.5px] text-neutral-100">
                        3 entidades ativas
                      </div>
                      <StatusPill tone="ok">healthy</StatusPill>
                    </div>
                    <ul className="space-y-1 text-[10.5px] text-neutral-400">
                      <li>· LAB-256 · workbench</li>
                      <li>· LAB-512 · runner</li>
                      <li>· LAB-8GB · edge</li>
                    </ul>
                  </div>
                </SectionCard>
              </Demo>

              <Demo name="EmptyState">
                <EmptyState
                  title="Nada para mostrar agora."
                  hint="Calmo. Sem ruído. Sem decoração inútil."
                />
              </Demo>

              <Demo name="LoadingState">
                <LoadingState rows={3} />
              </Demo>

              <Demo name="ErrorState" span={3}>
                <ErrorState
                  title="Não conseguimos sincronizar este painel."
                  hint="Sem stack trace no middle. Detalhe técnico vai pro preview."
                />
              </Demo>
            </Family>
          )}

          {/* NAV + DATA */}
          {visible("nav-data") && (
            <Family
              id="nav-data"
              title="Nav + Data"
              kicker="Filtros, busca, tabelas, métricas, timeline."
              note="Densidade alta, mas calma. Status comunica via cor + texto."
            >
              <Demo name="SegmentedTabs">
                <SegmentedTabs
                  value={tab}
                  onChange={setTab}
                  tabs={[
                    { id: "overview", label: "Overview", count: 12 },
                    { id: "rows", label: "Rows", count: 6 },
                    { id: "cards", label: "Cards", count: 3 },
                  ]}
                />
              </Demo>
              <Demo name="SearchInput">
                <SearchInput
                  value={q}
                  onChange={setQ}
                  placeholder="Buscar componente…"
                />
              </Demo>
              <Demo name="FilterChips">
                <FilterChips
                  chips={[
                    { id: "dark", label: "dark" },
                    { id: "dense", label: "dense" },
                    { id: "calm", label: "calm" },
                    { id: "operational", label: "operational" },
                  ]}
                  selected={chips}
                  onToggle={(id) =>
                    setChips((p) =>
                      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
                    )
                  }
                />
              </Demo>

              <Demo name="MetricCard ×4" span={3}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MetricCard label="Online" value="2 / 3" hint="lab-256 degradada" />
                  <MetricCard label="Ghosts" value={STUB_GHOSTS.length} tone="warn" />
                  <MetricCard label="Receipts" value={STUB_RECEIPTS.length} tone="good" />
                  <MetricCard label="Gates" value="0" hint="fila limpa" />
                </div>
              </Demo>

              <Demo name="StatusPill + StatusDot" span={2} compact>
                <div className="flex flex-wrap gap-2 items-center">
                  <StatusPill tone="ok">online</StatusPill>
                  <StatusPill tone="warn">degraded</StatusPill>
                  <StatusPill tone="bad">offline</StatusPill>
                  <StatusPill tone="ghost">ghost</StatusPill>
                  <StatusPill tone="info">draft</StatusPill>
                  <span className="mx-2 h-5 w-px bg-white/10" />
                  <StatusDot tone="ok" pulse />
                  <StatusDot tone="warn" />
                  <StatusDot tone="bad" />
                  <StatusDot tone="ghost" />
                  <StatusDot tone="info" />
                  <StatusDot tone="muted" />
                </div>
              </Demo>

              <Demo name="EntityTable + EntityRow" span={3}>
                <EntityTable>
                  {STUB_ENTITIES.slice(0, 4).map((e) => (
                    <EntityRow
                      key={e.id}
                      title={e.name}
                      subtitle={`${e.entity_type} · ${e.domain}`}
                      meta={e.updated_at}
                      tone="ok"
                    />
                  ))}
                </EntityTable>
              </Demo>

              <Demo name="EntityCard ×3" span={3}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {STUB_MACHINES.map((m) => (
                    <EntityCard
                      key={m.id}
                      title={m.label}
                      subtitle={`role · ${m.role}`}
                      tone={m.status === "online" ? "ok" : "warn"}
                      body={
                        <div className="flex items-center gap-2">
                          <StatusPill tone={m.status === "online" ? "ok" : "warn"}>
                            {m.status}
                          </StatusPill>
                        </div>
                      }
                      footer={
                        <span className="font-mono">heartbeat · {m.last_heartbeat}</span>
                      }
                    />
                  ))}
                </div>
              </Demo>

              <Demo name="Timeline" span={3}>
                <SectionCard>
                  <Timeline
                    events={[
                      {
                        id: "1",
                        when: "03:14",
                        title: "Backup noturno completou",
                        detail: "supabase.prod · 8m22s",
                        tone: "ok",
                      },
                      {
                        id: "2",
                        when: "06:30",
                        title: "Ghost: rotina matinal sem confirmação",
                        tone: "ghost",
                      },
                      {
                        id: "3",
                        when: "08:11",
                        title: "Sensor temp_sensor_a registrado",
                        detail: "vinculado a LAB-256",
                        tone: "ok",
                      },
                      {
                        id: "4",
                        when: "08:58",
                        title: "LAB-256 heartbeat atrasado",
                        tone: "warn",
                      },
                    ]}
                  />
                </SectionCard>
              </Demo>
            </Family>
          )}

          {/* REGISTER */}
          {visible("register") && (
            <Family
              id="register"
              title="Register"
              kicker="Linguagem natural → proposta revisada → admissão da engine."
              note="Nada executa. Nada salva localmente como verdade."
            >
              <Demo name="BigComposer" span={2}>
                <BigComposer
                  onPropose={() => {
                    /* showcase no-op */
                  }}
                  placeholder="ex: cadastrar sensor de temperatura no LAB-256"
                />
              </Demo>
              <Demo name="AttachmentDropzone">
                <AttachmentDropzone />
              </Demo>

              <Demo name="MissingFields · estados" span={2} compact>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MissingFields fields={["confirmed_by", "if_ok"]} />
                  <MissingFields fields={[]} />
                </div>
              </Demo>
              <Demo name="RegisterActions" compact>
                <RegisterActions
                  canCommit={false}
                  onRefine={() => {}}
                  onDiscard={() => {}}
                  onCommit={() => {}}
                />
              </Demo>

              <Demo name="AIProposalCard · Registry candidate" span={3}>
                <AIProposalCard
                  proposal={{
                    intent: 'Propor estado machine segundo o contrato da plataforma',
                    summary: 'cadastrar máquina "LAB-256"',
                    entity_kind: "machine",
                    schema_version: "minilab.registry.machine.v1",
                    payload: {
                      name: "LAB-256",
                      record_status: "active",
                      verification_status: "declared",
                      description: "cadastrar máquina LAB-256",
                      aliases: [],
                      tags: [],
                      attributes: { role: "workbench", status: "unknown" },
                      relations: [],
                    },
                    missing: [],
                    rule_check: { passed: true, note: "pronto para revisão; o provider ainda precisa aceitar" },
                  }}
                  actions={
                    <RegisterActions
                      canCommit
                      onRefine={() => {}}
                      onDiscard={() => {}}
                      onCommit={() => {}}
                    />
                  }
                />
              </Demo>

              <Demo name="LogLineShapePreview · isolado" span={3}>
                <LogLineShapePreview
                  shape={{
                    who: "dan",
                    did: "propose_register",
                    this: "entity:sensor",
                    when: "2026-05-19 09:01",
                    confirmed_by: "—",
                    if_ok: "registry.entities += new(entity)",
                    if_doubt: "ghost(missing_fields)",
                    if_not: "discard_proposal",
                    status: "draft",
                  }}
                />
              </Demo>
            </Family>
          )}

          {/* PREVIEW */}
          {visible("preview") && (
            <Family
              id="preview"
              title="Preview"
              kicker="Detalhe técnico vive aqui, fora do middle."
              note="Renderizado em contêineres reduzidos pra showcase. Em produção, ocupa a coluna direita inteira."
            >
              <Demo name="PreviewHeader (kind: gate)" span={3}>
                <FrameRight>
                  <PreviewHeader
                    kind="gate"
                    title="workorder · trocar HDMI"
                    subtitle="aguardando aprovação humana"
                    status={<StatusPill tone="warn">needs approval</StatusPill>}
                    onClose={() => {}}
                  />
                </FrameRight>
              </Demo>

              <Demo name="EntityPreview" span={3} h="auto">
                <FrameRight tall>
                  <EntityPreview entity={STUB_ENTITIES[0]} onClose={() => {}} />
                </FrameRight>
              </Demo>

              <Demo name="ReceiptPreview" span={3} h="auto">
                <FrameRight tall>
                  <ReceiptPreview receipt={STUB_RECEIPTS[0]} onClose={() => {}} />
                </FrameRight>
              </Demo>

              <Demo name="GhostPreview" span={3} h="auto">
                <FrameRight tall>
                  <GhostPreview ghost={STUB_GHOSTS[0]} onClose={() => {}} />
                </FrameRight>
              </Demo>

              <Demo name="JsonPreview" span={3}>
                <JsonPreview
                  value={{
                    id: "lab-256",
                    label: "LAB 256",
                    role: "workbench",
                    status: "degraded",
                    last_heartbeat: "2026-05-19 08:58:07",
                  }}
                />
              </Demo>
            </Family>
          )}

          {/* EVIDENCE */}
          {visible("evidence") && (
            <Family
              id="evidence"
              title="Evidence"
              kicker="Prova fechada · incompletude honesta · decisão de gate."
              note="O que está em receipt está em bytes online. Ghost preserva o que ainda não fechou."
            >
              <Demo name="ReceiptCard">
                <ReceiptCard receipt={STUB_RECEIPTS[0]} />
              </Demo>
              <Demo name="GhostCard">
                <GhostCard ghost={STUB_GHOSTS[0]} />
              </Demo>
              <Demo name="GateDecisionCard">
                <GateDecisionCard
                  scope="workorder · restart lab-256"
                  decision="needs_approval"
                  reason="ação protegida; humano precisa confirmar."
                  policy="policy.machines.restart"
                />
              </Demo>

              <Demo name="LogLineRecordCard" span={3} compact>
                <LogLineRecordCard
                  who="dan"
                  did="register"
                  what="sensor:temp_sensor_a@LAB-256"
                  when="2026-05-19T08:11Z"
                  status="online"
                />
              </Demo>

              <Demo name="EvidenceBlock" span={2}>
                <EvidenceBlock
                  items={[
                    { label: "scope", value: "lab-routine · backup nightly" },
                    { label: "closed_at", value: "2026-05-19 03:14", mono: true },
                    { label: "id", value: "r_101", mono: true },
                    { label: "digest", value: "sha256:9b1c…f2a7", mono: true },
                  ]}
                />
              </Demo>
              <Demo name="AuthorityBlock">
                <AuthorityBlock
                  authorities={[
                    { who: "dan", role: "operator", can: ["approve", "register", "ghost"] },
                    { who: "agent:keeper", role: "agent", can: ["observe", "propose"] },
                  ]}
                />
              </Demo>
            </Family>
          )}

          {/* OPERATIONS — Wave 3 */}
          {visible("operations") && (
            <Family
              id="operations"
              title="Operations"
              kicker="Today · Lab Routine · Workorders · Schedules"
              note="Composições da Wave 3: timeline do dia, planned vs actual, checklist de rotina, workorder por estado e calendário."
            >
              <Demo name="DayTimeline" span={3}>
                <DayTimeline
                  appointments={STUB_APPOINTMENTS}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="PlannedVsActual" span={3}>
                <PlannedVsActual
                  rows={STUB_ROUTINE_ENTRIES.slice(0, 4).map((e) => ({
                    id: e.id,
                    label: e.title,
                    planned: e.expected,
                    actual: e.observed ?? "—",
                    status: e.status,
                  }))}
                />
              </Demo>
              <Demo name="QualityScoreCard" span={3}>
                <QualityScoreCard entries={STUB_ROUTINE_ENTRIES} />
              </Demo>
              <Demo name="RoutineChecklist" span={3}>
                <RoutineChecklist
                  entries={STUB_ROUTINE_ENTRIES.slice(0, 4)}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="WorkorderCard · estados" span={3}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {STUB_WORKORDERS.slice(0, 6).map((w) => (
                    <WorkorderCard key={w.id} workorder={w} />
                  ))}
                </div>
              </Demo>
              <Demo name="ScheduleCalendar" span={2}>
                <ScheduleCalendar
                  schedules={STUB_SCHEDULES.slice(0, 5)}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="MissedSchedules">
                <MissedSchedules
                  schedules={STUB_SCHEDULES}
                  onSelect={() => {}}
                />
              </Demo>
            </Family>
          )}

          {/* KNOWLEDGE — Wave 4 */}
          {visible("knowledge") && (
            <Family
              id="knowledge"
              title="Knowledge"
              kicker="Gates · Knowledge · Docs · LLMs"
              note="Composições da Wave 4: fila de aprovações, decisões de gate, knowledge cards, playbooks, doc grid, markdown, llm cards, capability matrix e premium call meter."
            >
              <Demo name="ApprovalRequests" span={2}>
                <ApprovalRequests
                  decisions={STUB_GATE_DECISIONS}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="PremiumCallMeter">
                <PremiumCallMeter
                  llms={STUB_LLMS}
                  budget={PREMIUM_BUDGET_TODAY}
                />
              </Demo>
              <Demo name="GateDecisionQueue" span={3}>
                <GateDecisionQueue
                  decisions={STUB_GATE_DECISIONS.slice(0, 6)}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="KnowledgeCards" span={3}>
                <KnowledgeCards
                  items={STUB_KNOWLEDGE.slice(0, 6)}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="PlaybookList">
                <PlaybookList
                  items={STUB_KNOWLEDGE}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="DocGrid" span={2}>
                <DocGrid docs={STUB_DOCUMENTS.slice(0, 4)} onSelect={() => {}} />
              </Demo>
              <Demo name="MarkdownPreview" span={3}>
                <MarkdownPreview
                  content={
                    STUB_DOCUMENTS.find((d) => d.content)?.content ?? undefined
                  }
                />
              </Demo>
              <Demo name="LLMEntityCards" span={3}>
                <LLMEntityCards
                  llms={STUB_LLMS.slice(0, 6)}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="CapabilityMatrix" span={3}>
                <CapabilityMatrix llms={STUB_LLMS} />
              </Demo>
            </Family>
          )}

          {/* GOVERNANCE — Wave 5a */}
          {visible("governance") && (
            <Family
              id="governance"
              title="Governance"
              kicker="Reviews · Policies · Connections · Secrets"
              note="Composições da Wave 5a: ReviewQueue, ReviewChecklist, PolicyList, ConnectionGroups, ProviderRows, SecretReferenceRows, MissingSecretWarnings e AccessPolicyLinks."
            >
              <Demo name="ReviewQueue" span={3}>
                <ReviewQueue
                  reviews={STUB_REVIEWS.slice(0, 6)}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="ReviewChecklist">
                <ReviewChecklist review={STUB_REVIEWS[0]} />
              </Demo>
              <Demo name="PolicyList" span={2}>
                <PolicyList
                  policies={STUB_POLICIES.slice(0, 5)}
                  onSelect={() => {}}
                  groupByStatus={false}
                />
              </Demo>
              <Demo name="ConnectionGroups" span={3}>
                <ConnectionGroups
                  connections={STUB_CONNECTIONS}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="ProviderRows · code domain" span={2}>
                <ProviderRows
                  connections={STUB_CONNECTIONS.filter(
                    (c) => c.domain === "storage" || c.domain === "code"
                  )}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="ProviderStatus">
                <ProviderStatus secrets={STUB_SECRETS} />
              </Demo>
              <Demo name="SecretReferenceRows" span={2}>
                <SecretReferenceRows
                  secrets={STUB_SECRETS}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="MissingSecretWarnings + AccessPolicyLinks">
                <div className="space-y-3">
                  <MissingSecretWarnings
                    secrets={STUB_SECRETS}
                    onSelect={() => {}}
                  />
                  <AccessPolicyLinks
                    secret={STUB_SECRETS[0]}
                    policies={STUB_POLICIES}
                    onSelect={() => {}}
                  />
                </div>
              </Demo>
            </Family>
          )}

          {/* INSTITUTIONAL — Wave 5b */}
          {visible("institutional") && (
            <Family
              id="institutional"
              title="Institutional"
              kicker="Financeiro · Costs · Vendors · Legal"
              note="Composições da Wave 5b: visão geral financeira, due bills, budget, spending, cost table, allocations, anomalias, vendors agrupados, payment status, contratos, riscos, endereços oficiais e correspondência."
            >
              <Demo name="FinanceOverviewCards" span={3}>
                <FinanceOverviewCards
                  records={STUB_FINANCE_RECORDS}
                  budget={STUB_BUDGET}
                />
              </Demo>
              <Demo name="DueBills" span={2}>
                <DueBills
                  records={STUB_FINANCE_RECORDS.slice(0, 5)}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="BudgetProgress">
                <BudgetProgress budget={STUB_BUDGET} />
              </Demo>
              <Demo name="SpendingTimeline" span={2}>
                <SpendingTimeline events={STUB_SPENDING_EVENTS.slice(0, 6)} />
              </Demo>
              <Demo name="CategoryBreakdown">
                <CategoryBreakdown budget={STUB_BUDGET} />
              </Demo>
              <Demo name="CostTable" span={3}>
                <CostTable
                  costs={STUB_COSTS.slice(0, 6)}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="CostAllocationCards" span={3}>
                <CostAllocationCards costs={STUB_COSTS} />
              </Demo>
              <Demo name="CostByEntity">
                <CostByEntity costs={STUB_COSTS.slice(0, 5)} onSelect={() => {}} />
              </Demo>
              <Demo name="CostAnomalyList">
                <CostAnomalyList costs={STUB_COSTS} onSelect={() => {}} />
              </Demo>
              <Demo name="TrendCharts">
                <TrendCharts budget={STUB_BUDGET} />
              </Demo>
              <Demo name="VendorList · agrupado" span={2}>
                <VendorList
                  vendors={STUB_VENDORS.slice(0, 6)}
                  onSelect={() => {}}
                  groupByState={false}
                />
              </Demo>
              <Demo name="SubscriptionRows">
                <SubscriptionRows
                  vendors={STUB_VENDORS}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="PaymentStatus + ContactInfo" span={2}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <PaymentStatus vendor={STUB_VENDORS[0]} />
                  <ContactInfo vendor={STUB_VENDORS[0]} />
                </div>
              </Demo>
              <Demo name="ContractCards" span={3}>
                <ContractCards records={STUB_LEGAL} onSelect={() => {}} />
              </Demo>
              <Demo name="LegalObligationRows" span={2}>
                <LegalObligationRows
                  records={STUB_LEGAL}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="RiskBadges · níveis">
                <div className="flex flex-wrap gap-2">
                  <RiskBadges risk="low" />
                  <RiskBadges risk="medium" />
                  <RiskBadges risk="high" />
                  <RiskBadges risk="critical" />
                </div>
              </Demo>
              <Demo name="OfficialAddressCard" span={3}>
                <OfficialAddressCard addresses={STUB_ADDRESSES} />
              </Demo>
              <Demo name="CorrespondenceLog" span={3}>
                <CorrespondenceLog items={STUB_CORRESPONDENCE} />
              </Demo>
            </Family>
          )}

          {/* OPERATIONAL WORLD — Wave 6a */}
          {visible("world") && (
            <Family
              id="world"
              title="Operational world"
              kicker="Human · Santo Andre · Runtimes · Agents"
              note="Composições da Wave 6a: care checklist, alertas calmos, supply needs, assets físicos, manutenção, limpeza, observação do espaço, enforcement, runtimes por estado/saúde e agentes com workflows/permissões/runs."
            >
              <Demo name="CareChecklist" span={3}>
                <CareChecklist
                  items={STUB_CARE_ITEMS.slice(0, 8)}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="HumanCheckInCard">
                <HumanCheckInCard checkins={STUB_HUMAN_CHECKINS} />
              </Demo>
              <Demo name="GentleAlerts">
                <GentleAlerts alerts={STUB_GENTLE_ALERTS} />
              </Demo>
              <Demo name="SupplyNeeds">
                <SupplyNeeds needs={STUB_SUPPLY_NEEDS} />
              </Demo>
              <Demo name="RoutineQuality" span={3}>
                <RoutineQuality items={STUB_CARE_ITEMS} />
              </Demo>
              <Demo name="PhysicalAssetList" span={3}>
                <PhysicalAssetList
                  assets={STUB_PHYSICAL_ASSETS}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="MaintenanceTaskRows · alias MaintenanceRows">
                <MaintenanceTaskRows
                  tasks={STUB_MAINTENANCE_TASKS}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="CleaningSchedule">
                <CleaningSchedule
                  entries={STUB_CLEANING}
                  onSelect={() => {}}
                />
              </Demo>
              <Demo name="SupplyList">
                <SupplyList supplies={STUB_SUPPLY_LIST} />
              </Demo>
              <Demo name="SpaceObservationFeed" span={2}>
                <SpaceObservationFeed observations={STUB_SPACE_OBSERVATIONS} />
              </Demo>
              <Demo name="EnforcementPanel">
                <EnforcementPanel rules={STUB_ENFORCEMENT} />
              </Demo>
              <Demo name="RuntimeRows · by state" span={3}>
                <RuntimeRows
                  runtimes={STUB_RUNTIMES}
                  onSelect={() => {}}
                  groupBy="state"
                />
              </Demo>
              <Demo name="RuntimeHealth (selected)" span={2}>
                <RuntimeHealth runtime={STUB_RUNTIMES[0]} />
              </Demo>
              <Demo name="AttendanceStatus">
                <AttendanceStatus agents={STUB_AGENTS} />
              </Demo>
              <Demo name="AgentList" span={2}>
                <AgentList
                  agents={STUB_AGENTS}
                  onSelect={() => {}}
                  groupByStatus={false}
                />
              </Demo>
              <Demo name="AssignedWorkflows + PermissionSummary">
                <div className="space-y-3">
                  <AssignedWorkflows
                    agent={STUB_AGENTS[0]}
                    schedules={STUB_SCHEDULES}
                    onSelect={() => {}}
                  />
                  <PermissionSummary agent={STUB_AGENTS[0]} />
                </div>
              </Demo>
              <Demo name="AgentRunHistory" span={3}>
                <AgentRunHistory agent={STUB_AGENTS[0]} />
              </Demo>
            </Family>
          )}

          <Footer />
        </div>
      </div>
    </MinilabShell>
  );
}

/* ---------- showcase-only chrome ---------- */

function Hero() {
  return (
    <header className="border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent animate-[fade-in_500ms_ease-out_both]">
      <div className="max-w-[1240px] mx-auto px-8 pt-12 pb-10">
        <div className="flex items-start justify-between gap-8 flex-wrap">
          <div className="max-w-prose">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-blue-500/15 ring-1 ring-blue-500/40 grid place-items-center text-blue-300 text-[10.5px] font-semibold">
                mw
              </div>
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-neutral-500">
                minilab.work · component store
              </span>
            </div>
            <h1 className="mt-5 text-[44px] leading-[1.05] font-semibold tracking-tight text-neutral-100">
              Foundation set,
              <br />
              <span className="text-neutral-400">peça por peça.</span>
            </h1>
            <p className="mt-4 text-[14px] text-neutral-400 leading-relaxed">
              Componentes operacionais derivados dos manifestos da minilab.work
              official UI. Sidebar orienta, middle opera, preview detalha. Esta
              página renderiza cada peça em contexto real, usando os mesmos imports
              que as áreas usam.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[11.5px] text-neutral-400 flex-wrap">
              <a
                href="#/"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = "";
                  window.location.reload();
                }}
                className="h-8 px-3 rounded-md bg-white/[0.04] ring-1 ring-inset ring-white/10 hover:bg-white/[0.08] inline-flex items-center transition-colors"
              >
                ← Voltar pro app
              </a>
              <span className="text-neutral-600">·</span>
              <span className="whitespace-nowrap">dark-operational · Geist · monoline icons</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 shrink-0 w-full md:w-[340px]">
            <HeroStat label="demos" value={DEMO_COUNT} />
            <HeroStat label="pages wired" value={6} hint="+ placeholders" />
            <HeroStat label="rules" value={8} hint="page_header_required" />
          </div>
        </div>
      </div>
    </header>
  );
}

function HeroStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="text-[10px] uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-medium tabular-nums text-neutral-100">
        {value}
      </div>
      {hint && (
        <div className="mt-0.5 text-[10.5px] text-neutral-500 truncate">{hint}</div>
      )}
    </div>
  );
}

function FamilyNav({
  value,
  onChange,
}: {
  value: FamilyId | "all";
  onChange: (v: FamilyId | "all") => void;
}) {
  return (
    <div className="sticky top-0 z-20 -mx-8 px-8 py-4 bg-page/85 backdrop-blur border-b border-white/[0.06]">
      <div className="flex items-center gap-2 flex-wrap">
        <Chip active={value === "all"} onClick={() => onChange("all")}>
          All · {DEMO_COUNT}
        </Chip>
        {FAMILIES.map((f) => (
          <Chip
            key={f.id}
            active={value === f.id}
            onClick={() => onChange(f.id)}
          >
            {f.label} · {f.count}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-8 px-3 rounded-full text-[11.5px] transition-colors border whitespace-nowrap",
        active
          ? "border-blue-500/60 bg-blue-500/10 text-blue-200"
          : "border-white/10 bg-white/[0.02] text-neutral-400 hover:text-neutral-100 hover:border-white/20"
      )}
    >
      {children}
    </button>
  );
}

function Family({
  id,
  title,
  kicker,
  note,
  children,
}: {
  id: string;
  title: string;
  kicker: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="pt-12 animate-[fade-up_350ms_ease-out_both]"
    >
      <div className="flex items-end justify-between gap-6 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-blue-300/80">
            family
          </div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-100">
            {title}
          </h2>
          <p className="mt-1 text-[13px] text-neutral-400 max-w-prose">{kicker}</p>
        </div>
        {note && (
          <div className="hidden md:block max-w-[300px] text-[10.5px] text-neutral-500 leading-relaxed">
            {note}
          </div>
        )}
      </div>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
        {children}
      </div>
    </section>
  );
}

function Demo({
  name,
  span,
  h,
  center,
  compact,
  children,
}: {
  name: string;
  span?: 2 | 3;
  h?: "auto";
  center?: boolean;
  compact?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden",
        "hover:border-white/[0.18] transition-colors duration-200",
        span === 2 && "md:col-span-2 lg:col-span-2",
        span === 3 && "md:col-span-2 lg:col-span-3"
      )}
    >
      <div className="px-3 py-2 border-b border-white/[0.06] flex items-center justify-between">
        <div className="text-[10.5px] font-mono text-neutral-400">{name}</div>
        <div className="text-[10px] uppercase tracking-wider text-neutral-600 group-hover:text-neutral-400 transition-colors">
          showcase
        </div>
      </div>
      <div
        className={cn(
          "p-4 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[length:14px_14px]",
          center && "flex items-center justify-center",
          h !== "auto" && !compact && "min-h-[120px]",
          compact && "min-h-[64px]"
        )}
      >
        {children}
      </div>
    </div>
  );
}

function FrameRight({
  children,
  tall,
}: {
  children: React.ReactNode;
  tall?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-white/10 bg-panel overflow-hidden",
        tall ? "h-[420px]" : "h-auto"
      )}
    >
      <div className="h-full overflow-y-auto scrollbar-thin">{children}</div>
    </div>
  );
}

function FauxRailContext() {
  return (
    <div className="rounded-md border border-white/10 bg-panel p-3 w-[220px]">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-md bg-blue-500/15 ring-1 ring-blue-500/40 grid place-items-center text-blue-300 text-[10px] font-semibold">
          mw
        </div>
        <div className="min-w-0">
          <div className="text-sm text-neutral-100 leading-tight">minilab.work</div>
          <div className="text-[10.5px] text-neutral-500 leading-tight">
            LogLine Automation
          </div>
        </div>
      </div>
      <div className="mt-3 rounded-md bg-white/[0.03] border border-white/10 px-2 py-1.5">
        <div className="text-[10.5px] text-neutral-500 leading-none">current</div>
        <div className="mt-0.5 text-xs text-neutral-200">LAB-256</div>
        <div className="text-[10.5px] text-neutral-500">workbench · safe</div>
      </div>
    </div>
  );
}

function FauxRail() {
  const groups = NAVIGATION.slice(0, 3);
  const remaining = NAVIGATION.length - groups.length;
  return (
    <div className="rounded-md border border-white/10 bg-panel w-[260px] overflow-hidden relative">
      <div className="p-2 space-y-3">
        {groups.map((g) => (
          <div key={g.id}>
            <div className="px-2 pt-1 pb-1 text-[10px] uppercase tracking-wider text-neutral-600">
              {g.id.replaceAll("_", " ")}
            </div>
            <div className="flex flex-col gap-0.5">
              {g.items.slice(0, 4).map((it, i) => {
                const active = g.id === "core" && i === 0;
                return (
                  <div
                    key={it.id}
                    className={cn(
                      "h-8 px-2.5 rounded-md flex items-center gap-2.5 text-[11.5px]",
                      active
                        ? "bg-white/[0.06] text-neutral-100 ring-1 ring-inset ring-blue-500/60"
                        : "text-neutral-400"
                    )}
                  >
                    <NavIcon
                      name={it.icon}
                      className={cn(
                        "h-3.5 w-3.5",
                        active ? "text-blue-300" : "text-neutral-500"
                      )}
                    />
                    <span className="truncate">{it.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-panel to-transparent" />
      {remaining > 0 && (
        <div className="absolute bottom-1.5 right-2.5 text-[10px] text-neutral-500 font-mono">
          +{remaining} grupos
        </div>
      )}
    </div>
  );
}

function LayoutDiagram() {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
      <div className="grid grid-cols-[120px_1fr_220px] gap-2 h-[180px]">
        <div className="rounded-md border border-blue-500/30 bg-blue-500/[0.04] p-2 flex flex-col justify-end">
          <div className="text-[10px] uppercase tracking-wider text-blue-300/80">
            sidebar · orients
          </div>
          <div className="text-[10px] text-blue-300/40 font-mono mt-0.5">
            blue-500/30
          </div>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.03] p-2 flex flex-col justify-end">
          <div className="text-[10px] uppercase tracking-wider text-neutral-400">
            middle · operates
          </div>
          <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
            white/10
          </div>
        </div>
        <div className="rounded-md border border-violet-500/30 bg-violet-500/[0.04] p-2 flex flex-col justify-end">
          <div className="text-[10px] uppercase tracking-wider text-violet-300/80">
            preview · details
          </div>
          <div className="text-[10px] text-violet-300/40 font-mono mt-0.5">
            violet-500/30
          </div>
        </div>
      </div>
      <div className="mt-2 text-[10.5px] text-neutral-500">
        ResizableLayout compõe os 3 painéis. Preview abre por clique em row/card.
      </div>
    </div>
  );
}

function PageFrameDiagram() {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
      <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">
        esquema · PageFrame (p-6, max-w-1200) + MiddlePanel (space-y-4, scroll)
      </div>
      <div className="rounded border border-dashed border-white/15 p-4 bg-white/[0.02] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-3 w-32 rounded bg-white/[0.12]" />
            <div className="mt-1.5 h-2 w-56 rounded bg-white/[0.05]" />
          </div>
          <div className="h-6 w-24 rounded-md bg-blue-500/[0.12] ring-1 ring-inset ring-blue-500/30" />
        </div>
        <div className="h-12 rounded-md bg-white/[0.04] border border-white/[0.06]" />
        <div className="h-20 rounded-md bg-white/[0.04] border border-white/[0.06]" />
      </div>
      <div className="mt-2 text-[10.5px] text-neutral-500">
        Padding fixo, max-width contido, scroll vertical fino. Sem chrome extra.
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-16 pt-8 border-t border-white/[0.06] text-[10.5px] text-neutral-500 flex items-center justify-between flex-wrap gap-4">
      <div className="italic">
        sidebar orienta · middle opera · preview detalha · registry muta via AI + regras
      </div>
      <div className="italic">
        registros válidos vivem online em bytes · ghosts preservam incompletude · receipts fecham prova
      </div>
    </footer>
  );
}
