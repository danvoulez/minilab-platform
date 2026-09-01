import { PreviewHeader } from "./preview-header";
import { StatusPill } from "../components/status";
import { EvidenceBlock } from "../evidence/evidence-block";
import type { RegistryEntityDetail } from "../lib/registry-api";

export function RegistryProviderPreview({ detail, onClose }: { detail: RegistryEntityDetail; onClose: () => void }) {
  const name = detail.current?.canonical_payload?.name;
  return (
    <div className="flex flex-col">
      <PreviewHeader
        kind="registry_record"
        title={typeof name === "string" ? name : detail.entity.entity_id}
        subtitle={`${detail.entity.entity_kind} · provider state`}
        status={<StatusPill tone={detail.current ? "ok" : "warn"}>{detail.current ? "current state" : "no current state"}</StatusPill>}
        onClose={onClose}
      />
      <div className="p-4 space-y-4 text-[11.5px] text-neutral-300">
        <EvidenceBlock
          items={[
            { label: "entity_id", value: detail.entity.entity_id, mono: true },
            { label: "entity_kind", value: detail.entity.entity_kind },
            { label: "current_state_cid", value: detail.entity.current_state_cid ?? "none", mono: true },
            { label: "updated_at", value: detail.entity.updated_at ?? "unknown", mono: true },
            { label: "versions returned", value: String(detail.versions.length) },
          ]}
        />
        {detail.current && (
          <>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1.5">current canonical payload</div>
              <pre className="rounded-md border border-white/10 bg-black/20 p-3 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[10.5px] leading-relaxed text-neutral-300">
                {JSON.stringify(detail.current.canonical_payload, null, 2)}
              </pre>
            </div>
            <EvidenceBlock
              items={[
                { label: "schema_version", value: detail.current.schema_version, mono: true },
                { label: "content_cid", value: detail.current.content_cid, mono: true },
                { label: "admission_id", value: detail.current.admission_id ?? "not joined", mono: true },
                { label: "authority_ref", value: detail.current.authority_ref ?? "not joined", mono: true },
                { label: "admitted_at", value: detail.current.admitted_at ?? detail.current.created_at, mono: true },
              ]}
            />
          </>
        )}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">version history</div>
          <div className="space-y-1.5">
            {detail.versions.map((version) => (
              <div key={`${version.state_cid}:${version.admission_id ?? "version"}`} className="rounded-md border border-white/[0.08] bg-white/[0.02] px-3 py-2">
                <div className="font-mono text-[10px] text-neutral-300 break-all">{version.state_cid}</div>
                <div className="mt-1 text-[10px] text-neutral-600">{version.schema_version} · {version.admitted_at ?? version.created_at}</div>
              </div>
            ))}
            {detail.versions.length === 0 && <div className="text-[10.5px] text-neutral-600">Nenhuma versão retornada.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
