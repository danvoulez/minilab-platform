import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section, SectionCard } from "../layout/section";
import { EmptyState, ErrorState, LoadingState } from "../layout/states";
import { MetricCard } from "../components/metric-card";
import {
  fetchResearch,
  type ResearchLevel,
  type ResearchResponse,
} from "../lib/lab-dashboard-api";
import { formatTimestamp, SourceStatusPill } from "../components/research-health";
import { GENERATED_PAGE_CONTRACTS } from "../generated/page-contracts.generated";
import type { PreviewApi } from "./use-preview";

type ResearchPlanAreaId = "research-profile" | "milestones" | "short-term";

export function ResearchProfilePage({ preview }: { preview: PreviewApi }) {
  return <ResearchPlanPage levelId="research-profile" preview={preview} />;
}

export function MilestonesPage({ preview }: { preview: PreviewApi }) {
  return <ResearchPlanPage levelId="milestones" preview={preview} />;
}

export function ShortTermPage({ preview }: { preview: PreviewApi }) {
  return <ResearchPlanPage levelId="short-term" preview={preview} />;
}

function ResearchPlanPage({
  levelId,
  preview,
}: {
  levelId: ResearchPlanAreaId;
  preview: PreviewApi;
}) {
  const contract = GENERATED_PAGE_CONTRACTS[levelId];
  const horizon = contract.directions.horizon;
  const [data, setData] = useState<ResearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchResearch()
      .then((next) => {
        if (mounted) setData(next);
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const level = useMemo(
    () => data?.levels.find((candidate) => candidate.id === levelId) ?? null,
    [data, levelId]
  );

  function openLevel(next: ResearchLevel) {
    preview.open({
      kind: "json",
      id: next.id,
      title: next.title,
      subtitle: next.path,
      payload: next,
    });
  }

  return (
    <PageFrame>
      <PageHeader title={contract.title} lede={contract.lede} />

      {loading && <LoadingState rows={4} />}
      {error && <ErrorState title="Can't reach research source" hint={error} />}

      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard label="Horizon" value={horizon} />
            <MetricCard
              label="Level hash"
              value={level?.content_hash.slice(0, 8) ?? "missing"}
              tone={level ? "good" : "warn"}
            />
            <MetricCard
              label="Combined"
              value={data.combined_hash?.slice(0, 8) ?? "missing"}
              tone={data.combined_hash ? "good" : "warn"}
            />
            <MetricCard label="Repo" value={data.repo} hint={formatTimestamp(data.generated_at)} />
          </div>

          <Section title="Source of truth" hint="real text from GitHub, rendered without paraphrase">
            <SectionCard className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-neutral-100">
                    {level?.title ?? contract.title}
                  </div>
                  <div className="mt-1 text-xs text-neutral-500">
                    {level?.path ?? "path unavailable"}
                  </div>
                </div>
                <SourceStatusPill status={data.source_status} />
              </div>

              {data.source_status.status !== "ok" && (
                <ErrorState
                  title="Can't reach source"
                  hint={data.source_status.message}
                  className="border-sky-500/20 bg-sky-500/[0.04]"
                />
              )}

              {!level ? (
                <EmptyState
                  title="Research level not loaded"
                  hint="The configured GitHub file was not found or could not be read."
                />
              ) : (
                <>
                  <div className="rounded-md border border-white/10 bg-black/20 p-3">
                    <div className="text-xs uppercase tracking-wider text-neutral-500">
                      alignment read
                    </div>
                    <div className="mt-2 text-sm text-neutral-200">
                      This view is an alignment indicator: the hashes prove the currently
                      displayed plan state, while the health cards elsewhere show how well
                      calendar activity and evidence sources match it.
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <HashBlock label="current level" value={level.content_hash} />
                    <HashBlock label="github blob" value={level.sha || "unavailable"} />
                    <HashBlock label="combined plan" value={data.combined_hash || "unavailable"} />
                  </div>
                  <button
                    type="button"
                    onClick={() => openLevel(level)}
                    className="w-full rounded-md border border-white/10 bg-black/20 p-4 text-left hover:bg-white/[0.04]"
                  >
                    <pre className="whitespace-pre-wrap break-words text-xs leading-5 text-neutral-200">
                      {level.text}
                    </pre>
                  </button>
                </>
              )}
            </SectionCard>
          </Section>
        </>
      )}
    </PageFrame>
  );
}

function HashBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-3 min-w-0">
      <div className="text-[11px] uppercase tracking-wider text-neutral-500">{label}</div>
      <div className="mt-2 font-mono text-xs text-neutral-200 break-all">{value}</div>
    </div>
  );
}

