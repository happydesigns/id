# API

The [public API reference](docs/content/4.reference/1.api.md) owns exported values and usage examples. Its completeness is checked against `src/index.ts`.

The [Studio guide](docs/content/3.guides/6.brand-studio.md) owns host configuration, route previews, source updates and export options. Type declarations in `src/` are authoritative for exact signatures.

Native brands are the default output. Existing identity-runtime exports remain supported; `legacyRuntime: true` explicitly selects that project format. Docus is opt-in through `guide: true`.

See [Architecture](ARCHITECTURE.md) for dependency boundaries and compatibility policy, and [Security](SECURITY.md) for source and asset validation.

## Compatibility commitments

The documented package exports and their exported types form the public API. Files below those entrypoints, Vue component internals and generated file formatting are implementation details. Existing identity-runtime entrypoints remain supported; new projects should use native brand exports.

During 0.x, breaking public API changes require a minor version and upgrade notes. Patches preserve documented behavior and accepted source documents. A stable 1.0 requires a reviewed API surface and evidence from consumer upgrades; a successful build alone is insufficient.

Studio document version 1 remains readable throughout compatible releases. Unknown safe metadata is preserved. An unknown document version is rejected before saving. A future format change must provide an explicit migration, fixtures for previous versions and upgrade instructions; it must not silently rewrite the user's source.
