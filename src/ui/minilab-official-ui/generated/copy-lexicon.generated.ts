/* AUTO-GENERATED from minilab UI manifests. Do not edit manually. */

export const GENERATED_COPY_LEXICON = {
  "schema": "minilab.ui.copy_lexicon.v1",
  "document_type": "copy_lexicon",
  "surface_language": {
    "ok": "Deu certo",
    "denied": "Não deu",
    "needs_approval": "Aguardando você",
    "ghost": "Faltou prova",
    "degraded": "Com tropeço",
    "offline": "Offline",
    "online": "Online",
    "not_available": "Não disponível agora",
    "not_found": "Não encontrado",
    "no_connection": "Sem conexão"
  },
  "forbidden_on_middle": [
    "gate.decision",
    "evidence_hash",
    "runtime_status",
    "stack_trace",
    "provider_success_as_closure",
    "raw_secret_value"
  ],
  "allowed_in_preview": [
    "technical_ids",
    "hashes",
    "json",
    "logs",
    "raw_trace"
  ]
} as const;
