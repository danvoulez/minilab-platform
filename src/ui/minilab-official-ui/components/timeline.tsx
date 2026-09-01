import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { StatusDot, type StatusTone } from "./status";

export interface TimelineEvent {
  id: string;
  when: string;
  title: string;
  detail?: string;
  tone?: StatusTone;
  trailing?: ReactNode;
  onClick?: () => void;
}

export function Timeline({
  events,
  className,
}: {
  events: TimelineEvent[];
  className?: string;
}) {
  return (
    <ol className={cn("relative ml-2 border-l border-white/10 space-y-3", className)}>
      {events.map((e) => (
        <li key={e.id} className="relative pl-4">
          <span className="absolute -left-1 top-1.5">
            <StatusDot tone={e.tone ?? "muted"} />
          </span>
          <button
            type="button"
            onClick={e.onClick}
            className={cn(
              "w-full text-left rounded-md px-2 py-1.5 -mx-2",
              "hover:bg-white/[0.03] transition-colors"
            )}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-[10.5px] tabular-nums text-neutral-500">{e.when}</span>
              <span className="text-[13px] text-neutral-100 truncate">{e.title}</span>
            </div>
            {e.detail && (
              <div className="text-[10.5px] text-neutral-500 mt-0.5">{e.detail}</div>
            )}
            {e.trailing && <div className="mt-1">{e.trailing}</div>}
          </button>
        </li>
      ))}
    </ol>
  );
}
