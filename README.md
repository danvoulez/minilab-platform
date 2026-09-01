# minilab.work official UI — platform contract

Composable YAML manifests for generating and validating the UI implementation matrix.

Files:

- `00.tokens.yaml`: visual language tokens and layout rules.
- `01.navigation.yaml`: sidebar groups and navigation items.
- `02.component-catalog.yaml`: unique component catalog.
- `03.page-manifest.yaml`: page-by-page component/data/preview declarations.
- `04.preview-manifest.yaml`: preview kind mappings.
- `05.data-entities.yaml`: data entities/tables and fields.
- `06.interaction-flows.yaml`: reusable UI interaction flows.
- `07.quality-rules.yaml`: product constraints.
- `08.compose-ui-matrix.rules.yaml`: composition and validation rules.
- `99.matrix.generated.yaml`: generated page × component × data × preview × rules matrix.
- `combined.minilab-ui-spec.json`: all manifests in one JSON.

Core rule:

Sidebar orients. Middle operates. Preview details. The UI defines the product contract; a backend is a provider that may satisfy all or part of it. Proposal assistance never claims operational truth. Writes are valid only when the provider returns an authoritative result or receipt. Ghosts preserve incompleteness. Receipts close proof.

## Supplemental production manifests

The package now also includes:

- `09.page-blueprints.yaml`: page slot/composition blueprints.
- `10.component-states.yaml`: required states for components and showcase.
- `11.demo-store.yaml`: canonical demo data.
- `12.showcase-manifest.yaml`: component showcase source.
- `13.visual-audit-rules.yaml`: screenshot/visual audit rules.
- `14.action-contracts.yaml`: action behavior contracts.
- `15.api-contracts.yaml`: expected UI API contracts.
- `16.registry-type-schemas.yaml`: registry type schemas.
- `17.report-intelligence.yaml`: on-load LAB Report calculation contract.
- `18.sensor-ingestion-sync.yaml`: sensor liveness/import/sync/intelligence contract.
- `19.route-keyboard.yaml`: hash routing and keyboard shortcuts.
- `20.responsive-layout.yaml`: desktop/mobile layout rules.
- `21.copy-lexicon.yaml`: human surface language and forbidden jargon.
- `22.accessibility.yaml`: accessibility requirements.
- `23.test-plan.yaml`: unit/integration/visual/matrix/a11y test plan.
- `24.page-acceptance.yaml`: page-level acceptance criteria.
- `25.implementation-waves.yaml`: production waves for full UI.
- `26`–`31`: Operational Temperature visual policy.
- `32.runtime-bindings.yaml`: runtime React bindings generated into the router.
- `33.platform-contract.yaml`: canonical platform capabilities and page requirements.
- `34.provider-handshake.yaml`: backend capability-negotiation contract.
- `98.fix-queue.generated.yaml`: initial generated visual fix queue.


## Generated production artifacts

This package now includes a generated contract layer under:

```txt
src/ui/minilab-official-ui/generated/
```

Generated from the machine manifests:

- navigation/routes/types/copy metadata
- preview registry
- component registry
- area registry
- page blueprints
- demo store
- showcase index
- action/API/acceptance contracts
- implementation waves
- generated SQL starting point

Commands:

```bash
npm run generate:ui
npm run validate:ui
npm run build
```

The generated layer is intentionally metadata-first. It does not claim persistence, execution, or online validity. It lets the UI be assembled and audited from the manifests.


## Platform-first backend model

Minilab does not discover its product ontology from a backend. The platform contract declares the complete menu of possibilities. A provider reports which capabilities it currently satisfies through `GET /api/platform/capabilities`.

Provider status may be `available`, `degraded`, `unavailable`, or `unknown`. A missing capability must never remove a navigation surface. Required capabilities control the surface unavailable state; optional capabilities control only the dependent action or panel.

The Registry follows the same rule. `16.registry-type-schemas.yaml` is the UI-owned Registry ontology. A provider may support a subset of those entity kinds and may map them to different internal schemas, but provider-specific names do not become UI contracts.

Development has one backend seam:

```bash
MINILAB_PROVIDER_URL=http://127.0.0.1:8788 npm run dev
```

All platform HTTP contracts live under same-origin `/api`. Internally, an adapter can fan out to any architecture it needs.

Validation:

```bash
npm run check:platform-contract
npm run validate:ui
npm run typecheck
```
