import { GENERATED_API_CONTRACTS } from "../generated/api-contracts.generated";

export type RegistryAdmissionRequest = {
  entity_id?: string;
  entity_kind: string;
  schema_version: string;
  payload: Record<string, unknown>;
  idempotency_key: string;
  authority_ref?: string;
  signature?: string | null;
  admitted_at?: string;
};

export type RegistryAdmissionResult = {
  deduped?: boolean;
  entity_id: string;
  state_cid: string;
  content_cid: string;
  admission_id: string;
  previous_state_cid: string | null;
};

export type RegistryProviderEntity = {
  entity_id: string;
  entity_kind: string;
  current_state_cid?: string | null;
  state_cid?: string | null;
  content_cid?: string | null;
  schema_version?: string | null;
  name?: string | null;
  record_status?: string | null;
  verification_status?: string | null;
  payload?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type RegistryEntityVersion = {
  state_cid: string;
  previous_state_cid: string | null;
  schema_version: string;
  canonical_payload: Record<string, unknown>;
  content_cid: string;
  created_at: string;
  admission_id?: string | null;
  authority_ref?: string | null;
  admitted_at?: string | null;
};

export type RegistryEntityDetail = {
  entity: RegistryProviderEntity;
  versions: RegistryEntityVersion[];
  current: RegistryEntityVersion | null;
};

export type RegistryEntityListResult = {
  entities: RegistryProviderEntity[];
  next_cursor?: string | null;
};

type EndpointKey = keyof typeof GENERATED_API_CONTRACTS.endpoints;

function endpointPath(key: EndpointKey, params: Record<string, string> = {}) {
  let path: string = GENERATED_API_CONTRACTS.endpoints[key].path;
  for (const [name, value] of Object.entries(params)) path = path.replace(`:${name}`, encodeURIComponent(value));
  return path;
}

async function requestJson<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: "include",
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string; code?: string } | null;
    const detail = body?.error || `Registry provider returned ${response.status}`;
    const error = new Error(detail) as Error & { code?: string; status?: number };
    error.code = body?.code;
    error.status = response.status;
    throw error;
  }
  return response.json() as Promise<T>;
}

export function listRegistryEntities(
  options: { kind?: string | null; q?: string; limit?: number; cursor?: string | null } = {},
  signal?: AbortSignal,
) {
  const query = new URLSearchParams();
  if (options.kind) query.set("kind", options.kind);
  if (options.q?.trim()) query.set("q", options.q.trim());
  if (options.limit) query.set("limit", String(options.limit));
  if (options.cursor) query.set("cursor", options.cursor);
  const suffix = query.size ? `?${query.toString()}` : "";
  return requestJson<RegistryEntityListResult>(
    `${endpointPath("registry.entities.list")}${suffix}`,
    { method: "GET", signal },
  );
}

/** The browser supplies platform payload, never provider-internal tenant identity. */
export function admitRegistryState(input: RegistryAdmissionRequest, signal?: AbortSignal) {
  return requestJson<RegistryAdmissionResult>(
    endpointPath("registry.admissions.create"),
    { method: "POST", body: JSON.stringify(input), signal },
  );
}

export function fetchRegistryEntity(entityId: string, signal?: AbortSignal) {
  return requestJson<RegistryProviderEntity>(
    endpointPath("registry.entity.get", { id: entityId }),
    { method: "GET", signal },
  );
}

export function fetchRegistryEntityVersions(entityId: string, signal?: AbortSignal) {
  return requestJson<{ versions: RegistryEntityVersion[] }>(
    endpointPath("registry.entity.versions", { id: entityId }),
    { method: "GET", signal },
  );
}

export async function fetchRegistryEntityDetail(entityId: string, signal?: AbortSignal): Promise<RegistryEntityDetail> {
  const [entity, versionResult] = await Promise.all([
    fetchRegistryEntity(entityId, signal),
    fetchRegistryEntityVersions(entityId, signal),
  ]);
  const versions = versionResult.versions ?? [];
  const currentState = entity.current_state_cid ?? entity.state_cid ?? null;
  const current = currentState
    ? [...versions].reverse().find((version) => version.state_cid === currentState) ?? null
    : null;
  return { entity, versions, current };
}
