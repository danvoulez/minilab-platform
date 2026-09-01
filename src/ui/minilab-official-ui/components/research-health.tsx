import { SectionCard } from "../layout/section";
import type { HealthIndicator, SourceStatus } from "../lib/lab-dashboard-api";
import { cn } from "../utils/cn";

export function ResearchHealthPanel({
  indicators,
  updatedAt,
}: {
  indicators: HealthIndicator[];
  updatedAt?: string;
}) {
  return (
    <SectionCard className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="text-[13px] font-medium uppercase tracking-wider text-neutral-400">
            Research health
          </div>
          <div className="text-xs text-neutral-500">
            Plan alignment, work load, evidence, appointments, and drift.
          </div>
        </div>
        {updatedAt && (
          <div className="text-[11px] text-neutral-500">
            last updated {formatTimestamp(updatedAt)}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {indicators.map((indicator) => (
          <div
            key={indicator.id}
            className="rounded-md border border-white/10 bg-black/20 p-3 min-w-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm text-neutral-100 truncate">{indicator.label}</div>
                <div className="text-[11px] text-neutral-500 truncate">{indicator.trace}</div>
              </div>
              <div className={cn("text-lg tabular-nums", scoreText(indicator.color))}>
                {indicator.score}
              </div>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className={cn("h-full rounded-full", scoreBg(indicator.color))}
                style={{ width: `${Math.max(0, Math.min(100, indicator.score))}%` }}
              />
            </div>
            <div className="mt-2 text-[11px] text-neutral-400">{indicator.state}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function SourceStatusPill({ status }: { status: SourceStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]",
        status.status === "ok"
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
          : status.status === "missing_config"
            ? "border-sky-400/30 bg-sky-400/10 text-sky-200"
            : "border-amber-400/30 bg-amber-400/10 text-amber-200"
      )}
      title={status.message}
    >
      {status.status}
    </span>
  );
}

export function formatTimestamp(value?: string | null) {
  if (!value) return "unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function scoreText(color: string) {
  if (color === "green") return "text-emerald-300";
  if (color === "red") return "text-rose-300";
  return "text-amber-300";
}

function scoreBg(color: string) {
  if (color === "green") return "bg-emerald-400";
  if (color === "red") return "bg-rose-400";
  return "bg-amber-400";
}

