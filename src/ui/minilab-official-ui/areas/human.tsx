import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { GhostCard, ReceiptCard } from "../evidence/cards";
import {
  CareChecklist,
  GentleAlerts,
  HumanCheckInCard,
  RoutineQuality,
  SupplyNeeds,
  TodayAppointments,
} from "../components/domain-composition";
import {
  STUB_APPOINTMENTS,
  STUB_CARE_ITEMS,
  STUB_GENTLE_ALERTS,
  STUB_GHOSTS,
  STUB_HUMAN_CHECKINS,
  STUB_RECEIPTS,
  STUB_SUPPLY_NEEDS,
} from "./demo-data";
import type { CareGroup, CareItem, Ghost, Receipt } from "../types";
import type { PreviewApi } from "./use-preview";

const GROUP_ORDER: CareGroup[] = [
  "hydration",
  "food",
  "hygiene",
  "mental",
  "social",
  "peace",
];

const GROUP_TITLE: Record<CareGroup, string> = {
  hydration: "Hydration",
  food: "Food",
  hygiene: "Hygiene",
  mental: "Mental",
  social: "Social",
  peace: "Peace",
};

export function HumanPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.human;
  const [selectedId, setSelectedId] = useState<string | undefined>(
    STUB_CARE_ITEMS.find((c) => c.status === "missing")?.id ??
      STUB_CARE_ITEMS[0]?.id
  );

  const selected = useMemo<CareItem | undefined>(
    () => STUB_CARE_ITEMS.find((c) => c.id === selectedId),
    [selectedId]
  );

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

  function openCare(it: CareItem) {
    setSelectedId(it.id);
    if (it.receipt_id) {
      const r = STUB_RECEIPTS.find((x) => x.id === it.receipt_id);
      if (r) return openReceipt(r);
    }
    if (it.ghost_id) {
      const g = STUB_GHOSTS.find((x) => x.id === it.ghost_id);
      if (g) return openGhost(g);
    }
    preview.open({
      kind: "json",
      id: it.id,
      title: it.title,
      subtitle: GROUP_TITLE[it.group],
      payload: it,
    });
  }

  useEffect(() => {
    if (selected) openCare(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  const closedToday = STUB_RECEIPTS.filter((r) =>
    r.closed_at.startsWith("2026-05-19")
  ).slice(0, 3);
  const openGhosts = STUB_GHOSTS.filter((g) => g.status === "open").slice(0, 3);

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <RoutineQuality items={STUB_CARE_ITEMS} />

      <GentleAlerts alerts={STUB_GENTLE_ALERTS} />

      {GROUP_ORDER.map((g) => (
        <Section key={g} title={GROUP_TITLE[g]}>
          <CareChecklist
            items={STUB_CARE_ITEMS}
            onSelect={openCare}
            group={g}
          />
        </Section>
      ))}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <HumanCheckInCard checkins={STUB_HUMAN_CHECKINS} />
        <SupplyNeeds needs={STUB_SUPPLY_NEEDS} />
      </div>

      <TodayAppointments
        appointments={STUB_APPOINTMENTS.filter(
          (a) => a.domain === "human" || a.state === "now"
        ).map((a) => ({
          id: a.id,
          when: a.when,
          title: a.title,
          tone:
            a.state === "done"
              ? "ok"
              : a.state === "now"
                ? "info"
                : a.state === "missed"
                  ? "warn"
                  : "muted",
        }))}
      />

      <Section title="Needs attention" hint="o que vale uma pausa breve">
        {STUB_CARE_ITEMS.filter(
          (i) => i.status === "missing" || i.status === "ghost"
        ).length === 0 ? (
          <div className="text-[11.5px] text-emerald-300/90">
            está tudo bem por agora.
          </div>
        ) : (
          <CareChecklist
            items={STUB_CARE_ITEMS.filter(
              (i) => i.status === "missing" || i.status === "ghost"
            )}
            onSelect={openCare}
          />
        )}
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Section title="Fechado hoje" hint="o que foi cuidado com evidência">
          {closedToday.length === 0 ? (
            <div className="text-[11.5px] text-neutral-500">
              ainda nada fechado hoje.
            </div>
          ) : (
            <div className="space-y-2">
              {closedToday.map((r) => (
                <ReceiptCard
                  key={r.id}
                  receipt={r}
                  onClick={() => openReceipt(r)}
                />
              ))}
            </div>
          )}
        </Section>
        <Section title="Ghosts vinculados" hint="incompletudes que tocam o humano">
          {openGhosts.length === 0 ? (
            <div className="text-[11.5px] text-emerald-300/90">
              nenhuma incompletude pendente.
            </div>
          ) : (
            <div className="space-y-2">
              {openGhosts.map((g) => (
                <GhostCard
                  key={g.id}
                  ghost={g}
                  onClick={() => openGhost(g)}
                />
              ))}
            </div>
          )}
        </Section>
      </div>
    </PageFrame>
  );
}
