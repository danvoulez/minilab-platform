import { SHELL_IDENTITY } from "../navigation";
import { cn } from "../utils/cn";

export function RailContext({
  collapsed,
  className,
}: {
  collapsed: boolean;
  className?: string;
}) {
  const { product, subtitle, currentContext } = SHELL_IDENTITY;
  return (
    <div
      className={cn(
        "px-3 py-3 border-b border-white/10",
        collapsed && "px-2",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {/* Marca do dashboard Santo André: quadrado com gradiente em vez de
            chapado. Num trilho colapsado é a única coisa que identifica o
            produto, então precisa ler como marca e não como botão. */}
        <div className="h-7 w-7 shrink-0 rounded-lg bg-gradient-to-br from-blue-300 via-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
          mw
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-medium text-neutral-100 leading-tight truncate">
              {product}
            </div>
            <div className="text-[10.5px] text-neutral-500 leading-tight truncate">
              {subtitle}
            </div>
          </div>
        )}
      </div>
      {!collapsed && (
        <div className="mt-3 rounded-md bg-white/[0.03] border border-white/10 px-2 py-1.5">
          <div className="text-[10.5px] text-neutral-500 leading-none">
            current
          </div>
          <div className="mt-0.5 text-xs text-neutral-200 leading-tight">
            {currentContext.label}
          </div>
          <div className="text-[10.5px] text-neutral-500 leading-tight">
            {currentContext.detail}
          </div>
        </div>
      )}
    </div>
  );
}
