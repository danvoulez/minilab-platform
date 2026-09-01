import type { ReactNode } from "react";
import { cn } from "../utils/cn";

export function PageHeader({
  title,
  lede,
  actions,
  className,
}: {
  title: string;
  lede: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex items-start justify-between gap-6 pb-2", className)}>
      <div className="min-w-0 max-w-prose">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-100 leading-tight">
          {title}
        </h1>
        <p className="mt-1 text-sm text-neutral-400 leading-snug">{lede}</p>
      </div>
      {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
    </header>
  );
}
