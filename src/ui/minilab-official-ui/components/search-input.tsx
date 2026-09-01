import { Search } from "lucide-react";
import { cn } from "../utils/cn";

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 h-8 px-2.5 rounded-md border border-white/10 bg-white/[0.02]",
        "focus-within:border-blue-500/60 focus-within:bg-white/[0.04] transition-colors",
        className
      )}
    >
      <Search size={14} strokeWidth={1.5} className="text-neutral-500 shrink-0" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-0 outline-none text-[13px] text-neutral-100 placeholder:text-neutral-600"
      />
    </div>
  );
}
