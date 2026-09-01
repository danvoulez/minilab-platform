import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import {
  ContextPacks,
  EntityRelationList,
  KnowledgeCards,
  KnowledgeSearch,
  PinnedKnowledge,
  PlaybookList,
} from "../components/domain-composition";
import { STUB_KNOWLEDGE } from "./demo-data";
import type { KnowledgeItem } from "../types";
import type { PreviewApi } from "./use-preview";

export function KnowledgePage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.knowledge;
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const list = useMemo(
    () =>
      STUB_KNOWLEDGE.filter(
        (it) =>
          !q.trim() ||
          it.title.toLowerCase().includes(q.toLowerCase()) ||
          it.summary.toLowerCase().includes(q.toLowerCase()) ||
          it.domain.toLowerCase().includes(q.toLowerCase()) ||
          (it.tags ?? []).some((t) => t.includes(q.toLowerCase()))
      ),
    [q]
  );

  const selected = useMemo<KnowledgeItem | undefined>(
    () => list.find((it) => it.id === selectedId) ?? list[0],
    [list, selectedId]
  );

  useEffect(() => {
    if (!selected) return;
    preview.open({
      kind: "knowledge",
      id: selected.id,
      title: selected.title,
      subtitle: `${selected.kind} · ${selected.domain}`,
      payload: selected,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  function selectItem(it: KnowledgeItem) {
    setSelectedId(it.id);
  }

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <Section title="Search" hint="busca por título, resumo, domínio ou tag">
        <KnowledgeSearch value={q} onChange={setQ} />
      </Section>

      <Section title="Pinned context" hint="sempre presente · base operacional">
        <PinnedKnowledge items={STUB_KNOWLEDGE} onSelect={selectItem} />
      </Section>

      <Section title="Knowledge cards">
        <KnowledgeCards
          items={list}
          selectedId={selected?.id}
          onSelect={selectItem}
        />
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <PlaybookList items={STUB_KNOWLEDGE} onSelect={selectItem} />
        <ContextPacks items={STUB_KNOWLEDGE} onSelect={selectItem} />
      </div>

      <Section title="Operational memory" hint="referências cruzadas com agentes e LLMs">
        <EntityRelationList items={STUB_KNOWLEDGE} />
      </Section>
    </PageFrame>
  );
}
