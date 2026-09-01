import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { EmptyState } from "../layout/states";
import { MissingFields } from "../register/missing-fields";
import {
  GhostAgeBuckets,
  GhostDomainBreakdown,
  GhostList,
  GhostReasonTabs,
  GhostTriageSummary,
  MissingEvidenceMatrix,
  ResolvableGhosts,
} from "../components/domain-composition";
import { STUB_GHOSTS } from "./demo-data";
import type { Ghost } from "../types";
import type { PreviewApi } from "./use-preview";

const NOW = "2026-05-19";

export function GhostsPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.ghosts;
  const [reasons, setReasons] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>(
    STUB_GHOSTS[0]?.id
  );

  const allReasons = useMemo(
    () => Array.from(new Set(STUB_GHOSTS.map((g) => g.reason))),
    []
  );

  const list = useMemo(
    () =>
      STUB_GHOSTS.filter(
        (g) => reasons.length === 0 || reasons.includes(g.reason)
      ),
    [reasons]
  );

  const selected = useMemo<Ghost | undefined>(
    () => list.find((g) => g.id === selectedId) ?? list[0],
    [list, selectedId]
  );

  useEffect(() => {
    if (!selected) return;
    preview.open({
      kind: "ghost",
      id: selected.id,
      title: selected.summary,
      payload: selected,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  function selectGhost(g: Ghost) {
    setSelectedId(g.id);
  }

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <GhostTriageSummary ghosts={STUB_GHOSTS} />

      <Section title="Triagem por razão">
        <GhostReasonTabs
          reasons={allReasons}
          selected={reasons}
          onToggle={(id) =>
            setReasons((prev) =>
              prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
            )
          }
        />
      </Section>

      <Section title="Lista de ghosts" hint="o que ainda não fechou; clique para inspecionar">
        {list.length === 0 ? (
          <EmptyState
            title="Sem ghosts para esses filtros."
            hint="Ghost é honestidade — quando aparece, lembra que algo ainda não fechou."
          />
        ) : (
          <GhostList
            ghosts={list}
            selectedId={selected?.id}
            onSelect={selectGhost}
          />
        )}
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <MissingEvidenceMatrix ghosts={list} />
        <ResolvableGhosts ghosts={list} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GhostAgeBuckets ghosts={STUB_GHOSTS} now={NOW} />
        <GhostDomainBreakdown ghosts={STUB_GHOSTS} />
      </div>

      {selected && (
        <Section
          title={`Campos faltando · ${selected.summary}`}
          hint="estado canônico do ghost selecionado"
        >
          <MissingFields fields={selected.missing} />
        </Section>
      )}
    </PageFrame>
  );
}
