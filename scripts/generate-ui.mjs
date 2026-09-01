#!/usr/bin/env node
// Generates TypeScript/SQL artifacts from the machine-readable manifests.
// Outputs go to src/ui/minilab-official-ui/generated.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { resolve, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outDir = resolve(root, "src/ui/minilab-official-ui/generated");
const areasDir = resolve(root, "src/ui/minilab-official-ui/areas");

function readYaml(file) {
  return yaml.load(readFileSync(resolve(root, file), "utf-8"));
}

function write(file, body) {
  writeFileSync(resolve(outDir, file), body);
}

function tsConst(name, data) {
  return `/* AUTO-GENERATED from minilab UI manifests. Do not edit manually. */\n\nexport const ${name} = ${JSON.stringify(data, null, 2)} as const;\n`;
}

function unionType(name, values) {
  return `export type ${name} =\n  ${values.map((v) => JSON.stringify(v)).join(" |\n  ")};\n`;
}

function fieldSql(field) {
  const fl = field.toLowerCase();
  if (
    fl === "id" ||
    fl.endsWith("_id") ||
    ["name", "label", "title", "kind", "status", "role", "scope", "reason", "currency", "decision"].includes(fl)
  ) return "TEXT";
  if (fl.includes("amount") || fl === "value") return "NUMERIC";
  if (fl.includes("at") || fl.includes("date") || fl === "when") return "TIMESTAMPTZ";
  if (fl === "missing" || fl.endsWith("s") || fl.includes("payload") || fl === "this") return "JSONB";
  return "TEXT";
}

mkdirSync(outDir, { recursive: true });

const navigation = readYaml("01.navigation.yaml");
const componentsDoc = readYaml("02.component-catalog.yaml");
const pagesDoc = readYaml("03.page-manifest.yaml");
const previewDoc = readYaml("04.preview-manifest.yaml");
const dataDoc = readYaml("05.data-entities.yaml");
const qualityDoc = readYaml("07.quality-rules.yaml");
const pageBlueprintsDoc = readYaml("09.page-blueprints.yaml");
const demoStoreDoc = readYaml("11.demo-store.yaml");
const showcaseDoc = readYaml("12.showcase-manifest.yaml");
const actionContractsDoc = readYaml("14.action-contracts.yaml");
const apiContractsDoc = readYaml("15.api-contracts.yaml");
const registrySchemasDoc = readYaml("16.registry-type-schemas.yaml");
const routeKeyboardDoc = readYaml("19.route-keyboard.yaml");
const copyLexiconDoc = readYaml("21.copy-lexicon.yaml");
const acceptanceDoc = readYaml("24.page-acceptance.yaml");
const wavesDoc = readYaml("25.implementation-waves.yaml");
const runtimeBindingsDoc = readYaml("32.runtime-bindings.yaml");
const platformContractDoc = readYaml("33.platform-contract.yaml");
const providerHandshakeDoc = readYaml("34.provider-handshake.yaml");
const matrixDoc = readYaml("99.matrix.generated.yaml");

const matrix = matrixDoc.matrix;
const components = componentsDoc.components;
const previewKinds = previewDoc.preview_kinds;
const dataEntities = dataDoc.entities;

const navItems = (navigation.groups ?? []).flatMap((group) => group.items ?? []);
const navAreaIds = navItems.map((item) => item.id);
const pageAreaIds = Object.keys(pagesDoc.pages ?? {});
const areaIds = [...new Set([...navAreaIds, ...pageAreaIds])];
const runtimeBindings = runtimeBindingsDoc.routes ?? {};
const previewKindIds = Object.keys(previewKinds);
const iconIds = [...new Set(navItems.map((item) => item.icon))];
const registryContracts = registrySchemasDoc.types ?? {};
const registryKindIds = [...new Set(Object.values(registryContracts).map((spec) => spec.entity_kind))];
const registrySchemaVersionIds = [...new Set(Object.values(registryContracts).map((spec) => spec.schema_version))];
const platformCapabilityIds = Object.keys(platformContractDoc.capabilities ?? {});
const platformSurfaceIds = Object.keys(platformContractDoc.surfaces ?? {});
const componentNames = Object.keys(components);

const implemented = new Set(
  Object.entries(runtimeBindings)
    .filter(([, binding]) => binding.kind !== "placeholder")
    .map(([id]) => id)
);

const areaRegistry = {};
for (const entry of matrix) {
  areaRegistry[entry.page] = {
    nav_group: entry.nav_group,
    title: entry.title,
    layout: entry.layout,
    components: entry.components ?? [],
    data: entry.data ?? [],
    sources: entry.sources ?? [],
    preview: entry.preview ?? [],
    rules: entry.rules ?? [],
    status: implemented.has(entry.page) ? "implemented" : "planned",
  };
}

const pageCopy = {};
for (const [id, page] of Object.entries(pagesDoc.pages)) {
  pageCopy[id] = { title: page.title, lede: page.lede };
}

