import type { ReactNode } from "react";
import { cn } from "../utils/cn";

export function PageFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-full flex flex-col", className)}>
      <div className="p-6 space-y-4 max-w-[1200px] w-full">{children}</div>
    </div>
  );
}

export function MiddlePanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-4", className)}>{children}</div>;
}
