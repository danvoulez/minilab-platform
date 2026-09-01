import { ShieldCheck } from "lucide-react";
import { SHELL_IDENTITY } from "../navigation";
import { cn } from "../utils/cn";

/**
 * A instituição em vigor, no trilho.
 *
 * Ocupa o lugar do cartão "Active Preset" do dashboard Santo André — mesma
 * função: dizer, sem sair da tela, sob que regime você está operando. A
 * diferença é o que acontece quando não há resposta.
 *
 * "Enterprise Strict · 102 policies · 18 checks" é uma contagem. Se ninguém
 * apurou aquilo, o cartão está mentindo com precisão decimal. Aqui, sem
 * provider ou fonte institucional conectada, o estado vazio usa a palavra que o próprio léxico
 * já define para isso: "Sem conexão". Não finge saber.
 *
 * Regra de linguagem (21.copy-lexicon.yaml): o meio e o trilho falam humano.
 * Digest, realm, id de contrato e verdict são `allowed_in_preview`, não aqui.
 * Quem quiser o dado técnico abre o preview.
 */

export type RailAuthority = {
  /** Como a autoridade se chama em linguagem humana. */
  readonly label: string;
  /** Uma linha sobre o que ela permite. */
  readonly detail: string;
  /** Quantas capacidades estão admitidas agora. */
  readonly admitted?: number;
  /** Quantas coisas esperam uma decisão sua. */
  readonly awaiting?: number;
};

export function RailAuthorityCard({
  authority,
  collapsed,
  onOpen,
}: {
  authority: RailAuthority | null;
  collapsed: boolean;
  onOpen?: () => void;
}) {
  const copy = SHELL_IDENTITY.authority;
  const empty = authority === null;

  // Colapsado, o trilho é um mostrador de ícones. Um cartão de texto ali vira
  // ruído — mas o estado precisa continuar visível, então vira um ponto.
  if (collapsed) {
    return (
      <div className="px-2 pb-2 flex justify-center" title={copy.label}>
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            empty ? "bg-neutral-600" : "bg-blue-400"
          )}
          aria-label={empty ? copy.emptyLabel : authority.label}
        />
      </div>
    );
  }

  return (
    <div className="mx-2 mb-3 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-2">
      <div className="flex items-center gap-1.5">
        <ShieldCheck
          size={13}
          strokeWidth={2}
          className={empty ? "text-neutral-600" : "text-blue-300"}
        />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
          {copy.label}
        </span>
      </div>

      <div
        className={cn(
          "mt-1 text-[12.5px] leading-tight",
          empty ? "text-neutral-500" : "text-neutral-100"
        )}
      >
        {empty ? copy.emptyLabel : authority.label}
      </div>
      <div className="text-[10.5px] leading-tight text-neutral-500">
        {empty ? copy.emptyDetail : authority.detail}
      </div>

      {!empty && (authority.admitted !== undefined || authority.awaiting !== undefined) && (
        <div className="mt-1.5 flex items-center gap-2 text-[10px] text-neutral-500">
          {authority.admitted !== undefined && (
            <span>{authority.admitted} admitidas</span>
          )}
          {authority.admitted !== undefined && authority.awaiting !== undefined && (
            <span aria-hidden>·</span>
          )}
          {/* "Aguardando você" é a palavra do léxico para needs_approval. Não
              é um número neutro: é a única contagem no trilho que pede ação. */}
          {authority.awaiting !== undefined && authority.awaiting > 0 && (
            <span className="text-blue-300">{authority.awaiting} aguardando você</span>
          )}
        </div>
      )}

      {onOpen && !empty && (
        <button
          type="button"
          onClick={onOpen}
          className="mt-1.5 text-[10px] font-medium text-blue-300/80 hover:text-blue-200 transition-colors"
        >
          {copy.actionLabel}
        </button>
      )}
    </div>
  );
}
