import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { GateDecisionCard, GhostCard, ReceiptCard } from "../evidence/cards";
import {
  BudgetProgress,
  CategoryBreakdown,
  DueBills,
  FinanceOverviewCards,
  SpendingTimeline,
  SubscriptionRows,
} from "../components/domain-composition";
import {
  STUB_BUDGET,
  STUB_FINANCE_RECORDS,
  STUB_GATE_DECISIONS,
  STUB_GHOSTS,
  STUB_RECEIPTS,
  STUB_SPENDING_EVENTS,
  STUB_VENDORS,
} from "./demo-data";
import type {
  FinanceRecord,
  Ghost,
  Receipt,
  SpendingEvent,
  VendorItem,
} from "../types";
import type { PreviewApi } from "./use-preview";

export function FinanceiroPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.financeiro;
  const [selectedId, setSelectedId] = useState<string | undefined>(
    STUB_FINANCE_RECORDS.find((r) => r.status === "due")?.id ??
      STUB_FINANCE_RECORDS[0]?.id
  );

  const selected = useMemo<FinanceRecord | undefined>(
    () => STUB_FINANCE_RECORDS.find((r) => r.id === selectedId),
    [selectedId]
  );

  function openVendor(v: VendorItem) {
    preview.open({
      kind: "vendor",
      id: v.id,
      title: v.name,
      subtitle: v.service,
      payload: v,
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

  function openFinance(r: FinanceRecord) {
    setSelectedId(r.id);
    if (r.receipt_id) {
      const rc = STUB_RECEIPTS.find((x) => x.id === r.receipt_id);
      if (rc) return openReceipt(rc);
    }
    if (r.ghost_id) {
      const g = STUB_GHOSTS.find((x) => x.id === r.ghost_id);
      if (g) return openGhost(g);
    }
    if (r.vendor_id) {
      const v = STUB_VENDORS.find((x) => x.id === r.vendor_id);
      if (v) return openVendor(v);
    }
    preview.open({
      kind: "json",
      id: r.id,
      title: r.title,
      subtitle: r.category,
      payload: r,
    });
  }

  useEffect(() => {
    if (selected) openFinance(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  function openSpending(e: SpendingEvent) {
    if (e.receipt_id) {
      const r = STUB_RECEIPTS.find((x) => x.id === e.receipt_id);
      if (r) return openReceipt(r);
    }
    if (e.ghost_id) {
      const g = STUB_GHOSTS.find((x) => x.id === e.ghost_id);
      if (g) return openGhost(g);
    }
    if (e.vendor_id) {
      const v = STUB_VENDORS.find((x) => x.id === e.vendor_id);
      if (v) return openVendor(v);
    }
  }

  const urgent = STUB_FINANCE_RECORDS.filter(
    (r) =>
      r.status === "due" ||
      r.status === "needs_approval" ||
      r.status === "denied" ||
      r.status === "missing_evidence"
  );
  const linkedReceipt =
    selected?.receipt_id && STUB_RECEIPTS.find((r) => r.id === selected.receipt_id);
  const linkedGhost =
    selected?.ghost_id && STUB_GHOSTS.find((g) => g.id === selected.ghost_id);
  const linkedGate =
    selected?.gate_id && STUB_GATE_DECISIONS.find((g) => g.id === selected.gate_id);

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <FinanceOverviewCards
        records={STUB_FINANCE_RECORDS}
        budget={STUB_BUDGET}
      />

      <Section title="Due / open">
        <DueBills records={STUB_FINANCE_RECORDS} onSelect={openFinance} />
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <BudgetProgress budget={STUB_BUDGET} />
        <CategoryBreakdown budget={STUB_BUDGET} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SpendingTimeline
          events={STUB_SPENDING_EVENTS}
          onSelect={openSpending}
        />
        <SubscriptionRows vendors={STUB_VENDORS} onSelect={openVendor} />
      </div>

      <Section title="Urgent" hint="ações financeiras que dependem de Daniel">
        {urgent.length === 0 ? (
          <div className="text-[11.5px] text-emerald-300/90">
            sem urgência financeira agora.
          </div>
        ) : (
          <DueBills records={urgent} onSelect={openFinance} />
        )}
      </Section>

      {selected && (linkedReceipt || linkedGhost || linkedGate) && (
        <Section title={`Vínculos · ${selected.title}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
            {linkedGate && (
              <GateDecisionCard
                scope={linkedGate.scope}
                decision={linkedGate.decision}
                reason={linkedGate.reason}
                policy={linkedGate.policy_id}
              />
            )}
          </div>
        </Section>
      )}
    </PageFrame>
  );
}
