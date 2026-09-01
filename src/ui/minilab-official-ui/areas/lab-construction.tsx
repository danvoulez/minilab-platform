import { useEffect, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section, SectionCard } from "../layout/section";
import { EmptyState, ErrorState, LoadingState } from "../layout/states";
import { PAGE_COPY } from "../copy";
import { MetricCard } from "../components/metric-card";
import {
  fetchConstruction,
  type ConstructionResponse,
  type FolderFacts,
  type PlanStage,
  type RepoCommit,
  type RepoFacts,
  type RepoSync,
} from "../lib/lab-dashboard-api";
import { SourceStatusPill, formatTimestamp } from "../components/research-health";
import { cn } from "../utils/cn";
import type { PreviewApi } from "./use-preview";

/**
 * Lab Construction — nós, construindo isto.
 *
 * As outras áreas falam do laboratório. Esta fala de quem o está fazendo, e
 * existe porque a pergunta "onde estamos?" não tinha tela nenhuma: vivia num
 * documento que ninguém abre e numa memória que ninguém compartilha.
 *
 * DUAS COLUNAS QUE NÃO SE MISTURAM. O plano é lido de um documento declarado;
 * o progresso vem dos fatos do repositório. Nenhum dos dois é derivado do
 * outro — deduzir estágios a partir de commits produziria um roteiro que
 * sempre bate com o que já foi feito, e um plano que nunca discorda do código
 * não é um plano, é um espelho.
 *
 * Por isso os estágios aparecem como `declared` e não como "feito": esta tela
 * não sabe o que foi cumprido, e dizer que sabe seria a primeira mentira
 * confortável de um painel de progresso.
 *
 * UM REPOSITÓRIO, PASTAS DENTRO. carbon e gvi já foram repositórios aninhados,
 * e esta tela os mostrava como três árvores lado a lado. Depois que viraram
 * pastas, perguntar `git -C carbon` passou a devolver os fatos do repositório
 * pai — três cartões idênticos com nomes diferentes. Por isso agora há um
 * cartão de árvore e uma lista de pastas: uma pasta não tem branch nem remoto,
 * tem o que anda nela.
 *
 * O QUE ESTA TELA SE OBRIGA A MOSTRAR, mesmo quando é desconfortável:
 *
 *   · código sem remoto aparece como `só aqui`, não como uma linha tranquila.
 *     Nove commits que existem num disco só são nove commits a uma falha de
 *     disco do fim.
 *   · trabalho não commitado vem com os caminhos, não só a contagem — número
 *     sozinho ninguém consegue agir em cima.
 *   · `behind` fala do remoto como ele estava na última busca, e a idade dessa
 *     busca vem ao lado do número. O provider pode não fazer fetch; um "em dia"
 *     medido contra uma memória de ontem seria a mentira mais fácil daqui.
 */

const REFRESH_MS = 2 * 60 * 1000;
const RECENT_IN_CARD = 5;
const DIRTY_IN_CARD = 6;

