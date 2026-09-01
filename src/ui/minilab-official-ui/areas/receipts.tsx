import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { EmptyState } from "../layout/states";
import { EvidenceBlock } from "../evidence/evidence-block";
import {
  ReceiptByEntity,
  ReceiptByMachine,
  ReceiptByWorkorder,
  ReceiptDigest,
  ReceiptFilters,
  ReceiptLedgerSummary,
  ReceiptList,
  ReceiptTimeline,
} from "../components/domain-composition";
import {
  STUB_ENTITIES,
  STUB_MACHINES,
  STUB_RECEIPTS,
} from "./demo-data";
import type { Receipt } from "../types";
import type { PreviewApi } from "./use-preview";

export function ReceiptsPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.receipts;
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | undefined>(
    STUB_RECEIPTS[0]?.id
  );

  const list = useMemo(
    () =>
      STUB_RECEIPTS.filter(
        (r) =>
          !q.trim() ||
          r.scope.toLowerCase().includes(q.toLowerCase()) ||
          r.evidence_summary.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );

  const selected = useMemo<Receipt | undefined>(
    () => list.find((r) => r.id === selectedId) ?? list[0],
    [list, selectedId]
  );

  useEffect(() => {
    if (!selected) return;
    preview.open({
      kind: "receipt",
      id: selected.id,
      title: selected.scope,
      payload: selected,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  function selectReceipt(r: Receipt) {
    setSelectedId(r.id);
  }

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <ReceiptLedgerSummary receipts={STUB_RECEIPTS} />

      <Section
        title="Ledger"
        hint="O que está aqui está em bytes online."
        actions={<ReceiptFilters value={q} onChange={setQ} />}
      >
        {list.length === 0 ? (
          <EmptyState
            title="Nenhum receipt corresponde à busca."
            hint="Receipt é prova fechada. Não é storytelling."
          />
        ) : (
          <ReceiptList
            receipts={list}
            selectedId={selected?.id}
            onSelect={selectReceipt}
          />
        )}
      </Section>

      {selected && (
        <Section title={`Detalhe · ${selected.scope}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <EvidenceBlock
                items={[
                  { label: "scope", value: selected.scope },
                  {
                    label: "closed_at",
                    value: selected.closed_at,
                    mono: true,
                  },
                  { label: "id", value: selected.id, mono: true },
                  {
                    label: "summary",
                    value: selected.evidence_summary,
                  },
                ]}
              />
            </div>
            <div className="rounded-md border border-emerald-500/20 bg-emerald-500/[0.05] p-3 space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-emerald-300/80">
                digest
              </div>
              <ReceiptDigest receipt={selected} />
              <div className="text-[10.5px] text-emerald-200/70 leading-relaxed">
                Receipt = prova fechada. O que está aqui está em bytes online.
              </div>
            </div>
          </div>
        </Section>
      )}

      <Section title="Linha do tempo">
        <ReceiptTimeline receipts={list} />
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ReceiptByEntity
          receipts={STUB_RECEIPTS}
          entities={STUB_ENTITIES}
          onSelect={selectReceipt}
        />
        <ReceiptByMachine
          receipts={STUB_RECEIPTS}
          machines={STUB_MACHINES}
          onSelect={selectReceipt}
        />
        <ReceiptByWorkorder
          receipts={STUB_RECEIPTS}
          onSelect={selectReceipt}
        />
      </div>
    </PageFrame>
  );
}
