import { cn } from "../utils/cn";

export interface RegisterActionsProps {
  canCommit: boolean;
  isSubmitting?: boolean;
  onRefine: () => void;
  onDiscard: () => void;
  onCommit: () => void;
  className?: string;
}

export function RegisterActions({
  canCommit,
  isSubmitting = false,
  onRefine,
  onDiscard,
  onCommit,
  className,
}: RegisterActionsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <button
        type="button"
        onClick={onRefine}
        className="h-8 px-3 rounded-md text-[11.5px] whitespace-nowrap text-neutral-200 bg-white/[0.04] hover:bg-white/[0.08] ring-1 ring-inset ring-white/10 transition-colors"
      >
        Refinar
      </button>
      <button
        type="button"
        onClick={onDiscard}
        className="h-8 px-3 rounded-md text-[11.5px] whitespace-nowrap text-neutral-400 bg-white/[0.03] hover:bg-white/[0.07] ring-1 ring-inset ring-white/10 transition-colors"
      >
        Descartar
      </button>
      <button
        type="button"
        onClick={onCommit}
        disabled={!canCommit || isSubmitting}
        title={
          canCommit
            ? "Enviar o payload revisado para o provider que implementa a admissão do Registry."
            : "Revise o payload e preencha os campos exigidos antes da admissão."
        }
        className={cn(
          "h-8 px-3 rounded-md text-[11.5px] font-medium whitespace-nowrap transition-colors",
          canCommit && !isSubmitting
            ? "bg-blue-500/20 text-blue-200 ring-1 ring-inset ring-blue-500/40 hover:bg-blue-500/30"
            : "bg-white/[0.04] text-neutral-600 ring-1 ring-inset ring-white/[0.06] cursor-not-allowed"
        )}
      >
        {isSubmitting ? "Admitindo…" : "Admitir no Registry"}
      </button>
    </div>
  );
}
