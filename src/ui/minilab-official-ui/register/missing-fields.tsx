import { CircleDashed } from "lucide-react";
import { cn } from "../utils/cn";

export function MissingFields({
  fields,
  className,
}: {
  fields: string[];
  className?: string;
}) {
  if (fields.length === 0) {
    return (
      <div className={cn("text-[11.5px] text-emerald-300/90", className)}>
        Todos os campos canônicos preenchidos.
      </div>
    );
  }
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="text-[10.5px] uppercase tracking-wider text-amber-300/90">
        Campos faltando
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {fields.map((f) => (
          <li
            key={f}
            className="inline-flex items-center gap-1 h-6 px-2 rounded text-[10.5px] bg-amber-500/[0.08] text-amber-200 ring-1 ring-inset ring-amber-500/30"
          >
            <CircleDashed size={11} strokeWidth={1.5} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="text-[10.5px] text-neutral-500">
        Enquanto faltarem campos, a admissão fica bloqueada. Nada é persistido como atalho.
      </div>
    </div>
  );
}
