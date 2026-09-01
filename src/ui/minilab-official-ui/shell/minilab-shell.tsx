import type { ReactNode } from "react";
import { cn } from "../utils/cn";

export function MinilabShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("h-screen w-screen overflow-hidden bg-page", className)}>
      {children}
    </div>
  );
}
