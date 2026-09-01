#!/usr/bin/env node
// Matrix validator. Reads 99.matrix.generated.yaml + 02.component-catalog.yaml
// and audits the actual page implementations under src/.../areas/.
// Emits an honest report:
//   - catalog drift (components used but not in catalog) -> ERROR
//   - manifest coverage (pages with/without implementation file)
//   - promised vs delivered (per implemented page)
//   - rule_check: page_header_required (static)
// Exits 1 if any catalog drift or rule violation is detected.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { resolve, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const MATRIX_YAML = resolve(root, "99.matrix.generated.yaml");
const CATALOG_YAML = resolve(root, "02.component-catalog.yaml");
const RUNTIME_YAML = resolve(root, "32.runtime-bindings.yaml");
const ALIASES_JSON = resolve(root, "scripts/matrix-aliases.json");
const AREAS_DIR = resolve(root, "src/ui/minilab-official-ui/areas");
const UI_DIR = resolve(root, "src/ui/minilab-official-ui");

const PLACEHOLDER_FILE = "placeholder.tsx";
const NON_PAGE_FILES = new Set(["demo-data.ts", "use-preview.ts", PLACEHOLDER_FILE]);

const c = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

function loadYaml(path) {
  return yaml.load(readFileSync(path, "utf-8"));
}

const matrix = loadYaml(MATRIX_YAML).matrix;
const catalogDoc = loadYaml(CATALOG_YAML);
const runtimeDoc = loadYaml(RUNTIME_YAML);
const RUNTIME = runtimeDoc.routes ?? {};
const CATALOG = new Set(Object.keys(catalogDoc.components));

// Declared aliases: promised component → list of components that satisfy it.
const aliasesDoc = JSON.parse(readFileSync(ALIASES_JSON, "utf-8"));
const ALIAS_MAP = new Map(
  Object.entries(aliasesDoc.aliases ?? {}).map(([k, v]) => [k, new Set(v)])
);

function isSatisfied(promised, used) {
  if (used.has(promised)) return true;
  const aliases = ALIAS_MAP.get(promised);
  if (!aliases) return false;
  for (const a of aliases) if (used.has(a)) return true;
  return false;
}

// Map page id -> implementation filename from the canonical runtime bindings.
// Multiple page ids may intentionally share one implementation module.
const areaFiles = readdirSync(AREAS_DIR).filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"));
const IMPLEMENTED = new Map();
const EMBEDDED = new Set();
const referencedAreaFiles = new Set();
for (const [page, binding] of Object.entries(RUNTIME)) {
  if (binding.kind === "component") {
    const file = `${binding.module}.tsx`;
    if (areaFiles.includes(file)) {
      IMPLEMENTED.set(page, file);
      referencedAreaFiles.add(file);
    }
  } else if (binding.kind === "iframe") {
    EMBEDDED.add(page);
  }
}

// Extract React-component-shaped imports from any .tsx file under UI_DIR.
function extractComponentImports(source) {
  const out = new Set();
  // value imports only — skip `import type { ... }`
  const re = /import\s+(?!type\s)\{([^}]+)\}\s+from\s+["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    const names = m[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const raw of names) {
      // skip in-list `type X` annotations
      if (/^type\s/.test(raw)) continue;
      const id = raw.split(/\s+as\s+/)[0].trim();
      // Component identifiers start with uppercase letter
      // PascalCase only: starts uppercase AND contains at least one lowercase
      // (rejects ALL_CAPS constants like NAVIGATION / SHELL_IDENTITY)
      if (/^[A-Z][A-Za-z0-9]*$/.test(id) && /[a-z]/.test(id)) out.add(id);
    }
  }
  return out;
}

// Walk all .tsx under UI_DIR to detect usage of off-catalog components.
function walkTsx(dir, into = []) {
  for (const name of readdirSync(dir)) {
    const full = resolve(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) walkTsx(full, into);
    else if (full.endsWith(".tsx")) into.push(full);
  }
  return into;
}

const allTsx = walkTsx(UI_DIR);
const allUsed = new Set();
for (const file of allTsx) {
  const src = readFileSync(file, "utf-8");
  for (const id of extractComponentImports(src)) allUsed.add(id);
}

