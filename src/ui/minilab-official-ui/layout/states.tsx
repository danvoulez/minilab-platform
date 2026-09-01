import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "../utils/cn";

export function EmptyState({
  title,
  hint,
  action,
  className,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-white/10 bg-white/[0.02]",
        "p-8 text-center space-y-2",
        className
      )}
    >
      <div className="text-sm text-neutral-200">{title}</div>
      {hint && <div className="text-xs text-neutral-500 max-w-prose mx-auto">{hint}</div>}
      {action && <div className="pt-2 flex justify-center">{action}</div>}
    </div>
  );
}

export function LoadingState({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-10 rounded-md bg-white/[0.03] border border-white/[0.06] animate-pulse"
        />
      ))}
    </div>
  );
}

export function ErrorState({
  title,
  hint,
  action,
  className,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-amber-500/20 bg-amber-500/[0.04] p-4",
        "flex items-start gap-3",
        className
      )}
    >
      <CircleAlert size={16} strokeWidth={1.5} className="text-amber-400 mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-sm text-neutral-100">{title}</div>
        {hint && <div className="text-xs text-neutral-400 mt-0.5">{hint}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}
