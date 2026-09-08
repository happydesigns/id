# @happydesigns/id

Brand authoring, previews and reusable brand layers for Nuxt UI. Nuxt UI is the supported design system.

`@happydesigns/id` defines how a brand is described, validated, documented, and applied to Nuxt UI projects. It is the reusable identity mechanism between Nuxt UI apps and concrete brand layers such as `@happydesigns/brand`.

## What it provides

- A neutral typed brand definition plus a small public adapter contract.
- An official Nuxt UI adapter and a generic CSS-variable reference adapter.
- Separate brand-guide and primary brand-theme contracts.
- A neutral Nuxt UI baseline through `nuxtUiBrandTheme` and `idBrandGuide`.
- Explicit theme exports for `@happydesigns/id/themes/nuxt-ui` and the neutral `@happydesigns/id/themes/sample-brand` reference theme.
- Validation helpers for brand metadata, palettes, semantic roles, logos, voice, component coverage, and usage limits.
- CSS variable generation for light and dark themes.
- Nuxt UI app-config helpers for `ui.colors` and component defaults.
- A consumer-safe Nuxt layer and module for applying identity runtime behavior.
- An optional guide layer for docs links, example frames, reusable Nuxt UI component examples, install snippets, swatches, and component coverage.
- Starters for brand layers and themed apps.
- Docus documentation for brand-guide authors and Nuxt developers.

## Install

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

## Branding model

`id` supports a brand-layer-first model:

- A neutral brand definition stores named colors, optional free roles, freely named typography roles, and structured runtime assets once. `sans`, `mono`, and `display` are useful typography conventions, not a closed vocabulary.
- Nuxt UI mappings turn those values into component defaults and theme variables. Existing adapter helpers remain compatible utilities; additional design-system runtimes and editors are outside the supported product.
- Build-time brand layers for full app transformation: assets, layouts, app shell, custom components, CSS, metadata, docs styling, and Nuxt UI defaults.
- A primary `id.theme` in `app.config.ts` for public token data, Nuxt UI mappings, validation, previews, and generated CSS variables.
- A reusable brand source file such as `brand.ts` for package-owned identity data, with theme and guide exports wired into Nuxt through `app.config.ts`.
- Optional runtime theme lists for fast switching: CSS variables, semantic color mappings, typography variables, and Nuxt UI app-config defaults.

The included baseline intentionally stays close to standard Nuxt UI. Brand repositories build on top of it instead of starting from unrelated demo themes. The sample brand theme demonstrates the reusable contracts without carrying doctrine from a real brand; `@happydesigns/brand` owns the final public happydesigns guide, assets, logo doctrine, palette meaning, and voice.

Runtime themes are intentionally lightweight. They do not load arbitrary remote Vue components, uncompiled Tailwind classes, domain behavior, credentials, APIs, or server runtime changes.

Nuxt UI keeps its normal color-mode behavior. A brand may provide targeted dark CSS-variable overrides, but `id` does not require, generate, or force a separate dark theme.

Normal apps use the runtime-only `BrandRuntimeOnlyConfig`. Guide applications add `BrandGuideConfig` through `BrandGuideAppConfig`; the existing `BrandRuntimeConfig` name remains a compatibility alias for that combined shape.

## Development

## Brand Studio

Extend `@happydesigns/id/studio` in a guide or playground to add `/studio`. Create a brand, open a versioned JSON source, compare original and draft on shared Components, Landing and Docs scenes, then export the source or a starter archive. The runtime layer never includes Studio. See `docs/content/3.guides/6.brand-studio.md` for source, asset and export contracts.

## Development commands

```bash
pnpm install
pnpm prepare
pnpm build:package
pnpm dev
pnpm docs
pnpm verify
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
