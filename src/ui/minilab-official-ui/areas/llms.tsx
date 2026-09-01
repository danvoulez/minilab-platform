import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import {
  BenchmarkStatus,
  CapabilityMatrix,
  CostBadges,
  LLMEntityCards,
  PremiumCallMeter,
  RoleFilters,
  UsageRows,
} from "../components/domain-composition";
import { PREMIUM_BUDGET_TODAY, STUB_LLMS } from "./demo-data";
import type { LLMItem, LLMRole } from "../types";
import type { PreviewApi } from "./use-preview";

export function LLMsPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.llms;
  const [roleFilters, setRoleFilters] = useState<LLMRole[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>(
    STUB_LLMS.find((l) => l.tier === "local")?.id ?? STUB_LLMS[0]?.id
  );

  const filtered = useMemo(
    () =>
      STUB_LLMS.filter(
        (l) => roleFilters.length === 0 || roleFilters.includes(l.role)
      ),
    [roleFilters]
  );

  const local = filtered.filter((l) => l.tier === "local");
  const premium = filtered.filter((l) => l.tier === "premium");
  const benchmarked = filtered.filter(
    (l) => l.benchmark_status === "passing" || l.benchmark_status === "regressed"
  );
  const costly = filtered.filter((l) => l.tier === "premium");

  const selected = useMemo<LLMItem | undefined>(
    () => filtered.find((l) => l.id === selectedId) ?? filtered[0],
    [filtered, selectedId]
  );

  useEffect(() => {
    if (!selected) return;
    preview.open({
      kind: "llm",
      id: selected.id,
      title: selected.name,
      subtitle: `${selected.provider} · ${selected.role}`,
      payload: selected,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  function selectLLM(l: LLMItem) {
    setSelectedId(l.id);
  }

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <PremiumCallMeter llms={STUB_LLMS} budget={PREMIUM_BUDGET_TODAY} />

      <Section title="Roles" hint="filtre por papel · sem filtros mostra todos">
        <RoleFilters
          active={roleFilters}
          onToggle={(role) =>
            setRoleFilters((prev) =>
              prev.includes(role)
                ? prev.filter((r) => r !== role)
                : [...prev, role]
            )
          }
        />
      </Section>

      <Section
        title="Local"
        hint="LLMs locais são a primeira escolha; rodam nos LAB minis."
      >
        <LLMEntityCards
          llms={local}
          selectedId={selected?.id}
          onSelect={selectLLM}
        />
      </Section>

      <Section
        title="Premium"
        hint="recurso escasso. Toda chamada passa por política e gate."
      >
        <LLMEntityCards
          llms={premium}
          selectedId={selected?.id}
          onSelect={selectLLM}
        />
      </Section>

      <Section title="Capabilities" hint="quem faz o quê">
        <CapabilityMatrix llms={filtered} />
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <UsageRows llms={filtered} />
        <CostBadges llms={filtered} />
        <BenchmarkStatus llms={filtered} />
      </div>

      <Section
        title="Benchmarked"
        hint="modelos com bench observado (passing ou regressed)"
      >
        <LLMEntityCards
          llms={benchmarked}
          selectedId={selected?.id}
          onSelect={selectLLM}
        />
      </Section>

      <Section title="Costly" hint="premium · custo declarado">
        <LLMEntityCards
          llms={costly}
          selectedId={selected?.id}
          onSelect={selectLLM}
        />
      </Section>
    </PageFrame>
  );
}
