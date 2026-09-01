#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const readYaml = (file) => yaml.load(readFileSync(resolve(root, file), "utf-8"));

const nav = readYaml("01.navigation.yaml");
const pages = readYaml("03.page-manifest.yaml");
const api = readYaml("15.api-contracts.yaml");
const registry = readYaml("16.registry-type-schemas.yaml");
const platform = readYaml("33.platform-contract.yaml");
const handshake = readYaml("34.provider-handshake.yaml");

const pageIds = Object.keys(pages.pages ?? {});
const visibleIds = nav.groups.flatMap((group) => (group.items ?? []).map((item) => item.id));
const surfaceIds = Object.keys(platform.surfaces ?? {});
const capabilities = platform.capabilities ?? {};
const endpointIds = new Set(Object.keys(api.endpoints ?? {}));
const failures = [];

function fail(message) { failures.push(message); console.error(`✗ ${message}`); }
function pass(message) { console.log(`✓ ${message}`); }
function diff(a, b) {
  const aa = new Set(a), bb = new Set(b);
  return { left: [...aa].filter((x) => !bb.has(x)), right: [...bb].filter((x) => !aa.has(x)) };
}

const pageSurfaceDiff = diff(pageIds, surfaceIds);
if (pageSurfaceDiff.left.length || pageSurfaceDiff.right.length) {
  fail(`platform surfaces must match page contracts · missing=${pageSurfaceDiff.left.join(",") || "none"} extra=${pageSurfaceDiff.right.join(",") || "none"}`);
} else pass(`platform surfaces ↔ page contracts · ${pageIds.length}`);

const missingVisible = visibleIds.filter((id) => !surfaceIds.includes(id));
if (missingVisible.length) fail(`visible navigation without platform surface: ${missingVisible.join(", ")}`);
else pass(`every visible menu item remains a platform surface · ${visibleIds.length}`);

for (const [surfaceId, surface] of Object.entries(platform.surfaces ?? {})) {
  const refs = [...(surface.required ?? []), ...(surface.optional ?? [])];
  if ((surface.required ?? []).length === 0) fail(`${surfaceId} has no required platform capability`);
  for (const ref of refs) if (!(ref in capabilities)) fail(`${surfaceId} references unknown capability ${ref}`);
}

for (const [capabilityId, capability] of Object.entries(capabilities)) {
  for (const endpointRef of capability.endpoint_refs ?? []) {
    if (!endpointIds.has(endpointRef)) fail(`${capabilityId} references unknown API endpoint ${endpointRef}`);
  }
}
if (!failures.length) pass(`all ${Object.keys(capabilities).length} capabilities resolve to declared contracts`);

if (handshake.endpoint_ref !== "platform.capabilities.get") fail(`provider handshake must use platform.capabilities.get`);
else if (!endpointIds.has(handshake.endpoint_ref)) fail(`provider handshake endpoint does not exist`);
else pass(`provider handshake is anchored to the platform API contract`);

const states = new Set(platform.capability_states ?? []);
for (const expected of ["available", "degraded", "unavailable", "unknown"]) {
  if (!states.has(expected)) fail(`platform capability state missing: ${expected}`);
}
const handshakeStates = new Set(handshake.response?.capabilities?.record?.status ?? []);
for (const state of states) if (!handshakeStates.has(state)) fail(`handshake cannot report platform state ${state}`);
if (!failures.length) pass(`provider state vocabulary is coherent`);

if (platform.stance?.backend_is_provider !== true || platform.stance?.ui_is_product_contract !== true) {
  fail(`product/backend authority stance is not explicit`);
} else pass(`product contract precedes provider implementation`);

if (platform.provider_rules?.never_remove_navigation_item_because_provider_lacks_capability !== true) {
  fail(`provider limitation is allowed to erase platform navigation`);
} else pass(`provider capability gaps cannot erase product surfaces`);

for (const [id, spec] of Object.entries(registry.types ?? {})) {
  if (spec.entity_kind !== id) fail(`registry type ${id} must use the same platform entity_kind`);
  if (!String(spec.schema_version ?? "").startsWith("minilab.registry.")) fail(`registry type ${id} uses provider-specific schema_version ${spec.schema_version}`);
}
if (!failures.length) pass(`Registry ontology is platform-owned · ${Object.keys(registry.types ?? {}).length} kinds`);

if (failures.length) {
  console.error(`\n${failures.length} platform contract failure(s)`);
  process.exit(1);
}
console.log(`\nPlatform contract coherent · ${surfaceIds.length} surfaces · ${Object.keys(capabilities).length} capabilities · ${Object.keys(registry.types ?? {}).length} Registry kinds`);
