import { ChevronRight } from "lucide-react";
import { NavIcon } from "../icons";
import type { NavItem } from "../types";
import { cn } from "../utils/cn";

export function LeftRailItem({
  item,
  active,
  collapsed,
  onSelect,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onSelect: (id: NavItem["id"]) => void;
}) {
  // Item com href é ponte para uma superfície viva fora desta SPA — a UI
  // não implementa o destino, aponta para ele. Nunca fica "active".
  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        title={collapsed ? item.label : undefined}
        className={cn(
          "group relative w-full flex items-center gap-2.5 rounded-md text-left transition-colors",
          "h-9 px-2.5",
          collapsed && "justify-center px-0",
          "text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.04]"
        )}
      >
        <NavIcon
          name={item.icon}
          className="shrink-0 h-4 w-4 text-neutral-500 group-hover:text-neutral-300"
        />
        {!collapsed && (
          <span className="text-[13px] leading-none truncate">
            {item.label} <span className="text-neutral-600">↗</span>
          </span>
        )}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative w-full flex items-center gap-2.5 rounded-md text-left transition-colors",
        "h-9 px-2.5",
        collapsed && "justify-center px-0",
        active
          ? "bg-white/[0.06] text-neutral-100 ring-1 ring-inset ring-blue-500/60"
          : "text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.04]"
      )}
    >
      <NavIcon
        name={item.icon}
        className={cn(
          "shrink-0",
          "h-4 w-4",
          active ? "text-blue-300" : "text-neutral-500 group-hover:text-neutral-300"
        )}
      />
      {!collapsed && (
        <span className="text-[13px] leading-none truncate">{item.label}</span>
      )}
      {/* Chevron do Santo André: diz para que lado a leitura continua. O
          traço à esquerda marca onde você está; este marca para onde vai. */}
      {active && !collapsed && (
        <ChevronRight size={14} strokeWidth={2} className="ml-auto shrink-0 text-neutral-600" />
      )}
      {active && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] bg-blue-500 rounded-r" />
      )}
    </button>
  );
}
