import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { MetricCard } from "../components/metric-card";
import { EvidenceBlock } from "../evidence/evidence-block";
import { GhostCard, ReceiptCard } from "../evidence/cards";
import {
  CommentThread,
  DiffReview,
  GateDecisionPanel,
  ReviewChecklist,
  ReviewQueue,
} from "../components/domain-composition";
import {
  STUB_GATE_DECISIONS,
  STUB_GHOSTS,
  STUB_RECEIPTS,
  STUB_REVIEWS,
  STUB_WORKORDERS,
} from "./demo-data";
import type {
  GateDecisionRecord,
  Ghost,
  Receipt,
  ReviewItem,
  Workorder,
} from "../types";
import type { PreviewApi } from "./use-preview";

export function ReviewsPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.reviews;
  const [selectedId, setSelectedId] = useState<string | undefined>(
    STUB_REVIEWS.find((r) => r.status === "in_review")?.id ?? STUB_REVIEWS[0]?.id
  );

  const selected = useMemo<ReviewItem | undefined>(
    () => STUB_REVIEWS.find((r) => r.id === selectedId),
    [selectedId]
  );

  function openReview(r: ReviewItem) {
    setSelectedId(r.id);
    // Open the most informative linked thing in preview
    if (r.gate_id) {
      const g = STUB_GATE_DECISIONS.find((d) => d.id === r.gate_id);
      if (g) {
        preview.open({
          kind: "gate",
          id: g.id,
          title: g.scope,
          subtitle: g.policy_id,
          payload: g,
        });
        return;
      }
    }
    if (r.workorder_id) {
      const w = STUB_WORKORDERS.find((x) => x.id === r.workorder_id);
      if (w) {
        preview.open({
          kind: "workorder",
          id: w.id,
          title: w.title,
          subtitle: w.scope,
          payload: w,
        });
        return;
      }
    }
    if (r.document_id) {
      preview.open({
        kind: "document",
        id: r.document_id,
        title: r.title,
        subtitle: `${r.kind} · ${r.scope}`,
        payload: { id: r.document_id, title: r.title, kind: r.kind, status: "review", domain: r.scope, content: r.diff_summary },
      });
      return;
    }
    if (r.receipt_id) {
      const rc = STUB_RECEIPTS.find((x) => x.id === r.receipt_id);
      if (rc) return openReceipt(rc);
    }
    preview.open({
      kind: "json",
      id: r.id,
      title: r.title,
      subtitle: r.scope,
      payload: r,
    });
  }

  function openReceipt(rc: Receipt) {
    preview.open({
      kind: "receipt",
      id: rc.id,
      title: rc.scope,
      payload: rc,
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
  function openGateDecision(d: GateDecisionRecord) {
    preview.open({
      kind: "gate",
      id: d.id,
      title: d.scope,
      subtitle: d.policy_id,
      payload: d,
    });
  }
  // intentionally unused workorder opener — kept for future linking
  void ((_: Workorder) => {});

  useEffect(() => {
    if (selected) openReview(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  // Metric counts
  const counts = useMemo(() => {
    return {
      queued: STUB_REVIEWS.filter((r) => r.status === "queued").length,
      in_review: STUB_REVIEWS.filter((r) => r.status === "in_review").length,
      blocked: STUB_REVIEWS.filter((r) => r.status === "blocked").length,
      ready: STUB_REVIEWS.filter((r) => r.status === "ready_to_close").length,
      closed: STUB_REVIEWS.filter((r) => r.status === "closed").length,
    };
  }, []);

  const selectedReceipt = selected?.receipt_id
    ? STUB_RECEIPTS.find((r) => r.id === selected.receipt_id)
    : undefined;
  const selectedGhost = selected?.ghost_id
    ? STUB_GHOSTS.find((g) => g.id === selected.ghost_id)
    : undefined;

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MetricCard label="Queued" value={counts.queued} />
        <MetricCard label="In review" value={counts.in_review} tone="default" />
        <MetricCard
          label="Blocked"
          value={counts.blocked}
          tone={counts.blocked > 0 ? "warn" : "default"}
        />
        <MetricCard label="Ready to close" value={counts.ready} tone="good" />
        <MetricCard label="Closed" value={counts.closed} tone="good" />
      </div>

      <Section
        title="Review queue"
        hint="agrupado por status · clique abre detalhe à direita"
      >
        <ReviewQueue
          reviews={STUB_REVIEWS}
          selectedId={selected?.id}
          onSelect={openReview}
        />
      </Section>

      {selected && (
        <Section
          title={`Detalhe · ${selected.title}`}
          hint="diff, gate vinculado, checklist e thread de comentários"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <DiffReview review={selected} />
            <ReviewChecklist review={selected} />
            <GateDecisionPanel
              review={selected}
              decisions={STUB_GATE_DECISIONS}
              onSelectDecision={openGateDecision}
            />
            <CommentThread review={selected} />
            <div className="md:col-span-2">
              <EvidenceBlock
                items={[
                  { label: "kind", value: selected.kind },
                  { label: "scope", value: selected.scope },
                  { label: "reviewer", value: selected.reviewer ?? "—" },
                  { label: "created_at", value: selected.created_at, mono: true },
                  ...(selected.blocked_reason
                    ? [{ label: "blocked", value: selected.blocked_reason }]
                    : []),
                  ...(selected.workorder_id
                    ? [
                        {
                          label: "workorder",
                          value: selected.workorder_id,
                          mono: true,
                        },
                      ]
                    : []),
                  ...(selected.gate_id
                    ? [{ label: "gate", value: selected.gate_id, mono: true }]
                    : []),
                  ...(selected.document_id
                    ? [{ label: "document", value: selected.document_id, mono: true }]
                    : []),
                ]}
              />
            </div>
          </div>
        </Section>
      )}

      {(selectedReceipt || selectedGhost) && (
        <Section
          title="Fechamento vinculado"
          hint="onde o review aponta quando fechar"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedReceipt && (
              <ReceiptCard
                receipt={selectedReceipt}
                onClick={() => openReceipt(selectedReceipt)}
              />
            )}
            {selectedGhost && (
              <GhostCard
                ghost={selectedGhost}
                onClick={() => openGhost(selectedGhost)}
              />
            )}
          </div>
        </Section>
      )}
    </PageFrame>
  );
}
