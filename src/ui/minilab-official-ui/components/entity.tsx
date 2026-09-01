import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../utils/cn";
import { StatusDot, type StatusTone } from "./status";

export interface EntityRowProps {
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  tone?: StatusTone;
  selected?: boolean;
  onClick?: () => void;
}

export function EntityRow({
  title,
  subtitle,
  meta,
  tone = "muted",
  selected,
  onClick,
}: EntityRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group w-full h-10 px-3 flex items-center gap-3 text-left",
        "border-b border-white/[0.06] last:border-b-0",
        "hover:bg-white/[0.03] transition-colors",
        selected && "bg-white/[0.04] ring-1 ring-inset ring-blue-500/40"
      )}
    >
      <StatusDot tone={tone} />
      <div className="flex-1 min-w-0 flex items-center gap-2 transition-transform duration-150 group-hover:translate-x-[2px]">
        <span className="text-[13px] text-neutral-100 truncate">{title}</span>
        {subtitle && (
          <span className="text-[10.5px] text-neutral-500 truncate">· {subtitle}</span>
        )}
      </div>
      {meta && <div className="shrink-0 text-[10.5px] text-neutral-400">{meta}</div>}
      <ChevronRight
        size={14}
        strokeWidth={1.5}
        className="text-neutral-600 group-hover:text-neutral-400"
      />
    </button>
  );
}

export function EntityTable({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}

export function EntityCard({
  title,
  subtitle,
  tone = "muted",
  body,
  footer,
  selected,
  onClick,
  className,
}: {
  title: string;
  subtitle?: string;
  tone?: StatusTone;
  body?: ReactNode;
  footer?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg border bg-white/[0.03] p-3 space-y-2 transition-colors",
        selected
          ? "border-blue-500/60 bg-white/[0.05]"
          : "border-white/10 hover:border-white/20 hover:bg-white/[0.05]",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <StatusDot tone={tone} />
        <div className="min-w-0 flex-1">
          <div className="text-[13px] text-neutral-100 truncate">{title}</div>
          {subtitle && (
            <div className="text-[10.5px] text-neutral-500 truncate">{subtitle}</div>
          )}
        </div>
      </div>
      {body && <div className="text-[11.5px] text-neutral-300">{body}</div>}
      {footer && (
        <div className="pt-1 text-[10.5px] text-neutral-500 flex items-center gap-2">
          {footer}
        </div>
      )}
    </button>
  );
}
