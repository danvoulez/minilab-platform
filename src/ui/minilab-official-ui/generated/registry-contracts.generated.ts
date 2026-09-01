/* AUTO-GENERATED from minilab UI manifests. Do not edit manually. */

export const GENERATED_REGISTRY_CONTRACTS = {
  "human": {
    "entity_kind": "human",
    "schema_version": "minilab.registry.human.v1",
    "label": "Human",
    "description": "Pessoa durável na plataforma, com identidade, papel e contexto humano.",
    "match_terms": [
      "human",
      "humano",
      "pessoa",
      "person"
    ],
    "attributes": {
      "required": [
        "role"
      ],
      "optional": [
        "contact",
        "care_preferences",
        "schedule",
        "notes"
      ],
      "defaults": {
        "role": "unspecified"
      }
    },
    "preview": [
      "identity",
      "checkins",
      "routine",
      "receipts",
      "ghosts"
    ]
  },
  "machine": {
    "entity_kind": "machine",
    "schema_version": "minilab.registry.machine.v1",
    "label": "Machine",
    "description": "Máquina física ou host durável, separada de runtimes e agentes que rodam nela.",
    "match_terms": [
      "machine",
      "maquina",
      "máquina",
      "computador",
      "computer",
      "server",
      "servidor",
      "mac"
    ],
    "attributes": {
      "required": [
        "role",
        "status"
      ],
      "optional": [
        "serial",
        "location",
        "current_runtime",
        "owner",
        "wifi",
        "last_boot",
        "hostname",
        "architecture"
      ],
      "defaults": {
        "role": "unspecified",
        "status": "unknown"
      }
    },
    "preview": [
      "identity",
      "heartbeats",
      "runtimes",
      "receipts",
      "ghosts"
    ]
  },
  "sensor": {
    "entity_kind": "sensor",
    "schema_version": "minilab.registry.sensor.v1",
    "label": "Sensor",
    "description": "Fonte observável com leituras, calibração e estado de sincronização.",
    "match_terms": [
      "sensor",
      "probe",
      "detector"
    ],
    "attributes": {
      "required": [
        "kind",
        "status"
      ],
      "optional": [
        "source",
        "calibration",
        "registry_entity_id",
        "last_reading",
        "sync_status"
      ],
      "defaults": {
        "kind": "unknown",
        "status": "unknown"
      }
    },
    "preview": [
      "identity",
      "readings",
      "conclusions",
      "sync",
      "receipts",
      "ghosts"
    ]
  },
  "llm": {
    "entity_kind": "llm",
    "schema_version": "minilab.registry.llm.v1",
    "label": "LLM",
    "description": "Modelo de linguagem utilizável pela plataforma, local ou remoto, com papel explícito.",
    "match_terms": [
      "llm",
      "model language",
      "language model",
      "modelo de linguagem"
    ],
    "attributes": {
      "required": [
        "kind",
        "role"
      ],
      "optional": [
        "provider",
        "local_or_premium",
        "benchmark_status",
        "cost_profile"
      ],
      "defaults": {
        "kind": "unknown",
        "role": "unspecified"
      }
    },
    "preview": [
      "capabilities",
      "usage",
      "benchmarks",
      "costs",
      "policies"
    ]
  },
  "agent": {
    "entity_kind": "agent",
    "schema_version": "minilab.registry.agent.v1",
    "label": "Agent",
    "description": "Agente operacional que combina identidade, papel, runtime, modelo e permissões.",
    "match_terms": [
      "agent",
      "agente",
      "operator",
      "operador"
    ],
    "attributes": {
      "required": [
        "role",
        "status"
      ],
      "optional": [
        "llm_id",
        "runtime_id",
        "assigned_workflows",
        "permissions"
      ],
      "defaults": {
        "role": "unspecified",
        "status": "unknown"
      }
    },
    "preview": [
      "attendance",
      "workflows",
      "permissions",
      "history"
    ]
  },
  "runtime": {
    "entity_kind": "runtime",
    "schema_version": "minilab.registry.runtime.v1",
    "label": "Runtime",
    "description": "Ambiente de execução compartilhável, versionado e localizável em uma ou mais máquinas.",
    "match_terms": [
      "runtime",
      "node",
      "python",
      "uv",
      "bun",
      "deno",
      "ollama"
    ],
    "attributes": {
      "required": [
        "kind",
        "status"
      ],
      "optional": [
        "version",
        "executable",
        "machine_id",
        "manager",
        "capabilities",
        "install_ref"
      ],
      "defaults": {
        "kind": "unknown",
        "status": "unknown"
      }
    },
    "preview": [
      "identity",
      "machines",
      "versions",
      "health",
      "receipts"
    ]
  },
  "service": {
    "entity_kind": "service",
    "schema_version": "minilab.registry.service.v1",
    "label": "Service",
    "description": "Serviço durável com responsabilidade, endpoint e dono de ciclo de vida explícitos.",
    "match_terms": [
      "service",
      "serviço",
      "servidor",
      "daemon",
      "api",
      "websocket"
    ],
    "attributes": {
      "required": [
        "role",
        "status"
      ],
      "optional": [
        "endpoint",
        "protocol",
        "port",
        "machine_id",
        "owner",
        "healthcheck"
      ],
      "defaults": {
        "role": "unspecified",
        "status": "unknown"
      }
    },
    "preview": [
      "identity",
      "endpoints",
      "health",
      "dependencies",
      "receipts"
    ]
  },
  "model": {
    "entity_kind": "model",
    "schema_version": "minilab.registry.model.v1",
    "label": "Model",
    "description": "Modelo computacional que não precisa ser um LLM e pode ser usado por serviços ou agentes.",
    "match_terms": [
      "model",
      "modelo"
    ],
    "attributes": {
      "required": [
        "kind",
        "role"
      ],
      "optional": [
        "provider",
        "version",
        "artifact_ref",
        "benchmark_status"
      ],
      "defaults": {
        "kind": "unknown",
        "role": "unspecified"
      }
    },
    "preview": [
      "identity",
      "capabilities",
      "benchmarks",
      "provenance"
    ]
  },
  "provider": {
    "entity_kind": "provider",
    "schema_version": "minilab.registry.provider.v1",
    "label": "Provider",
    "description": "Provedor externo ou interno de infraestrutura, modelos, APIs ou serviços.",
    "match_terms": [
      "provider",
      "provedor"
    ],
    "attributes": {
      "required": [
        "service",
        "status"
      ],
      "optional": [
        "contact",
        "account_ref",
        "region",
        "capabilities"
      ],
      "defaults": {
        "service": "unspecified",
        "status": "unknown"
      }
    },
    "preview": [
      "service",
      "connections",
      "costs",
      "policies"
    ]
  },
  "space": {
    "entity_kind": "space",
    "schema_version": "minilab.registry.space.v1",
    "label": "Physical Space",
    "description": "Espaço físico com papel institucional, ativos, manutenção e observações.",
    "match_terms": [
      "space",
      "espaço",
      "sala",
      "laboratório",
      "laboratorio",
      "lab"
    ],
    "attributes": {
      "required": [
        "role"
      ],
      "optional": [
        "address",
        "rooms",
        "assets",
        "sensors"
      ],
      "defaults": {
        "role": "unspecified"
      }
    },
    "preview": [
      "assets",
      "maintenance",
      "cleaning",
      "supply",
      "observations"
    ]
  },
  "document": {
    "entity_kind": "document",
    "schema_version": "minilab.registry.document.v1",
    "label": "Document",
    "description": "Documento durável com conteúdo referenciado, estado e relações institucionais.",
    "match_terms": [
      "document",
      "documento",
      "doc"
    ],
    "attributes": {
      "required": [
        "kind",
        "status"
      ],
      "optional": [
        "content_ref",
        "linked_entities",
        "last_reviewed"
      ],
      "defaults": {
        "kind": "unknown",
        "status": "draft"
      }
    },
    "preview": [
      "content",
      "metadata",
      "relations"
    ]
  },
  "idea": {
    "entity_kind": "idea",
    "schema_version": "minilab.registry.idea.v1",
    "label": "Idea",
    "description": "Ideia durável com estágio explícito e espaço para evolução sem apagar a história.",
    "match_terms": [
      "idea",
      "ideia",
      "conceito",
      "proposal",
      "proposta"
    ],
    "attributes": {
      "required": [
        "stage"
      ],
      "optional": [
        "summary",
        "notes"
      ],
      "defaults": {
        "stage": "raw"
      }
    },
    "enums": {
      "stage": [
        "raw",
        "exploring",
        "developing",
        "accepted",
        "rejected",
        "paused",
        "implemented"
      ]
    },
    "preview": [
      "identity",
      "history",
      "relations",
      "evidence"
    ]
  },
  "expedition": {
    "entity_kind": "expedition",
    "schema_version": "minilab.registry.expedition.v1",
    "label": "Expedition",
    "description": "Investigação durável que pode produzir tarefas, descobertas, evidência e relações.",
    "match_terms": [
      "expedition",
      "expedição",
      "expedicao",
      "investigação",
      "investigacao"
    ],
    "attributes": {
      "required": [
        "status"
      ],
      "optional": [
        "objective",
        "started_on",
        "completed_on",
        "summary",
        "notes"
      ],
      "defaults": {
        "status": "planned"
      }
    },
    "enums": {
      "status": [
        "planned",
        "active",
        "paused",
        "completed",
        "cancelled"
      ]
    },
    "preview": [
      "identity",
      "tasks",
      "discoveries",
      "evidence",
      "history"
    ]
  },
  "workflow": {
    "entity_kind": "workflow",
    "schema_version": "minilab.registry.workflow.v1",
    "label": "Workflow",
    "description": "Fluxo repetível com trigger, estado, agenda, agente e política opcionais.",
    "match_terms": [
      "workflow",
      "fluxo",
      "automação",
      "automacao"
    ],
    "attributes": {
      "required": [
        "trigger",
        "status"
      ],
      "optional": [
        "schedule",
        "agent_id",
        "policy_id"
      ],
      "defaults": {
        "trigger": "manual",
        "status": "draft"
      }
    },
    "preview": [
      "runs",
      "schedule",
      "receipts",
      "ghosts"
    ]
  },
  "benchmark": {
    "entity_kind": "benchmark",
    "schema_version": "minilab.registry.benchmark.v1",
    "label": "Benchmark",
    "description": "Prova comparável com métrica, dataset e reprodutibilidade explícitos.",
    "match_terms": [
      "benchmark",
      "avaliação",
      "avaliacao"
    ],
    "attributes": {
      "required": [
        "metric",
        "dataset"
      ],
      "optional": [
        "suite",
        "method",
        "reproducibility_status"
      ],
      "defaults": {}
    },
    "preview": [
      "runs",
      "metrics",
      "dataset",
      "report",
      "evidence"
    ]
  },
  "cost": {
    "entity_kind": "cost",
    "schema_version": "minilab.registry.cost.v1",
    "label": "Cost",
    "description": "Custo atribuído a período, entidade, fornecedor ou evidência financeira.",
    "match_terms": [
      "cost",
      "custo",
      "despesa",
      "expense"
    ],
    "attributes": {
      "required": [
        "amount",
        "currency",
        "kind"
      ],
      "optional": [
        "vendor_id",
        "entity_id",
        "period",
        "document_id"
      ],
      "defaults": {
        "currency": "EUR",
        "kind": "unspecified"
      }
    },
    "preview": [
      "allocation",
      "evidence",
      "vendor",
      "receipt"
    ]
  },
  "vendor": {
    "entity_kind": "vendor",
    "schema_version": "minilab.registry.vendor.v1",
    "label": "Vendor",
    "description": "Fornecedor ou parceiro com serviço, contratos, assinatura e estado de pagamento.",
    "match_terms": [
      "vendor",
      "fornecedor",
      "parceiro"
    ],
    "attributes": {
      "required": [
        "service"
      ],
      "optional": [
        "contact",
        "contracts",
        "subscriptions",
        "payment_status"
      ],
      "defaults": {
        "service": "unspecified"
      }
    },
    "preview": [
      "service",
      "costs",
      "contracts",
      "payments"
    ]
  },
  "legal": {
    "entity_kind": "legal",
    "schema_version": "minilab.registry.legal.v1",
    "label": "Legal Record",
    "description": "Registro jurídico ou obrigação com tipo, estado, prazo, risco e evidência documental.",
    "match_terms": [
      "legal",
      "contrato",
      "contract",
      "obrigação",
      "obrigacao"
    ],
    "attributes": {
      "required": [
        "kind",
        "status"
      ],
      "optional": [
        "deadline",
        "risk",
        "document_id",
        "related_vendor"
      ],
      "defaults": {
        "kind": "unknown",
        "status": "open"
      }
    },
    "preview": [
      "obligation",
      "risk",
      "documents",
      "correspondence"
    ]
  },
  "address": {
    "entity_kind": "address",
    "schema_version": "minilab.registry.address.v1",
    "label": "Address",
    "description": "Endereço institucional ou operacional que pode ser ligado a outra entidade.",
    "match_terms": [
      "address",
      "endereço",
      "endereco"
    ],
    "attributes": {
      "required": [
        "lines",
        "purpose"
      ],
      "optional": [
        "country",
        "postal_code",
        "linked_entity"
      ],
      "defaults": {
        "purpose": "unspecified"
      }
    },
    "preview": [
      "lines",
      "purpose",
      "linked_records"
    ]
  },
  "policy": {
    "entity_kind": "policy",
    "schema_version": "minilab.registry.policy.v1",
    "label": "Policy",
    "description": "Regra institucional versionável que governa ações, escopos e gates.",
    "match_terms": [
      "policy",
      "política",
      "politica",
      "regra"
    ],
    "attributes": {
      "required": [
        "scope",
        "status"
      ],
      "optional": [
        "rules",
        "owner",
        "effective_from"
      ],
      "defaults": {
        "scope": "platform",
        "status": "draft"
      }
    },
    "preview": [
      "scope",
      "rules",
      "gates",
      "history"
    ]
  },
  "secret_reference": {
    "entity_kind": "secret_reference",
    "schema_version": "minilab.registry.secret_reference.v1",
    "label": "Secret Reference",
    "description": "Referência a segredo sem material secreto no Registry; valores permanecem no cofre do provider.",
    "match_terms": [
      "secret",
      "segredo",
      "credential",
      "credencial",
      "key",
      "chave"
    ],
    "attributes": {
      "required": [
        "provider",
        "status"
      ],
      "optional": [
        "reference",
        "scope",
        "rotation_due"
      ],
      "defaults": {
        "provider": "unspecified",
        "status": "unknown"
      }
    },
    "preview": [
      "reference",
      "provider",
      "policy",
      "access"
    ]
  },
  "connection": {
    "entity_kind": "connection",
    "schema_version": "minilab.registry.connection.v1",
    "label": "Connection",
    "description": "Ligação configurada entre a plataforma e um serviço, protocolo ou provider.",
    "match_terms": [
      "connection",
      "conexão",
      "conexao",
      "integration",
      "integração",
      "integracao"
    ],
    "attributes": {
      "required": [
        "kind",
        "status"
      ],
      "optional": [
        "provider",
        "endpoint",
        "protocol",
        "scope"
      ],
      "defaults": {
        "kind": "unknown",
        "status": "disconnected"
      }
    },
    "preview": [
      "provider",
      "status",
      "capabilities",
      "policy"
    ]
  },
  "schedule": {
    "entity_kind": "schedule",
    "schema_version": "minilab.registry.schedule.v1",
    "label": "Schedule",
    "description": "Intenção temporal durável para disparar workflow, tarefa ou rotina.",
    "match_terms": [
      "schedule",
      "agenda",
      "agendamento",
      "cron"
    ],
    "attributes": {
      "required": [
        "trigger",
        "status"
      ],
      "optional": [
        "timezone",
        "workflow_id",
        "next_fire",
        "policy_id"
      ],
      "defaults": {
        "trigger": "manual",
        "status": "active"
      }
    },
    "preview": [
      "calendar",
      "runs",
      "quality",
      "history"
    ]
  }
} as const;

/* AUTO-GENERATED from minilab UI manifests. Do not edit manually. */

export const GENERATED_REGISTRY_COMMON = {
  "record_status": [
    "active",
    "inactive",
    "archived"
  ],
  "verification_status": [
    "declared",
    "observed",
    "verified",
    "unknown"
  ],
  "optional": [
    "description",
    "aliases",
    "tags",
    "relations"
  ],
  "envelope": {
    "required": [
      "name",
      "record_status",
      "verification_status",
      "attributes"
    ],
    "defaults": {
      "record_status": "active",
      "verification_status": "declared",
      "aliases": [],
      "tags": [],
      "relations": []
    }
  }
} as const;
