import { Construction, FileText } from "lucide-react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section, SectionCard } from "../layout/section";
import { PAGE_COPY } from "../copy";
import { getPageContract, getRule } from "../manifests";
import { cn } from "../utils/cn";
import type { AreaId } from "../types";

import { GENERATED_ROUTE_META } from "../generated/routes.generated";
export function PlaceholderPage({ area }: { area: AreaId }) {
  const copy = PAGE_COPY[area];
  const contract = getPageContract(area);

  if (!contract) {
    return (
      <PageFrame>
        <PageHeader title={copy.title} lede={copy.lede} />
        <SectionCard>
          <div className="text-[11.5px] text-neutral-400">
            Esta área existe na navegação mas não está no manifesto. Atualize
            <span className="font-mono"> 03.page-manifest.yaml </span> para
            descrever o contrato.
          </div>
        </SectionCard>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <PlannedBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ContractList title="Componentes prometidos" items={contract.components} mono />
        <ContractList title="Dados (entidades)" items={contract.data} mono />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ContractList
          title="Preview kinds"
          items={contract.preview as unknown as string[]}
          mono
        />
        <RulesList rules={contract.rules} />
      </div>

      <Section title="Forma">
        <SectionCard>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <ContractField label="layout" value={contract.layout} />
            <ContractField label="nav_group" value={contract.nav_group} />
          </div>
        </SectionCard>
      </Section>

      <ManifestFooter area={area} />
    </PageFrame>
  );
}

function PlannedBanner() {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-amber-500/30 bg-amber-500/[0.04]",
        "px-4 py-3 flex items-start gap-3"
      )}
    >
      <Construction
        size={16}
        strokeWidth={1.5}
        className="text-amber-300 mt-0.5 shrink-0"
      />
      <div className="min-w-0">
        <div className="text-[13px] text-amber-100">
          Planejado pelo manifesto · ainda não implementado
        </div>
        <div className="mt-0.5 text-[10.5px] text-amber-200/70 leading-relaxed">
          Esta página existe como contrato no{" "}
          <span className="font-mono">03.page-manifest.yaml</span> e está
          listada na matriz. O que aparece abaixo é o que ela vai entregar
          quando for construída — não é UI real, é descrição derivada do
          manifesto.
        </div>
      </div>
    </div>
  );
}

function ContractList({
  title,
  items,
  mono,
}: {
  title: string;
  items: string[];
  mono?: boolean;
}) {
  return (
    <Section title={title} hint={items.length === 0 ? "—" : `${items.length} item(s)`}>
      <SectionCard>
        {items.length === 0 ? (
          <div className="text-[11.5px] text-neutral-500">nenhum</div>
        ) : (
          <ul className="flex flex-wrap gap-1.5">
            {items.map((it) => (
              <li
                key={it}
                className={cn(
                  "h-6 inline-flex items-center px-2 rounded text-[10.5px]",
                  "border border-white/10 bg-white/[0.03] text-neutral-300",
                  mono && "font-mono"
                )}
              >
                {it}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </Section>
  );
}

function RulesList({ rules }: { rules: string[] }) {
  return (
    <Section
      title="Regras que se aplicam"
      hint={rules.length === 0 ? "—" : `${rules.length} regra(s)`}
    >
      <SectionCard>
        {rules.length === 0 ? (
          <div className="text-[11.5px] text-neutral-500">
            nenhuma regra adicional além das gerais.
          </div>
        ) : (
          <ul className="space-y-2">
            {rules.map((rid) => {
              const r = getRule(rid);
              return (
                <li key={rid} className="text-[11.5px]">
                  <div className="font-mono text-blue-300/90">{rid}</div>
                  {r ? (
                    <div className="text-neutral-400 leading-snug">
                      {r.assertion}
                    </div>
                  ) : (
                    <div className="text-neutral-600 italic">
                      regra não encontrada no manifesto
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>
    </Section>
  );
}

function ContractField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div className="text-[11.5px] font-mono text-neutral-200">{value}</div>
    </div>
  );
}

function ManifestFooter({ area }: { area: AreaId }) {
  const implemented = GENERATED_ROUTE_META[area]?.status === "implemented";
  return (
    <div className="pt-4 mt-2 border-t border-white/[0.06] flex items-center gap-2 text-[10.5px] text-neutral-500">
      <FileText size={11} strokeWidth={1.5} />
      <span>
        Gerado de{" "}
        <span className="font-mono text-neutral-400">99.matrix.generated.yaml</span>
        {" + "}
        <span className="font-mono text-neutral-400">07.quality-rules.yaml</span>
      </span>
      <span className="text-neutral-700">·</span>
      <span>
        status:{" "}
        <span
          className={cn(
            "font-mono",
            implemented ? "text-emerald-300" : "text-amber-300"
          )}
        >
          {implemented ? "implemented" : "planned"}
        </span>
      </span>
    </div>
  );
}
