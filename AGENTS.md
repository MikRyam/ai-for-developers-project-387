# Booking Service API — TypeSpec

## Commands

```bash
npm run compile        # tsp compile . → api/openapi.yaml
```

## Project structure

| Path | Purpose |
|---|---|
| `main.tsp` | Entry point: `@service`, `@versioned`, imports |
| `src/models.tsp` | `Uuid`, `EventType`, `Slot`, `Booking`, `*Create`, `ErrorResponse` |
| `src/event-types.tsp` | `interface EventTypes` (4 endpoints) |
| `src/bookings.tsp` | `interface Bookings` (2 endpoints) |
| `tspconfig.yaml` | Emitter: `@typespec/openapi3` → `api/openapi.yaml` |

## Key conventions

- **Output path**: configured via `emitter-output-dir` under emitter options (NOT top-level `output-dir`). File lands directly in `api/openapi.yaml`, no intermediate subfolder.
- **Namespace**: each source file declares `namespace BookingService;` (blockless) to merge into the service namespace. `main.tsp` uses a block namespace (`namespace BookingService { ... }`).
- **Versioning**: `@versioned(ServiceVersions)` on namespace + `enum ServiceVersions { v1_0_0: "1.0.0" }` inside the block. Requires `@typespec/versioning`.
- **Uuid scalar**: defined as `scalar Uuid extends string` with `@format("uuid")`. Used in models and path params. In generated OpenAPI it appears as a separate `$ref` schema, not inline.
- **`@error`**: `ErrorResponse` is decorated with `@error` so OpenAPI treats it as an error schema.
- **Response unions**: `createBooking` returns `{201, Booking} | {409, ErrorResponse}` — union of explicit status code + body models.
- **`@body`** is NOT used on request body parameters — spread the model directly (`...EventTypeCreate`).
- **`@format("uuid")`** is on the scalar definition only; individual model fields use `Uuid` type directly.
- **Build artifacts**: `tsp-output/` and `.tsp-cache/` are gitignored.

## Contract usage rules

- `api/openapi.yaml` is the single source of truth for both frontend and backend. It is generated, never edit it by hand.
- To change the contract: edit the `.tsp` files in `src/`, then run `npm run compile` to regenerate `api/openapi.yaml`.
- Frontend and backend are implemented as separate, independent parts based solely on `api/openapi.yaml` — do not read or depend on each other's implementation code.
- If a contract change is needed while implementing frontend or backend, stop and update the `.tsp` source first, regenerate, then continue implementation against the updated contract.
