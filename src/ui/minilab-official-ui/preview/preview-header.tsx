import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../utils/cn";
import type { PreviewKind } from "../types";

const KIND_LABEL: Record<PreviewKind, string> = {
  entity: "Entity",
  registry_record: "Registry Entity",
  registry_admission: "Registry Admission",
  receipt: "Receipt",
  ghost: "Ghost",
  workorder: "Workorder",
  sensor: "Sensor",
  machine: "Machine",
  runtime: "Runtime",
  llm: "LLM",
  agent: "Agent",
  document: "Document",
  knowledge: "Knowledge",
  legal: "Legal",
  cost: "Cost",
  vendor: "Vendor",
  policy: "Policy",
  gate: "Gate",
  code: "Code",
  benchmark: "Benchmark",
  json: "JSON",
};

export function PreviewHeader({
  kind,
  title,
  subtitle,
  status,
  actions,
  onClose,
  className,
}: {
  kind: PreviewKind;
  title: string;
  subtitle?: string;
  status?: ReactNode;
  actions?: ReactNode;
  onClose: () => void;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "px-4 py-3 border-b border-white/10 sticky top-0 z-10 bg-panel/95 backdrop-blur",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500">
              {KIND_LABEL[kind]}
            </span>
            {status && <span>{status}</span>}
          </div>
          <h3 className="mt-0.5 text-[14px] font-medium text-neutral-100 leading-tight truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[10.5px] text-neutral-500 truncate">{subtitle}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="h-7 w-7 grid place-items-center rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.06]"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      </div>
      {actions && <div className="mt-2 flex items-center gap-2">{actions}</div>}
    </header>
  );
}
