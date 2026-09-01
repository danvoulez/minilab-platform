import { cn } from "../utils/cn";
import { StatusPill, type StatusTone } from "../components/status";
import type { Ghost, Receipt } from "../types";

export function ReceiptCard({
  receipt,
  selected,
  onClick,
}: {
  receipt: Receipt;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg border bg-white/[0.03] p-3 space-y-2 transition-colors",
        selected
          ? "border-blue-500/60 bg-white/[0.05]"
          : "border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[13px] text-neutral-100 line-clamp-2 leading-snug min-w-0">
          {receipt.scope}
        </div>
        <StatusPill tone="ok">{receipt.status}</StatusPill>
      </div>
      <div className="text-[11.5px] text-neutral-400 line-clamp-2">
        {receipt.evidence_summary}
      </div>
      <div className="text-[10.5px] text-neutral-500 font-mono">closed · {receipt.closed_at}</div>
    </button>
  );
}

export function GhostCard({
  ghost,
  selected,
  onClick,
}: {
  ghost: Ghost;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg border bg-white/[0.03] p-3 space-y-2 transition-colors",
        selected
          ? "border-violet-500/60 bg-white/[0.05]"
          : "border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[13px] text-neutral-100 line-clamp-2 leading-snug min-w-0">
          {ghost.summary}
        </div>
        <StatusPill tone="ghost">{ghost.reason}</StatusPill>
      </div>
      {ghost.missing.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {ghost.missing.slice(0, 4).map((m) => (
            <span
              key={m}
              className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/[0.08] text-amber-200 ring-1 ring-inset ring-amber-500/30"
            >
              {m}
            </span>
          ))}
          {ghost.missing.length > 4 && (
            <span className="text-[10px] text-neutral-500">+{ghost.missing.length - 4}</span>
          )}
        </div>
      )}
      <div className="text-[10.5px] text-neutral-500 font-mono">opened · {ghost.created_at}</div>
    </button>
  );
}

export type GateDecision = "ok" | "denied" | "needs_approval" | "ghost" | "error";

const DECISION_TONE: Record<GateDecision, StatusTone> = {
  ok: "ok",
  denied: "bad",
  needs_approval: "warn",
  ghost: "ghost",
  error: "bad",
};

export function GateDecisionCard({
  scope,
  decision,
  reason,
  policy,
  className,
}: {
  scope: string;
  decision: GateDecision;
  reason: string;
  policy?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-white/[0.03] p-3 space-y-2",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[13px] text-neutral-100 line-clamp-2 leading-snug min-w-0">
          {scope}
        </div>
        <StatusPill tone={DECISION_TONE[decision]}>{decision.replace("_", " ")}</StatusPill>
      </div>
      <div className="text-[11.5px] text-neutral-400">{reason}</div>
      {policy && (
        <div className="text-[10.5px] text-neutral-500">
          policy · <span className="font-mono">{policy}</span>
        </div>
      )}
    </div>
  );
}

export function LogLineRecordCard({
  who,
  did,
  what,
  when,
  status,
  className,
}: {
  who: string;
  did: string;
  what: string;
  when: string;
  status: "online" | "ghost" | "pending";
  className?: string;
}) {
  const tone: StatusTone =
    status === "online" ? "ok" : status === "ghost" ? "ghost" : "warn";
  return (
    <div
      className={cn(
        "rounded-md border border-white/10 bg-white/[0.03] p-3 font-mono text-[11.5px]",
        className
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="text-[10px] uppercase tracking-wider text-neutral-500">logline</div>
        <StatusPill tone={tone}>{status}</StatusPill>
      </div>
      <div className="text-neutral-300">
        <span className="text-blue-300">{who}</span>{" "}
        <span className="text-neutral-100">{did}</span>{" "}
        <span className="text-neutral-300">{what}</span>{" "}
        <span className="text-neutral-500">@ {when}</span>
      </div>
    </div>
  );
}
