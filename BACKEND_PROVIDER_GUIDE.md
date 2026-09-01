# Backend Provider Guide

A backend does not need to adopt Minilab's internal implementation. It only needs an adapter that satisfies the platform contract.

## Minimum integration sequence

1. Serve `GET /api/platform/capabilities`.
2. Mark every known capability as `available`, `degraded`, `unavailable`, or omit it for `unknown`.
3. Implement the endpoint references for the capabilities you mark available.
4. For writes, return an authoritative result/receipt. Never return success before the backend state change is durable according to your own system.
5. Map internal provider objects to Minilab response models at the adapter boundary.
6. Keep provider-specific IDs and schema names as metadata where useful, not as replacements for Minilab's product vocabulary.

## Capability handshake example

```json
{
  "platform_contract": "minilab.platform.contract.v1",
  "provider": {
    "id": "example-provider",
    "name": "Example Provider",
    "version": "1.0.0"
  },
  "capabilities": {
    "machines.read": { "status": "available" },
    "machines.protected_action": { "status": "degraded", "detail": "read-only maintenance window" },
    "sensors.read": { "status": "unavailable" },
    "registry.list": { "status": "available" },
    "registry.admit": { "status": "available" }
  },
  "registry_types": {
    "machine": { "status": "available" },
    "runtime": { "status": "available" },
    "sensor": { "status": "unavailable" }
  }
}
```

The Sensors menu item still exists in this example. It renders the provider limitation instead of disappearing.

## Registry adapter

The platform endpoints are:

```text
GET  /api/registry/entities
GET  /api/registry/entities/:id
GET  /api/registry/entities/:id/versions
POST /api/registry/admissions
```

The backend may use SQL, event sourcing, content addressing, files, a graph database, or another Registry internally. The adapter must expose the Minilab semantics without creating a second source of truth.

## Development

Point the UI at an adapter:

```bash
MINILAB_PROVIDER_URL=http://127.0.0.1:8788 npm run dev
```

Vite forwards `/api/*` to that provider.
