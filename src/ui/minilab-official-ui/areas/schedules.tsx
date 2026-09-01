import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section, SectionCard } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { Timeline, type TimelineEvent } from "../components/timeline";
import {
  MissedSchedules,
  RecurringWorkflowRows,
  ScheduleCalendar,
  ScheduleQuality,
  UpcomingRuns,
} from "../components/domain-composition";
import { GhostCard, ReceiptCard } from "../evidence/cards";
import {
  STUB_GHOSTS,
  STUB_RECEIPTS,
  STUB_SCHEDULES,
  STUB_WORKORDERS,
} from "./demo-data";
import type { Ghost, Receipt, Schedule } from "../types";
import type { PreviewApi } from "./use-preview";

export function SchedulesPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.schedules;
  const [selectedId, setSelectedId] = useState<string | undefined>();

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
  function openSchedule(s: Schedule) {
    setSelectedId(s.id);
    if (s.workorder_id) {
      const w = STUB_WORKORDERS.find((x) => x.id === s.workorder_id);
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
    if (s.receipt_id) {
      const r = STUB_RECEIPTS.find((x) => x.id === s.receipt_id);
      if (r) return openReceipt(r);
    }
    if (s.ghost_id) {
      const g = STUB_GHOSTS.find((x) => x.id === s.ghost_id);
      if (g) return openGhost(g);
    }
    preview.open({
      kind: "json",
      id: s.id,
      title: s.title,
      subtitle: s.cadence,
      payload: s,
    });
  }

  // Auto-open first upcoming on mount
  const firstUpcoming = STUB_SCHEDULES.find((s) => s.status === "upcoming");
  useEffect(() => {
    if (firstUpcoming) openSchedule(firstUpcoming);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completed = STUB_SCHEDULES.filter((s) => s.status === "completed");
  const missed = STUB_SCHEDULES.filter((s) => s.status === "missed");

  // Timeline = all scheduled with next_run/last_run, sorted by time of day where present.
  const timelineEvents: TimelineEvent[] = useMemo(() => {
    return STUB_SCHEDULES.map((s) => {
      const tone =
        s.status === "missed"
          ? ("warn" as const)
          : s.status === "completed"
            ? ("ok" as const)
            : s.status === "recurring"
              ? ("info" as const)
              : ("muted" as const);
      return {
        id: s.id,
        when: (s.next_run ?? s.last_run ?? "").slice(11, 16) || "—",
        title: s.title,
        detail: `${s.cadence} · ${s.domain}`,
        tone,
        onClick: () => openSchedule(s),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <ScheduleQuality schedules={STUB_SCHEDULES} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <UpcomingRuns schedules={STUB_SCHEDULES} onSelect={openSchedule} />
        <RecurringWorkflowRows
          schedules={STUB_SCHEDULES}
          onSelect={openSchedule}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <MissedSchedules schedules={STUB_SCHEDULES} onSelect={openSchedule} />
        <ScheduleCalendar schedules={STUB_SCHEDULES} onSelect={openSchedule} />
      </div>

      <Section title="Linha do tempo">
        <SectionCard>
          <Timeline events={timelineEvents} />
        </SectionCard>
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Section title="Completed" hint="schedules fechados; apontam para receipt">
          <div className="space-y-2">
            {completed.length === 0 ? (
              <div className="text-[11.5px] text-neutral-500">
                ainda sem schedules concluídos hoje.
              </div>
            ) : (
              completed.map((s) => {
                const r = s.receipt_id
                  ? STUB_RECEIPTS.find((x) => x.id === s.receipt_id)
                  : undefined;
                return r ? (
                  <ReceiptCard
                    key={s.id}
                    receipt={r}
                    onClick={() => openReceipt(r)}
                  />
                ) : (
                  <div
                    key={s.id}
                    className="text-[11.5px] text-neutral-300 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2"
                  >
                    {s.title}
                  </div>
                );
              })
            )}
          </div>
        </Section>
        <Section title="Missed → Ghost" hint="schedules perdidos que viraram ghost">
          <div className="space-y-2">
            {missed.length === 0 ? (
              <div className="text-[11.5px] text-emerald-300/90">
                nenhum schedule perdido.
              </div>
            ) : (
              missed.map((s) => {
                const g = s.ghost_id
                  ? STUB_GHOSTS.find((x) => x.id === s.ghost_id)
                  : undefined;
                return g ? (
                  <GhostCard key={s.id} ghost={g} onClick={() => openGhost(g)} />
                ) : (
                  <div
                    key={s.id}
                    className="text-[11.5px] text-amber-200 rounded-md border border-amber-500/30 bg-amber-500/[0.05] px-3 py-2"
                  >
                    {s.title} · sem ghost vinculado ainda
                  </div>
                );
              })
            )}
          </div>
        </Section>
      </div>

      {selectedId && (
        <div className="text-[10.5px] text-neutral-600">
          selected · <span className="font-mono">{selectedId}</span> · preview à direita
        </div>
      )}
    </PageFrame>
  );
}
