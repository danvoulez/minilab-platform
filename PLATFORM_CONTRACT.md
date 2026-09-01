# Minilab Platform Contract

## Decision

Minilab UI is the product contract. A backend is a provider of platform capabilities, not the source of the product ontology.

The current left rail, page structure, visual language, Registry model, inspectors, receipts, ghosts, gates, and workbench concepts are therefore intentional platform surfaces. A provider can satisfy all of them, some of them, or temporarily none of them. Provider coverage changes capability state. It does not rewrite Minilab.

## The spine

```text
01 navigation
03 page contracts
14 action contracts
15 API contracts
16 Registry ontology
33 platform capabilities
34 provider handshake
        │
        ▼
compiler / validators
        │
        ├─ navigation + router + types
        ├─ page contracts
        ├─ API metadata
        ├─ Registry contracts
        └─ platform capability registry
        │
        ▼
      React UI
        │
        ▼
   same-origin /api
        │
        ▼
 provider / adapter
```

## Provider contract

A provider implements the HTTP endpoints referenced by `15.api-contracts.yaml` and advertises coverage at:

```http
GET /api/platform/capabilities
```

The handshake reports:

- provider identity and version;
- capability status: `available`, `degraded`, `unavailable`, or `unknown`;
- optional endpoint/detail metadata;
- Registry type coverage independently of the platform Registry ontology.

If a provider omits a capability, Minilab interprets it as `unknown`.

## Surface behavior

Each page in `33.platform-contract.yaml` declares `required` and `optional` capabilities.

- Required unavailable: keep the page in navigation and render an unavailable/disconnected state.
- Optional unavailable: keep the page and disable or hide only the dependent control.
- Unknown: the UI may attempt the operation and must surface the provider response honestly.
- Degraded: preserve the feature while marking the dependent surface degraded.

Unmarked demo data must never impersonate provider truth.

## Registry

`16.registry-type-schemas.yaml` is owned by Minilab. It currently defines 23 durable platform kinds, including Human, Machine, Sensor, LLM, Agent, Runtime, Service, Model, Provider, Space, Document, Idea, Expedition, Workflow, Benchmark, Cost, Vendor, Legal Record, Address, Policy, Secret Reference, Connection, and Schedule.

A provider may support a subset. Unsupported kinds remain visible as platform possibilities.

Registry writes follow:

```text
language / form
    ↓
proposal
    ↓
human review
    ↓
Minilab canonical payload
    ↓
POST /api/registry/admissions
    ↓
provider validation + persistence
    ↓
authoritative admission receipt
```

The UI never stores provider-internal tenant identity and never treats proposal text as an operational write.

## One backend seam

All platform transport is same-origin `/api`. In development, Vite forwards the entire seam to `MINILAB_PROVIDER_URL`.

A provider adapter may internally call multiple services, databases, queues, agents, or legacy systems. Those details stay behind the provider boundary.

## Validation

`npm run check:platform-contract` proves:

- all 36 page contracts have platform surfaces;
- all 33 visible menu items remain platform surfaces;
- required/optional capability references exist;
- capability API references exist;
- provider-handshake status vocabulary matches the platform vocabulary;
- provider gaps cannot erase navigation;
- Registry schema versions are platform-owned.

This check runs inside `npm run validate:ui`.
