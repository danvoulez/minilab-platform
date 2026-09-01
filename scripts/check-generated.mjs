#!/usr/bin/env node
// Verifies generated UI contract files exist and line up with the manifests.

import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const generated = resolve(root, "src/ui/minilab-official-ui/generated");

function readYaml(file) {
  return yaml.load(readFileSync(resolve(root, file), "utf-8"));
}

const matrix = readYaml("99.matrix.generated.yaml").matrix;
const catalog = readYaml("02.component-catalog.yaml").components;
const preview = readYaml("04.preview-manifest.yaml").preview_kinds;

const required = [
  "navigation.generated.ts",
  "routes.generated.ts",
  "types.generated.ts",
  "copy.generated.ts",
  "page-contracts.generated.ts",
  "preview-registry.generated.ts",
  "component-registry.generated.ts",
  "area-registry.generated.ts",
  "page-blueprints.generated.ts",
  "demo-store.generated.ts",
  "showcase-index.generated.ts",
  "api-contracts.generated.ts",
  "action-contracts.generated.ts",
  "acceptance.generated.ts",
  "implementation-waves.generated.ts",
  "quality-rules.generated.ts",
  "route-keyboard.generated.ts",
  "copy-lexicon.generated.ts",
  "schema.generated.sql",
  "index.ts",
];

let failed = false;
for (const file of required) {
  if (!existsSync(resolve(generated, file))) {
    console.error(`missing generated file: ${file}`);
    failed = true;
  }
}

const areaText = readFileSync(resolve(generated, "area-registry.generated.ts"), "utf-8");
for (const entry of matrix) {
  if (!areaText.includes(`"${entry.page}"`)) {
    console.error(`area missing in generated registry: ${entry.page}`);
    failed = true;
  }
}

const componentText = readFileSync(resolve(generated, "component-registry.generated.ts"), "utf-8");
for (const name of Object.keys(catalog)) {
  if (!componentText.includes(`"${name}"`)) {
    console.error(`component missing in generated registry: ${name}`);
    failed = true;
  }
}

const previewText = readFileSync(resolve(generated, "preview-registry.generated.ts"), "utf-8");
for (const kind of Object.keys(preview)) {
  if (!previewText.includes(`"${kind}"`)) {
    console.error(`preview kind missing in generated registry: ${kind}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`generated contracts OK · ${matrix.length} pages · ${Object.keys(catalog).length} components · ${Object.keys(preview).length} preview kinds`);
