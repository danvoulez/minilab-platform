#!/usr/bin/env node
// Registry platform check: Minilab owns the ontology and interaction contract.
// A backend/provider may satisfy a subset, but it must not redefine the UI's
// entity kinds or cause a parallel local Registry to be generated.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const readYaml = (file) => yaml.load(readFileSync(resolve(root, file), "utf-8"));

const schemas = readYaml("16.registry-type-schemas.yaml");
const api = readYaml("15.api-contracts.yaml").endpoints ?? {};
const data = readYaml("05.data-entities.yaml").entities ?? {};
const page = readYaml("03.page-manifest.yaml").pages?.registry ?? {};

let failed = false;
const bad = (message) => { console.error(`✗ ${message}`); failed = true; };
const ok = (message) => console.log(`✓ ${message}`);

const contracts = Object.entries(schemas.types ?? {});
const kinds = contracts.map(([, spec]) => spec.entity_kind);
const versions = contracts.map(([, spec]) => spec.schema_version);
if (contracts.length < 10) bad(`platform Registry ontology unexpectedly narrow: ${contracts.length} kinds`);
if (new Set(kinds).size !== kinds.length) bad("Registry entity_kind values must be unique");
if (new Set(versions).size !== versions.length) bad("Registry schema_version values must be unique");
for (const [id, spec] of contracts) {
  if (spec.entity_kind !== id) bad(`${id} must be its own platform entity_kind`);
  if (!String(spec.schema_version ?? "").startsWith("minilab.registry.")) bad(`${id} has provider-specific schema_version ${spec.schema_version}`);
}
if (!failed) ok(`Registry platform ontology is canonical · ${contracts.length} kinds`);

for (const [id, method, path] of [
  ["registry.entities.list", "GET", "/api/registry/entities"],
  ["registry.admissions.create", "POST", "/api/registry/admissions"],
  ["registry.entity.get", "GET", "/api/registry/entities/:id"],
  ["registry.entity.versions", "GET", "/api/registry/entities/:id/versions"],
]) {
  const spec = api[id];
  if (!spec) bad(`missing Registry API contract: ${id}`);
  else if (spec.method !== method || spec.path !== path) bad(`${id} must be ${method} ${path}`);
}

const legacy = Object.keys(api).filter((id) => id.startsWith("register."));
if (legacy.length) bad(`legacy parallel register API contracts remain: ${legacy.join(", ")}`);
else ok("no parallel register.draft/refine/commit API remains");

for (const id of ["registry_entities", "registry_versions", "registry_admissions"]) {
  const spec = data[id];
  if (!spec) bad(`missing Registry external data contract: ${id}`);
  else if (spec.persistence !== "external_authority" || !String(spec.authority ?? "").startsWith("provider.")) {
    bad(`${id} must remain provider-owned external authority`);
  }
}

if ((page.data ?? []).includes("registry_types")) bad("Registry page still depends on mutable registry_types data");
if (!(page.data ?? []).includes("registry_contracts")) bad("Registry page must consume compiled registry_contracts");
if (!failed) ok("Registry page points at platform contracts + provider authority");

process.exit(failed ? 1 : 0);
