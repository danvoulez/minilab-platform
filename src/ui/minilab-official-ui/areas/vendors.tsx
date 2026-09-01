import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { MetricCard } from "../components/metric-card";
import { GhostCard, ReceiptCard } from "../evidence/cards";
import {
  ContactInfo,
  ContractLinks,
  PaymentStatus,
  SubscriptionRows,
  VendorList,
} from "../components/domain-composition";
import {
  STUB_DOCUMENTS,
  STUB_GHOSTS,
  STUB_LEGAL,
  STUB_RECEIPTS,
  STUB_VENDORS,
} from "./demo-data";
import type {
  DocumentItem,
  Ghost,
  LegalRecord,
  Receipt,
  VendorItem,
} from "../types";
import type { PreviewApi } from "./use-preview";

export function VendorsPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.vendors;
  const [selectedId, setSelectedId] = useState<string | undefined>(
    STUB_VENDORS.find((v) => v.state === "payment_issue")?.id ??
      STUB_VENDORS[0]?.id
  );

  const selected = useMemo<VendorItem | undefined>(
    () => STUB_VENDORS.find((v) => v.id === selectedId),
    [selectedId]
  );

  function selectVendor(v: VendorItem) {
    setSelectedId(v.id);
  }

  function openLegal(l: LegalRecord) {
    preview.open({
      kind: "legal",
      id: l.id,
      title: l.title,
      subtitle: l.kind,
      payload: l,
    });
  }
  function openDocument(d: DocumentItem) {
    preview.open({
      kind: "document",
      id: d.id,
      title: d.title,
      subtitle: `${d.kind} · ${d.domain}`,
      payload: d,
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
      kind: "vendor",
      id: selected.id,
      title: selected.name,
      subtitle: selected.service,
      payload: selected,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const counts = useMemo(
    () => ({
      total: STUB_VENDORS.length,
      recurring: STUB_VENDORS.filter((v) => v.state === "recurring").length,
      pending: STUB_VENDORS.filter((v) => v.state === "pending").length,
      legal: STUB_VENDORS.filter((v) => v.state === "legal_attention").length,
      payment: STUB_VENDORS.filter((v) => v.state === "payment_issue").length,
    }),
    []
  );

  const linkedDocs = selected
    ? STUB_DOCUMENTS.filter((d) => (selected.document_ids ?? []).includes(d.id))
    : [];
  const linkedReceipts = selected
    ? STUB_RECEIPTS.filter((r) => (selected.receipt_ids ?? []).includes(r.id))
    : [];
  const linkedGhosts = selected
    ? STUB_GHOSTS.filter((g) => (selected.ghost_ids ?? []).includes(g.id))
    : [];

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MetricCard label="Total" value={counts.total} />
        <MetricCard label="Recurring" value={counts.recurring} tone="good" />
        <MetricCard
          label="Pending"
          value={counts.pending}
          tone={counts.pending > 0 ? "warn" : "default"}
        />
        <MetricCard
          label="Legal attention"
          value={counts.legal}
          tone={counts.legal > 0 ? "warn" : "default"}
        />
        <MetricCard
          label="Payment issue"
          value={counts.payment}
          tone={counts.payment > 0 ? "warn" : "default"}
        />
      </div>

      <Section title="Vendors por estado">
        <VendorList
          vendors={STUB_VENDORS}
          selectedId={selected?.id}
          onSelect={selectVendor}
        />
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SubscriptionRows vendors={STUB_VENDORS} onSelect={selectVendor} />
        {selected && <PaymentStatus vendor={selected} />}
      </div>

      {selected && (
        <Section
          title={`Detalhe · ${selected.name}`}
          hint="contato, contratos, faturas e vínculos"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ContactInfo vendor={selected} />
            <ContractLinks
              vendor={selected}
              legal={STUB_LEGAL}
              onSelect={openLegal}
            />
            {linkedDocs.length > 0 && (
              <div className="md:col-span-2">
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  documentos vinculados
                </div>
                <ul className="space-y-1">
                  {linkedDocs.map((d) => (
                    <li key={d.id}>
                      <button
                        type="button"
                        onClick={() => openDocument(d)}
                        className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
                      >
                        <span className="font-mono text-neutral-200 truncate">
                          {d.title}
                        </span>
                        <span className="text-neutral-500 text-[10.5px]">
                          · {d.status}
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

      {selected && (linkedReceipts.length > 0 || linkedGhosts.length > 0) && (
        <Section title="Evidência" hint="receipts e ghosts vinculados">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {linkedReceipts.map((r) => (
              <ReceiptCard
                key={r.id}
                receipt={r}
                onClick={() => openReceipt(r)}
              />
            ))}
            {linkedGhosts.map((g) => (
              <GhostCard key={g.id} ghost={g} onClick={() => openGhost(g)} />
            ))}
          </div>
        </Section>
      )}

      <Section
        title="Payment issues"
        hint="vendors com problema financeiro ou fatura ausente"
      >
        {STUB_VENDORS.filter(
          (v) =>
            v.payment_status === "blocked" ||
            v.payment_status === "late" ||
            v.payment_status === "missing_invoice"
        ).length === 0 ? (
          <div className="text-[11.5px] text-emerald-300/90">
            tudo em ordem.
          </div>
        ) : (
          <ul className="space-y-1.5">
            {STUB_VENDORS.filter(
              (v) =>
                v.payment_status === "blocked" ||
                v.payment_status === "late" ||
                v.payment_status === "missing_invoice"
            ).map((v) => (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => selectVendor(v)}
                  className="w-full text-left flex items-center gap-2 text-[11.5px] hover:bg-white/[0.03] -mx-1 px-1 py-0.5 rounded transition-colors"
                >
                  <span className="text-neutral-100 truncate">{v.name}</span>
                  <span className="text-neutral-500 text-[10.5px]">
                    · {v.payment_status}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </PageFrame>
  );
}
