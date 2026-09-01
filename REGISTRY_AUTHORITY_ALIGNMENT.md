# Registry Authority Alignment · v3

This pass connects the existing Registry visual surface to the real authority model instead of reviving the UI prototype's parallel write path.

## Authority

The UI does not own Registry persistence.

Canonical authority is external to this package:

- `engine.registry_entities` — stable entity identity/current-state pointer
- `engine.registry_versions` — content-addressed canonical states
- `engine.registry_admissions` — admitted provenance/history

`05.data-entities.yaml` now marks those records as `external_authority`. The generated SQL deliberately emits comments for them and does not create local Registry tables.

## Admissible contracts

`16.registry-type-schemas.yaml` now mirrors the four engine contracts currently admitted:

- `person` → `carbon.registry.person.v1`
- `computer` → `carbon.registry.computer.v1`
- `idea` → `carbon.registry.idea.v1`
- `expedition` → `carbon.registry.expedition.v1`

The Registry type table is generated from this contract file. Unsupported ideas such as `runtime`, `service`, or `sensor` no longer appear as if they were already valid Registry entity kinds.

## Write path

The former fictional API family was removed:

- `/api/register/draft`
- `/api/register/refine`
- `/api/register/commit`

The UI adapter now uses the real engine contract:

- `POST /registry/admissions`
- `GET /registry/entities/:id`
- `GET /registry/entities/:id/versions`

A proposal is browser state only. The user must explicitly review the candidate payload before the UI can submit an admission. A successful response opens a Registry Admission inspector showing `entity_id`, `state_cid`, `content_cid`, `admission_id`, and `previous_state_cid`.

## Proposal assistance

The current package still does not contain a real local LLM integration. The Registry composer therefore says so explicitly. Its initial parser is deterministic and limited to producing a candidate.

The intended separation is now enforced in copy and contracts:

1. human/model interprets and proposes;
2. human reviews the exact payload;
3. engine validates schema, tenant relationships and admission rules;
4. engine admits or rejects;
5. UI displays the engine result as evidence.

## Existing entities

The engine surface available to this UI has fetch-one + version history, but not an authoritative list endpoint. The old demo entity list was therefore removed from the Registry runtime page.

Until a current-state projection/list endpoint is exposed, Registry supports lookup by UUID. The inspector then loads the entity, current canonical payload and version/admission history.

No demo list is presented as production truth.

## `+ New`

The primary rail action now creates an explicit `#registry?new` intent and focuses the Registry composer. Normal navigation to Registry remains `#registry`.

## Transport boundary

Registry requests are same-origin by default (`/registry/...`).

- Development: Vite proxies `/registry` to the local Registry/control-plane port.
- Production: the hosting layer must expose an authenticated BFF/reverse-proxy bridge for those paths.

The browser does not fall back to a direct control-plane origin, and it never supplies `tenant_id` itself.

This package has not claimed a live production admission until that deployment bridge is verified end-to-end.

## Validation

Added `npm run check:registry-contracts` and included it in `validate:ui`.

It blocks:

- reintroduction of `register.draft/refine/commit`;
- duplicate/invalid Registry contract vocabulary;
- Registry authority tables losing `external_authority` classification;
- Registry page returning to mutable `registry_types` data instead of compiled contracts.

Current checkpoint:

- 4 canonical admitted Registry kinds
- 3 real Registry HTTP contracts
- 21 preview kinds
- Registry page: 7/7 promised components matched
- 0 Registry page missing/extra component drift
- 0 blocking contract drift overall
- TypeScript passes
