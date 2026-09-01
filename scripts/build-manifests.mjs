#!/usr/bin/env node
// Converts combined.minilab-ui-spec.json (YAML despite extension) into a real
// JSON snapshot consumed by the app at runtime. Re-run when YAML changes.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const srcPath = resolve(root, "combined.minilab-ui-spec.json");
const outDir = resolve(root, "src/ui/minilab-official-ui/manifests");
const outPath = resolve(outDir, "spec.json");

const raw = readFileSync(srcPath, "utf-8");
const data = yaml.load(raw);

if (!data || typeof data !== "object") {
  throw new Error("Parsed manifest is not an object");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, JSON.stringify(data, null, 2));

const pageCount = data?.matrix?.matrix?.length ?? 0;
console.log(
  `wrote ${outPath.replace(root + "/", "")} · ${pageCount} pages in matrix`
);
