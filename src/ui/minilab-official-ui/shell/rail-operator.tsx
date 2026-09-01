import { SHELL_IDENTITY } from "../navigation";

/**
 * Quem está operando, no rodapé do trilho — vindo do dashboard Santo André.
 *
 * Não é enfeite: toda ação que sai desta tela é atribuída a alguém, e a
 * aprovação humana do Carbon distingue o humano autenticado do signatário
 * institucional. Ter o operador visível o tempo todo é o começo dessa
 * distinção na interface.
 *
 * Some quando o trilho colapsa: o rodapé é a primeira coisa que vira ruído
 * num mostrador de ícones.
 */
export function RailOperator({ collapsed }: { collapsed: boolean }) {
  if (collapsed) return null;
  const { name, role, initials } = SHELL_IDENTITY.operator;
  return (
    <div className="mt-auto border-t border-white/10 px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-blue-400/80 to-blue-600/80 flex items-center justify-center text-[10px] font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[12.5px] leading-tight text-neutral-200">
            {name}
          </div>
          <div className="truncate text-[10.5px] leading-tight text-neutral-500">
            {role}
          </div>
        </div>
      </div>
    </div>
  );
}