// Known non-catalog imports we deliberately use: lucide icons, internal wrappers
// declared in this codebase but outside catalog (e.g., FauxRail).
// We accept anything that maps to a file in our own UI tree OR comes from lucide.
const internalDefs = new Set();
for (const file of allTsx) {
  const src = readFileSync(file, "utf-8");
  // export function FooBar / export const FooBar = / export class FooBar
  const re = /export\s+(?:function|const|class)\s+([A-Z][A-Za-z0-9]*)/g;
  let m;
  while ((m = re.exec(src)) !== null) internalDefs.add(m[1]);
}

const ICON_OR_LIB = new Set([
  // lucide icons used across the app — keep this small and dumb
  // We detect lucide separately by import path below.
]);

// Structural composition primitives are intentionally omitted from per-page
// product contracts. They describe how every page is framed, not what the page
// promises to the operator.
const STRUCTURAL_COMPONENTS = new Set([
  "PageFrame",
  "Section",
  "SectionCard",
  "EmptyState",
  "ErrorState",
  "LoadingState",
]);

const driftCandidates = [...allUsed].filter(
  (id) => !CATALOG.has(id) && !internalDefs.has(id) && !ICON_OR_LIB.has(id)
);

// To filter out icons (lucide), re-scan and remove names that came from `lucide-react`.
function namesFromImport(source, fromPath) {
  const out = new Set();
  const re = new RegExp(
    `import\\s+(?!type\\s)\\{([^}]+)\\}\\s+from\\s+["']${fromPath.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    )}["']`,
    "g"
  );
  let m;
  while ((m = re.exec(source)) !== null) {
    m[1]
      .split(",")
      .map((s) => s.trim().split(/\s+as\s+/)[0].trim())
      .filter((n) => /^[A-Z][A-Za-z0-9]*$/.test(n) && /[a-z]/.test(n))
      .forEach((n) => out.add(n));
  }
  return out;
}

const lucideNames = new Set();
for (const file of allTsx) {
  const src = readFileSync(file, "utf-8");
  for (const n of namesFromImport(src, "lucide-react")) lucideNames.add(n);
}

const realDrift = driftCandidates.filter((id) => !lucideNames.has(id));

// Per-page diff for implemented pages
const pageReports = [];
for (const page of matrix) {
  const promised = new Set(page.components);
  // InspectorPreview is implicit in every layout that has preview
  promised.delete("InspectorPreview");

  const implFile = IMPLEMENTED.get(page.page);
  if (EMBEDDED.has(page.page)) {
    pageReports.push({ page: page.page, status: "embedded" });
    continue;
  }
  if (!implFile) {
    pageReports.push({ page: page.page, status: "planned" });
    continue;
  }

  const src = readFileSync(resolve(AREAS_DIR, implFile), "utf-8");
  const used = extractComponentImports(src);
  // Subtract noise: hooks/utilities (cn, etc) are skipped by upper-case rule already.

  const matched = [...promised].filter((p) => isSatisfied(p, used));
  const missingFromCode = [...promised].filter((p) => !isSatisfied(p, used));
  // Build set of all alias-targets so "extra" doesn't flag components that
  // satisfy an alias (they're already counted as matched).
  const aliasTargets = new Set();
  for (const p of promised) {
    const aliases = ALIAS_MAP.get(p);
    if (!aliases) continue;
    for (const a of aliases) if (used.has(a)) aliasTargets.add(a);
  }
  const extraInCode = [...used].filter(
    (u) => !promised.has(u) && !aliasTargets.has(u) && !STRUCTURAL_COMPONENTS.has(u)
  );

  // For report: which promised items were satisfied via alias (not by exact name)
  const viaAlias = [...promised].filter(
    (p) => !used.has(p) && isSatisfied(p, used)
  );

  // PAGE_HEADER_REQUIRED rule (page_header_required): every page must use PageHeader.
  const hasPageHeader = used.has("PageHeader");

  pageReports.push({
    page: page.page,
    status: "implemented",
    promised: [...promised],
    matched,
    missingFromCode,
    extraInCode,
    viaAlias,
    rules: { page_header_required: hasPageHeader },
  });
}

// ─── render report ───────────────────────────────────────────────────────────

