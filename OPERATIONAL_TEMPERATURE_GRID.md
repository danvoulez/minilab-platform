# Operational Temperature Grid

This package adds the contract layer for the next UI compression pass. It does **not** rewrite pages, regenerate area TSX, change the sidebar, change the shell, or replace the current component system.

## Problem

The UI is professional, coherent, and technically dense, but too much information is visible with the same weight. Operators lose trust by excess, not by lack.

## Rule

Healthy compacts. History collapses. Duplicates move to inspector. Critical rises. Raw goes to disclosure. Hot uses specific components. Cold uses fixed templates.

## Temperature model

- **hot**: urgent, recent, unstable, blocking, actionable.
- **warm**: active, monitored, relevant, in progress.
- **cold**: normal, peaceful, old, statistical, auditable.
- **raw**: technical payload, JSON, ids, source details.

## New manifests

- `26.grid-contract.yaml` — zone contract: header, hot, warm, cold, raw.
- `27.operational-temperature.yaml` — thermal semantics, promotion/demotion rules, metric behavior.
- `28.cold-templates.yaml` — fixed cold templates such as `ColdTable`, `ColdAuditTrail`, `ColdRawPayload`.
- `29.hot-components.yaml` — domain-specific hot components such as `HotDecisionCard`, `HotRuntimeImpactCard`, `HotHumanSupportCard`.
- `30.inspector-grammar.yaml` — decision-first inspector order: decision, evidence, relations, raw.
- `31.page-temperature-map.yaml` — page-by-page primary questions and hot/warm/cold mapping for all 31 pages.

## Validator

Run:

```bash
npm run check:temperature
```

It validates:

- all temperature YAMLs parse;
- every page in `03.page-manifest.yaml` appears in `31.page-temperature-map.yaml`;
- every hot component referenced by a page exists in `29.hot-components.yaml`;
- every cold template referenced by a page exists in `28.cold-templates.yaml`;
- every page has a `primary_question`;
- raw is last in inspector grammar;
- no raw-like component is used in a hot zone.

## Not implemented yet

This layer is a contract only. The next patch should be a pilot, not a full rewrite.

Recommended pilot:

1. `Today` — worst density and best proof of hot/cold separation.
2. `Financeiro` — clear hot financial urgencies vs cold archive/statistics.
3. `Ghosts` — already mature; good control page to avoid damaging what works.

The pilot should produce before/after screenshots and prove that visual weight drops without deleting operational capacity.
