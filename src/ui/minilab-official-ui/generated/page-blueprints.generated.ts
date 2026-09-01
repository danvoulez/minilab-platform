/* AUTO-GENERATED from minilab UI manifests. Do not edit manually. */

export const GENERATED_PAGE_BLUEPRINTS = {
  "lab-today": {
    "title": "Lab Today",
    "lede": "O estado operacional de hoje: agendas Dan/Lab, colisões, automações, saúde da pesquisa e o Observatório ao vivo.",
    "layout": "operational_summary_with_live_observatory",
    "components": [
      "PageHeader",
      "MetricCard",
      "ResearchHealthPanel",
      "SourceStatusPill",
      "EveFrame",
      "InspectorPreview"
    ],
    "data": [],
    "sources": [
      "lab.calendar.today",
      "lab.calendar.routine",
      "lab.research.current",
      "lab.health.current"
    ],
    "preview_kinds": [
      "json"
    ],
    "layout_intent": "source_backed_operational_summary_plus_live_observatory",
    "slots": {
      "health": {
        "component": "ResearchHealthPanel"
      },
      "metrics": {
        "component": "MetricCard",
        "count": 4
      },
      "plan_identity": {
        "components": [
          "SourceStatusPill"
        ],
        "preview_kind": "json"
      },
      "observatorio": {
        "component": "EveFrame",
        "source": "256-eve:/observatorio"
      }
    }
  },
  "lab-calendar": {
    "title": "Lab Calendar",
    "lede": "O calendário como ele é: compromissos pontuais de Dan e do LAB, colisões visíveis e nenhuma inferência de cumprimento.",
    "layout": "two_calendar_day_timeline",
    "components": [
      "PageHeader",
      "ResearchHealthPanel",
      "SourceStatusPill",
      "InspectorPreview"
    ],
    "data": [],
    "sources": [
      "lab.calendar.today",
      "lab.health.current"
    ],
    "preview_kinds": [
      "json"
    ],
    "layout_intent": "two_source_day_timeline_with_explicit_collisions",
    "slots": {
      "health": {
        "component": "ResearchHealthPanel"
      },
      "timeline": {
        "columns": [
          "dan",
          "lab"
        ],
        "source": "lab.calendar.today"
      },
      "collisions": {
        "source": "lab.calendar.today.overlaps"
      },
      "preview": {
        "kind": "json"
      }
    }
  },
  "lab-construction": {
    "title": "Lab Construction",
    "lede": "Onde o código está em relação ao plano, sem confundir intenção, observação e evidência.",
    "layout": "repository_facts_against_declared_plan",
    "components": [
      "PageHeader",
      "MetricCard",
      "SourceStatusPill",
      "InspectorPreview"
    ],
    "data": [],
    "sources": [
      "lab.construction.current"
    ],
    "preview_kinds": [
      "json"
    ],
    "layout_intent": "declared_plan_beside_repository_facts_without_inferred_completion",
    "slots": {
      "metrics": {
        "component": "MetricCard",
        "count": 4
      },
      "repository": {
        "source": "lab.construction.current.tree_and_folders"
      },
      "plan": {
        "source": "lab.construction.current.plan"
      },
      "gaps": {
        "source": "lab.construction.current.gaps"
      },
      "preview": {
        "kind": "json"
      }
    }
  },
  "lab-routine": {
    "title": "Lab Routine",
    "lede": "Os eventos recorrentes do calendário LAB, agrupados por frequência, com a saúde da pesquisa ao lado.",
    "layout": "recurring_automation_frequency_groups",
    "components": [
      "PageHeader",
      "ResearchHealthPanel",
      "SourceStatusPill",
      "InspectorPreview"
    ],
    "data": [],
    "sources": [
      "lab.calendar.routine",
      "lab.health.current"
    ],
    "preview_kinds": [
      "json"
    ],
    "layout_intent": "recurring_calendar_events_grouped_by_rrule_frequency",
    "slots": {
      "health": {
        "component": "ResearchHealthPanel"
      },
      "summary": {
        "source": "lab.calendar.routine"
      },
      "frequency_groups": {
        "source": "lab.calendar.routine.groups"
      },
      "preview": {
        "kind": "json"
      }
    }
  },
  "workorders": {
    "title": "Workorders",
    "lede": "Trabalho estruturado antes da execução.",
    "layout": "list_with_preview",
    "components": [
      "PageHeader",
      "WorkorderList",
      "StatusPills",
      "ScopeFilters",
      "NewWorkorderComposer",
      "ExecutionReadiness",
      "InspectorPreview"
    ],
    "data": [
      "workorders",
      "registry_entities",
      "ghosts",
      "receipts",
      "gate_decisions"
    ],
    "sources": [],
    "preview_kinds": [
      "workorder",
      "entity",
      "receipt",
      "ghost",
      "gate"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "WorkorderList",
          "StatusPills",
          "ScopeFilters",
          "NewWorkorderComposer",
          "ExecutionReadiness"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "workorder",
          "entity",
          "receipt",
          "ghost",
          "gate"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "receipts": {
    "title": "Receipts",
    "lede": "Evidências fechadas do que aconteceu no LAB.",
    "layout": "proof_ledger_with_preview",
    "components": [
      "PageHeader",
      "ReceiptLedgerSummary",
      "ReceiptList",
      "ReceiptCard",
      "ReceiptDigest",
      "EvidenceBlock",
      "ReceiptFilters",
      "ReceiptTimeline",
      "ReceiptByEntity",
      "ReceiptByMachine",
      "ReceiptByWorkorder",
      "InspectorPreview"
    ],
    "data": [
      "receipts",
      "registry_entities",
      "workorders",
      "ghosts",
      "evidence",
      "machines"
    ],
    "sources": [],
    "preview_kinds": [
      "receipt",
      "entity",
      "workorder",
      "ghost",
      "machine"
    ],
    "layout_intent": "proof_ledger",
    "slots": {
      "summary": {
        "component": "ReceiptLedgerSummary"
      },
      "filters": {
        "component": "ReceiptFilters"
      },
      "middle": {
        "components": [
          "ReceiptList",
          "ReceiptTimeline",
          "ReceiptByEntity",
          "ReceiptByMachine",
          "ReceiptByWorkorder"
        ]
      },
      "preview": {
        "component": "ReceiptPreview"
      }
    }
  },
  "ghosts": {
    "title": "Ghosts",
    "lede": "Registros incompletos, ausências e dúvidas que ainda importam.",
    "layout": "triage_with_preview",
    "components": [
      "PageHeader",
      "GhostTriageSummary",
      "GhostReasonTabs",
      "GhostList",
      "GhostCard",
      "MissingFields",
      "MissingEvidenceMatrix",
      "ResolvableGhosts",
      "GhostAgeBuckets",
      "GhostDomainBreakdown",
      "InspectorPreview"
    ],
    "data": [
      "ghosts",
      "registry_entities",
      "workorders",
      "receipts",
      "sensors",
      "machines"
    ],
    "sources": [],
    "preview_kinds": [
      "ghost",
      "entity",
      "workorder",
      "receipt",
      "sensor",
      "machine"
    ],
    "layout_intent": "honest_incompleteness_triage",
    "slots": {
      "summary": {
        "component": "GhostTriageSummary"
      },
      "filters": {
        "components": [
          "GhostReasonTabs",
          "GhostDomainBreakdown"
        ]
      },
      "middle": {
        "components": [
          "GhostList",
          "MissingEvidenceMatrix",
          "ResolvableGhosts"
        ]
      },
      "preview": {
        "component": "GhostPreview"
      }
    }
  },
  "registry": {
    "title": "Registry",
    "lede": "Proponha, revise e admita entidades segundo o contrato Minilab; o provider satisfaz a interface sem redefinir o produto.",
    "layout": "proposal_platform_contract_catalog_with_provider_preview",
    "components": [
      "PageHeader",
      "LocalOperatorComposer",
      "RegistryTypeTable",
      "SearchInput",
      "AIProposalCard",
      "RegisterActions",
      "MissingFields",
      "InspectorPreview"
    ],
    "data": [
      "registry_contracts",
      "registry_entities",
      "registry_versions",
      "registry_admissions"
    ],
    "sources": [],
    "preview_kinds": [
      "registry_record",
      "registry_admission"
    ],
    "layout_intent": "proposal_first_platform_contract_catalog_with_provider_inspector",
    "slots": {
      "hero": {
        "component": "LocalOperatorComposer",
        "prominence": "primary",
        "notes": "Proposal helper only. Current build uses deterministic browser parsing; provider admission returns operational truth."
      },
      "middle_initial": {
        "component": "RegistryTypeTable",
        "notes": "Complete platform Registry contracts generated from 16.registry-type-schemas.yaml."
      },
      "lookup": {
        "component": "SearchInput",
        "notes": "Existing entities come from the provider registry.list capability."
      },
      "preview": {
        "default_behavior": "open_after_lookup_or_admission",
        "component": "InspectorPreview"
      }
    }
  },
  "sensors": {
    "title": "Sensors",
    "lede": "Sensores proprietários do LAB: configuração, observação e conclusões.",
    "layout": "instrument_intelligence_with_preview",
    "components": [
      "PageHeader",
      "SensorIntelligencePanel",
      "SensorAliveGrid",
      "SensorList",
      "SensorReadingCards",
      "SensorDataTable",
      "SensorImportPanel",
      "SensorSyncStatus",
      "SupabaseSyncPanel",
      "SensorConclusionPanel",
      "SensorToRegistryAction",
      "AlertRules",
      "InspectorPreview"
    ],
    "data": [
      "sensors",
      "sensor_readings",
      "registry_entities",
      "ghosts",
      "receipts",
      "supabase_sync_events",
      "unregistered_signals"
    ],
    "sources": [],
    "preview_kinds": [
      "sensor",
      "entity",
      "ghost",
      "receipt"
    ],
    "layout_intent": "sensor_liveness_import_sync_intelligence",
    "slots": {
      "hero": {
        "component": "SensorIntelligencePanel",
        "notes": "What sensors are saying right now."
      },
      "health": {
        "component": "SensorAliveGrid"
      },
      "data": {
        "components": [
          "SensorList",
          "SensorReadingCards",
          "SensorDataTable"
        ]
      },
      "sync": {
        "components": [
          "SensorImportPanel",
          "SensorSyncStatus",
          "SupabaseSyncPanel"
        ]
      },
      "actions": {
        "components": [
          "SensorToRegistryAction",
          "SensorConclusionPanel",
          "AlertRules"
        ]
      },
      "preview": {
        "component": "SensorPreview"
      }
    }
  },
  "knowledge": {
    "title": "Knowledge",
    "lede": "Contexto estruturado que o LAB usa para interpretar e agir.",
    "layout": "search_cards_with_preview",
    "components": [
      "PageHeader",
      "KnowledgeSearch",
      "KnowledgeCards",
      "PlaybookList",
      "ContextPacks",
      "PinnedKnowledge",
      "InspectorPreview"
    ],
    "data": [
      "knowledge_items",
      "documents",
      "registry_entities"
    ],
    "sources": [],
    "preview_kinds": [
      "document",
      "entity"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "KnowledgeSearch",
          "KnowledgeCards",
          "PlaybookList",
          "ContextPacks",
          "PinnedKnowledge"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "document",
          "entity"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "docs": {
    "title": "Docs",
    "lede": "Documentos oficiais, runbooks e referências do LAB.",
    "layout": "grid_with_preview",
    "components": [
      "PageHeader",
      "DocSearch",
      "DocGrid",
      "PinnedDocs",
      "MarkdownPreview",
      "DocStatusBadge",
      "InspectorPreview"
    ],
    "data": [
      "documents",
      "registry_entities"
    ],
    "sources": [],
    "preview_kinds": [
      "document",
      "entity"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "DocSearch",
          "DocGrid",
          "PinnedDocs",
          "MarkdownPreview",
          "DocStatusBadge"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "document",
          "entity"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "human": {
    "title": "Human",
    "lede": "Cuidado operacional do humano: energia, saúde, calma e presença.",
    "layout": "care_with_preview",
    "components": [
      "PageHeader",
      "CareChecklist",
      "HumanCheckIn",
      "GentleAlerts",
      "SupplyNeeds",
      "RoutineQuality",
      "InspectorPreview"
    ],
    "data": [
      "human_checkins",
      "schedules",
      "ghosts",
      "receipts"
    ],
    "sources": [],
    "preview_kinds": [
      "ghost",
      "receipt",
      "workorder"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "CareChecklist",
          "HumanCheckIn",
          "GentleAlerts",
          "SupplyNeeds",
          "RoutineQuality"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "ghost",
          "receipt",
          "workorder"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "santo-andre": {
    "title": "Laboratório Santo Andre",
    "lede": "Espaço físico do LAB: assets, manutenção, limpeza, suprimentos e organização.",
    "layout": "physical_ops_with_preview",
    "components": [
      "PageHeader",
      "PhysicalAssetList",
      "MaintenanceRows",
      "CleaningSchedule",
      "SupplyList",
      "SpaceObservationFeed",
      "EnforcementPanel",
      "InspectorPreview"
    ],
    "data": [
      "registry_entities",
      "workorders",
      "schedules",
      "ghosts",
      "receipts"
    ],
    "sources": [],
    "preview_kinds": [
      "entity",
      "workorder",
      "ghost",
      "receipt"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "PhysicalAssetList",
          "MaintenanceRows",
          "CleaningSchedule",
          "SupplyList",
          "SpaceObservationFeed",
          "EnforcementPanel"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "entity",
          "workorder",
          "ghost",
          "receipt"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "machines": {
    "title": "Machines",
    "lede": "Os três Mac minis do LAB: presença, saúde, papéis e capacidade.",
    "layout": "observability_fleet_with_preview",
    "components": [
      "PageHeader",
      "MetricCard",
      "MachineCards",
      "MachineCard",
      "HeartbeatStatus",
      "ConnectivityPanel",
      "AccessHistory",
      "JobActivityList",
      "MaintenanceRows",
      "SecurityEvents",
      "RuntimeSummary",
      "MachineReceipts",
      "ProtectedActions",
      "InspectorPreview"
    ],
    "data": [
      "machines",
      "machine_heartbeats",
      "runtimes",
      "receipts",
      "ghosts",
      "jobs",
      "access_events",
      "security_events",
      "maintenance_records"
    ],
    "sources": [],
    "preview_kinds": [
      "machine",
      "runtime",
      "receipt",
      "ghost",
      "gate"
    ],
    "layout_intent": "observability_total_for_three_mac_minis",
    "slots": {
      "hero": {
        "component": "MachineCards",
        "notes": "Three main cards: LAB 8GB, LAB 512, LAB 256."
      },
      "observability": {
        "components": [
          "ConnectivityPanel",
          "AccessHistory",
          "JobActivityList",
          "MaintenanceRows",
          "SecurityEvents",
          "RuntimeSummary",
          "MachineReceipts",
          "GhostSummary"
        ]
      },
      "preview": {
        "component": "MachinePreview",
        "default_behavior": "open_selected_machine"
      }
    }
  },
  "runtimes": {
    "title": "Runtimes",
    "lede": "Software oficial instalado, configurado e observado nos LABs.",
    "layout": "settings_rows_with_preview",
    "components": [
      "PageHeader",
      "RuntimeRows",
      "VersionBadges",
      "InstallStatus",
      "ConfigGroups",
      "RuntimeHealth",
      "InspectorPreview"
    ],
    "data": [
      "runtimes",
      "machines",
      "receipts",
      "ghosts"
    ],
    "sources": [],
    "preview_kinds": [
      "runtime",
      "machine",
      "receipt",
      "ghost"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "RuntimeRows",
          "VersionBadges",
          "InstallStatus",
          "ConfigGroups",
          "RuntimeHealth"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "runtime",
          "machine",
          "receipt",
          "ghost"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "llms": {
    "title": "LLMs",
    "lede": "Tradutores, minis, agentes, chatbots, transistors e operators.",
    "layout": "cards_matrix_with_preview",
    "components": [
      "PageHeader",
      "LLMEntityCards",
      "CapabilityMatrix",
      "UsageRows",
      "CostBadges",
      "BenchmarkStatus",
      "RoleFilters",
      "InspectorPreview"
    ],
    "data": [
      "llms",
      "agents",
      "benchmarks",
      "costs",
      "receipts"
    ],
    "sources": [],
    "preview_kinds": [
      "llm",
      "agent",
      "benchmark",
      "cost",
      "receipt"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "LLMEntityCards",
          "CapabilityMatrix",
          "UsageRows",
          "CostBadges",
          "BenchmarkStatus",
          "RoleFilters"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "llm",
          "agent",
          "benchmark",
          "cost",
          "receipt"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "agents": {
    "title": "Agents",
    "lede": "Agentes operacionais do LAB: presença, papéis, workflows e limites.",
    "layout": "list_with_preview",
    "components": [
      "PageHeader",
      "AgentList",
      "AttendanceStatus",
      "AssignedWorkflows",
      "PermissionSummary",
      "AgentRunHistory",
      "InspectorPreview"
    ],
    "data": [
      "agents",
      "llms",
      "workorders",
      "receipts",
      "ghosts"
    ],
    "sources": [],
    "preview_kinds": [
      "agent",
      "llm",
      "workorder",
      "receipt",
      "ghost"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "AgentList",
          "AttendanceStatus",
          "AssignedWorkflows",
          "PermissionSummary",
          "AgentRunHistory"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "agent",
          "llm",
          "workorder",
          "receipt",
          "ghost"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "research": {
    "title": "Research",
    "lede": "Arena de pesquisa digital do LAB.",
    "layout": "workbench",
    "components": [
      "PageHeader",
      "ResearchWorkbench",
      "HypothesisList",
      "ExperimentCards",
      "PaperQueue",
      "ResultTimeline",
      "ResearchComposer",
      "InspectorPreview"
    ],
    "data": [
      "research_items",
      "benchmarks",
      "documents",
      "receipts",
      "ghosts"
    ],
    "sources": [],
    "preview_kinds": [
      "document",
      "benchmark",
      "receipt",
      "ghost"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "ResearchWorkbench",
          "HypothesisList",
          "ExperimentCards",
          "PaperQueue",
          "ResultTimeline",
          "ResearchComposer"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "document",
          "benchmark",
          "receipt",
          "ghost"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "benchmarks": {
    "title": "Benchmarks",
    "lede": "Produção, execução e validação de benchmarks comparáveis internacionalmente.",
    "layout": "analytics_workbench_with_preview",
    "components": [
      "PageHeader",
      "BenchmarkSuiteList",
      "DatasetRows",
      "RunHistory",
      "MetricCards",
      "LeaderboardDraft",
      "ReportBuilder",
      "ReproducibilityChecklist",
      "InspectorPreview"
    ],
    "data": [
      "benchmarks",
      "datasets",
      "benchmark_runs",
      "receipts",
      "ghosts"
    ],
    "sources": [],
    "preview_kinds": [
      "benchmark",
      "receipt",
      "ghost"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "BenchmarkSuiteList",
          "DatasetRows",
          "RunHistory",
          "MetricCards",
          "LeaderboardDraft",
          "ReportBuilder",
          "ReproducibilityChecklist"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "benchmark",
          "receipt",
          "ghost"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "code": {
    "title": "Code",
    "lede": "Engenharia de software com LLMs locais, premium calls escassas e LogLine.",
    "layout": "code_workbench",
    "components": [
      "PageHeader",
      "CodeComposer",
      "FileExplorer",
      "DiffViewer",
      "PlanPanel",
      "LogPanel",
      "TestResults",
      "PremiumCallMeter",
      "ReceiptPreview",
      "InspectorPreview"
    ],
    "data": [
      "workorders",
      "receipts",
      "ghosts",
      "llms"
    ],
    "sources": [],
    "preview_kinds": [
      "code",
      "workorder",
      "receipt",
      "ghost",
      "llm"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "CodeComposer",
          "FileExplorer",
          "DiffViewer",
          "PlanPanel",
          "LogPanel",
          "TestResults",
          "PremiumCallMeter",
          "ReceiptPreview"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "code",
          "workorder",
          "receipt",
          "ghost",
          "llm"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "reviews": {
    "title": "Reviews",
    "lede": "Revisões de mudanças, workorders e decisões antes de fechamento.",
    "layout": "review_workbench",
    "components": [
      "PageHeader",
      "ReviewQueue",
      "DiffReview",
      "GateDecisionPanel",
      "CommentThread",
      "ReviewChecklist",
      "InspectorPreview"
    ],
    "data": [
      "reviews",
      "gate_decisions",
      "workorders",
      "documents",
      "receipts"
    ],
    "sources": [],
    "preview_kinds": [
      "gate",
      "workorder",
      "document",
      "receipt"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "ReviewQueue",
          "DiffReview",
          "GateDecisionPanel",
          "CommentThread",
          "ReviewChecklist"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "gate",
          "workorder",
          "document",
          "receipt"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "financeiro": {
    "title": "Financeiro",
    "lede": "Contas, orçamento, custos e gastos do LAB.",
    "layout": "finance_dashboard_with_preview",
    "components": [
      "PageHeader",
      "FinanceOverviewCards",
      "DueBills",
      "BudgetProgress",
      "SpendingTimeline",
      "CategoryBreakdown",
      "InspectorPreview"
    ],
    "data": [
      "finance_records",
      "vendors",
      "costs",
      "documents"
    ],
    "sources": [],
    "preview_kinds": [
      "cost",
      "vendor",
      "document"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "FinanceOverviewCards",
          "DueBills",
          "BudgetProgress",
          "SpendingTimeline",
          "CategoryBreakdown"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "cost",
          "vendor",
          "document"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "costs": {
    "title": "Costs",
    "lede": "Custos atribuídos por entidade, projeto, máquina, LLM e workflow.",
    "layout": "analytics_table_with_preview",
    "components": [
      "PageHeader",
      "CostTable",
      "CostAllocationCards",
      "CostByEntity",
      "TrendCharts",
      "CostAnomalyList",
      "InspectorPreview"
    ],
    "data": [
      "costs",
      "registry_entities",
      "vendors",
      "receipts"
    ],
    "sources": [],
    "preview_kinds": [
      "cost",
      "entity",
      "vendor",
      "receipt"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "CostTable",
          "CostAllocationCards",
          "CostByEntity",
          "TrendCharts",
          "CostAnomalyList"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "cost",
          "entity",
          "vendor",
          "receipt"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "vendors": {
    "title": "Vendors",
    "lede": "Fornecedores, assinaturas e relações comerciais do LAB.",
    "layout": "list_with_preview",
    "components": [
      "PageHeader",
      "VendorList",
      "SubscriptionRows",
      "ContractLinks",
      "PaymentStatus",
      "ContactInfo",
      "InspectorPreview"
    ],
    "data": [
      "vendors",
      "finance_records",
      "legal_records",
      "documents"
    ],
    "sources": [],
    "preview_kinds": [
      "vendor",
      "cost",
      "legal",
      "document"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "VendorList",
          "SubscriptionRows",
          "ContractLinks",
          "PaymentStatus",
          "ContactInfo"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "vendor",
          "cost",
          "legal",
          "document"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "legal": {
    "title": "Legal",
    "lede": "Contratos, obrigações, endereços oficiais, riscos e correspondência.",
    "layout": "legal_rows_with_preview",
    "components": [
      "PageHeader",
      "LegalObligationRows",
      "ContractCards",
      "RiskBadges",
      "OfficialAddressCard",
      "CorrespondenceLog",
      "DocumentPreview",
      "InspectorPreview"
    ],
    "data": [
      "legal_records",
      "documents",
      "vendors",
      "registry_entities"
    ],
    "sources": [],
    "preview_kinds": [
      "legal",
      "document",
      "vendor",
      "entity"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "LegalObligationRows",
          "ContractCards",
          "RiskBadges",
          "OfficialAddressCard",
          "CorrespondenceLog",
          "DocumentPreview"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "legal",
          "document",
          "vendor",
          "entity"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "policies": {
    "title": "Policies",
    "lede": "Regras operáveis que governam registros, ações e decisões.",
    "layout": "settings_rows_with_preview",
    "components": [
      "PageHeader",
      "PolicyList",
      "PolicyScopeBadges",
      "PolicyStatus",
      "PolicyEditorPreview",
      "LinkedGates",
      "InspectorPreview"
    ],
    "data": [
      "policies",
      "gate_decisions"
    ],
    "sources": [],
    "preview_kinds": [
      "policy",
      "gate"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "PolicyList",
          "PolicyScopeBadges",
          "PolicyStatus",
          "PolicyEditorPreview",
          "LinkedGates"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "policy",
          "gate"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "gates": {
    "title": "Gates",
    "lede": "Decisões de admissão antes de execução, mutação ou fechamento.",
    "layout": "decision_queue_with_preview",
    "components": [
      "PageHeader",
      "GateDecisionQueue",
      "DecisionCards",
      "ApprovalRequests",
      "GateHistory",
      "ReasonPanel",
      "InspectorPreview"
    ],
    "data": [
      "gate_decisions",
      "policies",
      "receipts",
      "ghosts"
    ],
    "sources": [],
    "preview_kinds": [
      "gate",
      "policy",
      "receipt",
      "ghost"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "GateDecisionQueue",
          "DecisionCards",
          "ApprovalRequests",
          "GateHistory",
          "ReasonPanel"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "gate",
          "policy",
          "receipt",
          "ghost"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "secrets": {
    "title": "Secrets",
    "lede": "Referências a segredos, configs e credenciais sem expor valores.",
    "layout": "secure_rows_with_preview",
    "components": [
      "PageHeader",
      "SecretReferenceRows",
      "ProviderStatus",
      "MissingSecretWarnings",
      "AccessPolicyLinks",
      "InspectorPreview"
    ],
    "data": [
      "secrets",
      "policies",
      "connections"
    ],
    "sources": [],
    "preview_kinds": [
      "json",
      "policy"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "SecretReferenceRows",
          "ProviderStatus",
          "MissingSecretWarnings",
          "AccessPolicyLinks"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "json",
          "policy"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "connections": {
    "title": "Connections",
    "lede": "Serviços externos conectados ao LAB.",
    "layout": "settings_groups_with_preview",
    "components": [
      "PageHeader",
      "ConnectionGroups",
      "ProviderRows",
      "ConnectedBadges",
      "ConfigureActions",
      "MCPMarketplaceLikeList",
      "InspectorPreview"
    ],
    "data": [
      "connections",
      "secrets",
      "policies"
    ],
    "sources": [],
    "preview_kinds": [
      "json",
      "policy"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "ConnectionGroups",
          "ProviderRows",
          "ConnectedBadges",
          "ConfigureActions",
          "MCPMarketplaceLikeList"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "json",
          "policy"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "schedules": {
    "title": "Schedules",
    "lede": "Rotinas, expedições e workflows agendados do LAB.",
    "layout": "calendar_with_preview",
    "components": [
      "PageHeader",
      "ScheduleCalendar",
      "RecurringWorkflowRows",
      "UpcomingRuns",
      "MissedSchedules",
      "ScheduleQuality",
      "InspectorPreview"
    ],
    "data": [
      "schedules",
      "workorders",
      "ghosts",
      "receipts"
    ],
    "sources": [],
    "preview_kinds": [
      "workorder",
      "ghost",
      "receipt"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "ScheduleCalendar",
          "RecurringWorkflowRows",
          "UpcomingRuns",
          "MissedSchedules",
          "ScheduleQuality"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "workorder",
          "ghost",
          "receipt"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "analytics": {
    "title": "Analytics",
    "lede": "Métricas de qualidade, custo, uso e operação do LAB.",
    "layout": "analytics",
    "components": [
      "PageHeader",
      "MetricCards",
      "Charts",
      "SegmentedControls",
      "ExportButton",
      "BreakdownTables",
      "InspectorPreview"
    ],
    "data": [
      "analytics",
      "costs",
      "receipts",
      "ghosts",
      "workorders"
    ],
    "sources": [],
    "preview_kinds": [
      "json",
      "receipt",
      "ghost"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "MetricCards",
          "Charts",
          "SegmentedControls",
          "ExportButton",
          "BreakdownTables"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "json",
          "receipt",
          "ghost"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "settings": {
    "title": "Settings",
    "lede": "Configurações gerais do minilab.work.",
    "layout": "settings_mode",
    "components": [
      "PageHeader",
      "SettingsRail",
      "SettingsSearch",
      "SettingsGroups",
      "ToggleRows",
      "SelectRows",
      "DangerZone"
    ],
    "data": [
      "settings",
      "connections",
      "secrets",
      "policies"
    ],
    "sources": [],
    "preview_kinds": [
      "json"
    ],
    "layout_intent": "manifest_declared_composition",
    "slots": {
      "header": {
        "component": "PageHeader",
        "source": "03.page-manifest.yaml"
      },
      "middle": {
        "components": [
          "SettingsRail",
          "SettingsSearch",
          "SettingsGroups",
          "ToggleRows",
          "SelectRows",
          "DangerZone"
        ],
        "notes": "Render in declared order until page receives a custom blueprint."
      },
      "preview": {
        "component": "InspectorPreview",
        "preview_kinds": [
          "json"
        ],
        "default_behavior": "open_on_interactive_record_click"
      }
    }
  },
  "expedicoes": {
    "title": "Expedições",
    "lede": "A fila viva da pessoa jurídica, apresentada pela superfície oficial do 256-eve.",
    "layout": "embedded_live_surface",
    "components": [
      "EveFrame"
    ],
    "data": [],
    "sources": [],
    "preview_kinds": [],
    "layout_intent": "embedded_mature_surface",
    "slots": {
      "surface": {
        "component": "EveFrame",
        "source": "256-eve:/expedicoes"
      }
    }
  },
  "research-profile": {
    "title": "Research Profile",
    "lede": "A fonte de longo prazo do que o LAB está pesquisando, exibida diretamente do repositório.",
    "layout": "research_plan_source_of_truth",
    "components": [
      "PageHeader",
      "MetricCard",
      "SourceStatusPill",
      "InspectorPreview"
    ],
    "data": [],
    "sources": [
      "lab.research.current"
    ],
    "preview_kinds": [
      "json"
    ],
    "layout_intent": "render_exact_research_source_with_hash_identity",
    "slots": {
      "metrics": {
        "component": "MetricCard",
        "count": 4
      },
      "source_of_truth": {
        "source": "lab.research.current"
      },
      "preview": {
        "kind": "json"
      }
    }
  },
  "milestones": {
    "title": "Milestones",
    "lede": "Os marcos de médio prazo da pesquisa, com identidade de conteúdo verificável.",
    "layout": "research_plan_source_of_truth",
    "components": [
      "PageHeader",
      "MetricCard",
      "SourceStatusPill",
      "InspectorPreview"
    ],
    "data": [],
    "sources": [
      "lab.research.current"
    ],
    "preview_kinds": [
      "json"
    ],
    "layout_intent": "render_exact_research_source_with_hash_identity",
    "slots": {
      "metrics": {
        "component": "MetricCard",
        "count": 4
      },
      "source_of_truth": {
        "source": "lab.research.current"
      },
      "preview": {
        "kind": "json"
      }
    }
  },
  "short-term": {
    "title": "Short Term",
    "lede": "O plano de curto prazo que deve tocar a realidade em seguida, exibido sem paráfrase.",
    "layout": "research_plan_source_of_truth",
    "components": [
      "PageHeader",
      "MetricCard",
      "SourceStatusPill",
      "InspectorPreview"
    ],
    "data": [],
    "sources": [
      "lab.research.current"
    ],
    "preview_kinds": [
      "json"
    ],
    "layout_intent": "render_exact_research_source_with_hash_identity",
    "slots": {
      "metrics": {
        "component": "MetricCard",
        "count": 4
      },
      "source_of_truth": {
        "source": "lab.research.current"
      },
      "preview": {
        "kind": "json"
      }
    }
  }
} as const;
