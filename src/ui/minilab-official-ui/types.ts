import type { ReactNode } from "react";
import type { GeneratedAreaId, GeneratedIconName, GeneratedPreviewKind } from "./generated/types.generated";

export type AreaId = GeneratedAreaId;

export type IconName = GeneratedIconName;

export interface NavItem {
  id: AreaId;
  label: string;
  icon: IconName;
  // Link externo: o item vira <a> para uma superfície viva fora desta SPA.
  // control.minilab não implementa Expedições; aponta para a porta viva.
  href?: string;
}

export interface NavGroup {
  id: string;
  items: NavItem[];
}

export type PreviewKind = GeneratedPreviewKind;

export interface PreviewTarget<TPayload = unknown> {
  kind: PreviewKind;
  id: string;
  title: string;
  subtitle?: string;
  status?: string;
  payload?: TPayload;
}

export interface RegistryEntity {
  id: string;
  name: string;
  entity_type: string;
  domain: string;
  role: string;
  status: "active" | "draft" | "retired";
  updated_at: string;
}

export interface Ghost {
  id: string;
  summary: string;
  reason: string;
  missing: string[];
  status: "open" | "resolved" | "rejected";
  created_at: string;
}

export interface Receipt {
  id: string;
  scope: string;
  evidence_summary: string;
  closed_at: string;
  status: "closed" | "pending";
  digest?: string;
}

export interface Machine {
  id: string;
  label: string;
  role: string;
  status: "online" | "offline" | "degraded";
  last_heartbeat?: string;
  wifi_status?: string;
  last_boot?: string;
  last_access?: string;
  current_job?: string;
  efficiency?: string;
  maintenance?: string;
  security?: string;
  jobs?: string[];
  runtimes?: string[];
}

export interface Sensor {
  id: string;
  name: string;
  kind: string;
  status:
    | "ok"
    | "alert"
    | "silent"
    | "alive"
    | "degraded"
    | "unknown"
    | "unregistered"
    | "ghost";
  entity_id?: string;
  source?: string;
  sync_status?: string;
  last_sync?: string;
  registry_status?: "linked" | "candidate" | "missing";
  conclusions?: string[];
  last_reading?: { value: string; observed_at: string };
}

export interface SectionHeading {
  title: string;
  hint?: string;
  actions?: ReactNode;
}

export type WorkorderState =
  | "draft"
  | "candidate"
  | "waiting_approval"
  | "running"
  | "blocked"
  | "closed"
  | "ghosted";

export interface Workorder {
  id: string;
  title: string;
  intent: string;
  scope: string;
  authority?: string;
  state: WorkorderState;
  created_at: string;
  required_evidence?: string[];
  linked_entities?: string[];
  gate_decision?: "ok" | "denied" | "needs_approval" | "ghost" | "error";
  gate_reason?: string;
  receipt_id?: string;
  ghost_id?: string;
  blocked_reason?: string;
}

export type ScheduleCadence =
  | "daily"
  | "weekly"
  | "monthly"
  | "ad_hoc"
  | "hourly";

export interface Schedule {
  id: string;
  title: string;
  cadence: ScheduleCadence;
  domain: string;
  next_run?: string;
  last_run?: string;
  status: "upcoming" | "recurring" | "missed" | "completed";
  workorder_id?: string;
  receipt_id?: string;
  ghost_id?: string;
  quality?: number;
}

export interface Appointment {
  id: string;
  when: string;
  title: string;
  domain?: string;
  state: "upcoming" | "now" | "done" | "missed";
  workorder_id?: string;
  receipt_id?: string;
}

export type AgentStatus =
  | "present"
  | "absent"
  | "degraded"
  | "paused"
  | "scheduled"
  | "ghost";

export interface AgentRun {
  id: string;
  when: string;
  what: string;
  status: "ok" | "warn" | "bad" | "ghost";
  receipt_id?: string;
  ghost_id?: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  last_check_in?: string;
  llm_id?: string;
  runtime_id?: string;
  assigned_workflows?: string[]; // workflow/schedule ids
  permissions?: string[]; // "register", "observe", "approve", ...
  recent_runs?: AgentRun[];
  ghost_id?: string;
}

export interface HumanCheckIn {
  id: string;
  who: string;
  when?: string;
  status: "confirmed" | "missing" | "ghost";
}

export interface RoutineEntry {
  id: string;
  group: string;
  title: string;
  expected: string;
  observed?: string;
  status: "done" | "missed" | "in_progress" | "ghost";
  quality_impact?: number;
  receipt_id?: string;
  ghost_id?: string;
}

export type GateDecisionState =
  | "ok"
  | "denied"
  | "needs_approval"
  | "ghost"
  | "error";

export interface GateDecisionRecord {
  id: string;
  scope: string;
  decision: GateDecisionState;
  reason: string;
  policy_id?: string;
  authority?: string;
  evidence?: string[];
  created_at: string;
  workorder_id?: string;
}

export type KnowledgeKind = "playbook" | "context_pack" | "note" | "pinned";