const routeMeta = {};
for (const [id, page] of Object.entries(pagesDoc.pages)) {
  routeMeta[id] = {
    title: page.title,
    lede: page.lede,
    layout: page.layout,
    status: areaRegistry[id]?.status ?? "planned",
  };
}

const componentFamilies = {};
for (const [name, spec] of Object.entries(components)) {
  const family = spec.family ?? "unknown";
  componentFamilies[family] ||= [];
  componentFamilies[family].push(name);
}

const generatedNavigation = (navigation.groups ?? []).map((group) => ({
  id: group.id,
  items: (group.items ?? []).map((item) => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
    ...(item.href ? { href: item.href } : {}),
  })),
}));
const rawShell = navigation.shell_identity ?? {};
const generatedShellIdentity = {
  product: rawShell.product ?? "",
  subtitle: rawShell.subtitle ?? "",
  currentContext: {
    label: rawShell.current_context?.label ?? "",
    detail: rawShell.current_context?.detail ?? "",
  },
  primaryAction: {
    id: rawShell.primary_action?.id ?? "new",
    label: rawShell.primary_action?.label ?? "+ New",
    behavior: rawShell.primary_action?.behavior ?? "open_register_flow",
    target: rawShell.primary_action?.target ?? "registry",
  },
  authority: {
    label: rawShell.authority?.label ?? "Autoridade",
    emptyLabel: rawShell.authority?.empty_label ?? "Sem conexão",
    emptyDetail: rawShell.authority?.empty_detail ?? "",
    actionLabel: rawShell.authority?.action_label ?? "Ver contrato",
  },
  operator: rawShell.operator ?? {},
};

write("navigation.generated.ts", tsConst("GENERATED_NAVIGATION", generatedNavigation) + "\n" + tsConst("GENERATED_SHELL_IDENTITY", generatedShellIdentity));
write("routes.generated.ts", tsConst("GENERATED_ROUTE_META", routeMeta) + "\n" + tsConst("GENERATED_AREA_IDS", areaIds));

let types = "/* AUTO-GENERATED from minilab UI manifests. Do not edit manually. */\n\n";
types += unionType("GeneratedAreaId", areaIds) + "\n";
types += unionType("GeneratedPreviewKind", previewKindIds) + "\n";
types += unionType("GeneratedIconName", iconIds) + "\n";
types += unionType("GeneratedRegistryKind", registryKindIds) + "\n";
types += unionType("GeneratedRegistrySchemaVersion", registrySchemaVersionIds) + "\n";
types += unionType("GeneratedPlatformCapabilityId", platformCapabilityIds) + "\n";
types += unionType("GeneratedPlatformSurfaceId", platformSurfaceIds) + "\n";
types += unionType("GeneratedComponentName", componentNames) + "\n";
write("types.generated.ts", types);

write("copy.generated.ts", tsConst("GENERATED_PAGE_COPY", pageCopy));
write("page-contracts.generated.ts", tsConst("GENERATED_PAGE_CONTRACTS", pagesDoc.pages));
write("preview-registry.generated.ts", tsConst("GENERATED_PREVIEW_REGISTRY", previewKinds));
write("component-registry.generated.ts", tsConst("GENERATED_COMPONENT_REGISTRY", components) + "\n" + tsConst("GENERATED_COMPONENT_FAMILIES", componentFamilies));
write("area-registry.generated.ts", tsConst("GENERATED_AREA_REGISTRY", areaRegistry));
const compiledPageBlueprints = {};
for (const [id, page] of Object.entries(pagesDoc.pages ?? {})) {
  const override = pageBlueprintsDoc.pages?.[id] ?? {};
  compiledPageBlueprints[id] = {
    title: page.title,
    lede: page.lede,
    layout: page.layout,
    components: page.components ?? [],
    data: page.data ?? [],
    sources: page.sources ?? [],
    preview_kinds: page.preview_kinds ?? [],
    ...override,
  };
}
write("page-blueprints.generated.ts", tsConst("GENERATED_PAGE_BLUEPRINTS", compiledPageBlueprints));
write("demo-store.generated.ts", tsConst("GENERATED_DEMO_STORE", demoStoreDoc));
write("showcase-index.generated.ts", tsConst("GENERATED_SHOWCASE_MANIFEST", showcaseDoc));
write("api-contracts.generated.ts", tsConst("GENERATED_API_CONTRACTS", apiContractsDoc));
write("registry-contracts.generated.ts", tsConst("GENERATED_REGISTRY_CONTRACTS", registryContracts) + "\n" + tsConst("GENERATED_REGISTRY_COMMON", registrySchemasDoc.common ?? {}));
write("platform-contract.generated.ts", tsConst("GENERATED_PLATFORM_CONTRACT", platformContractDoc));
write("provider-handshake.generated.ts", tsConst("GENERATED_PROVIDER_HANDSHAKE", providerHandshakeDoc));
write("action-contracts.generated.ts", tsConst("GENERATED_ACTION_CONTRACTS", actionContractsDoc));
write("acceptance.generated.ts", tsConst("GENERATED_PAGE_ACCEPTANCE", acceptanceDoc));
write("implementation-waves.generated.ts", tsConst("GENERATED_IMPLEMENTATION_WAVES", wavesDoc));
write("quality-rules.generated.ts", tsConst("GENERATED_QUALITY_RULES", qualityDoc));
write("route-keyboard.generated.ts", tsConst("GENERATED_ROUTE_KEYBOARD", routeKeyboardDoc));
write("copy-lexicon.generated.ts", tsConst("GENERATED_COPY_LEXICON", copyLexiconDoc));

