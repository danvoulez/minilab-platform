import { cn } from "../utils/cn";

export function MetricCard({
  label,
  value,
  hint,
  tone = "default",
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "good" | "warn";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-white/[0.03] p-3",
        className
      )}
    >
      <div className="text-[10.5px] uppercase tracking-wider text-neutral-500">{label}</div>
      <div
        className={cn(
          "mt-1 text-xl font-medium tabular-nums",
          tone === "good" && "text-emerald-300",
          tone === "warn" && "text-amber-300",
          tone === "default" && "text-neutral-100"
        )}
      >
        {value}
      </div>
      {hint && <div className="mt-0.5 text-[10.5px] text-neutral-500">{hint}</div>}
    </div>
  );
}
