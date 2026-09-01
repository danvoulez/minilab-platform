# Contract reconciliation — single spine v2

This pass moves the modern operational UI back onto the canonical manifest spine without redesigning the shell or visual language.

## What is canonical now

- `01.navigation.yaml` owns visible rail order, labels, icons, shell identity and primary action.
- `03.page-manifest.yaml` owns page identity, lede, layout intent, promised product components, live sources and preview vocabulary.
- `04.preview-manifest.yaml` owns preview kinds. `knowledge` is now declared because the runtime already uses it.
- `09.page-blueprints.yaml` is no longer a second page manifest. It contains only layout/slot overrides and is merged onto `03` during generation.
- `15.api-contracts.yaml` owns the live HTTP boundary used by `lab-dashboard-api.ts`.
- `32.runtime-bindings.yaml` owns component / iframe / placeholder bindings, but no longer duplicates the Expedições title.

## Operational pages reconciled

The old calculated Markdown-report contract for `lab-today` was retired. The canonical contract now matches the implemented surface:

- Dan/Lab calendar counts
- overlap count
- recurring automation count
- research health when available
- research plan identity and hashes
- JSON preview for research levels
- live 256-eve Observatório iframe

`lab-calendar`, `lab-routine`, and `lab-construction` were similarly updated to describe the code that actually exists. Lab Construction now explicitly preserves its truth rules: declared plan is not inferred completion, gaps are declared rather than guessed, folder activity is not repository state, and remote freshness must stay visible.

The three research-plan pages now get title, lede, and horizon from generated page contracts rather than a handwritten `LEVEL_COPY` twin.

## Compiler changes

`generate-ui.mjs` now additionally:

- generates `GeneratedIconName` from the actual navigation manifest;
- generates `page-contracts.generated.ts` from the page manifest;
- compiles full page blueprints by merging canonical page contracts with `09` overrides;
- derives iframe titles from the canonical page contract when the runtime binding does not override them;
- carries page `sources` into generated area metadata.

`types.ts` now projects both `IconName` and `PreviewKind` from generated manifest types.

## New blocking checks

`check:live-contracts` verifies:

1. every `/api/lab-dashboard/*` path used by `lab-dashboard-api.ts` exists in `15.api-contracts.yaml`;
2. every page `sources: [lab.*]` reference resolves to an API contract;
3. `consumed_by` references point at real page contracts.

`check:matrix` now treats promised-but-undelivered components on implemented pages as a build failure. Structural layout primitives (`PageFrame`, `Section`, loading/error/empty states) are ignored in the product-contract diff.

`check:spine` now rejects page blueprint overrides that duplicate canonical fields such as title, lede, layout, components, data, sources, or preview kinds.

## Current verification

- 33 visible rail items
- 36 page contracts
- 30 local implementations
- 1 embedded live surface
- 5 intentional placeholders
- 19 canonical preview kinds
- 6 live dashboard client paths, all contracted
- 12 page-to-live-source references, all resolved
- 0 promised-but-missing components on implemented pages
- `npm run validate:ui` passes
- `npm run typecheck` passes

## About the Operational Temperature Grid

Files `26`–`31` remain a future visual-policy layer. Their own documentation explicitly says they do not rewrite or drive the current React pages yet. They are included in the composed contract and validated, but they are not treated as runtime truth until a compiler/runtime consumer is deliberately added. This distinction is intentional so a future visual experiment cannot silently become a second implementation spine.
