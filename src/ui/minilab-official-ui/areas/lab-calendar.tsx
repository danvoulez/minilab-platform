import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section, SectionCard } from "../layout/section";
import { EmptyState, ErrorState, LoadingState } from "../layout/states";
import { PAGE_COPY } from "../copy";
import {
  fetchHealth,
  fetchToday,
  type CalendarColumn,
  type CalendarEvent,
  type HealthResponse,
  type TodayResponse,
} from "../lib/lab-dashboard-api";
import {
  formatTimestamp,
  ResearchHealthPanel,
  SourceStatusPill,
} from "../components/research-health";
import { cn } from "../utils/cn";
import type { PreviewApi } from "./use-preview";

const REFRESH_MS = 5 * 60 * 1000;

export function LabCalendarPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY["lab-calendar"];
  const [today, setToday] = useState<TodayResponse | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let timer: number | undefined;

    async function load() {
      const controller = new AbortController();
      try {
        setError(null);
        const [nextToday, nextHealth] = await Promise.all([
          fetchToday(controller.signal),
          fetchHealth(controller.signal),
        ]);
        if (mounted) {
          setToday(nextToday);
          setHealth(nextHealth);
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (mounted) {
          setLoading(false);
          timer = window.setTimeout(load, REFRESH_MS);
        }
      }
    }

    load();
    return () => {
      mounted = false;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const overlapIds = useMemo(() => {
    const ids = new Set<string>();
    for (const overlap of today?.overlaps ?? []) {
      ids.add(overlap.dan_event_id);
      ids.add(overlap.lab_event_id);
    }
    return ids;
  }, [today]);

  function openEvent(event: CalendarEvent) {
    preview.open({
      kind: "json",
      id: event.id,
      title: event.title,
      subtitle: `${event.calendar} calendar`,
      payload: event,
    });
  }

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      {loading && !today && <LoadingState rows={4} />}
      {error && <ErrorState title="Can't reach LAB dashboard source" hint={error} />}

      {today && (
        <>
          {health && (
            <ResearchHealthPanel
              indicators={health.indicators}
              updatedAt={health.generated_at}
            />
          )}

          <Section
            title="One-off appointments"
            hint={`single day view · ${today.date} · ${today.timezone} · last updated ${formatTimestamp(today.generated_at)}`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <TimelineColumn
                column={today.dan}
                overlapIds={overlapIds}
                onSelect={openEvent}
              />
              <TimelineColumn
                column={today.lab}
                overlapIds={overlapIds}
                onSelect={openEvent}
              />
            </div>
          </Section>

          <Section title="Visible collisions" hint="overlaps between Dan and Lab work">
            {today.overlaps.length === 0 ? (
              <EmptyState
                title="No collisions today"
                hint="The two one-off calendars do not overlap in the current source data."
              />
            ) : (
              <SectionCard>
                <div className="space-y-2">
                  {today.overlaps.map((overlap) => (
                    <div
                      key={`${overlap.dan_event_id}:${overlap.lab_event_id}`}
                      className="rounded-md border border-amber-300/20 bg-amber-300/[0.05] px-3 py-2 text-sm text-neutral-200"
                    >
                      {overlap.start}-{overlap.end} · Dan and Lab calendars overlap
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </Section>
        </>
      )}
    </PageFrame>
  );
}

function TimelineColumn({
  column,
  overlapIds,
  onSelect,
}: {
  column: CalendarColumn;
  overlapIds: Set<string>;
  onSelect: (event: CalendarEvent) => void;
}) {
  const sourceMissing = column.source_status.status !== "ok";

  return (
    <SectionCard className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-neutral-100">{column.label}</div>
          <div className="text-xs text-neutral-500">
            {column.calendar_id || "calendar id not configured"}
          </div>
        </div>
        <SourceStatusPill status={column.source_status} />
      </div>

      {sourceMissing ? (
        <ErrorState
          title="Can't reach source"
          hint={column.source_status.message}
          className="border-sky-500/20 bg-sky-500/[0.04]"
        />
      ) : column.events.length === 0 ? (
        <EmptyState
          title="nothing scheduled today"
          hint="Only non-recurring, one-off appointments appear in this column."
        />
      ) : (
        <div className="relative min-h-[720px] rounded-md border border-white/10 bg-black/20 overflow-hidden">
          <HourGrid />
          {column.events.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => onSelect(event)}
              className={cn(
                "absolute left-12 right-2 rounded-md border p-2 text-left transition-colors",
                "bg-neutral-950/95 hover:bg-neutral-900",
                overlapIds.has(event.id)
                  ? "border-amber-300/70 shadow-[0_0_0_1px_rgba(251,191,36,0.25)]"
                  : "border-white/15"
              )}
              style={{
                top: `${(clampMinutes(event.start_minutes) / 1440) * 100}%`,
                height: `${(eventHeight(event) / 1440) * 100}%`,
              }}
            >
              <div className="text-[11px] text-neutral-500">
                {timeLabel(event.start)}-{timeLabel(event.end)}
              </div>
              <div className="mt-0.5 text-xs text-neutral-100 line-clamp-2">
                {event.title}
              </div>
              {overlapIds.has(event.id) && (
                <div className="mt-1 text-[10px] uppercase tracking-wider text-amber-300">
                  overlap
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function HourGrid() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 25 }).map((_, hour) => (
        <div
          key={hour}
          className="absolute left-0 right-0 border-t border-white/[0.06]"
          style={{ top: `${(hour / 24) * 100}%` }}
        >
          {hour < 24 && (
            <div className="w-10 pr-2 -translate-y-2 text-right text-[10px] tabular-nums text-neutral-600">
              {String(hour).padStart(2, "0")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function timeLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function clampMinutes(value: number) {
  return Math.max(0, Math.min(1439, value));
}

function eventHeight(event: CalendarEvent) {
  return Math.max(20, clampMinutes(event.end_minutes) - clampMinutes(event.start_minutes));
}
