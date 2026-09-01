import { cn } from "../utils/cn";

export interface SegmentedTab<T extends string> {
  id: T;
  label: string;
  count?: number;
}

export function SegmentedTabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: SegmentedTab<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.02] p-0.5",
        className
      )}
    >
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cn(
              "h-7 px-2.5 rounded text-[11.5px] flex items-center gap-1.5 transition-colors",
              active
                ? "bg-white/[0.08] text-neutral-100 ring-1 ring-inset ring-white/10"
                : "text-neutral-400 hover:text-neutral-100"
            )}
          >
            <span>{t.label}</span>
            {typeof t.count === "number" && (
              <span
                className={cn(
                  "rounded px-1.5 text-[10px] leading-4",
                  active ? "bg-white/[0.12] text-neutral-200" : "bg-white/[0.06] text-neutral-500"
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
