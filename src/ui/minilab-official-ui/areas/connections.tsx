import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { MetricCard } from "../components/metric-card";
import { EvidenceBlock } from "../evidence/evidence-block";
import {
  ConfigureActions,
  ConnectionGroups,
  MCPMarketplaceLikeList,
  SecretReferenceRows,
} from "../components/domain-composition";
import {
  STUB_CONNECTIONS,
  STUB_MCP_MARKETPLACE,
  STUB_POLICIES,
  STUB_SECRETS,
} from "./demo-data";
import type {
  ConnectionItem,
  PolicyItem,
  SecretReference,
} from "../types";
import type { PreviewApi } from "./use-preview";

export function ConnectionsPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.connections;
  const [selectedId, setSelectedId] = useState<string | undefined>(
    STUB_CONNECTIONS.find((c) => c.state === "missing")?.id ??
      STUB_CONNECTIONS[0]?.id
  );

  const selected = useMemo<ConnectionItem | undefined>(
    () => STUB_CONNECTIONS.find((c) => c.id === selectedId),
    [selectedId]
  );

  useEffect(() => {
    if (!selected) return;
    preview.open({
      kind: "json",
      id: selected.id,
      title: selected.name,
      subtitle: selected.provider,
      // Strip secret_refs from raw JSON view (refs are ok, but keep preview honest)
      payload: {
        id: selected.id,
        name: selected.name,
        provider: selected.provider,
        domain: selected.domain,
        state: selected.state,
        scope: selected.scope,
        last_sync: selected.last_sync,
        risks: selected.risks,
        secret_refs: selected.secret_refs,
        policy_ids: selected.policy_ids,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  function selectConnection(c: ConnectionItem) {
    setSelectedId(c.id);
  }

  function openPolicy(p: PolicyItem) {
    preview.open({
      kind: "policy",
      id: p.id,
      title: p.name,
      subtitle: p.scope.join(" · "),
      payload: p,
    });
  }
  // selecting a secret keeps user on the page; show in middle below
  function selectSecret(_s: SecretReference) {
    /* no-op; could route to Secrets page in the future */
  }

  const counts = useMemo(
    () => ({
      connected: STUB_CONNECTIONS.filter((c) => c.state === "connected").length,
      degraded: STUB_CONNECTIONS.filter((c) => c.state === "degraded").length,
      missing: STUB_CONNECTIONS.filter((c) => c.state === "missing").length,
      configuring: STUB_CONNECTIONS.filter((c) => c.state === "configuring").length,
    }),
    []
  );

  const needsAttention = STUB_CONNECTIONS.filter(
    (c) => c.state !== "connected"
  );

  const selectedSecrets = selected
    ? STUB_SECRETS.filter((s) => (selected.secret_refs ?? []).includes(s.id))
    : [];
  const selectedPolicies = selected
    ? STUB_POLICIES.filter((p) => (selected.policy_ids ?? []).includes(p.id))
    : [];

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Connected" value={counts.connected} tone="good" />
        <MetricCard
          label="Degraded"
          value={counts.degraded}
          tone={counts.degraded > 0 ? "warn" : "default"}
        />
        <MetricCard
          label="Missing"
          value={counts.missing}
          tone={counts.missing > 0 ? "warn" : "default"}
        />
        <MetricCard label="Configuring" value={counts.configuring} />
      </div>

      <Section
        title="Providers por domínio"
        hint="agrupado · clique abre detalhe à direita"
      >
        <ConnectionGroups
          connections={STUB_CONNECTIONS}
          selectedId={selected?.id}
          onSelect={selectConnection}
        />
      </Section>

      <Section title="Needs attention" hint="degradados, ausentes ou em configuração">
        {needsAttention.length === 0 ? (
          <div className="text-[11.5px] text-emerald-300/90">
            todos os providers estão conectados.
          </div>
        ) : (
          <ul className="space-y-1.5">
            {needsAttention.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => selectConnection(c)}
                  className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
                >
                  <span className="text-neutral-100 truncate">{c.name}</span>
                  <span className="text-neutral-500 text-[10.5px]">· {c.state}</span>
                  {c.risks && c.risks.length > 0 && (
                    <span className="ml-auto text-amber-200/80 text-[10.5px] truncate">
                      {c.risks[0]}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {selected && (
        <Section
          title={`Detalhe · ${selected.name}`}
          hint="estado, escopo, secrets e policies"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ConfigureActions connection={selected} />
            <EvidenceBlock
              items={[
                { label: "provider", value: selected.provider },
                { label: "domain", value: selected.domain },
                { label: "state", value: selected.state },
                ...(selected.scope ? [{ label: "scope", value: selected.scope }] : []),
                ...(selected.last_sync
                  ? [{ label: "last_sync", value: selected.last_sync, mono: true }]
                  : []),
                ...(selected.risks && selected.risks.length > 0
                  ? [{ label: "risks", value: selected.risks.join("; ") }]
                  : []),
              ]}
            />
            {selectedSecrets.length > 0 && (
              <div className="md:col-span-2">
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  secret references (sem valor)
                </div>
                <SecretReferenceRows
                  secrets={selectedSecrets}
                  onSelect={selectSecret}
                />
              </div>
            )}
            {selectedPolicies.length > 0 && (
              <div className="md:col-span-2">
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  policies vinculadas
                </div>
                <ul className="space-y-1.5">
                  {selectedPolicies.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => openPolicy(p)}
                        className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
                      >
                        <span className="font-mono text-neutral-200 truncate">
                          {p.name}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}

      <Section
        title="MCP marketplace (preview)"
        hint="tools instaláveis · stub"
      >
        <MCPMarketplaceLikeList items={STUB_MCP_MARKETPLACE} />
      </Section>
    </PageFrame>
  );
}
