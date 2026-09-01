import { Plus } from "lucide-react";
import { NAVIGATION, SHELL_IDENTITY } from "../navigation";
import type { AreaId } from "../types";
import { cn } from "../utils/cn";
import { RailContext } from "./rail-context";
import { RailCollapseButton } from "./rail-collapse-button";
import { LeftRailItem } from "./left-rail-item";
import { RailAuthorityCard, type RailAuthority } from "./rail-authority";
import { RailOperator } from "./rail-operator";

export function LeftRail({
  active,
  collapsed,
  onSelect,
  onToggleCollapsed,
  onPrimaryAction,
  authority = null,
  onOpenAuthority,
}: {
  active: AreaId;
  collapsed: boolean;
  onSelect: (id: AreaId) => void;
  onToggleCollapsed: () => void;
  onPrimaryAction: () => void;
  /** A instituição em vigor. `null` enquanto não houver provider ou autoridade institucional reportada.
   *  Estado honesto, não placeholder. */
  authority?: RailAuthority | null;
  onOpenAuthority?: () => void;
}) {
  return (
    <aside
      className={cn(
        "h-full flex flex-col bg-panel border-r border-white/10",
        "transition-[width] duration-150 ease-out",
        collapsed ? "w-[56px]" : "w-[232px]"
      )}
    >
      <RailContext collapsed={collapsed} />

      <div className="flex items-center justify-between px-2 py-2">
        <button
          type="button"
          onClick={onPrimaryAction}
          title={collapsed ? "New" : undefined}
          className={cn(
            "h-8 rounded-md bg-blue-500/15 ring-1 ring-blue-500/40 text-blue-200",
            "hover:bg-blue-500/25 hover:text-blue-100 transition-colors",
            "flex items-center gap-1.5 text-[11.5px] font-medium",
            collapsed ? "w-8 justify-center px-0" : "flex-1 px-2.5 justify-start"
          )}
        >
          <Plus size={14} strokeWidth={2} />
          {!collapsed && <span>{SHELL_IDENTITY.primaryAction.label.replace("+ ", "")}</span>}
        </button>
        {!collapsed && (
          <RailCollapseButton collapsed={collapsed} onToggle={onToggleCollapsed} />
        )}
      </div>

      {collapsed && (
        <div className="px-2 pb-2 flex justify-center">
          <RailCollapseButton collapsed={collapsed} onToggle={onToggleCollapsed} />
        </div>
      )}

      <RailAuthorityCard
        authority={authority}
        collapsed={collapsed}
        onOpen={onOpenAuthority}
      />

      <nav
        aria-label="Primary"
        className="flex-1 min-h-0 overflow-y-auto scrollbar-thin px-2 pb-3"
      >
        {NAVIGATION.map((group, idx) => (
          <div key={group.id} className={cn(idx > 0 && "mt-3")}>
            {!collapsed && (
              <div className="px-2 pt-2 pb-1 text-[10px] uppercase tracking-wider text-neutral-600">
                {group.id.replaceAll("_", " ")}
              </div>
            )}
            {collapsed && idx > 0 && (
              <div className="my-2 mx-2 h-px bg-white/[0.06]" />
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <LeftRailItem
                  key={item.id}
                  item={item}
                  active={item.id === active}
                  collapsed={collapsed}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <RailOperator collapsed={collapsed} />
    </aside>
  );
}
