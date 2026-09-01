#!/usr/bin/env node
// Cross-check the operational HTTP boundary against the canonical contracts.
// A path used by lab-dashboard-api.ts must exist in 15.api-contracts.yaml, and
// every page source declared as `lab.*` must name a real endpoint contract.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const readYaml = (file) => yaml.load(readFileSync(resolve(root, file), "utf-8"));

const pages = readYaml("03.page-manifest.yaml").pages ?? {};
const api = readYaml("15.api-contracts.yaml").endpoints ?? {};
const client = readFileSync(
  resolve(root, "src/ui/minilab-official-ui/lib/lab-dashboard-api.ts"),
  "utf-8"
);

let failed = false;
function bad(message) { console.error(`✗ ${message}`); failed = true; }
function ok(message) { console.log(`✓ ${message}`); }

const pathToId = new Map();
for (const [id, spec] of Object.entries(api)) {
  if (spec?.path) pathToId.set(spec.path, id);
  for (const page of spec?.consumed_by ?? []) {
    if (!(page in pages)) bad(`API contract ${id} consumed_by unknown page: ${page}`);
  }
}

const clientPaths = [...client.matchAll(/fetchJson<[^>]+>\(\s*["']([^"']+)["']/g)].map((m) => m[1]);
for (const path of clientPaths) {
  if (!pathToId.has(path)) bad(`lab-dashboard-api.ts uses uncontracted path: ${path}`);
}
if (clientPaths.every((path) => pathToId.has(path))) {
  ok(`every live dashboard client path has an API contract · ${clientPaths.length}`);
}

let sourceCount = 0;
for (const [pageId, page] of Object.entries(pages)) {
  for (const source of page.sources ?? []) {
    if (!String(source).startsWith("lab.")) continue;
    sourceCount += 1;
    if (!(source in api)) bad(`page ${pageId} references unknown live source: ${source}`);
  }
}
if (!failed) ok(`every page live-source reference resolves · ${sourceCount}`);

if (failed) process.exit(1);
