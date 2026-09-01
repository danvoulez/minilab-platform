import { cn } from "../utils/cn";

export type StatusTone =
  | "ok"
  | "warn"
  | "bad"
  | "info"
  | "ghost"
  | "muted";

const TONE_PILL: Record<StatusTone, string> = {
  ok: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30",
  warn: "bg-amber-500/10 text-amber-300 ring-amber-500/30",
  bad: "bg-rose-500/10 text-rose-300 ring-rose-500/30",
  info: "bg-blue-500/10 text-blue-300 ring-blue-500/30",
  ghost: "bg-violet-500/10 text-violet-300 ring-violet-500/30",
  muted: "bg-white/[0.04] text-neutral-400 ring-white/10",
};

const TONE_DOT: Record<StatusTone, string> = {
  ok: "bg-emerald-400",
  warn: "bg-amber-400",
  bad: "bg-rose-400",
  info: "bg-blue-400",
  ghost: "bg-violet-400",
  muted: "bg-neutral-500",
};

export function StatusPill({
  tone = "muted",
  children,
  className,
}: {
  tone?: StatusTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 h-5 px-1.5 rounded text-[10.5px] ring-1 ring-inset whitespace-nowrap",
        TONE_PILL[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({
  tone = "muted",
  pulse = false,
  className,
}: {
  tone?: StatusTone;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-block h-2 w-2", className)}>
      {pulse && (
        <span
          className={cn(
            "absolute inset-0 rounded-full opacity-60 animate-ping",
            TONE_DOT[tone]
          )}
        />
      )}
      <span className={cn("relative inline-block h-2 w-2 rounded-full", TONE_DOT[tone])} />
    </span>
  );
}
