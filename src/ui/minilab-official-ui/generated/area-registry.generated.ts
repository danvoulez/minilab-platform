/* AUTO-GENERATED from minilab UI manifests. Do not edit manually. */

export const GENERATED_AREA_REGISTRY = {
  "lab-today": {
    "nav_group": "core",
    "title": "Lab Today",
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
    "preview": [
      "json"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "lab-calendar": {
    "nav_group": "core",
    "title": "Lab Calendar",
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
    "preview": [
      "json"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "lab-construction": {
    "nav_group": "core",
    "title": "Lab Construction",
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
    "preview": [
      "json"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "lab-routine": {
    "nav_group": "core",
    "title": "Lab Routine",
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
    "preview": [
      "json"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "workorders": {
    "nav_group": "hidden",
    "title": "Workorders",
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
    "preview": [
      "workorder",
      "entity",
      "receipt",
      "ghost",
      "gate"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "receipts": {
    "nav_group": "hidden",
    "title": "Receipts",
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
    "preview": [
      "receipt",
      "entity",
      "workorder",
      "ghost",
      "machine"
    ],
    "rules": [
      "page_header_required",
      "preview_for_details",
      "middle_uses_human_language",
      "preview_can_show_technical_detail",
      "receipt_not_activity_log"
    ],
    "status": "implemented"
  },
  "ghosts": {
    "nav_group": "hidden",
    "title": "Ghosts",
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
    "preview": [
      "ghost",
      "entity",
      "workorder",
      "receipt",
      "sensor",
      "machine"
    ],
    "rules": [
      "page_header_required",
      "preview_for_details",
      "middle_uses_human_language",
      "preview_can_show_technical_detail",
      "ghosts_resolve_to_receipts"
    ],
    "status": "implemented"
  },
  "registry": {
    "nav_group": "registry_and_knowledge",
    "title": "Registry",
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
    "preview": [
      "registry_record",
      "registry_admission"
    ],
    "rules": [
      "no_direct_registry_edit",
      "no_local_validity",
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail",
      "registry_proposer_not_authority"
    ],
    "status": "implemented"
  },
  "sensors": {
    "nav_group": "registry_and_knowledge",
    "title": "Sensors",
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
    "preview": [
      "sensor",
      "entity",
      "ghost",
      "receipt"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail",
      "sensor_liveness_explicit",
      "sensor_registry_bridge"
    ],
    "status": "implemented"
  },
  "knowledge": {
    "nav_group": "registry_and_knowledge",
    "title": "Knowledge",
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
    "preview": [
      "document",
      "entity"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "docs": {
    "nav_group": "registry_and_knowledge",
    "title": "Docs",
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
    "preview": [
      "document",
      "entity"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "human": {
    "nav_group": "world",
    "title": "Human",
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
    "preview": [
      "ghost",
      "receipt",
      "workorder"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "santo-andre": {
    "nav_group": "world",
    "title": "Laboratório Santo Andre",
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
    "preview": [
      "entity",
      "workorder",
      "ghost",
      "receipt"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "machines": {
    "nav_group": "world",
    "title": "Machines",
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
    "preview": [
      "machine",
      "runtime",
      "receipt",
      "ghost",
      "gate"
    ],
    "rules": [
      "page_header_required",
      "preview_for_details",
      "middle_uses_human_language",
      "preview_can_show_technical_detail",
      "machine_observability_depth"
    ],
    "status": "implemented"
  },
  "runtimes": {
    "nav_group": "world",
    "title": "Runtimes",
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
    "preview": [
      "runtime",
      "machine",
      "receipt",
      "ghost"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "llms": {
    "nav_group": "world",
    "title": "LLMs",
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
    "preview": [
      "llm",
      "agent",
      "benchmark",
      "cost",
      "receipt"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "agents": {
    "nav_group": "world",
    "title": "Agents",
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
    "preview": [
      "agent",
      "llm",
      "workorder",
      "receipt",
      "ghost"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "research": {
    "nav_group": "workbenches",
    "title": "Research",
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
    "preview": [
      "document",
      "benchmark",
      "receipt",
      "ghost"
    ],
    "rules": [
      "page_header_required",
      "no_execution_from_natural_language",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "planned"
  },
  "benchmarks": {
    "nav_group": "workbenches",
    "title": "Benchmarks",
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
    "preview": [
      "benchmark",
      "receipt",
      "ghost"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "planned"
  },
  "code": {
    "nav_group": "workbenches",
    "title": "Code",
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
    "preview": [
      "code",
      "workorder",
      "receipt",
      "ghost",
      "llm"
    ],
    "rules": [
      "page_header_required",
      "no_execution_from_natural_language",
      "middle_uses_human_language",
      "preview_can_show_technical_detail",
      "receipt_not_activity_log",
      "ghosts_resolve_to_receipts"
    ],
    "status": "planned"
  },
  "reviews": {
    "nav_group": "workbenches",
    "title": "Reviews",
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
    "preview": [
      "gate",
      "workorder",
      "document",
      "receipt"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "financeiro": {
    "nav_group": "institutional",
    "title": "Financeiro",
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
    "preview": [
      "cost",
      "vendor",
      "document"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "costs": {
    "nav_group": "institutional",
    "title": "Costs",
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
    "preview": [
      "cost",
      "entity",
      "vendor",
      "receipt"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "vendors": {
    "nav_group": "institutional",
    "title": "Vendors",
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
    "preview": [
      "vendor",
      "cost",
      "legal",
      "document"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "legal": {
    "nav_group": "institutional",
    "title": "Legal",
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
    "preview": [
      "legal",
      "document",
      "vendor",
      "entity"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "policies": {
    "nav_group": "admin",
    "title": "Policies",
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
    "preview": [
      "policy",
      "gate"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "gates": {
    "nav_group": "admin",
    "title": "Gates",
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
    "preview": [
      "gate",
      "policy",
      "receipt",
      "ghost"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "secrets": {
    "nav_group": "admin",
    "title": "Secrets",
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
    "preview": [
      "json",
      "policy"
    ],
    "rules": [
      "no_secret_values",
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "connections": {
    "nav_group": "admin",
    "title": "Connections",
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
    "preview": [
      "json",
      "policy"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "schedules": {
    "nav_group": "admin",
    "title": "Schedules",
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
    "preview": [
      "workorder",
      "ghost",
      "receipt"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "analytics": {
    "nav_group": "admin",
    "title": "Analytics",
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
    "preview": [
      "json",
      "receipt",
      "ghost"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "planned"
  },
  "settings": {
    "nav_group": "admin",
    "title": "Settings",
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
    "preview": [
      "json"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language"
    ],
    "status": "planned"
  },
  "expedicoes": {
    "nav_group": "core",
    "title": "Expedições",
    "layout": "embedded_live_surface",
    "components": [
      "EveFrame"
    ],
    "data": [],
    "sources": [],
    "preview": [],
    "rules": [
      "page_header_required"
    ],
    "status": "implemented"
  },
  "research-profile": {
    "nav_group": "core",
    "title": "Research Profile",
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
    "preview": [
      "json"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "milestones": {
    "nav_group": "core",
    "title": "Milestones",
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
    "preview": [
      "json"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  },
  "short-term": {
    "nav_group": "core",
    "title": "Short Term",
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
    "preview": [
      "json"
    ],
    "rules": [
      "page_header_required",
      "middle_uses_human_language",
      "preview_can_show_technical_detail"
    ],
    "status": "implemented"
  }
} as const;
