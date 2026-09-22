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

The Node requirement and dependency contracts are declared in [`package.json`](package.json). Shared dependency ranges are maintained in the catalog in [`pnpm-workspace.yaml`](https://github.com/happydesigns/id/blob/main/pnpm-workspace.yaml). The optional guide uses the Docus development dependency; [`pnpm-lock.yaml`](https://github.com/happydesigns/id/blob/main/pnpm-lock.yaml) records the exact tested versions.

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

Open `/studio`. Register the project's brand source and optional route previews as described in the [Studio guide](https://id.happydesigns.de/guides/brand-studio).

### Existing integrations

The identity runtime remains supported through the Nuxt layer or configurable module. See [Installation](https://id.happydesigns.de/getting-started/installation) for both options and the separate optional Guide integration. New projects use native brand exports; compatibility exports explicitly select `legacyRuntime: true`.

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

- [Studio and template integration](https://id.happydesigns.de/guides/brand-studio)
- [Public API](https://id.happydesigns.de/reference/api)
- [Architecture and repository layout](https://github.com/happydesigns/id/blob/main/ARCHITECTURE.md)
- [Contribution and verification](https://github.com/happydesigns/id/blob/main/CONTRIBUTING.md)
- [Security boundaries](https://github.com/happydesigns/id/blob/main/SECURITY.md)
- [Release workflow](https://github.com/happydesigns/id/blob/main/RELEASING.md)
