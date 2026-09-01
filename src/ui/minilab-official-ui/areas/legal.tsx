import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { MetricCard } from "../components/metric-card";
import { MarkdownPreview } from "../components/domain-composition";
import { GhostCard, ReceiptCard } from "../evidence/cards";
import {
  ContractCards,
  CorrespondenceLog,
  LegalObligationRows,
  OfficialAddressCard,
  RiskBadges,
} from "../components/domain-composition";
import {
  STUB_ADDRESSES,
  STUB_CORRESPONDENCE,
  STUB_DOCUMENTS,
  STUB_GHOSTS,
  STUB_LEGAL,
  STUB_RECEIPTS,
  STUB_VENDORS,
} from "./demo-data";
import type {
  CorrespondenceItem,
  Ghost,
  LegalRecord,
  Receipt,
} from "../types";
import type { PreviewApi } from "./use-preview";

export function LegalPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.legal;
  const [selectedId, setSelectedId] = useState<string | undefined>(
    STUB_LEGAL.find((l) => l.risk === "critical" || l.risk === "high")?.id ??
      STUB_LEGAL[0]?.id
  );

  const selected = useMemo<LegalRecord | undefined>(
    () => STUB_LEGAL.find((l) => l.id === selectedId),
    [selectedId]
  );

  function selectLegal(l: LegalRecord) {
    setSelectedId(l.id);
  }
  function openCorrespondence(c: CorrespondenceItem) {
    if (c.legal_id) {
      const l = STUB_LEGAL.find((x) => x.id === c.legal_id);
      if (l) return selectLegal(l);
    }
    preview.open({
      kind: "json",
      id: c.id,
      title: c.subject,
      subtitle: c.party,
      payload: c,
    });
  }
  function openReceipt(r: Receipt) {
    preview.open({
      kind: "receipt",
      id: r.id,
      title: r.scope,
      payload: r,
    });
  }
  function openGhost(g: Ghost) {
    preview.open({
      kind: "ghost",
      id: g.id,
      title: g.summary,
      payload: g,
    });
  }

  useEffect(() => {
    if (!selected) return;
    preview.open({
      kind: "legal",
      id: selected.id,
      title: selected.title,
      subtitle: selected.kind,
      payload: selected,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const counts = useMemo(
    () => ({
      contracts: STUB_LEGAL.filter(
        (l) => l.kind === "contract" || l.kind === "lease" || l.kind === "license"
      ).length,
      obligations: STUB_LEGAL.filter((l) => l.next_obligation && l.next_obligation !== "—").length,
      high_risk: STUB_LEGAL.filter(
        (l) => l.risk === "high" || l.risk === "critical"
      ).length,
      expiring: STUB_LEGAL.filter((l) => l.status === "expiring").length,
    }),
    []
  );

  const linkedDoc = selected?.document_id
    ? STUB_DOCUMENTS.find((d) => d.id === selected.document_id)
    : undefined;
  const linkedReceipt = selected?.receipt_id
    ? STUB_RECEIPTS.find((r) => r.id === selected.receipt_id)
    : undefined;
  const linkedGhost = selected?.ghost_id
    ? STUB_GHOSTS.find((g) => g.id === selected.ghost_id)
    : undefined;
  const linkedVendor = selected?.vendor_id
    ? STUB_VENDORS.find((v) => v.id === selected.vendor_id)
    : undefined;

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Contracts" value={counts.contracts} tone="good" />
        <MetricCard label="Obligations" value={counts.obligations} />
        <MetricCard
          label="High / critical"
          value={counts.high_risk}
          tone={counts.high_risk > 0 ? "warn" : "default"}
        />
        <MetricCard
          label="Expiring"
          value={counts.expiring}
          tone={counts.expiring > 0 ? "warn" : "default"}
        />
      </div>

      <Section title="Contracts" hint="contratos em vigor, rascunho e licenças">
        <ContractCards
          records={STUB_LEGAL}
          selectedId={selected?.id}
          onSelect={selectLegal}
        />
      </Section>

      <LegalObligationRows
        records={STUB_LEGAL}
        selectedId={selected?.id}
        onSelect={selectLegal}
      />

      <Section title="Risks" hint="níveis de risco declarados">
        <ul className="space-y-1.5">
          {STUB_LEGAL.filter((l) => l.risk).map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => selectLegal(l)}
                className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
              >
                <RiskBadges risk={l.risk} />
                <span className="text-neutral-100 truncate">{l.title}</span>
                <span className="text-neutral-500 text-[10.5px]">
                  · {l.kind}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Section>

      <CorrespondenceLog
        items={STUB_CORRESPONDENCE}
        onSelect={openCorrespondence}
      />

      <OfficialAddressCard addresses={STUB_ADDRESSES} />

      {selected && (
        <Section
          title={`Detalhe · ${selected.title}`}
          hint="documento, vendor, evidência e fechamento"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {linkedDoc && (
              <MarkdownPreview content={linkedDoc.content} />
            )}
            <div className="space-y-3">
              {linkedVendor && (
                <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                    vendor vinculado
                  </div>
                  <div className="text-[12px] text-neutral-100">
                    {linkedVendor.name}
                  </div>
                  <div className="text-[10.5px] text-neutral-500">
                    {linkedVendor.service}
                  </div>
                </div>
              )}
              {linkedReceipt && (
                <ReceiptCard
                  receipt={linkedReceipt}
                  onClick={() => openReceipt(linkedReceipt)}
                />
              )}
              {linkedGhost && (
                <GhostCard
                  ghost={linkedGhost}
                  onClick={() => openGhost(linkedGhost)}
                />
              )}
            </div>
          </div>
        </Section>
      )}
    </PageFrame>
  );
}
