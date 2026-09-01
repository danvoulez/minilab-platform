import { cn } from "../utils/cn";

export interface EvidenceItem {
  label: string;
  value: string;
  mono?: boolean;
}

export function EvidenceBlock({
  items,
  className,
}: {
  items: EvidenceItem[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-white/10 bg-black/20 divide-y divide-white/[0.06]",
        className
      )}
    >
      {items.map((it) => (
        <div key={it.label} className="grid grid-cols-[120px_1fr] gap-3 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-neutral-500">
            {it.label}
          </div>
          <div
            className={cn(
              "text-[11.5px] text-neutral-200 break-words",
              it.mono && "font-mono text-[10.5px] text-neutral-300"
            )}
          >
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}
