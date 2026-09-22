# @happydesigns/id

Brand authoring, previews and reusable brand layers for Nuxt UI. Nuxt UI is the supported design system.

`@happydesigns/id` is an optional authoring and verification tool for reusable native Nuxt UI brand layers. Applications use Nuxt UI and their brand layer; Studio helps edit the brand and check its appearance without becoming an application runtime requirement.

## Product contract

Applications depend on Nuxt UI components, semantic roles and stable brand asset roles. A brand supplies their appearance. Change the shared brand source and regenerate its native layer to update compatible applications without rewriting their features. Applications must adopt the new brand version and rebuild or redeploy; ID is not a remote theme distribution service.

The supported path is Studio source → generated native brand → consuming Nuxt applications. Studio and the guide are optional authoring tools. ID does not guarantee artistic quality or automatically theme hardcoded application colors, custom third-party widgets or unavailable fonts.

## What it provides

- Studio for editing, comparing and exporting brands.
- Native Nuxt UI layers generated from a validated brand source.
- Optional capability previews and Docus guide components.
- Compatible identity-runtime helpers for existing applications.

## Compatibility

The Node requirement and dependency contracts are declared in [`package.json`](package.json). Shared dependency ranges are maintained in the catalog in [`pnpm-workspace.yaml`](pnpm-workspace.yaml). The optional guide uses the Docus development dependency; [`pnpm-lock.yaml`](pnpm-lock.yaml) records the exact tested versions.

CI checks the locked dependency set on Linux, plus package types and source operations on the minimum supported Node release and Windows. Isolated package consumers resolve their own dependencies. Newer major versions are not implicitly supported.

## Install

For a new brand, use Studio and download **New project**. The project contains a standard Nuxt UI layer and a Studio playground. Select **Include Docus guide** only when the project also needs documentation. Consumers extend the generated brand; `id` is only an authoring dependency.

To add Studio to an existing Nuxt UI project:

```bash
pnpm add -D @happydesigns/id
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@happydesigns/id/studio']
})
```

Open `/studio`. Register the project's brand source and optional route previews as described in the [Studio guide](docs/content/3.guides/6.brand-studio.md).

### Existing identity runtime

The identity module and runtime helpers remain supported for projects that already use them:

```bash
pnpm add @happydesigns/id tailwindcss
```

Use the Nuxt layer when a brand repository wants the default identity runtime:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@happydesigns/id/nuxt']
})
```

Use the module when a project wants explicit module options:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@happydesigns/id/module'],
  id: {
    name: 'client',
    componentPrefix: 'Id'
  }
})
```

The layer export uses the standard `Id` component prefix. The module can register the same runtime components under another global prefix when a host app needs to avoid naming collisions.

Brand guides add the guide helpers separately so ordinary applications do not inherit documentation-only components:

```ts [docs/nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@example/brand', '@happydesigns/id/guide', 'docus']
})
```

`@happydesigns/id/guide` is an add-on to an existing identity runtime or brand layer. It does not select a brand or configure a theme by itself.

## Development commands

```bash
pnpm install
pnpm prepare
pnpm build:package
pnpm dev
pnpm docs
pnpm verify
```

`pnpm dev` opens Studio through the playground root. Its searchable brand picker combines configured brands, browser drafts and the protected Nuxt UI baseline. The old `/runtime` URL redirects to Studio; runtime and adapter contracts remain covered by automated tests. `pnpm docs` starts the Docus documentation.

`pnpm build:package` creates the publishable `dist/` package output and copies the Nuxt layer runtime files used by the package exports.

## Documentation

Product documentation lives in `docs/` and is built with Docus.

```bash
pnpm docs:build
```

## Scope

`id` owns reusable identity contracts and application mechanics. It does not own a specific brand expression, product domain behavior, authorization, storage, API contracts, runtime credentials, or customer-specific copy.

## Reference

- [Studio and template integration](docs/content/3.guides/6.brand-studio.md)
- [Public API](docs/content/4.reference/1.api.md)
- [Architecture and repository layout](ARCHITECTURE.md)
- [Contribution and verification](CONTRIBUTING.md)
- [Security boundaries](SECURITY.md)
- [Release workflow](RELEASING.md)

Studio's default export is a native brand with a minimal Studio playground. Docus is an explicit extension (`guide: true`). Existing identity-runtime projects remain supported (`legacyRuntime: true`). The examples under `templates/` cover compatibility and integration; use Studio's New project export for a new brand.
