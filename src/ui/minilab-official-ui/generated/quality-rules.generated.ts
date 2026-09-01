/* AUTO-GENERATED from minilab UI manifests. Do not edit manually. */

export const GENERATED_QUALITY_RULES = {
  "schema": "minilab.ui.quality_rules.v1",
  "document_type": "quality_rules",
  "rules": [
    {
      "id": "no_direct_registry_edit",
      "applies_to": [
        "Registry",
        "EntityPreview",
        "RegistryTypeTable"
      ],
      "assertion": "Registry mutations must pass through a reviewed platform proposal and a provider admission capability; no direct edit."
    },
    {
      "id": "no_local_validity",
      "applies_to": [
        "RegisterActions",
        "AIProposalCard",
        "LogLineRecordCard"
      ],
      "assertion": "A valid Registry state exists only after a provider returns authoritative content/state/admission identifiers."
    },
    {
      "id": "no_secret_values",
      "applies_to": [
        "Secrets",
        "ProviderStatus",
        "SecretReferenceRows"
      ],
      "assertion": "Never render secret values."
    },
    {
      "id": "page_header_required",
      "applies_to": "*",
      "assertion": "Every page must render PageHeader with title and lede."
    },
    {
      "id": "preview_for_details",
      "applies_to": [
        "EntityRow",
        "EntityTable",
        "MachineCard",
        "GhostCard",
        "ReceiptCard"
      ],
      "assertion": "Interactive records open preview, not modal detail."
    },
    {
      "id": "no_execution_from_natural_language",
      "applies_to": [
        "BigComposer",
        "CodeComposer",
        "ResearchComposer",
        "RegisterDialog"
      ],
      "assertion": "Natural language produces proposals, not direct execution."
    },
    {
      "id": "middle_uses_human_language",
      "applies_to": [
        "PageFrame",
        "PageHeader",
        "SectionCard"
      ],
      "assertion": "Main surface must not expose raw engine jargon."
    },
    {
      "id": "preview_can_show_technical_detail",
      "applies_to": [
        "InspectorPreview",
        "JsonPreview",
        "CodePreview"
      ],
      "assertion": "Technical detail belongs in preview."
    },
    {
      "id": "registry_proposer_not_authority",
      "applies_to": [
        "Registry",
        "LocalOperatorComposer",
        "AIProposalCard"
      ],
      "assertion": "Proposal assistance may interpret text, but the model/browser is never operational authority; the platform contract defines validity and the provider returns operational truth."
    },
    {
      "id": "lab_report_computed_on_load",
      "applies_to": [
        "LAB",
        "RealtimeLabReport"
      ],
      "assertion": "LAB report is calculated on load, not a cron report."
    },
    {
      "id": "sensor_liveness_explicit",
      "applies_to": [
        "Sensors",
        "SensorAliveGrid"
      ],
      "assertion": "Sensors must show liveness/alive state explicitly."
    },
    {
      "id": "sensor_registry_bridge",
      "applies_to": [
        "Sensors",
        "SensorToRegistryAction"
      ],
      "assertion": "Unregistered signals must be able to become Registry candidates or ghosts."
    },
    {
      "id": "machine_observability_depth",
      "applies_to": [
        "Machines",
        "MachinePreview"
      ],
      "assertion": "Machines page must show connectivity, access, jobs, maintenance, security and runtimes."
    },
    {
      "id": "receipt_not_activity_log",
      "applies_to": [
        "Receipts",
        "ReceiptCard",
        "ReceiptPreview"
      ],
      "assertion": "Receipts are proof ledger entries, not generic activity logs."
    },
    {
      "id": "ghosts_resolve_to_receipts",
      "applies_to": [
        "Ghosts",
        "GhostPreview",
        "ReceiptPreview"
      ],
      "assertion": "Ghosts can resolve through evidence into receipts."
    }
  ]
} as const;
