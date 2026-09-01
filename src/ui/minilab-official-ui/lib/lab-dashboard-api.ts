export type SourceStatus = {
  status: "ok" | "missing_config" | "error" | string;
  message: string;
  source: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  start_minutes: number;
  end_minutes: number;
  calendar: "dan" | "lab" | string;
  recurrence: string[];
  html_link?: string | null;
  status?: string | null;
};

export type CalendarColumn = {
  label: string;
  calendar_id?: string | null;
  source_status: SourceStatus;
  events: CalendarEvent[];
};

export type CalendarOverlap = {
  dan_event_id: string;
  lab_event_id: string;
  start: string;
  end: string;
};

export type TodayResponse = {
  date: string;
  timezone: string;
  generated_at: string;
  dan: CalendarColumn;
  lab: CalendarColumn;
  overlaps: CalendarOverlap[];
};

export type RoutineGroup = {
  frequency: string;
  count: number;
  events: CalendarEvent[];
};

export type RoutineResponse = {
  generated_at: string;
  calendar_id?: string | null;
  source_status: SourceStatus;
  total_count: number;
  groups: RoutineGroup[];
  events: CalendarEvent[];
};

export type ResearchLevel = {
  id: "research-profile" | "milestones" | "short-term" | string;
  title: string;
  summary: string;
  path: string;
  sha?: string | null;
  content_hash: string;
  commit_hash?: string | null;
  text: string;
};

export type ResearchResponse = {
  generated_at: string;
  source_status: SourceStatus;
  repo: string;
  combined_hash?: string | null;
  levels: ResearchLevel[];
};

export type HealthIndicator = {
  id: string;
  label: string;
  score: number;
  state: string;
  color: "green" | "amber" | "red" | string;
  trace: string;
};

export type HealthResponse = {
  generated_at: string;
  indicators: HealthIndicator[];
};

export type PlanStage = {
  id: string;
  title: string;
  /** `declared` significa: existe no plano. NÃO significa pendente nem feito —
   *  o documento diz o que está previsto, o repositório diz o que aconteceu, e
   *  esta UI não funde os dois. */
  state: string;
  /** O canal pelo qual se saberia que este estágio foi cumprido. Hoje é sempre
   *  `null`, e a tela diz isso em vez de deixar o silêncio parecer progresso. */
  evidence: string | null;
};

export type RepoCommit = { sha: string; subject: string; date?: string | null };

/** Onde esta árvore está em relação ao remoto.
 *
 *  `local-only` é o estado que mais importa e o que mais fácil desaparece num
 *  painel: a árvore inteira existe num disco só. `behind` fala do remoto como
 *  ele estava em `last_fetch`. O provider pode não buscar automaticamente, então a tela precisa
 *  mostrar a idade da comparação junto com o número. */
export type RepoSync = {
  state: "local-only" | "synced" | "ahead" | "behind" | "diverged" | "unknown";
  upstream: string | null;
  remote_url: string | null;
  ahead: number | null;
  behind: number | null;
  last_fetch: string | null;
  detail: string;
};

export type RepoFacts = {
  name: string;
  branch?: string | null;
  sync?: RepoSync;
  commits: number | null;
  dirty?: number;
  /** Os caminhos, não só a contagem — é o que deixa alguém agir. */
  dirty_files?: { code: string; path: string }[];
  dirty_truncated?: number;
  head?: { sha: string; subject: string; date: string };
  commits_today: RepoCommit[];
  /** Os últimos commits, com ou sem "hoje". Um dia parado não é uma árvore sem
   *  história, e sem isto a tela fica muda na maioria dos dias. */
  recent?: RepoCommit[];
  error?: string;
};

/** Uma pasta do repositório — não uma árvore.
 *
 *  carbon e gvi já foram repositórios aninhados. Hoje são caminhos dentro de
 *  um repositório só, e medi-los como árvores devolveria três vezes o mesmo
 *  número com nomes diferentes. O que se pode dizer de uma pasta é o que anda
 *  nela: commits que a tocaram, o último deles, e o que está solto lá dentro. */
export type FolderFacts = {
  name: string;
  commits_today: number;
  last: RepoCommit | null;
  dirty: number;
};

export type ConstructionResponse = {
  generated_at: string;
  plan: {
    source_status: SourceStatus;
    file: string | null;
    /** Quando o plano foi escrito pela última vez — a metade que falta para
     *  comparar a idade do documento com a idade do código. */
    last_commit: RepoCommit | null;
    stages: PlanStage[];
  };
  /** Um repositório, porque agora é um só. */
  tree: RepoFacts;
  folders: FolderFacts[];
  /** O que o plano declara que ainda não existe. Declarado, como os estágios:
   *  sondar o disco atrás de cada peça faria a lista encolher sozinha, e um
   *  arquivo com o nome certo não é a peça pronta. */
  gaps: { source_status: SourceStatus; items: { title: string; state: string }[] };
};

export type SectionOneResponse = {
  generated_at: string;
  today: TodayResponse;
  routine: RoutineResponse;
  research: ResearchResponse;
  health: HealthResponse;
};

const DEFAULT_BASE_URL = "";

function minilabApiBaseUrl() {
  const configured = (window as unknown as { __MINILAB_API_BASE_URL?: string }).__MINILAB_API_BASE_URL;
  return (configured ?? DEFAULT_BASE_URL).replace(/\/$/, "");
}

async function fetchJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${minilabApiBaseUrl()}${path}`, {
    method: "GET",
    signal,
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Minilab provider returned ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function fetchLabSectionOne(signal?: AbortSignal) {
  return fetchJson<SectionOneResponse>("/api/lab-dashboard/section-1", signal);
}

export function fetchToday(signal?: AbortSignal) {
  return fetchJson<TodayResponse>("/api/lab-dashboard/calendar/today", signal);
}

export function fetchRoutine(signal?: AbortSignal) {
  return fetchJson<RoutineResponse>("/api/lab-dashboard/calendar/routine", signal);
}

export function fetchResearch(signal?: AbortSignal) {
  return fetchJson<ResearchResponse>("/api/lab-dashboard/research/current", signal);
}

export function fetchConstruction(signal?: AbortSignal) {
  return fetchJson<ConstructionResponse>("/api/lab-dashboard/construction/current", signal);
}

export function fetchHealth(signal?: AbortSignal) {
  return fetchJson<HealthResponse>("/api/lab-dashboard/health/current", signal);
}
