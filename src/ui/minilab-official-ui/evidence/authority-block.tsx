import { ShieldCheck } from "lucide-react";
import { cn } from "../utils/cn";

export interface Authority {
  who: string;
  role: string;
  can: string[];
}

export function AuthorityBlock({
  authorities,
  className,
}: {
  authorities: Authority[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-white/10 bg-white/[0.02] p-3 space-y-2",
        className
      )}
    >
      <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-wider text-neutral-500">
        <ShieldCheck size={12} strokeWidth={1.5} className="text-blue-300" />
        <span>Autoridade</span>
      </div>
      <ul className="space-y-1.5">
        {authorities.map((a) => (
          <li key={a.who} className="text-[11.5px] text-neutral-300">
            <div>
              <span className="text-neutral-100">{a.who}</span>{" "}
              <span className="text-neutral-500">· {a.role}</span>
            </div>
            <div className="text-[10.5px] text-neutral-500">pode: {a.can.join(", ")}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
