import { GENERATED_API_CONTRACTS } from "../generated/api-contracts.generated";
import type {
  GeneratedPlatformCapabilityId,
  GeneratedRegistryKind,
} from "../generated/types.generated";

export type ProviderCapabilityStatus = "available" | "degraded" | "unavailable" | "unknown";

export type ProviderCapabilityRecord = {
  status: ProviderCapabilityStatus;
  detail?: string;
  endpoint?: string;
  read_only?: boolean;
  latency_class?: string;
};

export type ProviderRegistryTypeRecord = {
  status: ProviderCapabilityStatus;
  detail?: string;
  provider_schema_version?: string;
};

export type PlatformProviderHandshake = {
  platform_contract: string;
  provider: {
    id: string;
    name: string;
    version: string;
    build?: string;
    environment?: string;
    documentation_url?: string;
  };
  capabilities: Partial<Record<GeneratedPlatformCapabilityId, ProviderCapabilityRecord>>;
  registry_types?: Partial<Record<GeneratedRegistryKind, ProviderRegistryTypeRecord>>;
};

export function capabilityStatus(
  handshake: PlatformProviderHandshake | null,
  capability: GeneratedPlatformCapabilityId,
): ProviderCapabilityStatus {
  return handshake?.capabilities?.[capability]?.status ?? "unknown";
}

export function registryTypeStatus(
  handshake: PlatformProviderHandshake | null,
  type: GeneratedRegistryKind,
): ProviderCapabilityStatus {
  return handshake?.registry_types?.[type]?.status ?? "unknown";
}

export async function fetchPlatformProviderHandshake(signal?: AbortSignal): Promise<PlatformProviderHandshake> {
  const endpoint = GENERATED_API_CONTRACTS.endpoints["platform.capabilities.get"].path;
  const response = await fetch(endpoint, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
    signal,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string; code?: string } | null;
    const error = new Error(body?.error || `Provider capability handshake returned ${response.status}`) as Error & {
      code?: string;
      status?: number;
    };
    error.code = body?.code;
    error.status = response.status;
    throw error;
  }
  return response.json() as Promise<PlatformProviderHandshake>;
}
