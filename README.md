# @happydesigns/id

Brand authoring, previews and reusable brand layers for Nuxt UI. Nuxt UI is the supported design system.

`@happydesigns/id` defines how a brand is described, validated, documented, and applied to Nuxt UI projects. It is the reusable identity mechanism between Nuxt UI apps and concrete brand layers such as `@happydesigns/brand`.

## Product contract

Applications depend on Nuxt UI components, semantic roles and stable brand asset roles. A brand supplies their appearance. Change the shared brand source and regenerate its native layer to update compatible applications without rewriting their features. Applications must adopt the new brand version and rebuild or redeploy; ID is not a remote theme distribution service.

The supported path is Studio source → generated native brand → consuming Nuxt applications. Studio and the guide are optional authoring tools. ID does not guarantee artistic quality or automatically theme hardcoded application colors, custom third-party widgets or unavailable fonts.

## What it provides

- A visual Studio for brand projects, with shared component scenarios, Landing and optional capability templates.
- Native Nuxt UI exports: CSS, app config and assets; consumers do not need the editor runtime.
- Reviewed local source updates in development, plus portable JSON and project downloads.
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

## Branding model

`id` supports a brand-layer-first model:

- A neutral brand definition stores named colors, optional free roles, freely named typography roles, and structured runtime assets once. `sans`, `mono`, and `display` are useful typography conventions, not a closed vocabulary.
- Nuxt UI mappings turn those values into component defaults and theme variables. Existing adapter helpers remain compatible utilities; additional design-system runtimes and editors are outside the supported product.
- Build-time brand layers for full app transformation: assets, layouts, app shell, custom components, CSS, metadata, docs styling, and Nuxt UI defaults.
- For existing identity-runtime integrations, a primary `id.theme` in `app.config.ts` for public token data, Nuxt UI mappings, validation, previews, and generated CSS variables.
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

`pnpm dev` opens Studio through the playground root. Its searchable brand picker combines configured brands, browser drafts and the protected Nuxt UI baseline. The old `/runtime` URL redirects to Studio; runtime and adapter contracts remain covered by automated tests. `pnpm docs` starts the Docus documentation.

`pnpm build:package` creates the publishable `dist/` package output and copies the Nuxt layer runtime files used by the package exports.

## Documentation

Product documentation lives in `docs/` and is built with Docus.

```bash
pnpm docs:build
```

## Scope

`id` owns reusable identity contracts and application mechanics. It does not own a specific brand expression, product domain behavior, authorization, storage, API contracts, runtime credentials, or customer-specific copy.

### Capability-owned Studio templates

The Studio supports an optional host catalog in `appConfig.idStudio.templates`.
Capabilities keep their name and runtime ownership; **Templates** is the Studio's
presentation of complete example applications. Landing is included. Docs uses the host’s real Docus routes, registered with `route` and `routePrefix`; it has no duplicated page implementation.

A capability may publish an opt-in Nuxt layer that registers an async global
component, its fixtures and this catalog entry:

```ts
export default defineAppConfig({
  idStudio: {
    templates: {
      course: {
        label: 'Course',
        description: 'A complete learning scenario.',
        owner: '@happydesigns/course-nuxt',
        component: 'CourseAcademyPreview',
        pages: [{ id: 'home', label: 'Home' }, { id: 'lesson', label: 'Lesson' }]
      }
    }
  }
})
```

The component receives `document` (the validated brand), `mode` and `page`, and
emits `navigate(pageId)` for an internal page change. The host validates IDs against
its catalog and synchronizes page selection between isolated original/draft frames.
The component must use semantic theme tokens, keep demo data and progress local,
and expose no real service mutations. Register it globally with Nuxt's async
component registration so its implementation loads only when selected.

Catalog configuration is trusted application code, never executable data from an
imported brand document. Templates are previews: selecting one does not install a
capability into the exported brand project. Add a capability explicitly when building
that application. The Studio has no dependency on Course or another capability.
The capability playground should consume the exact same component and fixtures;
maintain one scenario, not separate Studio and playground implementations.

Studio exports native Nuxt UI layers whose consumers do not need the id runtime. Extend the layer for app config/components and import its public `styles.css` fragment after Tailwind and Nuxt UI in the application's CSS entry. New native layers do not auto-register CSS. Docus hosts import the fragment through `app/app.css`; Docus owns the framework entry. Legacy runtime exports retain their existing contract and require an explicit migration. The handwritten brand-layer starter uses the same native runtime boundary. A local authoring host may opt into one fixed JSON source through private `runtimeConfig.idStudioSource`; only the development server offers reviewed, revision-checked Apply. See [Brand Studio](docs/content/3.guides/6.brand-studio.md) for route previews, generation and export compatibility.

## Optional documentation

Studio is the default authoring surface. Docus is an explicit host extension, not a requirement for Studio, templates or generated brand consumers. Existing guides keep using the separate `@happydesigns/id/guide` layer alongside `docus`. The project generator accepts `{ guide: true }` for that opt-in; its default output contains no Docus dependency or documentation routes.
