/* AUTO-GENERATED from minilab UI manifests. Do not edit manually. */

export const GENERATED_API_CONTRACTS = {
  "schema": "minilab.ui.api_contracts.v3",
  "document_type": "api_contracts",
  "endpoints": {
    "registry.admissions.create": {
      "method": "POST",
      "path": "/api/registry/admissions",
      "authority": "provider_registry_admission",
      "returns": [
        "deduped",
        "entity_id",
        "state_cid",
        "content_cid",
        "admission_id",
        "previous_state_cid"
      ],
      "consumed_by": [
        "registry"
      ]
    },
    "registry.entity.get": {
      "method": "GET",
      "path": "/api/registry/entities/:id",
      "authority": "provider_registry_current_state",
      "returns": [
        "entity_id",
        "entity_kind",
        "current_state_cid",
        "created_at",
        "updated_at"
      ],
      "consumed_by": [
        "registry"
      ]
    },
    "registry.entity.versions": {
      "method": "GET",
      "path": "/api/registry/entities/:id/versions",
      "authority": "provider_registry_history",
      "returns": [
        "versions"
      ],
      "consumed_by": [
        "registry"
      ]
    },
    "lab.dashboard.section_one": {
      "method": "GET",
      "path": "/api/lab-dashboard/section-1",
      "returns": [
        "generated_at",
        "today",
        "routine",
        "research",
        "health"
      ],
      "status": "available_not_currently_consumed_by_pages"
    },
    "lab.calendar.today": {
      "method": "GET",
      "path": "/api/lab-dashboard/calendar/today",
      "returns": [
        "date",
        "timezone",
        "generated_at",
        "dan",
        "lab",
        "overlaps"
      ],
      "consumed_by": [
        "lab-today",
        "lab-calendar"
      ]
    },
    "lab.calendar.routine": {
      "method": "GET",
      "path": "/api/lab-dashboard/calendar/routine",
      "returns": [
        "generated_at",
        "calendar_id",
        "source_status",
        "total_count",
        "groups",
        "events"
      ],
      "consumed_by": [
        "lab-today",
        "lab-routine"
      ]
    },
    "lab.research.current": {
      "method": "GET",
      "path": "/api/lab-dashboard/research/current",
      "returns": [
        "generated_at",
        "source_status",
        "repo",
        "combined_hash",
        "levels"
      ],
      "consumed_by": [
        "lab-today",
        "research-profile",
        "milestones",
        "short-term"
      ]
    },
    "lab.construction.current": {
      "method": "GET",
      "path": "/api/lab-dashboard/construction/current",
      "returns": [
        "generated_at",
        "plan",
        "tree",
        "folders",
        "gaps"
      ],
      "consumed_by": [
        "lab-construction"
      ]
    },
    "lab.health.current": {
      "method": "GET",
      "path": "/api/lab-dashboard/health/current",
      "returns": [
        "generated_at",
        "indicators"
      ],
      "consumed_by": [
        "lab-today",
        "lab-calendar",
        "lab-routine"
      ]
    },
    "sensors.import": {
      "method": "POST",
      "path": "/api/sensors/import",
      "returns": [
        "import_event",
        "candidates",
        "ghosts"
      ],
      "consumed_by": [
        "sensors"
      ]
    },
    "sensors.sync": {
      "method": "POST",
      "path": "/api/sensors/sync",
      "returns": [
        "sync_event",
        "receipts",
        "ghosts"
      ],
      "consumed_by": [
        "sensors"
      ]
    },
    "machines.status": {
      "method": "GET",
      "path": "/api/machines/status",
      "returns": [
        "machines",
        "heartbeats",
        "jobs",
        "access_events"
      ],
      "consumed_by": [
        "machines"
      ]
    },
    "receipts.list": {
      "method": "GET",
      "path": "/api/receipts",
      "returns": [
        "receipts"
      ],
      "consumed_by": [
        "receipts"
      ]
    },
    "ghosts.list": {
      "method": "GET",
      "path": "/api/ghosts",
      "returns": [
        "ghosts"
      ],
      "consumed_by": [
        "ghosts"
      ]
    },
    "gates.decide": {
      "method": "POST",
      "path": "/api/gates/decide",
      "returns": [
        "decision",
        "reason",
        "receipt_or_ghost"
      ],
      "consumed_by": [
        "gates"
      ]
    },
    "platform.capabilities.get": {
      "method": "GET",
      "path": "/api/platform/capabilities",
      "returns": [
        "platform_contract",
        "provider",
        "capabilities",
        "registry_types"
      ],
      "consumed_by": [
        "registry"
      ]
    },
    "registry.entities.list": {
      "method": "GET",
      "path": "/api/registry/entities",
      "query": [
        "kind",
        "q",
        "limit",
        "cursor"
      ],
      "returns": [
        "entities",
        "next_cursor"
      ],
      "consumed_by": [
        "registry"
      ]
    },
    "sensors.list": {
      "method": "GET",
      "path": "/api/sensors",
      "returns": [
        "sensors",
        "readings",
        "sync_status"
      ]
    },
    "knowledge.list": {
      "method": "GET",
      "path": "/api/knowledge",
      "returns": [
        "items",
        "pinned",
        "context_packs"
      ]
    },
    "docs.list": {
      "method": "GET",
      "path": "/api/docs",
      "returns": [
        "documents",
        "pinned"
      ]
    },
    "human.summary": {
      "method": "GET",
      "path": "/api/human",
      "returns": [
        "checkins",
        "routine",
        "alerts",
        "supplies"
      ]
    },
    "spaces.status": {
      "method": "GET",
      "path": "/api/spaces",
      "returns": [
        "spaces",
        "assets",
        "maintenance",
        "cleaning",
        "supplies",
        "observations"
      ]
    },
    "machines.action.request": {
      "method": "POST",
      "path": "/api/machines/:id/actions",
      "returns": [
        "request",
        "gate_or_receipt"
      ]
    },
    "runtimes.list": {
      "method": "GET",
      "path": "/api/runtimes",
      "returns": [
        "runtimes"
      ]
    },
    "llms.list": {
      "method": "GET",
      "path": "/api/llms",
      "returns": [
        "llms",
        "usage",
        "costs",
        "benchmarks"
      ]
    },
    "agents.list": {
      "method": "GET",
      "path": "/api/agents",
      "returns": [
        "agents",
        "attendance",
        "runs"
      ]
    },
    "research.workbench": {
      "method": "GET",
      "path": "/api/research",
      "returns": [
        "items",
        "hypotheses",
        "experiments",
        "papers",
        "timeline"
      ]
    },
    "benchmarks.list": {
      "method": "GET",
      "path": "/api/benchmarks",
      "returns": [
        "benchmarks",
        "datasets",
        "runs",
        "metrics"
      ]
    },
    "code.workbench": {
      "method": "GET",
      "path": "/api/code",
      "returns": [
        "workspace",
        "plan",
        "logs",
        "tests",
        "diffs"
      ]
    },
    "reviews.list": {
      "method": "GET",
      "path": "/api/reviews",
      "returns": [
        "reviews",
        "queue"
      ]
    },
    "reviews.decide": {
      "method": "POST",
      "path": "/api/reviews/:id/decision",
      "returns": [
        "decision",
        "receipt_or_gate"
      ]
    },
    "finance.summary": {
      "method": "GET",
      "path": "/api/finance",
      "returns": [
        "overview",
        "bills",
        "budget",
        "spending",
        "categories"
      ]
    },
    "costs.list": {
      "method": "GET",
      "path": "/api/costs",
      "returns": [
        "costs",
        "allocations",
        "trends",
        "anomalies"
      ]
    },
    "vendors.list": {
      "method": "GET",
      "path": "/api/vendors",
      "returns": [
        "vendors",
        "subscriptions",
        "contracts",
        "payments"
      ]
    },
    "legal.list": {
      "method": "GET",
      "path": "/api/legal",
      "returns": [
        "records",
        "obligations",
        "risks",
        "correspondence"
      ]
    },
    "policies.list": {
      "method": "GET",
      "path": "/api/policies",
      "returns": [
        "policies"
      ]
    },
    "policies.update": {
      "method": "PATCH",
      "path": "/api/policies/:id",
      "returns": [
        "policy",
        "receipt"
      ]
    },
    "gates.list": {
      "method": "GET",
      "path": "/api/gates",
      "returns": [
        "decisions",
        "requests",
        "history"
      ]
    },
    "secrets.references": {
      "method": "GET",
      "path": "/api/secrets",
      "returns": [
        "references",
        "provider_status",
        "missing"
      ]
    },
    "connections.list": {
      "method": "GET",
      "path": "/api/connections",
      "returns": [
        "connections",
        "providers"
      ]
    },
    "connections.configure": {
      "method": "POST",
      "path": "/api/connections/:id/configure",
      "returns": [
        "connection",
        "receipt_or_gate"
      ]
    },
    "schedules.list": {
      "method": "GET",
      "path": "/api/schedules",
      "returns": [
        "schedules",
        "upcoming",
        "missed"
      ]
    },
    "schedules.update": {
      "method": "PATCH",
      "path": "/api/schedules/:id",
      "returns": [
        "schedule",
        "receipt"
      ]
    },
    "analytics.summary": {
      "method": "GET",
      "path": "/api/analytics",
      "returns": [
        "metrics",
        "charts",
        "breakdowns"
      ]
    },
    "settings.get": {
      "method": "GET",
      "path": "/api/settings",
      "returns": [
        "settings"
      ]
    },
    "settings.update": {
      "method": "PATCH",
      "path": "/api/settings",
      "returns": [
        "settings",
        "receipt"
      ]
    },
    "workorders.list": {
      "method": "GET",
      "path": "/api/workorders",
      "returns": [
        "workorders"
      ]
    },
    "workorders.create": {
      "method": "POST",
      "path": "/api/workorders",
      "returns": [
        "workorder",
        "receipt_or_gate"
      ]
    },
    "ghosts.resolve": {
      "method": "POST",
      "path": "/api/ghosts/:id/resolve",
      "returns": [
        "ghost",
        "receipt"
      ]
    }
  },
  "stub_policy": "Unavailable provider capabilities must render an explicit unavailable/degraded state; demo data may never impersonate provider truth.",
  "role": "provider_interface",
  "transport": {
    "default_base": "same_origin",
    "provider_adapter_allowed": true,
    "provider_internal_routes_are_not_ui_contract": true,
    "write_success_requires_receipt_or_authoritative_result": true
  }
} as const;
