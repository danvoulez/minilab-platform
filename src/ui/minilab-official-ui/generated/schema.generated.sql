-- AUTO-GENERATED from 05.data-entities.yaml.
-- Starting point for online persistence; local files are not a valid source of truth.

CREATE TABLE IF NOT EXISTS logline_records (
  id TEXT PRIMARY KEY,
  who TEXT,
  did TEXT,
  this JSONB,
  when TIMESTAMPTZ,
  confirmed_by TEXT,
  if_ok TEXT,
  if_doubt TEXT,
  if_not TEXT,
  status TEXT,
  payload_bytes JSONB,
  created_at TIMESTAMPTZ,
  online_status TIMESTAMPTZ
);

-- registry_entities: external_authority · authority=provider.registry_entities; no local table generated.

-- registry_versions: external_authority · authority=provider.registry_versions; no local table generated.

-- registry_admissions: external_authority · authority=provider.registry_admissions; no local table generated.

-- registry_contracts: compiled_contract · authority=16.registry-type-schemas.yaml; no local table generated.

CREATE TABLE IF NOT EXISTS entity_links (
  id TEXT PRIMARY KEY,
  from_entity_id TEXT,
  relation TIMESTAMPTZ,
  to_entity_id TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS ghosts (
  id TEXT PRIMARY KEY,
  logline_record_id TEXT,
  reason TEXT,
  summary TEXT,
  missing JSONB,
  status TEXT,
  created_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS receipts (
  id TEXT PRIMARY KEY,
  logline_record_id TEXT,
  scope TEXT,
  evidence_summary TEXT,
  evidence_payload JSONB,
  closed_at TIMESTAMPTZ,
  status TEXT
);

CREATE TABLE IF NOT EXISTS workorders (
  id TEXT PRIMARY KEY,
  title TEXT,
  intent TEXT,
  scope TEXT,
  status TEXT,
  created_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS gate_decisions (
  id TEXT PRIMARY KEY,
  decision TEXT,
  reason TEXT,
  policy_id TEXT,
  created_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS policies (
  id TEXT PRIMARY KEY,
  name TEXT,
  scope TEXT,
  status TEXT,
  rule_payload JSONB
);

CREATE TABLE IF NOT EXISTS sensors (
  id TEXT PRIMARY KEY,
  name TEXT,
  kind TEXT,
  status TEXT,
  entity_id TEXT
);

CREATE TABLE IF NOT EXISTS sensor_readings (
  id TEXT PRIMARY KEY,
  sensor_id TEXT,
  value NUMERIC,
  observed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS machines (
  id TEXT PRIMARY KEY,
  label TEXT,
  role TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS machine_heartbeats (
  id TEXT PRIMARY KEY,
  machine_id TEXT,
  observed_at TIMESTAMPTZ,
  status TEXT
);

CREATE TABLE IF NOT EXISTS runtimes (
  id TEXT PRIMARY KEY,
  name TEXT,
  machine_id TEXT,
  version TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS llms (
  id TEXT PRIMARY KEY,
  name TEXT,
  kind TEXT,
  role TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  name TEXT,
  llm_id TEXT,
  role TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS finance_records (
  id TEXT PRIMARY KEY,
  kind TEXT,
  amount NUMERIC,
  currency TEXT,
  vendor_id TEXT,
  due_date TIMESTAMPTZ,
  status TEXT
);

CREATE TABLE IF NOT EXISTS legal_records (
  id TEXT PRIMARY KEY,
  kind TEXT,
  title TEXT,
  status TEXT,
  document_id TEXT
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  title TEXT,
  kind TEXT,
  status TEXT,
  content_ref TEXT
);

CREATE TABLE IF NOT EXISTS supabase_sync_events (
  id TEXT PRIMARY KEY,
  source TEXT,
  target TEXT,
  status TEXT,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  failed_rows JSONB
);

CREATE TABLE IF NOT EXISTS unregistered_signals (
  id TEXT PRIMARY KEY,
  source TEXT,
  kind TEXT,
  observed_at TIMESTAMPTZ,
  payload JSONB,
  status TEXT
);

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  machine_id TEXT,
  title TEXT,
  status TEXT,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS access_events (
  id TEXT PRIMARY KEY,
  machine_id TEXT,
  actor TEXT,
  method TEXT,
  observed_at TIMESTAMPTZ,
  status TEXT
);

CREATE TABLE IF NOT EXISTS security_events (
  id TEXT PRIMARY KEY,
  machine_id TEXT,
  summary TEXT,
  severity TEXT,
  observed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS maintenance_records (
  id TEXT PRIMARY KEY,
  entity_id TEXT,
  summary TEXT,
  status TEXT,
  created_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS evidence (
  id TEXT PRIMARY KEY,
  kind TEXT,
  source TEXT,
  payload_ref JSONB,
  summary TEXT,
  created_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  scope TEXT,
  key TEXT,
  value_ref TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS connections (
  id TEXT PRIMARY KEY,
  provider TEXT,
  status TEXT,
  scope TEXT,
  last_sync TEXT
);

CREATE TABLE IF NOT EXISTS secrets (
  id TEXT PRIMARY KEY,
  logical_name TEXT,
  provider TEXT,
  scope TEXT,
  presence TEXT,
  last_rotation TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS vendors (
  id TEXT PRIMARY KEY,
  name TEXT,
  status TEXT,
  contact_ref TEXT
);

CREATE TABLE IF NOT EXISTS costs (
  id TEXT PRIMARY KEY,
  entity_id TEXT,
  amount NUMERIC,
  currency TEXT,
  period TEXT,
  source TEXT
);

CREATE TABLE IF NOT EXISTS analytics (
  id TEXT PRIMARY KEY,
  metric TEXT,
  value NUMERIC,
  period TEXT,
  source TEXT
);

CREATE TABLE IF NOT EXISTS benchmarks (
  id TEXT PRIMARY KEY,
  name TEXT,
  status TEXT,
  method_ref TEXT
);

CREATE TABLE IF NOT EXISTS datasets (
  id TEXT PRIMARY KEY,
  name TEXT,
  status TEXT,
  source TEXT
);

CREATE TABLE IF NOT EXISTS benchmark_runs (
  id TEXT PRIMARY KEY,
  benchmark_id TEXT,
  status TEXT,
  result TEXT,
  created_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS knowledge_items (
  id TEXT PRIMARY KEY,
  title TEXT,
  kind TEXT,
  status TEXT,
  content_ref TEXT
);

CREATE TABLE IF NOT EXISTS human_checkins (
  id TEXT PRIMARY KEY,
  kind TEXT,
  status TEXT,
  observed_at TIMESTAMPTZ,
  summary TEXT
);

CREATE TABLE IF NOT EXISTS research_items (
  id TEXT PRIMARY KEY,
  kind TEXT,
  title TEXT,
  status TEXT,
  created_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  kind TEXT,
  target_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ
);
