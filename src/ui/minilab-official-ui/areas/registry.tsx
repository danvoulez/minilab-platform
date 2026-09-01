import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { AIProposalCard, type AIProposal } from "../register/ai-proposal-card";
import { RegisterActions } from "../register/register-actions";
import { SearchInput } from "../components/search-input";
import { ErrorState } from "../layout/states";
import {
  LocalOperatorComposer,
  RegistryTypeTable,
  type RegistryTypeSummary,
} from "../components/domain-composition";
import { GENERATED_REGISTRY_CONTRACTS } from "../generated/registry-contracts.generated";
import type { GeneratedRegistryKind } from "../generated/types.generated";
import {
  admitRegistryState,
  fetchRegistryEntityDetail,
  listRegistryEntities,
  type RegistryAdmissionResult,
  type RegistryProviderEntity,
} from "../lib/registry-api";
import {
  capabilityStatus,
  fetchPlatformProviderHandshake,
  registryTypeStatus,
  type PlatformProviderHandshake,
  type ProviderCapabilityStatus,
} from "../lib/platform-api";
import type { PreviewApi } from "./use-preview";

type RegistryContractSpec = {
  entity_kind: GeneratedRegistryKind;
  schema_version: string;
  label: string;
  description: string;
  match_terms?: readonly string[];
  attributes: {
    required: readonly string[];
    optional?: readonly string[];
    defaults?: Readonly<Record<string, unknown>>;
  };
  enums?: Readonly<Record<string, readonly string[]>>;
};

const CONTRACT_ENTRIES = Object.entries(GENERATED_REGISTRY_CONTRACTS) as unknown as Array<[
  GeneratedRegistryKind,
  RegistryContractSpec,
]>;