export interface KnowledgeItem {
  id: string;
  title: string;
  kind: KnowledgeKind;
  summary: string;
  domain: string;
  pinned?: boolean;
  tags?: string[];
  used_by?: string[]; // agent/llm ids that consult this
  source?: string;
  updated_at?: string;
}

export type DocStatus = "draft" | "review" | "official" | "deprecated";

export interface DocumentItem {
  id: string;
  title: string;
  kind: string; // "runbook" | "plan" | "policy" | "report" | ...
  status: DocStatus;
  domain: string;
  pinned?: boolean;
  updated_at?: string;
  content?: string; // markdown body, optional
}

export type ReviewKind =
  | "code"
  | "workorder"
  | "policy"
  | "document"
  | "legal"
  | "gate"
  | "diff";

export type ReviewStatus =
  | "queued"
  | "in_review"
  | "blocked"
  | "ready_to_close"
  | "closed";

export interface ReviewItem {
  id: string;
  title: string;
  kind: ReviewKind;
  status: ReviewStatus;
  scope: string;
  reviewer?: string;
  created_at: string;
  risks?: string[];
  checks?: { label: string; passed: boolean }[];
  comments?: number;
  workorder_id?: string;
  gate_id?: string;
  document_id?: string;
  receipt_id?: string;
  ghost_id?: string;
  blocked_reason?: string;
  diff_summary?: string;
}

export type PolicyStatusKind = "active" | "draft" | "needs_review" | "retired";

export interface PolicyItem {
  id: string;
  name: string;
  status: PolicyStatusKind;
  scope: string[]; // domains/components it governs
  rule_summary: string;
  applies_to?: string[];
  linked_gates?: string[];
  last_decision?: string; // "2026-05-19 09:00 · denied"
  updated_at?: string;
}

export type ConnectionDomain =
  | "runtime"
  | "communication"
  | "storage"
  | "code"
  | "finance"
  | "legal";

export type ConnectionState = "connected" | "degraded" | "missing" | "configuring";

export interface ConnectionItem {
  id: string;
  name: string;
  provider: string;
  domain: ConnectionDomain;
  state: ConnectionState;
  last_sync?: string;
  scope?: string;
  risks?: string[];
  secret_refs?: string[]; // ids in SecretReference
  policy_ids?: string[];
}

export type SecretPresence = "present" | "missing" | "stale";

export interface SecretReference {
  id: string;
  logical_name: string;
  provider: string;
  scope: string;
  presence: SecretPresence;
  last_rotation?: string;
  policy_ids?: string[];
  dependents?: string[]; // connection ids / agent ids that depend on it
  // intentionally NO `value` field. Never store secret value here.
}

/* ─── Wave 6a · Human ─────────────────────────────────────────────────── */

export type CareGroup =
  | "hydration"
  | "food"
  | "hygiene"
  | "mental"
  | "social"
  | "peace";

export type CareStatus = "ok" | "due" | "missing" | "ghost";

export interface CareItem {
  id: string;
  group: CareGroup;
  title: string;
  expected: string;
  observed?: string;
  status: CareStatus;
  last_at?: string;
  receipt_id?: string;
  ghost_id?: string;
}

export interface GentleAlertItem {
  id: string;
  tone: "info" | "soft_warn" | "soft_bad";
  message: string;
  suggestion?: string;
}

export interface SupplyNeed {
  id: string;
  what: string;
  category: "food" | "hydration" | "hygiene" | "other";
  needed_by?: string;
  status: "stocked" | "low" | "missing";
}

/* ─── Wave 6a · Santo Andre ───────────────────────────────────────────── */

export type AssetState = "ok" | "needs_maintenance" | "broken" | "missing";

export interface PhysicalAsset {
  id: string;
  name: string;
  kind: "furniture" | "equipment" | "infrastructure" | "consumable" | "machine";
  location: string;
  state: AssetState;
  responsible?: string;
  last_check?: string;
  workorder_id?: string;
  ghost_id?: string;
  receipt_id?: string;
}

export interface MaintenanceTask {
  id: string;
  title: string;
  asset_id?: string;
  due_at?: string;
  status: "scheduled" | "in_progress" | "done" | "ghost";
  workorder_id?: string;
  receipt_id?: string;
  ghost_id?: string;
}

export interface CleaningEntry {
  id: string;
  area: string;
  cadence: "daily" | "weekly" | "monthly";
  last_done?: string;
  next_due?: string;
  status: "done" | "due" | "missed" | "ghost";
  receipt_id?: string;
  ghost_id?: string;
}

export interface SupplyEntry {
  id: string;
  name: string;
  category: "consumable" | "tool" | "filter" | "other";
  state: "stocked" | "low" | "missing";
  vendor_id?: string;
}

export interface SpaceObservation {
  id: string;
  when: string;
  area: string;
  message: string;
  tone: "info" | "warn" | "bad";
}

export interface EnforcementRule {
  id: string;
  rule: string;
  status: "active" | "draft" | "violated";
  last_violation_at?: string;
  policy_id?: string;
}

/* ─── Wave 6a · Runtimes ──────────────────────────────────────────────── */

