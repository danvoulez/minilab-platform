import { useEffect, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section, SectionCard } from "../layout/section";
import { EmptyState, ErrorState, LoadingState } from "../layout/states";
import { PAGE_COPY } from "../copy";
import { MetricCard } from "../components/metric-card";
import { EveFrame } from "../components/eve-frame";
import {
  fetchHealth,
  fetchResearch,
  fetchRoutine,
  fetchToday,
  type HealthResponse,
  type ResearchLevel,
  type ResearchResponse,
  type RoutineResponse,
  type TodayResponse,
} from "../lib/lab-dashboard-api";
import {
  formatTimestamp,
  ResearchHealthPanel,
  SourceStatusPill,
} from "../components/research-health";
import type { PreviewApi } from "./use-preview";

const REFRESH_MS = 5 * 60 * 1000;

export function LabTodayPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY["lab-today"];
  const [today, setToday] = useState<TodayResponse | null>(null);
  const [routine, setRoutine] = useState<RoutineResponse | null>(null);
  const [research, setResearch] = useState<ResearchResponse | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let timer: number | undefined;

    async function load() {
      try {
        setError(null);
        const [nextToday, nextRoutine, nextResearch, nextHealth] = await Promise.all([
          fetchToday(),
          fetchRoutine(),
          fetchResearch(),
          fetchHealth(),
        ]);
        if (mounted) {
          setToday(nextToday);
          setRoutine(nextRoutine);
          setResearch(nextResearch);
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

  function openLevel(level: ResearchLevel) {
    preview.open({
      kind: "json",
      id: level.id,
      title: level.title,
      subtitle: level.path,
      payload: level,
    });
  }

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      {loading && !today && !routine && !research && <LoadingState rows={4} />}
      {error && <ErrorState title="Can't reach LAB dashboard source" hint={error} />}

      {today && routine && research && (
        <>
          {health && (
            <ResearchHealthPanel
              indicators={health.indicators}
              updatedAt={health.generated_at}
            />
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard
              label="Today: Dan"
              value={today.dan.events.length}
              hint={today.dan.source_status.status}
              tone={today.dan.source_status.status === "ok" ? "good" : "warn"}
            />
            <MetricCard
              label="Today: Lab"
              value={today.lab.events.length}
              hint={today.lab.source_status.status}
              tone={today.lab.source_status.status === "ok" ? "good" : "warn"}
            />
            <MetricCard
              label="Collisions"
              value={today.overlaps.length}
              hint="one-off overlaps"
              tone={today.overlaps.length > 0 ? "warn" : "good"}
            />
            <MetricCard
              label="Automations"
              value={routine.total_count}
              hint={routine.source_status.status}
              tone={routine.source_status.status === "ok" ? "good" : "warn"}
            />
          </div>

          <Section title="Plan identity" hint="top-to-bottom hash for the current research plan">
            <SectionCard className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-neutral-100">{research.repo}</div>
                  <div className="mt-1 font-mono text-xs text-neutral-400">
                    combined {research.combined_hash || "unavailable"}
                  </div>
                </div>
                <SourceStatusPill status={research.source_status} />
              </div>
              {research.source_status.status !== "ok" && (
                <ErrorState
                  title="Can't reach research source"
                  hint={research.source_status.message}
                  className="border-sky-500/20 bg-sky-500/[0.04]"
                />
              )}
              {research.levels.length === 0 ? (
                <EmptyState
                  title="No research plan loaded"
                  hint="GitHub repo/path configuration is missing or unreachable."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {research.levels.map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => openLevel(level)}
                      className="rounded-md border border-white/10 bg-black/20 p-3 text-left hover:bg-white/[0.04]"
                    >
                      <div className="text-sm text-neutral-100">{level.title}</div>
                      <div className="mt-1 text-xs text-neutral-500 line-clamp-2">
                        {level.summary || level.path}
                      </div>
                      <div className="mt-3 font-mono text-[11px] text-neutral-400">
                        {level.content_hash}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <div className="text-[11px] text-neutral-500">
                last updated {formatTimestamp(research.generated_at)}
              </div>
            </SectionCard>
          </Section>
        </>
      )}
      {/* A aba LAB é a única com licença dashboard-y: o observatório entra
          nu e cru, ao vivo, numa televisão — completo porque é completo. */}
      <Section
        title="Observatório"
        hint="a vista derivada do ledger do 256-eve, ao vivo"
      >
        <EveFrame path="/observatorio" title="Observatório" />
      </Section>
    </PageFrame>
  );
}
