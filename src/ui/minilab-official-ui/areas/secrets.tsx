import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { MetricCard } from "../components/metric-card";
import { EvidenceBlock } from "../evidence/evidence-block";
import {
  AccessPolicyLinks,
  MissingSecretWarnings,
  ProviderStatus,
  SecretReferenceRows,
} from "../components/domain-composition";
import {
  STUB_CONNECTIONS,
  STUB_POLICIES,
  STUB_SECRETS,
} from "./demo-data";
import type { PolicyItem, SecretReference } from "../types";
import type { PreviewApi } from "./use-preview";

export function SecretsPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.secrets;
  const [selectedId, setSelectedId] = useState<string | undefined>(
    STUB_SECRETS.find((s) => s.presence !== "present")?.id ??
      STUB_SECRETS[0]?.id
  );

  const selected = useMemo<SecretReference | undefined>(
    () => STUB_SECRETS.find((s) => s.id === selectedId),
    [selectedId]
  );

  // Build a SAFE payload that explicitly omits any potential value field.
  // (no_secret_values rule)
  function safePayload(s: SecretReference) {
    return {
      id: s.id,
      logical_name: s.logical_name,
      provider: s.provider,
      scope: s.scope,
      presence: s.presence,
      last_rotation: s.last_rotation,
      policy_ids: s.policy_ids,
      dependents: s.dependents,
    };
  }

  useEffect(() => {
    if (!selected) return;
    preview.open({
      kind: "json",
      id: selected.id,
      title: selected.logical_name,
      subtitle: `${selected.provider} · ${selected.scope}`,
      payload: safePayload(selected),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  function selectSecret(s: SecretReference) {
    setSelectedId(s.id);
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

  const counts = useMemo(
    () => ({
      present: STUB_SECRETS.filter((s) => s.presence === "present").length,
      missing: STUB_SECRETS.filter((s) => s.presence === "missing").length,
      stale: STUB_SECRETS.filter((s) => s.presence === "stale").length,
    }),
    []
  );

  const dependentConnections = selected
    ? STUB_CONNECTIONS.filter((c) =>
        (c.secret_refs ?? []).includes(selected.id)
      )
    : [];

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <div className="rounded-md border border-amber-500/30 bg-amber-500/[0.04] px-3 py-2 text-[10.5px] text-amber-200/85">
        no_secret_values · esta UI exibe presença, escopo e rotação. Valor de
        secret nunca aparece aqui — nem em preview, nem em JSON.
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <MetricCard label="Present" value={counts.present} tone="good" />
        <MetricCard
          label="Stale"
          value={counts.stale}
          tone={counts.stale > 0 ? "warn" : "default"}
        />
        <MetricCard
          label="Missing"
          value={counts.missing}
          tone={counts.missing > 0 ? "warn" : "default"}
        />
      </div>

      <Section title="Providers" hint="saúde por provedor">
        <ProviderStatus secrets={STUB_SECRETS} />
      </Section>

      <Section
        title="References"
        hint="lista canônica · clique abre detalhe seguro"
      >
        <SecretReferenceRows
          secrets={STUB_SECRETS}
          selectedId={selected?.id}
          onSelect={selectSecret}
        />
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <MissingSecretWarnings
          secrets={STUB_SECRETS}
          onSelect={selectSecret}
        />
        {selected && (
          <AccessPolicyLinks
            secret={selected}
            policies={STUB_POLICIES}
            onSelect={openPolicy}
          />
        )}
      </div>

      {selected && (
        <Section
          title={`Detalhe · ${selected.logical_name}`}
          hint="presença, rotação, escopo e dependentes · sem valor"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <EvidenceBlock
              items={[
                { label: "logical_name", value: selected.logical_name, mono: true },
                { label: "provider", value: selected.provider },
                { label: "scope", value: selected.scope },
                { label: "presence", value: selected.presence },
                ...(selected.last_rotation
                  ? [
                      {
                        label: "last_rotation",
                        value: selected.last_rotation,
                        mono: true,
                      },
                    ]
                  : []),
              ]}
            />
            {dependentConnections.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  dependentes
                </div>
                <ul className="space-y-1">
                  {dependentConnections.map((c) => (
                    <li
                      key={c.id}
                      className="text-[11.5px] text-neutral-300"
                    >
                      <span className="font-mono">{c.name}</span>
                      <span className="text-neutral-500 text-[10.5px]"> · {c.state}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}
    </PageFrame>
  );
}
