#!/usr/bin/env node
// Validates the Operational Temperature Grid manifests.
// This does not inspect or rewrite TSX. It only checks that the new contract
// layer is internally consistent and aligned with the existing page manifest.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const files = {
  pages: "03.page-manifest.yaml",
  grid: "26.grid-contract.yaml",
  temperature: "27.operational-temperature.yaml",
  cold: "28.cold-templates.yaml",
  hot: "29.hot-components.yaml",
  inspector: "30.inspector-grammar.yaml",
  map: "31.page-temperature-map.yaml",
};

function loadYaml(rel) {
  const path = resolve(root, rel);
  const raw = readFileSync(path, "utf-8");
  const parsed = yaml.load(raw);
  if (!parsed || typeof parsed !== "object") {
    throw new Error(`${rel} did not parse to an object`);
  }
  return parsed;
}

const docs = Object.fromEntries(
  Object.entries(files).map(([key, rel]) => [key, loadYaml(rel)])
);

const errors = [];
const warnings = [];

function err(message) {
  errors.push(message);
}
function warn(message) {
  warnings.push(message);
}

// 1. Required document types / schemas exist.
for (const [key, rel] of Object.entries(files)) {
  const doc = docs[key];
  if (!doc.schema) err(`${rel}: missing schema`);
  if (!doc.document_type) err(`${rel}: missing document_type`);
}

// 2. Zones match expected contract.
const expectedZones = ["header", "hot", "warm", "cold", "raw"];
const zones = docs.grid?.zones ?? {};
for (const zone of expectedZones) {
  if (!zones[zone]) err(`26.grid-contract.yaml: missing zone ${zone}`);
}

// 3. Temperature levels match expected contract.
const levels = docs.temperature?.levels ?? {};
for (const level of ["hot", "warm", "cold", "raw"]) {
  if (!levels[level]) err(`27.operational-temperature.yaml: missing level ${level}`);
}

// 4. Page ids in temperature map exactly match 03.page-manifest.yaml.
const manifestPages = new Set(Object.keys(docs.pages?.pages ?? {}));
const tempPages = new Set(Object.keys(docs.map?.pages ?? {}));

for (const page of manifestPages) {
  if (!tempPages.has(page)) err(`31.page-temperature-map.yaml: missing page ${page}`);
}
for (const page of tempPages) {
  if (!manifestPages.has(page)) err(`31.page-temperature-map.yaml: unknown page ${page}`);
}

// 5. Every page has primary_question and zones.
for (const [page, cfg] of Object.entries(docs.map?.pages ?? {})) {
  if (!cfg.primary_question || typeof cfg.primary_question !== "string") {
    err(`${page}: missing primary_question`);
  }
  if (!cfg.default_temperature) err(`${page}: missing default_temperature`);
  if (!cfg.hot) warn(`${page}: missing hot section`);
  if (!cfg.warm) warn(`${page}: missing warm section`);
  if (!cfg.cold) warn(`${page}: missing cold section`);
}

// 6. All hot components referenced by pages exist in hot-components manifest.
const declaredHot = new Set(Object.keys(docs.hot?.components ?? {}));
for (const [page, cfg] of Object.entries(docs.map?.pages ?? {})) {
  for (const component of cfg.hot?.components ?? []) {
    if (!declaredHot.has(component)) {
      err(`${page}: hot component ${component} is not declared in 29.hot-components.yaml`);
    }
    if (/raw/i.test(component)) {
      err(`${page}: raw-like component ${component} used in hot zone`);
    }
  }
}

// 7. All cold templates referenced by pages exist in cold-templates manifest.
const declaredCold = new Set(Object.keys(docs.cold?.templates ?? {}));
for (const [page, cfg] of Object.entries(docs.map?.pages ?? {})) {
  for (const template of cfg.cold?.templates ?? []) {
    if (!declaredCold.has(template)) {
      err(`${page}: cold template ${template} is not declared in 28.cold-templates.yaml`);
    }
  }
}

// 8. Inspector raw must be last.
const order = docs.inspector?.inspector?.order ?? [];
if (order[order.length - 1] !== "raw") {
  err("30.inspector-grammar.yaml: raw must be the last inspector section");
}
if (order[0] !== "decision_header") {
  err("30.inspector-grammar.yaml: decision_header must be first");
}

// 9. Secret safety: no secret values as fields/examples. The token
// no_secret_values_in_raw is allowed because it is a rule, not a value.
const forbiddenSecretPatterns = [
  /secret[_-]?value\s*:/i,
  /password\s*:\s*[^\n]+/i,
  /api[_-]?key\s*:\s*[^\n]+/i,
  /token\s*:\s*[^\n]+/i,
];
for (const rel of Object.values(files)) {
  const raw = readFileSync(resolve(root, rel), "utf-8");
  for (const pattern of forbiddenSecretPatterns) {
    const match = raw.match(pattern);
    if (match) err(`${rel}: possible secret value pattern detected: ${match[0]}`);
  }
}

// 10. Quick coverage summary.
const defaults = { hot: 0, warm: 0, cold: 0, mixed: 0, raw: 0 };
for (const cfg of Object.values(docs.map?.pages ?? {})) {
  if (cfg.default_temperature in defaults) defaults[cfg.default_temperature]++;
  else warn(`unknown default_temperature: ${cfg.default_temperature}`);
}

console.log("Operational Temperature contract check");
console.log("--------------------------------------");
console.log(`pages in manifest:       ${manifestPages.size}`);
console.log(`pages in temperature map:${tempPages.size}`);
console.log(`hot components:          ${declaredHot.size}`);
console.log(`cold templates:          ${declaredCold.size}`);
console.log(`default temperatures:    hot=${defaults.hot}, warm=${defaults.warm}, mixed=${defaults.mixed}, cold=${defaults.cold}`);

if (warnings.length) {
  console.log("\nWarnings:");
  for (const w of warnings) console.log(`  - ${w}`);
}

if (errors.length) {
  console.error("\nErrors:");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log("\n✓ temperature contract is valid");
