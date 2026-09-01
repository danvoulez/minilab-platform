#!/usr/bin/env node
// Cross-boundary validator for the single UI contract spine.
// Unlike the older validators, this checks that source manifests, composed
// artifacts and generated runtime routing all describe the same area universe.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const readYaml = (f) => yaml.load(readFileSync(resolve(root, f), "utf-8"));
const readJson = (f) => JSON.parse(readFileSync(resolve(root, f), "utf-8"));

const nav = readYaml("01.navigation.yaml");
const pages = readYaml("03.page-manifest.yaml");
const runtime = readYaml("32.runtime-bindings.yaml");
const blueprintOverrides = readYaml("09.page-blueprints.yaml");
const apiContracts = readYaml("15.api-contracts.yaml");
const registryTypeSchemas = readYaml("16.registry-type-schemas.yaml");
const platformContract = readYaml("33.platform-contract.yaml");
const providerHandshake = readYaml("34.provider-handshake.yaml");
const matrix = readYaml("99.matrix.generated.yaml");
const combined = readJson("combined.minilab-ui-spec.json");
const generatedRouter = readFileSync(
  resolve(root, "src/ui/minilab-official-ui/generated/area-router.generated.tsx"),
  "utf-8"
);

const navIds = nav.groups.flatMap((g) => (g.items ?? []).map((i) => i.id));
const pageIds = Object.keys(pages.pages ?? {});
const runtimeIds = Object.keys(runtime.routes ?? {});
const matrixIds = (matrix.matrix ?? []).map((p) => p.page);
const routerIds = [...generatedRouter.matchAll(/case\s+"([^"]+)"/g)].map((m) => m[1]);
const blueprintIds = Object.keys(blueprintOverrides.pages ?? {});

let failed = false;
function sameSet(label, a, b) {
  const aa = new Set(a); const bb = new Set(b);
  const onlyA = [...aa].filter((x) => !bb.has(x));
  const onlyB = [...bb].filter((x) => !aa.has(x));
  if (onlyA.length || onlyB.length) {
    failed = true;
    console.error(`✗ ${label}`);
    if (onlyA.length) console.error(`  only left:  ${onlyA.join(", ")}`);
    if (onlyB.length) console.error(`  only right: ${onlyB.join(", ")}`);
  } else {
    console.log(`✓ ${label} · ${aa.size}`);
  }
}

sameSet("page contracts ↔ runtime bindings", pageIds, runtimeIds);
sameSet("page contracts ↔ generated matrix", pageIds, matrixIds);
sameSet("runtime bindings ↔ generated router", runtimeIds, routerIds);

const staleBlueprintFields = [];
for (const [id, spec] of Object.entries(blueprintOverrides.pages ?? {})) {
  if (!(id in (pages.pages ?? {}))) {
    failed = true;
    console.error(`✗ blueprint override without page contract: ${id}`);
  }
  for (const forbidden of ["title", "lede", "layout", "components", "data", "sources", "preview_kinds"]) {
    if (forbidden in (spec ?? {})) staleBlueprintFields.push(`${id}.${forbidden}`);
  }
}
if (staleBlueprintFields.length) {
  failed = true;
  console.error(`✗ page blueprint overrides duplicate canonical page fields: ${staleBlueprintFields.join(", ")}`);
} else {
  console.log(`✓ page blueprint overrides contain only layout-specific detail · ${blueprintIds.length}`);
}

const missingVisibleContracts = navIds.filter((id) => !pageIds.includes(id));
if (missingVisibleContracts.length) {
  failed = true;
  console.error(`✗ visible navigation without page contract: ${missingVisibleContracts.join(", ")}`);
} else {
  console.log(`✓ every visible navigation item has a page contract · ${navIds.length}`);
}

for (const [key, source] of [
  ["navigation", nav],
  ["pages", pages],
  ["runtime_bindings", runtime],
  ["matrix", matrix],
  ["page_blueprints", blueprintOverrides],
  ["api_contracts", apiContracts],
  ["registry_type_schemas", registryTypeSchemas],
  ["platform_contract", platformContract],
  ["provider_handshake", providerHandshake],
]) {
  if (JSON.stringify(combined[key]) !== JSON.stringify(source)) {
    failed = true;
    console.error(`✗ combined spec drift: ${key}`);
  } else {
    console.log(`✓ combined spec matches source: ${key}`);
  }
}

for (const required of [
  "grid_contract",
  "operational_temperature",
  "cold_templates",
  "hot_components",
  "inspector_grammar",
  "page_temperature_map",
]) {
  if (!(required in combined)) {
    failed = true;
    console.error(`✗ combined spec missing ${required}`);
  }
}
if (!failed) console.log("✓ one contract spine is coherent");
process.exit(failed ? 1 : 0);
