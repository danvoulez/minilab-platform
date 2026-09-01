import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "../utils/cn";

export function RailCollapseButton({
  collapsed,
  onToggle,
  className,
}: {
  collapsed: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={cn(
        "h-7 w-7 grid place-items-center rounded-md text-neutral-400",
        "hover:text-neutral-100 hover:bg-white/[0.06] transition-colors",
        className
      )}
    >
      {collapsed ? (
        <PanelLeftOpen size={15} strokeWidth={1.5} />
      ) : (
        <PanelLeftClose size={15} strokeWidth={1.5} />
      )}
    </button>
  );
}
