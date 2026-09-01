import { cn } from "../utils/cn";

// A televisão (expedição #11): o control não reimplementa superfícies do
// 256-eve — ele as exibe ao vivo num retângulo. O eve fica como está (dois
// corpos maduros, dois logins, nenhum template desfigurado); o control ganha
// um iframe sempre que quiser mostrar o eve. Sessão atravessa porque
// control.minilab.work e 256-eve.minilab.work são o mesmo site (minilab.work).
const EVE_ORIGIN = "https://256-eve.minilab.work";

export function EveFrame({
  path,
  title,
  className,
  frameClassName,
}: {
  path: string;
  title: string;
  className?: string;
  frameClassName?: string;
}) {
  const src = `${EVE_ORIGIN}${path}`;
  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[11px] text-neutral-500">
        <span>
          {title} <span className="text-neutral-400">· ao vivo do 256-eve</span>
        </span>
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="hover:text-neutral-800"
        >
          abrir em aba própria ↗
        </a>
      </div>
      <iframe
        src={src}
        title={title}
        className={cn("w-full flex-1 border-0", frameClassName ?? "min-h-[75vh]")}
      />
    </div>
  );
}
