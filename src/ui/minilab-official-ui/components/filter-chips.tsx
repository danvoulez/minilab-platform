import { cn } from "../utils/cn";

export interface Chip {
  id: string;
  label: string;
}

export function FilterChips({
  chips,
  selected,
  onToggle,
  className,
}: {
  chips: Chip[];
  selected: string[];
  onToggle: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {chips.map((c) => {
        const on = selected.includes(c.id);
        return (
          <button
            key={c.id}
            onClick={() => onToggle(c.id)}
            className={cn(
              "h-7 px-2.5 rounded-full text-[11.5px] border transition-colors",
              on
                ? "border-blue-500/60 bg-blue-500/10 text-blue-200"
                : "border-white/10 bg-white/[0.02] text-neutral-400 hover:text-neutral-100 hover:border-white/20"
            )}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
