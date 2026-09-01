import { useEffect, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section, SectionCard } from "../layout/section";
import { EmptyState, ErrorState, LoadingState } from "../layout/states";
import { PAGE_COPY } from "../copy";
import {
  fetchHealth,
  fetchRoutine,
  type CalendarEvent,
  type HealthResponse,
  type RoutineResponse,
} from "../lib/lab-dashboard-api";
import {
  formatTimestamp,
  ResearchHealthPanel,
  SourceStatusPill,
} from "../components/research-health";
import type { PreviewApi } from "./use-preview";

const REFRESH_MS = 5 * 60 * 1000;

export function LabRoutinePage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY["lab-routine"];
  const [routine, setRoutine] = useState<RoutineResponse | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let timer: number | undefined;

    async function load() {
      try {
        setError(null);
        const [nextRoutine, nextHealth] = await Promise.all([
          fetchRoutine(),
          fetchHealth(),
        ]);
        if (mounted) {
          setRoutine(nextRoutine);
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

  function openEvent(event: CalendarEvent) {
    preview.open({
      kind: "json",
      id: event.id,
      title: event.title,
      subtitle: event.recurrence[0] || "recurring automation",
      payload: event,
    });
  }

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      {loading && !routine && <LoadingState rows={4} />}
      {error && <ErrorState title="Can't reach LAB dashboard source" hint={error} />}

      {routine && (
        <>
          {health && (
            <ResearchHealthPanel
              indicators={health.indicators}
              updatedAt={health.generated_at}
            />
          )}

          <SectionCard className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-neutral-500">
                  recurring automations
                </div>
                <div className="mt-1 text-5xl tabular-nums text-neutral-50">
                  {routine.total_count}
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  last updated {formatTimestamp(routine.generated_at)}
                </div>
              </div>
              <div className="text-right space-y-1">
                <SourceStatusPill status={routine.source_status} />
                <div className="text-xs text-neutral-500 max-w-[300px]">
                  {routine.calendar_id || "Lab calendar id not configured"}
                </div>
              </div>
            </div>
            {routine.source_status.status !== "ok" && (
              <ErrorState
                title="Can't reach routine source"
                hint={routine.source_status.message}
                className="border-sky-500/20 bg-sky-500/[0.04]"
              />
            )}
          </SectionCard>

          <Section title="Load by frequency" hint="recurring RRULE events from the Lab calendar">
            {routine.groups.length === 0 ? (
              <EmptyState
                title="No recurring automations"
                hint="The source is either empty or not configured yet."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {routine.groups.map((group) => (
                  <SectionCard key={group.frequency} className="space-y-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="text-sm font-medium capitalize text-neutral-100">
                        {group.frequency}
                      </div>
                      <div className="text-2xl tabular-nums text-neutral-50">{group.count}</div>
                    </div>
                    <div className="space-y-2">
                      {group.events.map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => openEvent(event)}
                          className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-left hover:bg-white/[0.04]"
                        >
                          <div className="text-sm text-neutral-100">{event.title}</div>
                          <div className="mt-1 text-[11px] text-neutral-500 truncate">
                            {event.recurrence.join(" · ")}
                          </div>
                        </button>
                      ))}
                    </div>
                  </SectionCard>
                ))}
              </div>
            )}
          </Section>
        </>
      )}
    </PageFrame>
  );
}