export function LabConstructionPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY["lab-construction"];
  const [data, setData] = useState<ConstructionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let timer: number | undefined;

    async function load() {
      try {
        setError(null);
        const next = await fetchConstruction();
        if (!mounted) return;
        setData(next);
      } catch (cause) {
        if (mounted) setError(cause instanceof Error ? cause.message : String(cause));
      } finally {
        if (mounted) setLoading(false);
        timer = window.setTimeout(load, REFRESH_MS);
      }
    }

    void load();
    return () => {
      mounted = false;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const tree = data?.tree;
  const sync = tree?.sync;
  const commitsToday = tree?.commits_today.length ?? 0;
  const dirty = tree?.dirty ?? 0;
  const lastCommit = tree?.head?.date;

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      {loading && !data && <LoadingState rows={4} />}
      {error && <ErrorState title="Sem conexão com o provider" hint={error} />}

      {data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard
              label="Commits hoje"
              value={commitsToday}
              // Zero commits hoje não é uma tela vazia: é uma pergunta sobre
              // quando foi a última vez, e a resposta cabe na dica.
              hint={
                commitsToday > 0
                  ? "no repositório"
                  : lastCommit
                    ? `último ${formatAge(lastCommit)}`
                    : "nenhum commit encontrado"
              }
              tone={commitsToday > 0 ? "good" : "default"}
            />
            {/* Trabalho não commitado é a única métrica desta tela que pede
                ação. Zero é bom; qualquer outra coisa é coisa por guardar. */}
            <MetricCard
              label="Por commitar"
              value={dirty}
              hint={dirty === 0 ? "nada solto" : "arquivos modificados"}
              tone={dirty === 0 ? "good" : "warn"}
            />
            {/* A métrica que esta tela existe para não deixar esquecer: código
                sem remoto some de qualquer painel que só saiba contar commits,
                e é justamente o que corre risco. */}
            <MetricCard
              label="Onde está salvo"
              value={sync?.state === "local-only" ? "só aqui" : "no remoto"}
              hint={sync?.upstream ?? "nenhum remoto configurado"}
              tone={sync?.state === "local-only" ? "warn" : "good"}
            />
            <MetricCard
              label="Por publicar"
              value={sync?.ahead ?? "—"}
              hint={
                sync?.ahead == null
                  ? "não segue nenhum remoto"
                  : sync.ahead === 0
                    ? "nada à frente do remoto"
                    : "commits à frente do remoto"
              }
              tone={sync?.ahead == null ? "default" : sync.ahead === 0 ? "good" : "warn"}
            />
          </div>

          <Section
            title="Onde o código está"
            hint="fato do repositório, medido agora"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <RepoCard
                repo={data.tree}
                onOpen={() =>
                  preview.open({
                    kind: "json",
                    id: data.tree.name,
                    title: data.tree.name,
                    payload: data.tree,
                  })
                }
              />
              <FolderList folders={data.folders} />
            </div>
          </Section>

          <Section
            title="O plano"
            hint="lido de um documento declarado, nunca inferido do código"
          >
            <SectionCard className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-[12.5px] text-neutral-400">
                    {data.plan.file ?? "nenhum documento de plano"}
                  </div>
                  {/* A idade do plano ao lado da idade do código é a única
                      comparação honesta que esta tela pode fazer entre os dois:
                      não diz o que foi cumprido, diz quem parou de andar. */}
                  {data.plan.last_commit && (
                    <div className="mt-0.5 font-mono text-[10.5px] text-neutral-600">
                      escrito {formatAge(data.plan.last_commit.date)} ·{" "}
                      {data.plan.last_commit.sha}
                      {lastCommit && ` · código ${formatAge(lastCommit)}`}
                    </div>
                  )}
                </div>
                <SourceStatusPill status={data.plan.source_status} />
              </div>

              {data.plan.stages.length === 0 ? (
                <EmptyState
                  title="Nenhum plano carregado"
                  hint={data.plan.source_status.message}
                />
              ) : (
                <>
                  <div className="flex flex-col gap-1">
                    {data.plan.stages.map((stage) => (
                      <StageRow
                        key={stage.id}
                        stage={stage}
                        onOpen={() =>
                          preview.open({
                            kind: "json",
                            id: stage.id,
                            title: `${stage.id} — ${stage.title}`,
                            payload: stage,
                          })
                        }
                      />
                    ))}
                  </div>
                  {/* Dito uma vez, em voz alta, em vez de deixar onze chips
                      cinzentos serem lidos como "quase lá". */}
                  <p className="border-t border-white/[0.06] pt-2.5 text-[11px] leading-relaxed text-neutral-500">
                    Nenhum estágio tem canal de evidência. O plano diz o que
                    está previsto; ninguém escreveu ainda como se saberia que um
                    deles foi cumprido — então esta tela não sabe, e não vai
                    fingir que sabe.
                  </p>
                </>
              )}
            </SectionCard>
          </Section>

          <Section title="O que falta" hint="declarado, não adivinhado">
            <SectionCard className="space-y-2">
              {data.gaps.items.length === 0 ? (
                <EmptyState
                  title="Nenhuma lacuna registrada"
                  hint={data.gaps.source_status.message}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[12.5px] text-neutral-400">
                      {data.gaps.source_status.message}
                    </div>
                    <SourceStatusPill status={data.gaps.source_status} />
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {data.gaps.items.map((gap) => (
                      <span
                        key={gap.title}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-neutral-400"
                      >
                        {gap.title}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </SectionCard>
          </Section>

          <div className="text-[10.5px] text-neutral-600">
            medido {formatTimestamp(data.generated_at)} · recarrega a cada 2 min
          </div>
        </>
      )}
    </PageFrame>
  );
}

function StageRow({ stage, onOpen }: { stage: PlanStage; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-white/[0.04]"
    >
      <span className="w-9 shrink-0 font-mono text-[11px] text-blue-300">{stage.id}</span>
      <span className="flex-1 truncate text-[13px] text-neutral-200">{stage.title}</span>
      {/* "declared" e não "pendente": a tela sabe que o estágio existe no
          plano, e não sabe se foi cumprido. As duas coisas são diferentes. */}
      <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-neutral-500">
        {stage.state}
      </span>
    </button>
  );
}

function RepoCard({ repo, onOpen }: { repo: RepoFacts; onOpen: () => void }) {
  if (repo.error) {
    return (
      <SectionCard>
        <div className="text-[13px] text-neutral-200">{repo.name}</div>
        <div className="mt-1 text-[11px] text-amber-300/80">{repo.error}</div>
      </SectionCard>
    );
  }

  // O rótulo e a lista têm que falar da mesma coisa. Encabeçar os últimos
  // commits com "hoje · 11" seria dizer que aqueles cinco são de hoje.
  const today = repo.commits_today.length > 0;
  const timeline = today ? repo.commits_today : (repo.recent ?? []);
  const dirtyFiles = repo.dirty_files ?? [];

  return (
    <SectionCard className="space-y-2.5">
      <button type="button" onClick={onOpen} className="w-full text-left">
        {/* O nome da árvore não trunca: é a identidade do cartão. O branch e a
            contagem descem para a linha de baixo em vez de disputar espaço. */}
        <div className="text-[13px] text-neutral-100">{repo.name}</div>
        <div className="mt-0.5 font-mono text-[10.5px] text-neutral-500">
          {repo.branch ?? "?"} · {repo.commits ?? "?"} commits
        </div>
      </button>

      {repo.sync && <SyncLine sync={repo.sync} />}

      {repo.head && (
        <div className="border-t border-white/[0.06] pt-2">
          <div className="truncate text-[11.5px] text-neutral-300">
            {repo.head.subject}
          </div>
          <div className="mt-0.5 font-mono text-[10.5px] text-neutral-600">
            {repo.head.sha} · {formatAge(repo.head.date)}
          </div>
        </div>
      )}

      {/* Os caminhos, e não a contagem. É a diferença entre saber que há
          trabalho solto e saber qual é. */}
      {dirtyFiles.length > 0 && (
        <div className="border-t border-white/[0.06] pt-2">
          <div className="text-[10px] uppercase tracking-wider text-amber-300/70">
            por commitar · {repo.dirty}
          </div>
          <div className="mt-1 flex flex-col gap-0.5">
            {dirtyFiles.slice(0, DIRTY_IN_CARD).map((file) => (
              <div key={file.path} className="flex items-baseline gap-1.5">
                <span
                  className="w-5 shrink-0 font-mono text-[10px] text-amber-300/70"
                  title={file.code === "??" ? "o git nunca viu este arquivo" : file.code}
                >
                  {file.code}
                </span>
                <span className="truncate font-mono text-[10.5px] text-neutral-400">
                  {file.path}
                </span>
              </div>
            ))}
            {(repo.dirty_truncated ?? 0) > 0 && (
              <div className="text-[10.5px] text-neutral-600">
                e mais {repo.dirty_truncated}
              </div>
            )}
          </div>
        </div>
      )}

      {timeline.length > 0 && (
        <div className="border-t border-white/[0.06] pt-2">
          <div className="text-[10px] uppercase tracking-wider text-neutral-600">
            {today ? `hoje · ${repo.commits_today.length}` : "últimos commits"}
          </div>
          <div className="mt-1 flex flex-col gap-0.5">
            {timeline.slice(0, RECENT_IN_CARD).map((commit) => (
              <CommitRow key={commit.sha} commit={commit} />
            ))}
            {timeline.length > RECENT_IN_CARD && (
              <div className="text-[10.5px] text-neutral-600">
                e mais {timeline.length - RECENT_IN_CARD}
              </div>
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
}

/**
 * As pastas, e não árvores.
 *
 * carbon e gvi já foram repositórios com história e remoto próprios. Hoje são
 * caminhos dentro de um repositório só — e a tela precisa parar de falar deles
 * como se ainda fossem três coisas, senão mostra o mesmo estado três vezes com
 * nomes diferentes e chama isso de painel.
 *
 * O que dá para dizer de uma pasta é o que anda nela.
 */
function FolderList({ folders }: { folders: FolderFacts[] }) {
  return (
    <SectionCard className="space-y-2">
      <div className="text-[13px] text-neutral-100">as pastas</div>
      <div className="font-mono text-[10.5px] text-neutral-500">
        um repositório · {folders.length} pastas
      </div>

      <div className="flex flex-col divide-y divide-white/[0.06] border-t border-white/[0.06]">
        {folders.map((folder) => (
          <div key={folder.name} className="flex items-baseline gap-3 py-1.5">
            <span className="w-28 shrink-0 truncate font-mono text-[11.5px] text-neutral-300">
              {folder.name}
            </span>
            <span className="flex-1 truncate text-[11px] text-neutral-500">
              {folder.last ? folder.last.subject : "nenhum commit tocou esta pasta"}
            </span>
            {folder.dirty > 0 && (
              <span className="shrink-0 font-mono text-[10px] text-amber-300/80">
                {folder.dirty} solto{folder.dirty > 1 ? "s" : ""}
              </span>
            )}
            <span className="w-16 shrink-0 text-right font-mono text-[10px] text-neutral-600">
              {folder.commits_today > 0
                ? `${folder.commits_today} hoje`
                : formatAge(folder.last?.date)}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function CommitRow({ commit }: { commit: RepoCommit }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="truncate text-[11px] text-neutral-400">{commit.subject}</span>
      {commit.date && (
        <span className="ml-auto shrink-0 font-mono text-[10px] text-neutral-600">
          {formatAge(commit.date)}
        </span>
      )}
    </div>
  );
}

/**
 * A linha de sincronia.
 *
 * `local-only` fica em âmbar por decisão, não por descuido: é o único estado
 * aqui em que o risco não aparece sozinho. Uma árvore limpa, com commits em
 * dia e sem remoto nenhum, tem tudo para se parecer com sucesso num painel — e
 * é a que some inteira junto com o disco.
 */
function SyncLine({ sync }: { sync: RepoSync }) {
  const label =
    sync.state === "local-only"
      ? "só neste disco"
      : sync.state === "synced"
        ? "em dia"
        : sync.state === "ahead"
          ? `${sync.ahead} por publicar`
          : sync.state === "behind"
            ? `${sync.behind} atrás`
            : sync.state === "diverged"
              ? `${sync.ahead} à frente · ${sync.behind} atrás`
              : "não medido";

  const tone =
    sync.state === "synced"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
      : sync.state === "diverged"
        ? "border-rose-400/30 bg-rose-400/10 text-rose-200"
        : sync.state === "unknown"
          ? "border-white/10 bg-white/[0.03] text-neutral-400"
          : "border-amber-400/30 bg-amber-400/10 text-amber-200";

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px]",
            tone
          )}
        >
          {label}
        </span>
        {sync.upstream && (
          <span className="truncate font-mono text-[10px] text-neutral-600">
            {sync.upstream}
          </span>
        )}
      </div>
      {/* A idade da comparação anda junto com o número, sempre. Sem isso,
          "em dia" é uma afirmação sobre o passado disfarçada de presente. */}
      <div className="text-[10.5px] leading-snug text-neutral-500">
        {sync.detail}
        {sync.last_fetch && ` · ${formatAge(sync.last_fetch)}`}
      </div>
    </div>
  );
}

/** Idade em linguagem de quem está acompanhando: o que importa é "quando foi",
 *  não a data por extenso. Datas absolutas continuam no preview em JSON. */
function formatAge(value?: string | null) {
  if (!value) return "sem data";
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return value;

  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 0) return "no futuro";
  if (seconds < 90) return "agora";

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `há ${minutes} min`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `há ${hours} h`;

  const days = Math.round(hours / 24);
  if (days < 30) return `há ${days} d`;

  return `há ${Math.round(days / 30)} m`;
}
