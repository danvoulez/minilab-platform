/* AUTO-GENERATED from minilab UI manifests. Do not edit manually. */

export const GENERATED_PAGE_CONTRACTS = {
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
    "external_surfaces": [
      "256-eve:/observatorio"
    ],
    "preview_kinds": [
      "json"
    ],
    "directions": {
      "refresh": "5m_after_each_load_cycle",
      "summary": "source_backed_metrics_not_synthetic_report",
      "research": "show_plan_identity_and_open_exact_level_payload_in_preview",
      "observatorio": "embed_live_256_eve_surface_do_not_reimplement",
      "truth": "surface_source_status_and_never_invent_fallback_counts"
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
    "directions": {
      "refresh": "5m_after_each_load_cycle",
      "scope": "one_off_events_only",
      "columns": [
        "dan",
        "lab"
      ],
      "collisions": "render_only_overlaps_returned_by_source",
      "truth": "calendar_is_observation_not_judgement"
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
    "directions": {
      "refresh": "2m_after_each_load_cycle",
      "repository_model": "one_tree_with_folder_activity_not_fake_nested_repositories",
      "dirty_state": "show_paths_not_only_counts",
      "remote_state": "always_show_freshness_of_last_fetch"
    },
    "truth_rules": {
      "plan": "declared_intent_never_inferred_from_code",
      "stage_state": "declared_does_not_mean_pending_or_complete",
      "progress": "unknown_without_declared_evidence_channel",
      "gaps": "declared_not_scanned_or_guessed",
      "folders": "folder_activity_is_not_repository_state"
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
    "directions": {
      "refresh": "5m_after_each_load_cycle",
      "grouping": "calendar_rrule_frequency",
      "truth": "show_declared_recurring_events_without_inventing_attendance_or_compliance"
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
    "preview_kinds": [
      "workorder",
      "entity",
      "receipt",
      "ghost",
      "gate"
    ]
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
    "preview_kinds": [
      "receipt",
      "entity",
      "workorder",
      "ghost",
      "machine"
    ],
    "flows": [
      "preview_selection",
      "receipt_export",
      "open_evidence"
    ],
    "directions": {
      "meaning": "scoped_proof_closure",
      "not": [
        "activity_log",
        "agent_storytelling"
      ],
      "bridge": "receipt_can_resolve_ghosts"
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
    "preview_kinds": [
      "ghost",
      "entity",
      "workorder",
      "receipt",
      "sensor",
      "machine"
    ],
    "flows": [
      "preview_selection",
      "ghost_refine",
      "ghost_resolve_with_receipt"
    ],
    "directions": {
      "meaning": "honest_incompleteness",
      "tone": "useful_not_alarmist",
      "bridge": "ghost_can_resolve_with_receipt"
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
    "preview_kinds": [
      "registry_record",
      "registry_admission"
    ],
    "mutations": {
      "mode": "reviewed_proposal_then_provider_admission",
      "direct_edit": false,
      "authority": "provider_receipt"
    },
    "flows": [
      "register",
      "registry_mutation",
      "preview_selection"
    ],
    "directions": {
      "proposer": "assistive_and_replaceable_never_authoritative",
      "authority": "platform_contract_plus_provider_receipt",
      "initial_middle": "complete_platform_contract_catalog",
      "existing_entity_access": "provider_registry_list_and_inspector",
      "mutation_rule": "reviewed_platform_payload_plus_provider_validation",
      "provider_subset_does_not_shrink_ontology": true,
      "no_fake_list": true
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
    "preview_kinds": [
      "sensor",
      "entity",
      "ghost",
      "receipt"
    ],
    "flows": [
      "preview_selection",
      "sensor_import",
      "sensor_sync",
      "sensor_to_registry",
      "conclusion_to_record"
    ],
    "directions": {
      "detect_alive": true,
      "can_add_to_registry": true,
      "can_import": true,
      "can_sync_supabase": true,
      "intelligence_source": "primary"
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
    "preview_kinds": [
      "document",
      "entity"
    ]
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
    "preview_kinds": [
      "document",
      "entity"
    ]
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
    "preview_kinds": [
      "ghost",
      "receipt",
      "workorder"
    ]
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
    "preview_kinds": [
      "entity",
      "workorder",
      "ghost",
      "receipt"
    ]
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
    "preview_kinds": [
      "machine",
      "runtime",
      "receipt",
      "ghost",
      "gate"
    ],
    "directions": {
      "scope": "LAB_8GB_LAB_512_LAB_256",
      "observe": [
        "online",
        "wifi",
        "last_boot",
        "last_access",
        "connectivity",
        "work",
        "efficiency",
        "jobs",
        "maintenance",
        "security"
      ]
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
    "preview_kinds": [
      "runtime",
      "machine",
      "receipt",
      "ghost"
    ]
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
    "preview_kinds": [
      "llm",
      "agent",
      "benchmark",
      "cost",
      "receipt"
    ]
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
    "preview_kinds": [
      "agent",
      "llm",
      "workorder",
      "receipt",
      "ghost"
    ]
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
    "preview_kinds": [
      "document",
      "benchmark",
      "receipt",
      "ghost"
    ]
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
    "preview_kinds": [
      "benchmark",
      "receipt",
      "ghost"
    ]
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
    "preview_kinds": [
      "code",
      "workorder",
      "receipt",
      "ghost",
      "llm"
    ]
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
    "preview_kinds": [
      "gate",
      "workorder",
      "document",
      "receipt"
    ]
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
    "preview_kinds": [
      "cost",
      "vendor",
      "document"
    ]
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
    "preview_kinds": [
      "cost",
      "entity",
      "vendor",
      "receipt"
    ]
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
    "preview_kinds": [
      "vendor",
      "cost",
      "legal",
      "document"
    ]
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
    "preview_kinds": [
      "legal",
      "document",
      "vendor",
      "entity"
    ]
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
    "preview_kinds": [
      "policy",
      "gate"
    ]
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
    "preview_kinds": [
      "gate",
      "policy",
      "receipt",
      "ghost"
    ]
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
    "preview_kinds": [
      "json",
      "policy"
    ],
    "forbidden": [
      "secret_values"
    ]
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
    "preview_kinds": [
      "json",
      "policy"
    ]
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
    "preview_kinds": [
      "workorder",
      "ghost",
      "receipt"
    ]
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
    "preview_kinds": [
      "json",
      "receipt",
      "ghost"
    ]
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
    "preview_kinds": [
      "json"
    ],
    "mode": {
      "has_own_settings_rail": true
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
    "external_surfaces": [
      "256-eve:/expedicoes"
    ],
    "preview_kinds": [],
    "directions": {
      "source": "256-eve",
      "render": "iframe_not_reimplementation",
      "open_external": true
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
    "directions": {
      "horizon": "long term",
      "source": "provider_lab_research_capability",
      "render": "exact_source_text_without_paraphrase",
      "identity": "show_level_hash_github_blob_and_combined_plan_hash"
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
    "directions": {
      "horizon": "mid term",
      "source": "provider_lab_research_capability",
      "render": "exact_source_text_without_paraphrase",
      "identity": "show_level_hash_github_blob_and_combined_plan_hash"
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
    "directions": {
      "horizon": "short term",
      "source": "provider_lab_research_capability",
      "render": "exact_source_text_without_paraphrase",
      "identity": "show_level_hash_github_blob_and_combined_plan_hash"
    }
  }
} as const;
