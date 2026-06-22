# @happydesigns/id

Reusable identity system for brand guides, Nuxt UI defaults, and Nuxt brand layers.

`@happydesigns/id` defines how a brand is described, validated, documented, and applied to Nuxt projects. It is the reusable identity mechanism between `@happydesigns/ui` and concrete brand layers such as `@happydesigns/brand`.

## What it provides

- Typed brand-guide and primary brand-theme contracts.
- Validation helpers for brand metadata, palettes, semantic roles, logos, voice, component coverage, and usage limits.
- CSS variable generation for light and dark themes.
- Nuxt UI app-config helpers for semantic colors and component defaults.
- A Nuxt layer and module for applying identity runtime behavior.
- Starter templates for brand layers and themed apps.
- Docus documentation for brand-guide authors and Nuxt developers.

## Install

```bash
pnpm add @happydesigns/id
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
    name: 'client'
  }
})
```

## Branding model

`id` supports a brand-layer-first model:

- Build-time brand layers for full app transformation: assets, layouts, app shell, custom components, CSS, metadata, docs styling, and Nuxt UI defaults.
- A primary `id.theme` in `app.config.ts` for public token data, Nuxt UI mappings, validation, previews, and generated CSS variables.
- Optional runtime theme lists for fast switching: CSS variables, semantic color mappings, typography variables, and Nuxt UI app-config defaults.

Runtime themes are intentionally lightweight. They do not load arbitrary remote Vue components, uncompiled Tailwind classes, domain behavior, credentials, APIs, or server runtime changes.

## Development

```bash
pnpm install
pnpm prepare
pnpm dev
pnpm docs
pnpm test
pnpm typecheck
pnpm lint
```

`pnpm dev` starts the playground app. `pnpm docs` starts the Docus documentation.

## Documentation

Product documentation lives in `docs/` and is built with Docus.

```bash
pnpm docs:build
```

## Scope

`id` owns reusable identity contracts and application mechanics. It does not own a specific brand expression, product domain behavior, authorization, storage, API contracts, runtime credentials, or customer-specific copy.
