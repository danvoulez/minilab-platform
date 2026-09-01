# Changes — Operational Temperature Grid manifests

Added a non-invasive contract layer for the next visual compression pass.

## Added

- `26.grid-contract.yaml`
- `27.operational-temperature.yaml`
- `28.cold-templates.yaml`
- `29.hot-components.yaml`
- `30.inspector-grammar.yaml`
- `31.page-temperature-map.yaml`
- `scripts/check-temperature-contract.mjs`
- `OPERATIONAL_TEMPERATURE_GRID.md`

## Updated

- `package.json`
  - added `check:temperature`
  - appended `check:temperature` to `validate:ui`

## Validation

Ran:

```bash
npm run check:temperature
npm run validate:ui
npm run typecheck
npm run build
```

Result:

- 31 pages in `03.page-manifest.yaml`
- 31 pages in `31.page-temperature-map.yaml`
- 13 hot components declared
- 13 cold templates declared
- temperature contract valid
- existing UI validation still green
- typecheck green
- build green

## Guardrail

No `areas/*.tsx` files were rewritten. No sidebar, shell, palette, preview system, or existing pages were changed.
