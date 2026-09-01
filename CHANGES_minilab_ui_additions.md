# Changes — minilab.work official UI additions

Applied on top of the uploaded `minilab-official-ui(2).zip`.

## Implemented page composition upgrades

### Registry
- Added local operator emphasis via `LocalOperatorComposer`.
- Initial middle surface now shows Registry type table.
- Clicking a Registry type switches to item list.
- First item of selected type auto-opens in preview.
- Registry mutation remains AI + rules only.

### LAB
- Added `Hello Daniel` + `Today is May 19th`.
- Added on-load `RealtimeLabReport`.
- Added `MinilabMarkdown` renderer for rich, temporary report content.
- Added report action buttons and stronger urgency/accomplishment hierarchy.

### Machines
- Expanded from status cards to deep observability:
  - connectivity
  - wifi
  - last boot
  - last access
  - current job
  - efficiency
  - maintenance
  - security
  - runtimes
  - machine receipts
- Machine preview now shows richer machine evidence fields.

### Sensors
- Added liveness/health grid.
- Added sensor intelligence panel.
- Added import/sync/Supabase panels.
- Added Sensor → Registry action surface.
- First critical sensor auto-opens in preview.
- Sensor preview now shows registry/sync/conclusion details.

### Ghosts
- Added triage summary.
- Added missing-evidence matrix.
- Added domain breakdown.
- Added resolvable ghosts panel.
- Keeps Ghost as honest incompleteness, not an error dump.

### Receipts
- Added receipt ledger summary.
- Added receipt timeline.
- Added filter component.
- Keeps Receipt as scoped proof closure, not generic activity log.

## Manifest upgrades

Updated:
- `02.component-catalog.yaml`
- `03.page-manifest.yaml`
- `04.preview-manifest.yaml`
- `05.data-entities.yaml`
- `06.interaction-flows.yaml`
- `07.quality-rules.yaml`
- `99.matrix.generated.yaml`
- `combined.minilab-ui-spec.json`
- generated runtime `src/ui/minilab-official-ui/manifests/spec.json`

## Validation

Commands run:

```bash
npm ci
npm run build
```

Result:
- build passed
- typecheck passed through `npm run build`
- matrix check passed
- 31 pages total
- 6 implemented
- 25 planned
- 0 catalog drift
- 0 rule violations

The matrix still reports honest `missing`/`extra` drift for implemented pages. This is expected at this stage: the manifest now describes the intended richer composition, while some components are implemented as grouped domain-composition panels rather than exact one-component-per-contract imports.
