/* AUTO-GENERATED from minilab UI manifests. Do not edit manually. */

export const GENERATED_PREVIEW_REGISTRY = {
  "entity": {
    "component": "EntityPreview",
    "data": [
      "registry_entities",
      "entity_links",
      "receipts",
      "ghosts"
    ],
    "actions": [
      "propose_change",
      "open_receipt",
      "open_ghost"
    ]
  },
  "registry_record": {
    "component": "RegistryProviderPreview",
    "data": [
      "registry_entities",
      "registry_versions",
      "registry_admissions"
    ],
    "actions": []
  },
  "registry_admission": {
    "component": "RegistryAdmissionPreview",
    "data": [
      "registry_admissions",
      "registry_versions",
      "registry_entities"
    ],
    "actions": []
  },
  "receipt": {
    "component": "ReceiptPreview",
    "data": [
      "receipts",
      "evidence",
      "registry_entities",
      "workorders",
      "ghosts"
    ],
    "actions": [
      "copy_digest",
      "open_evidence",
      "open_linked_entity",
      "open_resolved_ghost",
      "export_receipt"
    ]
  },
  "ghost": {
    "component": "GhostPreview",
    "data": [
      "ghosts",
      "registry_entities",
      "workorders",
      "receipts",
      "evidence"
    ],
    "actions": [
      "add_evidence",
      "ask_dan",
      "refine",
      "convert_to_record",
      "create_workorder",
      "keep_as_ghost",
      "reject",
      "resolve_with_receipt"
    ]
  },
  "workorder": {
    "component": "WorkorderPreview",
    "data": [
      "workorders",
      "registry_entities",
      "receipts",
      "ghosts"
    ],
    "actions": [
      "send_to_gate",
      "ghost",
      "close_with_receipt"
    ]
  },
  "sensor": {
    "component": "SensorPreview",
    "data": [
      "sensors",
      "sensor_readings",
      "registry_entities",
      "supabase_sync_events",
      "receipts",
      "ghosts"
    ],
    "actions": [
      "add_to_registry",
      "sync_now",
      "import_readings",
      "create_alert_rule",
      "create_conclusion",
      "open_ghost",
      "open_receipt"
    ]
  },
  "machine": {
    "component": "MachinePreview",
    "data": [
      "machines",
      "machine_heartbeats",
      "runtimes",
      "jobs",
      "access_events",
      "security_events",
      "maintenance_records",
      "receipts",
      "ghosts"
    ],
    "actions": [
      "inspect",
      "request_protected_action",
      "open_runtime",
      "open_receipt",
      "open_ghost"
    ]
  },
  "runtime": {
    "component": "RuntimePreview",
    "data": [
      "runtimes",
      "machines",
      "receipts",
      "ghosts"
    ],
    "actions": [
      "inspect",
      "update_proposal"
    ]
  },
  "llm": {
    "component": "LLMPreview",
    "data": [
      "llms",
      "benchmarks",
      "usage",
      "costs"
    ],
    "actions": [
      "run_benchmark",
      "open_policy"
    ]
  },
  "agent": {
    "component": "AgentPreview",
    "data": [
      "agents",
      "llms",
      "workflows",
      "receipts"
    ],
    "actions": [
      "pause",
      "assign_workflow"
    ]
  },
  "document": {
    "component": "DocumentPreview",
    "data": [
      "documents",
      "registry_entities"
    ],
    "actions": [
      "open_external",
      "propose_change"
    ]
  },
  "knowledge": {
    "component": "KnowledgePreview",
    "data": [
      "knowledge_items"
    ],
    "actions": []
  },
  "legal": {
    "component": "LegalPreview",
    "data": [
      "legal_records",
      "documents",
      "vendors"
    ],
    "actions": [
      "open_doc",
      "mark_reviewed"
    ]
  },
  "cost": {
    "component": "CostPreview",
    "data": [
      "costs",
      "vendors",
      "registry_entities"
    ],
    "actions": [
      "open_vendor",
      "allocate"
    ]
  },
  "vendor": {
    "component": "VendorPreview",
    "data": [
      "vendors",
      "contracts",
      "payments"
    ],
    "actions": [
      "open_contract",
      "register_payment"
    ]
  },
  "policy": {
    "component": "PolicyPreview",
    "data": [
      "policies",
      "gate_decisions"
    ],
    "actions": [
      "edit_proposal",
      "retire"
    ]
  },
  "gate": {
    "component": "GatePreview",
    "data": [
      "gate_decisions",
      "policies",
      "evidence"
    ],
    "actions": [
      "approve",
      "deny",
      "ghost"
    ]
  },
  "code": {
    "component": "CodePreview",
    "data": [
      "code_files",
      "diffs",
      "logs",
      "receipts"
    ],
    "actions": [
      "open_file",
      "create_review"
    ]
  },
  "benchmark": {
    "component": "BenchmarkPreview",
    "data": [
      "benchmarks",
      "benchmark_runs",
      "datasets",
      "metrics"
    ],
    "actions": [
      "open_run",
      "generate_report"
    ]
  },
  "json": {
    "component": "JsonPreview",
    "data": [
      "unknown"
    ],
    "actions": [
      "copy"
    ]
  }
} as const;