export function RegistryPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.registry;
  const [selectedType, setSelectedType] = useState<GeneratedRegistryKind | null>(null);
  const [proposal, setProposal] = useState<AIProposal | null>(null);
  const [composerDraft, setComposerDraft] = useState("");
  const [focusToken, setFocusToken] = useState(0);
  const [reviewed, setReviewed] = useState(false);
  const [admitting, setAdmitting] = useState(false);
  const [admissionError, setAdmissionError] = useState<string | null>(null);
  const [provider, setProvider] = useState<PlatformProviderHandshake | null>(null);
  const [providerError, setProviderError] = useState<string | null>(null);
  const [entities, setEntities] = useState<RegistryProviderEntity[]>([]);
  const [entityQuery, setEntityQuery] = useState("");
  const [entityListBusy, setEntityListBusy] = useState(false);
  const [entityListError, setEntityListError] = useState<string | null>(null);

  const currentContract = useMemo(
    () => (selectedType ? contractFor(selectedType) : null),
    [selectedType],
  );

  const registryTypes = useMemo<RegistryTypeSummary[]>(() => {
    return CONTRACT_ENTRIES.map(([id, contract]) => {
      const count = entities.filter((entity) => entity.entity_kind === id).length;
      const status = registryTypeStatus(provider, id);
      return {
        id,
        label: contract.label,
        description: contract.description,
        schemaVersion: contract.schema_version,
        count: entities.length ? count : undefined,
        status,
      };
    });
  }, [entities, provider]);

  const admitStatus = capabilityStatus(provider, "registry.admit");
  const listStatus = capabilityStatus(provider, "registry.list");
  const selectedTypeStatus: ProviderCapabilityStatus = selectedType
    ? registryTypeStatus(provider, selectedType)
    : "unknown";
  const providerBlocksAdmission = admitStatus === "unavailable" || selectedTypeStatus === "unavailable";

  useEffect(() => {
    function requestFocus() { setFocusToken((value) => value + 1); }
    window.addEventListener("minilab:open-register", requestFocus);
    if (window.location.hash.startsWith("#registry?new")) requestFocus();
    return () => window.removeEventListener("minilab:open-register", requestFocus);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchPlatformProviderHandshake(controller.signal)
      .then((next) => {
        setProvider(next);
        setProviderError(null);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setProvider(null);
        setProviderError(error instanceof Error ? error.message : "Provider capability handshake unavailable");
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void refreshEntities(), 180);
    return () => window.clearTimeout(timer);
  // entityQuery intentionally triggers provider-side search.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, entityQuery]);

  function buildProposalFrom(text: string): AIProposal {
    const entityKind = selectedType ?? inferRegistryKind(text);
    const contract = entityKind ? contractFor(entityKind) : null;
    const name = extractCandidateName(text, contract);
    const missing: string[] = [];

    if (!entityKind || !contract) missing.push("entity_kind");
    if (!name) missing.push("payload.name");

    const attributes: Record<string, unknown> = contract
      ? structuredClone(contract.attributes.defaults ?? {})
      : {};

    if (contract) {
      applySimpleFieldInference(text, contract, attributes);
      for (const field of contract.attributes.required ?? []) {
        if (attributes[field] === undefined || attributes[field] === null || attributes[field] === "") {
          missing.push(`payload.attributes.${field}`);
        }
      }
    }

    const payload: Record<string, unknown> = {
      ...(name ? { name } : {}),
      record_status: "active",
      verification_status: "declared",
      description: text,
      aliases: [],
      tags: [],
      attributes,
      relations: [],
    };

    return {
      intent: entityKind
        ? `Propor estado ${entityKind} segundo o contrato da plataforma`
        : "Identificar um contrato da plataforma antes de propor estado",
      summary: text,
      entity_kind: entityKind,
      schema_version: contract?.schema_version ?? null,
      payload,
      missing,
      rule_check: {
        passed: missing.length === 0,
        note: missing.length === 0
          ? "candidato completo para revisão humana; o provider ainda precisa aceitar o contrato e devolver recibo autoritativo"
          : "o candidato não será enviado enquanto faltarem campos exigidos pelo contrato Minilab",
      },
    };
  }

  function propose(text: string) {
    setAdmissionError(null);
    setReviewed(false);
    setProposal(buildProposalFrom(text));
    setComposerDraft("");
  }

  function refineProposal() {
    if (!proposal) return;
    setComposerDraft(`${proposal.summary}\n\nDetalhe ${proposal.missing.join(", ") || "o que deve mudar"}: `);
    setFocusToken((value) => value + 1);
  }

  async function admitProposal() {
    if (!proposal?.entity_kind || !proposal.schema_version || proposal.missing.length > 0 || !reviewed || providerBlocksAdmission) return;
    setAdmitting(true);
    setAdmissionError(null);
    try {
      const result = await admitRegistryState({
        entity_kind: proposal.entity_kind,
        schema_version: proposal.schema_version,
        payload: proposal.payload,
        idempotency_key: `minilab-ui:${crypto.randomUUID()}`,
      });
      openAdmissionReceipt(result, proposal);
      await refreshEntities();
    } catch (error) {
      setAdmissionError(error instanceof Error ? error.message : "Registry provider rejected the admission");
    } finally {
      setAdmitting(false);
    }
  }

  function openAdmissionReceipt(result: RegistryAdmissionResult, admittedProposal: AIProposal) {
    preview.open({
      kind: "registry_admission",
      id: result.admission_id,
      title: String(admittedProposal.payload.name ?? result.entity_id),
      subtitle: `${admittedProposal.entity_kind} · admission receipt`,
      status: result.deduped ? "deduped" : "admitted",
      payload: { result, proposal: admittedProposal, provider: provider?.provider ?? null },
    });
    setProposal(null);
    setReviewed(false);
  }

  async function refreshEntities() {
    if (listStatus === "unavailable") {
      setEntities([]);
      setEntityListError("Este provider declarou registry.list como unavailable.");
      return;
    }
    setEntityListBusy(true);
    setEntityListError(null);
    try {
      const result = await listRegistryEntities({ kind: selectedType, q: entityQuery, limit: 100 });
      setEntities(result.entities ?? []);
    } catch (error) {
      setEntities([]);
      setEntityListError(error instanceof Error ? error.message : "Registry list capability unavailable");
    } finally {
      setEntityListBusy(false);
    }
  }

  async function openEntity(entityId: string) {
    try {
      const detail = await fetchRegistryEntityDetail(entityId);
      const payloadName = detail.current?.canonical_payload?.name ?? detail.entity.name;
      preview.open({
        kind: "registry_record",
        id: detail.entity.entity_id,
        title: typeof payloadName === "string" ? payloadName : detail.entity.entity_id,
        subtitle: `${detail.entity.entity_kind} · provider state`,
        status: detail.current ? "current" : "no-current-state",
        payload: detail,
      });
    } catch (error) {
      setEntityListError(error instanceof Error ? error.message : "Registry entity could not be opened");
    }
  }

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <Section
        title="Propor estado"
        hint="Minilab define o contrato. Assistência propõe, você revisa, e o provider precisa aceitar o payload e devolver um recibo autoritativo."
      >
        <LocalOperatorComposer
          value={composerDraft}
          onChange={setComposerDraft}
          focusToken={focusToken}
          selectedContract={currentContract?.schema_version ?? null}
          onPropose={propose}
        />
        {provider && (
          <div className="mt-2 text-[10.5px] text-neutral-500">
            Provider: <span className="text-neutral-300">{provider.provider.name}</span> · {provider.provider.version}
            {admitStatus !== "unknown" ? ` · registry.admit ${admitStatus}` : ""}
          </div>
        )}
        {providerError && (
          <div className="mt-2 text-[10.5px] text-amber-300/70">
            Provider capability report unavailable. Platform contracts remain visible; capability state is unknown.
          </div>
        )}
        {proposal && (
          <div className="mt-3">
            <AIProposalCard
              proposal={proposal}
              actions={
                <div className="flex flex-wrap items-center justify-end gap-3">
                  <label className="inline-flex items-center gap-2 text-[10.5px] text-neutral-400 select-none">
                    <input
                      type="checkbox"
                      checked={reviewed}
                      onChange={(event) => setReviewed(event.target.checked)}
                      className="accent-blue-500"
                    />
                    Revisei o payload canônico
                  </label>
                  <RegisterActions
                    canCommit={proposal.missing.length === 0 && reviewed && !providerBlocksAdmission}
                    isSubmitting={admitting}
                    onRefine={refineProposal}
                    onDiscard={() => {
                      setProposal(null);
                      setReviewed(false);
                      setAdmissionError(null);
                    }}
                    onCommit={admitProposal}
                  />
                </div>
              }
            />
            {providerBlocksAdmission && (
              <div className="mt-2"><ErrorState title="Admissão indisponível neste provider" hint="A possibilidade continua no contrato da plataforma; apenas este provider declarou que não a satisfaz." /></div>
            )}
            {admissionError && <div className="mt-2"><ErrorState title="Admissão recusada" hint={admissionError} /></div>}
          </div>
        )}
      </Section>

      <Section
        title="Contratos da plataforma"
        hint="Este catálogo descreve o que Minilab sabe representar. Providers podem suportar um subconjunto, mas não redefinem o vocabulário da plataforma."
      >
        <RegistryTypeTable
          types={registryTypes}
          activeType={selectedType}
          onSelect={(type) => {
            const next = type as GeneratedRegistryKind;
            setSelectedType((current) => current === next ? null : next);
            setProposal(null);
            setReviewed(false);
            setFocusToken((value) => value + 1);
          }}
        />
        {currentContract && (
          <div className="mt-3 rounded-md border border-white/10 bg-black/15 p-3 grid grid-cols-1 md:grid-cols-4 gap-3 text-[10.5px]">
            <ContractFact label="entity_kind" value={currentContract.entity_kind} />
            <ContractFact label="schema_version" value={currentContract.schema_version} mono />
            <ContractFact label="required attributes" value={(currentContract.attributes.required ?? []).join(", ") || "none"} />
            <ContractFact label="provider" value={selectedTypeStatus} />
          </div>
        )}
      </Section>

      <Section
        title="Entidades do provider"
        hint="A lista vem do provider atual através do contrato registry.list. Sem provider, a plataforma continua mostrando o que é possível, mas não inventa entidades."
        actions={
          <div className="flex items-center gap-2">
            <SearchInput value={entityQuery} onChange={setEntityQuery} placeholder="Buscar entidades…" />
            <button
              type="button"
              onClick={() => void refreshEntities()}
              disabled={entityListBusy || listStatus === "unavailable"}
              className="h-8 px-3 rounded-md text-[11.5px] bg-white/[0.04] ring-1 ring-inset ring-white/10 text-neutral-200 hover:bg-white/[0.08] disabled:text-neutral-600"
            >
              {entityListBusy ? "Lendo…" : "Atualizar"}
            </button>
          </div>
        }
      >
        {entities.length > 0 ? (
          <div className="rounded-lg border border-white/10 overflow-hidden divide-y divide-white/[0.06]">
            {entities.map((entity) => (
              <button
                key={entity.entity_id}
                type="button"
                onClick={() => void openEntity(entity.entity_id)}
                className="w-full px-3 py-2.5 text-left flex items-center justify-between gap-3 bg-white/[0.015] hover:bg-white/[0.045] transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-[12px] text-neutral-200 truncate">{entity.name || entity.entity_id}</div>
                  <div className="mt-0.5 text-[10.5px] text-neutral-500 truncate">{entity.entity_kind} · {entity.schema_version || "schema provider"}</div>
                </div>
                <div className="text-[10.5px] text-neutral-600 shrink-0">{entity.verification_status || entity.record_status || "current"}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-white/[0.08] bg-white/[0.02] px-3 py-3 text-[11px] text-neutral-500">
            {entityListBusy
              ? "Consultando o provider…"
              : "Nenhuma entidade veio do provider para este filtro. O catálogo acima continua sendo o contrato completo da plataforma."}
          </div>
        )}
        {entityListError && <div className="mt-2"><ErrorState title="Registry do provider indisponível" hint={entityListError} /></div>}
      </Section>
    </PageFrame>
  );
}

function contractFor(kind: GeneratedRegistryKind): RegistryContractSpec {
  return GENERATED_REGISTRY_CONTRACTS[kind] as unknown as RegistryContractSpec;
}

function ContractFact({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wider text-neutral-600">{label}</div>
      <div className={`mt-0.5 text-neutral-300 break-words ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

function inferRegistryKind(text: string): GeneratedRegistryKind | null {
  const normalized = text.toLocaleLowerCase();
  for (const [kind, contract] of CONTRACT_ENTRIES) {
    const terms = contract.match_terms ?? [kind, contract.label];
    if (terms.some((term) => normalized.includes(term.toLocaleLowerCase()))) return kind;
  }
  return null;
}

function extractCandidateName(text: string, contract: RegistryContractSpec | null): string | null {
  const quoted = text.match(/["“']([^"”']{1,120})["”']/)?.[1]?.trim();
  if (quoted) return quoted;
  let candidate = text
    .replace(/^\s*(registrar|registre|cadastrar|cadastre|admitir|admita|criar|crie)\s+/i, "")
    .replace(/^\s*(um|uma|o|a)\s+/i, "");
  if (contract) {
    for (const term of contract.match_terms ?? []) {
      if (candidate.toLocaleLowerCase().startsWith(term.toLocaleLowerCase() + " ")) {
        candidate = candidate.slice(term.length).trim();
        break;
      }
    }
  }
  candidate = candidate.split(/\s+(?:como|com|em|no|na|que|para)\s+/i)[0]?.trim() ?? "";
  if (!candidate || candidate.length > 120) return null;
  return candidate;
}

function applySimpleFieldInference(text: string, contract: RegistryContractSpec, attributes: Record<string, unknown>) {
  if ((contract.attributes.required ?? []).includes("amount") && attributes.amount === undefined) {
    const amount = text.match(/(?:€|eur\s*)?(\d+(?:[.,]\d{1,2})?)/i)?.[1];
    if (amount) attributes.amount = Number(amount.replace(",", "."));
  }
  for (const [field, values] of Object.entries(contract.enums ?? {})) {
    if (attributes[field] !== undefined) continue;
    const found = values.find((value) => new RegExp(`\\b${escapeRegex(value)}\\b`, "i").test(text));
    if (found) attributes[field] = found;
  }
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
