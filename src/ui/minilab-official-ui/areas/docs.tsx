import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section, SectionCard } from "../layout/section";
import { PAGE_COPY } from "../copy";
import {
  DocGrid,
  DocSearch,
  DocStatusBadge,
  MarkdownPreview,
  PinnedDocs,
} from "../components/domain-composition";
import { STUB_DOCUMENTS } from "./demo-data";
import type { DocStatus, DocumentItem } from "../types";
import type { PreviewApi } from "./use-preview";

export function DocsPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.docs;
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const filtered = useMemo(
    () =>
      STUB_DOCUMENTS.filter(
        (d) =>
          !q.trim() ||
          d.title.toLowerCase().includes(q.toLowerCase()) ||
          d.kind.toLowerCase().includes(q.toLowerCase()) ||
          d.domain.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );

  const selected = useMemo<DocumentItem | undefined>(
    () => filtered.find((d) => d.id === selectedId) ?? filtered[0],
    [filtered, selectedId]
  );

  useEffect(() => {
    if (!selected) return;
    preview.open({
      kind: "document",
      id: selected.id,
      title: selected.title,
      subtitle: `${selected.kind} · ${selected.domain}`,
      payload: selected,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  function selectDoc(d: DocumentItem) {
    setSelectedId(d.id);
  }

  const recent = useMemo(
    () =>
      [...filtered].sort((a, b) =>
        (b.updated_at ?? "").localeCompare(a.updated_at ?? "")
      ),
    [filtered]
  );

  const byDomain = useMemo(() => {
    const map = new Map<string, DocumentItem[]>();
    for (const d of filtered) {
      const arr = map.get(d.domain) ?? [];
      arr.push(d);
      map.set(d.domain, arr);
    }
    return [...map.entries()];
  }, [filtered]);

  const byStatus = useMemo(() => {
    const map = new Map<DocStatus, DocumentItem[]>();
    for (const d of filtered) {
      const arr = map.get(d.status) ?? [];
      arr.push(d);
      map.set(d.status, arr);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <Section title="Search">
        <DocSearch value={q} onChange={setQ} />
      </Section>

      <Section title="Pinned" hint="documentos sempre disponíveis">
        <PinnedDocs docs={STUB_DOCUMENTS} onSelect={selectDoc} />
      </Section>

      <Section title="Recent" hint="ordenado por última atualização">
        <DocGrid
          docs={recent}
          selectedId={selected?.id}
          onSelect={selectDoc}
        />
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionCard>
          <div className="text-[12px] text-neutral-100 mb-2">By domain</div>
          {byDomain.length === 0 ? (
            <div className="text-[11.5px] text-neutral-500">sem docs.</div>
          ) : (
            <ul className="space-y-2">
              {byDomain.map(([domain, items]) => (
                <li key={domain}>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                    {domain} <span className="text-neutral-600">· {items.length}</span>
                  </div>
                  <ul className="space-y-1">
                    {items.slice(0, 4).map((d) => (
                      <li key={d.id}>
                        <button
                          type="button"
                          onClick={() => selectDoc(d)}
                          className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
                        >
                          <DocStatusBadge status={d.status} />
                          <span className="text-neutral-200 truncate">
                            {d.title}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
        <SectionCard>
          <div className="text-[12px] text-neutral-100 mb-2">By status</div>
          {byStatus.length === 0 ? (
            <div className="text-[11.5px] text-neutral-500">sem docs.</div>
          ) : (
            <ul className="space-y-2">
              {byStatus.map(([status, items]) => (
                <li key={status}>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-2">
                    <DocStatusBadge status={status} />
                    <span className="text-neutral-600">· {items.length}</span>
                  </div>
                  <ul className="space-y-1">
                    {items.slice(0, 4).map((d) => (
                      <li key={d.id}>
                        <button
                          type="button"
                          onClick={() => selectDoc(d)}
                          className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
                        >
                          <span className="text-neutral-200 truncate">
                            {d.title}
                          </span>
                          <span className="ml-auto text-neutral-500 text-[10.5px]">
                            {d.domain}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      {selected && (
        <Section title={`Preview · ${selected.title}`}>
          <MarkdownPreview content={selected.content} />
        </Section>
      )}
    </PageFrame>
  );
}
