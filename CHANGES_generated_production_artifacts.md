# CHANGES — generated production artifacts

Added generator and validation layer on top of the full production manifests.

## Added scripts

- `scripts/generate-ui.mjs`
- `scripts/check-generated.mjs`
- `scripts/check-demo-store.mjs`
- `scripts/check-acceptance.mjs`

## Added npm scripts

- `npm run generate:ui`
- `npm run check:generated`
- `npm run check:demo-store`
- `npm run check:acceptance`
- `npm run validate:ui`

## Generated outputs

Under `src/ui/minilab-official-ui/generated/`:

- `navigation.generated.ts`
- `routes.generated.ts`
- `types.generated.ts`
- `copy.generated.ts`
- `preview-registry.generated.ts`
- `component-registry.generated.ts`
- `area-registry.generated.ts`
- `page-blueprints.generated.ts`
- `demo-store.generated.ts`
- `showcase-index.generated.ts`
- `api-contracts.generated.ts`
- `action-contracts.generated.ts`
- `acceptance.generated.ts`
- `implementation-waves.generated.ts`
- `quality-rules.generated.ts`
- `route-keyboard.generated.ts`
- `copy-lexicon.generated.ts`
- `schema.generated.sql`
- `index.ts`

## Purpose

The new layer turns the manifests into executable production inputs:
navigation metadata, route metadata, component registry, preview registry,
page composition, demo store, acceptance contracts, and a SQL starting point.

No generated artifact claims real execution or online record validity.
