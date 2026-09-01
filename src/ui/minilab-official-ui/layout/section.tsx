import type { ReactNode } from "react";
import { cn } from "../utils/cn";

export function Section({
  title,
  hint,
  actions,
  children,
  className,
}: {
  title?: string;
  hint?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-2", className)}>
      {(title || actions) && (
        <div className="flex items-end justify-between gap-3">
          <div>
            {title && (
              <h2 className="text-[13px] font-medium uppercase tracking-wider text-neutral-400">
                {title}
              </h2>
            )}
            {hint && <p className="text-xs text-neutral-500 mt-0.5">{hint}</p>}
          </div>
          {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function SectionCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-white/[0.03] p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
