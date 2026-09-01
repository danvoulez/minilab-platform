#!/usr/bin/env node
// Verifies page acceptance docs cover known pages and critical foundation pages.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const pages = yaml.load(readFileSync(resolve(root, "03.page-manifest.yaml"), "utf-8")).pages;
const acceptance = yaml.load(readFileSync(resolve(root, "24.page-acceptance.yaml"), "utf-8"));

let failed = false;
function assert(condition, message) {
  if (!condition) {
    console.error(message);
    failed = true;
  }
}

assert(acceptance.default_for_all_other_pages?.length > 0, "default acceptance criteria are required");

const critical = ["registry", "lab-today", "machines", "sensors", "ghosts", "receipts"];
for (const page of critical) {
  assert(page in pages, `critical page missing from page manifest: ${page}`);
  assert(Array.isArray(acceptance.pages?.[page]) && acceptance.pages[page].length > 0, `critical page missing acceptance criteria: ${page}`);
}

for (const page of Object.keys(acceptance.pages ?? {})) {
  assert(page in pages, `acceptance criteria refers to unknown page: ${page}`);
}

if (failed) process.exit(1);
console.log(`acceptance OK · ${Object.keys(acceptance.pages ?? {}).length} explicit pages · ${Object.keys(pages).length} total pages`);