export type RuntimeState =
  | "running"
  | "installed"
  | "needs_update"
  | "broken"
  | "planned";

export interface RuntimeConfigGroup {
  label: string;
  entries: { key: string; value: string; secret_ref?: boolean }[];
}

export interface RuntimeHealthSignal {
  label: string;
  status: "ok" | "warn" | "bad" | "unknown";
  detail?: string;
}

export interface RuntimeRecord {
  id: string;
  name: string;
  machine_id?: string;
  version: string;
  state: RuntimeState;
  critical?: boolean;
  last_used_at?: string;
  config_groups?: RuntimeConfigGroup[];
  health?: RuntimeHealthSignal[];
  dependencies?: string[]; // other runtime ids
  receipt_id?: string;
  ghost_id?: string;
}

export type FinanceCategory =
  | "infra"
  | "subscriptions"
  | "supplies"
  | "vendors"
  | "legal"
  | "people"
  | "research"
  | "other";

export type FinanceStatus =
  | "due"
  | "scheduled"
  | "paid"
  | "missing_evidence"
  | "needs_approval"
  | "denied";

export interface FinanceRecord {
  id: string;
  title: string;
  vendor_id?: string;
  amount: number; // positive = expense
  currency: "EUR" | "USD" | "BRL";
  due_date?: string;
  paid_at?: string;
  category: FinanceCategory;
  status: FinanceStatus;
  document_id?: string;
  receipt_id?: string;
  ghost_id?: string;
  gate_id?: string;
  recurring?: boolean;
}

export interface BudgetCategory {
  category: FinanceCategory;
  label: string;
  budget: number; // monthly budget EUR
  spent: number; // EUR spent this month
}

export interface SpendingEvent {
  id: string;
  when: string;
  title: string;
  amount: number;
  currency: "EUR" | "USD" | "BRL";
  category: FinanceCategory;
  vendor_id?: string;
  receipt_id?: string;
  ghost_id?: string;
}

export type CostObjectKind =
  | "machine"
  | "llm"
  | "vendor"
  | "project"
  | "workflow"
  | "benchmark"
  | "other";

export interface CostRecord {
  id: string;
  cost_object_kind: CostObjectKind;
  cost_object_id: string; // ref into machines/llms/vendors/etc
  cost_object_label: string;
  amount_eur: number; // normalized to EUR for the table
  period: string; // "2026-05"
  source: string; // "vendor invoice", "benchmark log", "premium meter", etc
  receipt_id?: string;
  ghost_id?: string;
  anomaly?: boolean;
  delta_from_avg_pct?: number; // +120 means +120% vs average
}

export type VendorKind =
  | "saas"
  | "infra"
  | "supply"
  | "legal"
  | "professional_service"
  | "other";

export type VendorState = "active" | "recurring" | "pending" | "legal_attention" | "payment_issue";

export interface VendorItem {
  id: string;
  name: string;
  kind: VendorKind;
  state: VendorState;
  service: string;
  contact?: { name?: string; email?: string; phone?: string; site?: string };
  contract_ids?: string[]; // ref to legal_records
  document_ids?: string[]; // refs to documents
  receipt_ids?: string[];
  ghost_ids?: string[];
  monthly_cost_eur?: number;
  last_payment_at?: string;
  payment_status?: "ok" | "late" | "blocked" | "missing_invoice";
}

export type LegalKind =
  | "contract"
  | "obligation"
  | "lease"
  | "policy"
  | "compliance"
  | "license"
  | "correspondence";

export type LegalRiskLevel = "low" | "medium" | "high" | "critical";

export interface LegalRecord {
  id: string;
  title: string;
  kind: LegalKind;
  status: "draft" | "in_force" | "expiring" | "expired" | "ghost";
  vendor_id?: string;
  document_id?: string;
  risk?: LegalRiskLevel;
  start_at?: string;
  end_at?: string;
  next_obligation?: string; // "2026-06-01 · pay annual fee"
  evidence?: string[];
  receipt_id?: string;
  ghost_id?: string;
}

export interface CorrespondenceItem {
  id: string;
  when: string;
  party: string; // "Landlord · Santo Andre", "AT · Portugal", etc
  subject: string;
  channel: "email" | "letter" | "court" | "phone" | "in_person";
  summary: string;
  legal_id?: string;
  document_id?: string;
}

export interface AddressItem {
  id: string;
  label: string;
  purpose: "commercial" | "physical_lab" | "billing" | "other";
  lines: string[];
  country: string;
}

export type LLMTier = "local" | "premium";
export type LLMRole =
  | "translator"
  | "mini"
  | "agent"
  | "chatbot"
  | "transistor"
  | "operator"
  | "judge";

export interface LLMItem {
  id: string;
  name: string;
  provider: string;
  tier: LLMTier;
  role: LLMRole;
  capabilities: string[]; // e.g. ["reason", "tool_use", "code"]
  cost_profile?: string; // "free local", "$0.001/1k tokens", etc
  benchmark_status?: "passing" | "regressed" | "unknown" | "scheduled";
  usage_today?: number; // call count
  limits?: string;
  policy_ids?: string[];
}
