# API

The [public API reference](docs/content/4.reference/1.api.md) owns exported values and usage examples. Its completeness is checked against `src/index.ts`.

The [Studio guide](docs/content/3.guides/6.brand-studio.md) owns host configuration, route previews, source updates and export options. Type declarations in `src/` are authoritative for exact signatures.

Native brands are the default output. Existing identity-runtime exports remain supported; `legacyRuntime: true` explicitly selects that project format. Docus is opt-in through `guide: true`.

See [Architecture](ARCHITECTURE.md) for dependency boundaries and compatibility policy, and [Security](SECURITY.md) for source and asset validation.
