# @happydesigns/id

Reusable identity system for Nuxt UI brand guides, Nuxt UI defaults, and Nuxt brand layers.

`@happydesigns/id` defines how a brand is described, validated, documented, and applied to Nuxt UI projects. It is the reusable identity mechanism between Nuxt UI apps and concrete brand layers such as `@happydesigns/brand`.

## What it provides

- Typed brand-guide and primary brand-theme contracts.
- A neutral Nuxt UI baseline through `nuxtUiBrandTheme` and `idBrandGuide`.
- Explicit theme exports for `@happydesigns/id/themes/nuxt-ui` and the local `@happydesigns/id/themes/happydesigns` demonstration theme.
- Validation helpers for brand metadata, palettes, semantic roles, logos, voice, component coverage, and usage limits.
- CSS variable generation for light and dark themes.
- Nuxt UI app-config helpers for `ui.colors` and component defaults.
- A Nuxt layer and module for applying identity runtime behavior.
- Brand-guide helper components for docs links, example frames, install snippets, and component coverage.
- Starters for brand layers and themed apps.
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
    name: 'client',
    componentPrefix: 'Id'
  }
})
```

The layer export uses the standard `Id` component prefix. The module can register the same runtime components under another global prefix when a host app needs to avoid naming collisions.

## Branding model

`id` supports a brand-layer-first model:

- Build-time brand layers for full app transformation: assets, layouts, app shell, custom components, CSS, metadata, docs styling, and Nuxt UI defaults.
- A primary `id.theme` in `app.config.ts` for public token data, Nuxt UI mappings, validation, previews, and generated CSS variables.
- A reusable brand source file such as `brand.ts` for package-owned identity data that is then wired into Nuxt through `app.config.ts`.
- Optional runtime theme lists for fast switching: CSS variables, semantic color mappings, typography variables, and Nuxt UI app-config defaults.

The included baseline intentionally stays close to standard Nuxt UI. Brand repositories build on top of it instead of starting from unrelated demo themes. The local happydesigns theme is a reference for migration work; `@happydesigns/brand` owns the final public happydesigns guide, assets, logo doctrine, palette meaning, and voice.

Runtime themes are intentionally lightweight. They do not load arbitrary remote Vue components, uncompiled Tailwind classes, domain behavior, credentials, APIs, or server runtime changes.

## Development

```bash
pnpm install
pnpm prepare
pnpm build:package
pnpm dev
pnpm docs
pnpm test
pnpm typecheck
pnpm lint
```

`pnpm dev` starts the playground app. `pnpm docs` starts the Docus documentation.

`pnpm build:package` creates the publishable `dist/` package output and copies the Nuxt layer runtime files used by the package exports.

## Documentation

Product documentation lives in `docs/` and is built with Docus.

```bash
pnpm docs:build
```

## Scope

`id` owns reusable identity contracts and application mechanics. It does not own a specific brand expression, product domain behavior, authorization, storage, API contracts, runtime credentials, or customer-specific copy.
