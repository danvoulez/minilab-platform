#!/usr/bin/env node
// Compose the modular YAML sources into the two canonical generated snapshots:
//   - 99.matrix.generated.yaml
//   - combined.minilab-ui-spec.json
// These files are build artifacts. The numbered YAML documents are the source.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function readYaml(file) {
  return yaml.load(readFileSync(resolve(root, file), "utf-8"));
}

const docs = {
  tokens: ["00.tokens.yaml", readYaml("00.tokens.yaml")],
  navigation: ["01.navigation.yaml", readYaml("01.navigation.yaml")],
  components: ["02.component-catalog.yaml", readYaml("02.component-catalog.yaml")],
  pages: ["03.page-manifest.yaml", readYaml("03.page-manifest.yaml")],
  preview: ["04.preview-manifest.yaml", readYaml("04.preview-manifest.yaml")],
  data_entities: ["05.data-entities.yaml", readYaml("05.data-entities.yaml")],
  flows: ["06.interaction-flows.yaml", readYaml("06.interaction-flows.yaml")],
  quality_rules: ["07.quality-rules.yaml", readYaml("07.quality-rules.yaml")],
  compose_rules: ["08.compose-ui-matrix.rules.yaml", readYaml("08.compose-ui-matrix.rules.yaml")],
  page_blueprints: ["09.page-blueprints.yaml", readYaml("09.page-blueprints.yaml")],
  component_states: ["10.component-states.yaml", readYaml("10.component-states.yaml")],
  demo_store: ["11.demo-store.yaml", readYaml("11.demo-store.yaml")],
  showcase_manifest: ["12.showcase-manifest.yaml", readYaml("12.showcase-manifest.yaml")],
  visual_audit_rules: ["13.visual-audit-rules.yaml", readYaml("13.visual-audit-rules.yaml")],
  action_contracts: ["14.action-contracts.yaml", readYaml("14.action-contracts.yaml")],
  api_contracts: ["15.api-contracts.yaml", readYaml("15.api-contracts.yaml")],
  registry_type_schemas: ["16.registry-type-schemas.yaml", readYaml("16.registry-type-schemas.yaml")],
  report_intelligence: ["17.report-intelligence.yaml", readYaml("17.report-intelligence.yaml")],
  sensor_ingestion_sync: ["18.sensor-ingestion-sync.yaml", readYaml("18.sensor-ingestion-sync.yaml")],
  route_keyboard: ["19.route-keyboard.yaml", readYaml("19.route-keyboard.yaml")],
  responsive_layout: ["20.responsive-layout.yaml", readYaml("20.responsive-layout.yaml")],
  copy_lexicon: ["21.copy-lexicon.yaml", readYaml("21.copy-lexicon.yaml")],
  accessibility: ["22.accessibility.yaml", readYaml("22.accessibility.yaml")],
  test_plan: ["23.test-plan.yaml", readYaml("23.test-plan.yaml")],
  page_acceptance: ["24.page-acceptance.yaml", readYaml("24.page-acceptance.yaml")],
  implementation_waves: ["25.implementation-waves.yaml", readYaml("25.implementation-waves.yaml")],
  grid_contract: ["26.grid-contract.yaml", readYaml("26.grid-contract.yaml")],
  operational_temperature: ["27.operational-temperature.yaml", readYaml("27.operational-temperature.yaml")],
  cold_templates: ["28.cold-templates.yaml", readYaml("28.cold-templates.yaml")],
  hot_components: ["29.hot-components.yaml", readYaml("29.hot-components.yaml")],
  inspector_grammar: ["30.inspector-grammar.yaml", readYaml("30.inspector-grammar.yaml")],
  page_temperature_map: ["31.page-temperature-map.yaml", readYaml("31.page-temperature-map.yaml")],
  runtime_bindings: ["32.runtime-bindings.yaml", readYaml("32.runtime-bindings.yaml")],
  platform_contract: ["33.platform-contract.yaml", readYaml("33.platform-contract.yaml")],
  provider_handshake: ["34.provider-handshake.yaml", readYaml("34.provider-handshake.yaml")],
  fix_queue: ["98.fix-queue.generated.yaml", readYaml("98.fix-queue.generated.yaml")],
};

const navigation = docs.navigation[1];
const pagesDoc = docs.pages[1];
const quality = docs.quality_rules[1];

const navGroupByPage = new Map();
for (const group of navigation.groups ?? []) {
  for (const item of group.items ?? []) navGroupByPage.set(item.id, group.id);
}

function qualityRulesFor(pageId, page) {
  const targets = new Set([pageId, page.title, ...(page.components ?? [])]);
  const out = [];
  for (const rule of quality.rules ?? []) {
    if (rule.applies_to === "*") {
      out.push(rule.id);
      continue;
    }
    const applies = Array.isArray(rule.applies_to) ? rule.applies_to : [];
    if (applies.some((target) => targets.has(target))) out.push(rule.id);
  }
  return out;
}

const matrix = Object.entries(pagesDoc.pages ?? {}).map(([pageId, page]) => ({
  page: pageId,
  nav_group: navGroupByPage.get(pageId) ?? "hidden",
  title: page.title,
  lede: page.lede,
  layout: page.layout,
  components: page.components ?? [],
  data: page.data ?? [],
  sources: page.sources ?? [],
  preview: page.preview_kinds ?? [],
  flows: page.flows ?? [],
  rules: qualityRulesFor(pageId, page),
}));

const matrixDoc = {
  schema: "minilab.ui.matrix.v1",
  document_type: "generated_matrix",
  generated_from: [
    "00.tokens.yaml",
    "01.navigation.yaml",
    "02.component-catalog.yaml",
    "03.page-manifest.yaml",
    "04.preview-manifest.yaml",
    "05.data-entities.yaml",
    "06.interaction-flows.yaml",
    "07.quality-rules.yaml",
    "08.compose-ui-matrix.rules.yaml",
    "32.runtime-bindings.yaml",
    "33.platform-contract.yaml",
    "34.provider-handshake.yaml",
  ],
  matrix,
};

writeFileSync(
  resolve(root, "99.matrix.generated.yaml"),
  yaml.dump(matrixDoc, { noRefs: true, lineWidth: 120, sortKeys: false })
);

const combined = {};
for (const [key, [, doc]] of Object.entries(docs)) {
  if (key === "fix_queue") continue;
  combined[key] = doc;
}
combined.matrix = matrixDoc;
combined.fix_queue = docs.fix_queue[1];

writeFileSync(
  resolve(root, "combined.minilab-ui-spec.json"),
  JSON.stringify(combined, null, 2) + "\n"
);

console.log(
  `composed manifests · ${navigation.groups.flatMap((g) => g.items ?? []).length} visible areas · ${matrix.length} page contracts`
);