// Runtime router is generated from 32.runtime-bindings.yaml. This removes the
// handwritten switch as a second route source of truth.
const importByModule = new Map();
for (const binding of Object.values(runtimeBindings)) {
  if (binding.kind !== "component") continue;
  const names = importByModule.get(binding.module) ?? new Set();
  names.add(binding.export);
  importByModule.set(binding.module, names);
}

const routerLines = [
  "/* AUTO-GENERATED from 32.runtime-bindings.yaml. Do not edit manually. */",
  'import type { GeneratedAreaId } from "./types.generated";',
  'import type { PreviewApi } from "../areas/use-preview";',
  'import { PlaceholderPage } from "../areas/placeholder";',
  'import { EveFrame } from "../components/eve-frame";',
];
for (const [module, names] of [...importByModule.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  routerLines.push(`import { ${[...names].sort().join(", ")} } from "../areas/${module}";`);
}
routerLines.push(
  "",
  "export function GeneratedAreaRouter({ area, preview }: { area: GeneratedAreaId; preview: PreviewApi }) {",
  "  switch (area) {"
);
for (const [id, binding] of Object.entries(runtimeBindings)) {
  routerLines.push(`    case ${JSON.stringify(id)}:`);
  if (binding.kind === "component") {
    routerLines.push(`      return <${binding.export} preview={preview} />;`);
  } else if (binding.kind === "iframe") {
    const frameClass = binding.frame_class_name
      ? ` frameClassName=${JSON.stringify(binding.frame_class_name)}`
      : "";
    routerLines.push(
      `      return <EveFrame path=${JSON.stringify(binding.path)} title=${JSON.stringify(binding.title ?? pagesDoc.pages?.[id]?.title ?? id)}${frameClass} />;`
    );
  } else {
    routerLines.push("      return <PlaceholderPage area={area} />;");
  }
}
routerLines.push(
  "    default:",
  "      return <PlaceholderPage area={area} />;",
  "  }",
  "}",
  ""
);
write("area-router.generated.tsx", routerLines.join("\n"));

const sql = [
  "-- AUTO-GENERATED from 05.data-entities.yaml.",
  "-- Starting point for online persistence; local files are not a valid source of truth.",
  "",
];
for (const [table, spec] of Object.entries(dataEntities)) {
  if (spec.persistence === "external_authority" || spec.persistence === "compiled_contract") {
    sql.push(`-- ${table}: ${spec.persistence} · authority=${spec.authority ?? "external"}; no local table generated.\n`);
    continue;
  }
  let fields = spec.fields ?? [];
  if (!Array.isArray(fields)) fields = Object.keys(fields);
  if (!fields.includes("id")) fields = ["id", ...fields];
  sql.push(`CREATE TABLE IF NOT EXISTS ${table} (`);
  sql.push(fields.map((f) => `  ${f} ${fieldSql(f)}${f === "id" ? " PRIMARY KEY" : ""}`).join(",\n"));
  sql.push(");\n");
}
write("schema.generated.sql", sql.join("\n"));

write(
  "index.ts",
  [
    "/* AUTO-GENERATED generated manifest exports. */",
    'export * from "./navigation.generated";',
    'export * from "./routes.generated";',
    'export * from "./types.generated";',
    'export * from "./copy.generated";',
    'export * from "./page-contracts.generated";',
    'export * from "./preview-registry.generated";',
    'export * from "./component-registry.generated";',
    'export * from "./area-registry.generated";',
    'export * from "./page-blueprints.generated";',
    'export * from "./demo-store.generated";',
    'export * from "./showcase-index.generated";',
    'export * from "./api-contracts.generated";',
    'export * from "./registry-contracts.generated";',
    'export * from "./platform-contract.generated";',
    'export * from "./provider-handshake.generated";',
    'export * from "./action-contracts.generated";',
    'export * from "./acceptance.generated";',
    'export * from "./implementation-waves.generated";',
    'export * from "./quality-rules.generated";',
    'export * from "./route-keyboard.generated";',
    'export * from "./copy-lexicon.generated";',
    'export * from "./area-router.generated";',
    "",
  ].join("\n")
);

write(
  "README.md",
  [
    "# Generated UI contracts",
    "",
    "These files are generated from the machine-readable manifests at the project root.",
    "",
    "Regenerate with:",
    "",
    "```bash",
    "npm run generate:ui",
    "```",
    "",
  ].join("\n")
);

console.log(`generated UI contracts · ${areaIds.length} pages · ${componentNames.length} components · ${previewKindIds.length} preview kinds`);
