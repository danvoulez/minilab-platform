# Minilab UI single-spine repair

## Goal

Preserve the current Minilab visual system and final left rail while restoring the original manifest-driven architecture: modular declarative contracts compose into generated artifacts, and the React runtime consumes those artifacts instead of maintaining parallel copies.

## Source spine

- `01.navigation.yaml` — shell identity and visible left rail, including order, labels, icons and primary action target.
- `03.page-manifest.yaml` — page contracts and page copy.
- `32.runtime-bindings.yaml` — the single bridge from area IDs to React implementations, embedded surfaces or placeholders.
- `00`–`31` YAML documents — supporting component, data, quality, acceptance and operational-temperature contracts.

## Generated chain

```text
numbered YAML sources
        ↓
scripts/compose-manifests.mjs
        ↓
99.matrix.generated.yaml
combined.minilab-ui-spec.json
        ↓
scripts/build-manifests.mjs + scripts/generate-ui.mjs
        ↓
manifest runtime snapshot + generated TypeScript/router
        ↓
React shell
```

## Parallel mechanisms removed

- Handwritten left-navigation data → generated from `01.navigation.yaml`.
- Handwritten shell identity copy → generated from `01.navigation.yaml`.
- Handwritten `AreaId` union → generated from the contract area universe.
- Handwritten page-copy table → generated from `03.page-manifest.yaml`.
- Handwritten `AreaRouter` switch → generated from `32.runtime-bindings.yaml`.
- Handwritten placeholder implementation set → generated route status.
- Filename-only matrix implementation detection → runtime-binding-aware validation.
- Stale checked-in matrix/combined spec as authoritative inputs → rebuilt from modular sources.

## Visual invariants

No layout, rail styling, typography, color, inspector styling, page component styling or visual component code was redesigned in this repair. The existing final rail configuration remains the visible navigation source.

## Contract enforcement

`npm run check:spine` verifies:

- page contracts and runtime bindings describe the same 36-area universe;
- the generated matrix contains the same 36 contracts;
- the generated router contains the same 36 runtime bindings;
- all 33 visible navigation items have page contracts;
- the combined spec exactly matches current source navigation, pages, runtime bindings and matrix;
- the Operational Temperature family is part of the combined contract.

`npm run validate:ui` now includes this cross-boundary check.

## Current honest state

- 33 visible rail areas
- 36 total page contracts
- 30 local implemented areas
- 1 embedded live surface (`expedicoes`)
- 5 manifest placeholders (`research`, `benchmarks`, `code`, `analytics`, `settings`)

The remaining major drift is now content-level rather than structural. For example, the old Lab Today page contract still promises an earlier report UI while the implemented page has evolved into the newer operational dashboard. That should be resolved by updating the canonical page contract, not by creating another runtime mechanism.

## v2 contract reconciliation

The follow-up pass is documented in `CONTRACT_RECONCILIATION.md`. It reconciles the modern Lab surfaces with `03.page-manifest.yaml`, removes duplicated page identity from `09.page-blueprints.yaml`, makes icon/preview vocabularies generated, contracts the live carbon-control-plane endpoints, and turns promised-but-undelivered page components into a blocking validation error.
