import { cn } from "../utils/cn";
import { StatusPill } from "../components/status";
import { PreviewHeader } from "./preview-header";
import type { RegistryEntity } from "../types";

export function EntityPreview({
  entity,
  onClose,
  className,
}: {
  entity: RegistryEntity;
  onClose: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <PreviewHeader
        kind="entity"
        title={entity.name}
        subtitle={`${entity.domain} · ${entity.role}`}
        status={
          <StatusPill tone={entity.status === "active" ? "ok" : "muted"}>
            {entity.status}
          </StatusPill>
        }
        actions={
          <>
            <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-blue-500/15 ring-1 ring-inset ring-blue-500/40 text-blue-200 hover:bg-blue-500/25">
              Propor mudança
            </button>
            <button className="h-7 px-2.5 rounded-md text-[11.5px] bg-white/[0.04] ring-1 ring-inset ring-white/10 text-neutral-300 hover:bg-white/[0.08]">
              Abrir receipt
            </button>
          </>
        }
        onClose={onClose}
      />
      <div className="p-4 space-y-4">
        <Field label="entity_type" value={entity.entity_type} />
        <Field label="domain" value={entity.domain} />
        <Field label="role" value={entity.role} />
        <Field label="status" value={entity.status} />
        <Field label="updated_at" value={entity.updated_at} mono />
        <div className="rounded-md border border-white/10 bg-black/20 p-3 text-[10.5px] text-neutral-500">
          Edição direta do Registry está desativada. Toda mudança válida nasce de um payload revisado e de uma nova admissão determinística na engine.
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-neutral-500">{label}</div>
      <div
        className={cn(
          "text-[13px] text-neutral-100",
          mono && "font-mono text-[11.5px] text-neutral-300"
        )}
      >
        {value}
      </div>
    </div>
  );
}