function h1(s) {
  console.log(`\n${c.bold}${s}${c.reset}`);
  console.log(c.dim + "─".repeat(s.length + 2) + c.reset);
}
function ok(s) {
  console.log(`  ${c.green}✓${c.reset} ${s}`);
}
function warn(s) {
  console.log(`  ${c.yellow}!${c.reset} ${s}`);
}
function bad(s) {
  console.log(`  ${c.red}✗${c.reset} ${s}`);
}
function info(s) {
  console.log(`  ${c.dim}${s}${c.reset}`);
}

let exitCode = 0;

h1("catalog drift");
if (realDrift.length === 0) {
  ok(`all component imports resolve to catalog or internal helpers (${CATALOG.size} catalog · ${internalDefs.size} internal · ${lucideNames.size} icons)`);
} else {
  bad(`${realDrift.length} identifier(s) used in code but not in catalog`);
  for (const id of realDrift) console.log(`     · ${c.red}${id}${c.reset}`);
  exitCode = 1;
}

h1("manifest coverage");
const implementedCount = pageReports.filter((p) => p.status === "implemented").length;
const embeddedCount = pageReports.filter((p) => p.status === "embedded").length;
const plannedCount = pageReports.filter((p) => p.status === "planned").length;
info(`${implementedCount} implemented · ${embeddedCount} embedded · ${plannedCount} planned · ${matrix.length} total in matrix`);
const orphanFiles = areaFiles.filter(
  (file) => !NON_PAGE_FILES.has(file) && !referencedAreaFiles.has(file)
);
if (orphanFiles.length > 0) {
  warn(`area implementation file(s) without a runtime binding: ${orphanFiles.join(", ")}`);
}

h1("rule_check · page_header_required");
const ruleFailures = pageReports.filter(
  (p) => p.status === "implemented" && p.rules.page_header_required === false
);
if (ruleFailures.length === 0) {
  ok(`every implemented page imports PageHeader`);
} else {
  for (const p of ruleFailures) bad(`${p.page} · falta PageHeader`);
  exitCode = 1;
}

h1("promised vs delivered · per implemented page");
for (const p of pageReports) {
  if (p.status !== "implemented") continue;
  const pad = p.page.padEnd(14, " ");
  const summary = `${c.cyan}${pad}${c.reset} ${c.dim}${p.matched.length}/${p.promised.length} matched${c.reset}  ·  ${c.yellow}${p.missingFromCode.length} missing${c.reset}  ·  ${c.blue}${p.extraInCode.length} extra${c.reset}`;
  console.log("  " + summary);
  if (p.missingFromCode.length > 0) {
    console.log(
      `      ${c.yellow}missing${c.reset}:  ${p.missingFromCode.join(", ")}`
    );
  }
  if (p.extraInCode.length > 0) {
    console.log(`      ${c.blue}extra${c.reset}:    ${p.extraInCode.join(", ")}`);
  }
  if (p.viaAlias && p.viaAlias.length > 0) {
    console.log(
      `      ${c.gray}via alias${c.reset}: ${p.viaAlias
        .map((p) => `${p} → ${[...(ALIAS_MAP.get(p) ?? [])].join("/")}`)
        .join(", ")}`
    );
  }
}
info("`missing`   = manifest promete, código não importa (drift de implementação)");
info("`extra`     = código importa, manifesto não promete (drift de manifesto)");
info("`via alias` = manifest promete X, código entrega Y (registrado em scripts/matrix-aliases.json)");

const contractDrift = pageReports.filter(
  (p) => p.status === "implemented" && p.missingFromCode.length > 0
);
if (contractDrift.length > 0) {
  h1("contract drift · blocking");
  for (const p of contractDrift) {
    bad(`${p.page} promises components not delivered by its implementation: ${p.missingFromCode.join(", ")}`);
  }
  exitCode = 1;
}

h1("planned (placeholder)");
const planned = pageReports.filter((p) => p.status === "planned").map((p) => p.page);
info(planned.join(", "));

h1("summary");
console.log(
  `  ${c.bold}${implementedCount}${c.reset} implemented · ${c.bold}${embeddedCount}${c.reset} embedded · ${c.bold}${plannedCount}${c.reset} planned · ${c.bold}${matrix.length}${c.reset} total`
);
console.log(
  `  ${c.bold}${realDrift.length}${c.reset} catalog drift · ${c.bold}${ruleFailures.length}${c.reset} rule violation(s) · ${c.bold}${contractDrift.length}${c.reset} blocking contract drift`
);
console.log("");

process.exit(exitCode);
