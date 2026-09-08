# Architecture

This file defines the technical structure for `@happydesigns/id`: Nuxt UI brand-guide contracts, runtime theming, Nuxt integration, starters, and documentation.

## Principles

- Keep identity contracts portable TypeScript.
- Keep neutral brand data separate from target-system adapters.
- Keep brand expression separate from the reusable identity mechanism.
- Use Nuxt UI semantic roles and CSS variables as the default theming surface.
- Use Nuxt layers for complete brand transformation.
- Treat one primary brand theme as the public app-config contract for a brand layer.
- Use runtime theme lists only for values that can change without recompiling UI.
- Keep domain behavior outside identity layers.

## Layer Model

| Layer | Owns | Avoid putting here |
| --- | --- | --- |
| `src/` | Neutral brand definitions, adapter contracts, brand-guide types, validation, CSS generation, app-config helpers, brand-theme utilities. | Vue component state, routing, assets, app-specific copy. |
| `app/` | Consumer-safe Nuxt layer runtime, composables, plugin, neutral CSS defaults, and runtime identity helpers. | Guide-only examples, concrete customer assets, domain behavior, server APIs. |
| `guide/` | Optional brand-guide components such as example frames, coverage tables, install surfaces, and docs links. | Runtime requirements, brand doctrine, customer copy, or product behavior. |
| `module.ts` | Optional Nuxt module integration, module options, runtime registration. | Brand-specific visual decisions. |
| `nuxt.layer.config.ts` | Public runtime layer export for consumers extending `@happydesigns/id/nuxt`. | Guide-only components and repository tooling such as lint modules. |
| `guide/nuxt.config.ts` | Optional guide add-on for documentation applications extending `@happydesigns/id/guide`. | Theme selection, concrete guide content, or production app behavior. |
| `nuxt.config.ts` | Development config for this repository, importing the public layer and adding local tooling. | Public layer behavior. |
| `themes/` | Shipped reference themes such as the Nuxt UI baseline and a neutral sample brand demonstration theme. | Canonical brand doctrine, product-specific behavior, or private customer configuration. |
| `templates/` | Starter projects for brand layers and themed apps. | Generated project state or private credentials. |
| `playground/` | Visual QA for runtime themes and layer behavior. | Product documentation source of truth. |
| `docs/` | Docus documentation for identity concepts and usage. | Source-derived implementation facts that should be generated or tested. |

## Branding Application

Use the smallest branding mechanism that fits the required change.

Full brand layers are the default for deployable branded products. They can own assets, layout wrappers, app metadata, public files, Nuxt UI defaults, CSS, docs styling, and brand primitives.

Each brand layer should expose one primary `id.theme` through `app.config.ts`. Runtime theme lists are for switching visual roles without rebuild overhead. They can own CSS variables, Nuxt UI semantic color mappings, typography variables, and component default variants that use stable compiled classes.

Reusable brand repositories should keep identity data in a normal source file such as `brand.ts` and wire that data into Nuxt through `app.config.ts`. This keeps Nuxt's app-config model as the integration point without making Nuxt config the only place where a brand guide can be authored, tested, or exported.

The canonical reusable brand repository exposes its public Nuxt layer from the repository and package root. A separate `docs/` Docus app extends that root and owns guide-only app config, pages, prose, and examples. Downstream apps extend the root, never the documentation app. This topology keeps the reference guide useful as an integration consumer without publishing Docus or guide content as runtime branding.

The neutral brand definition owns named colors, optional free-form role aliases, open typography roles, and optional structured runtime assets. `BrandAssets` is independent from guide content. Adapters own target roles and output. `id` maintains the Nuxt UI adapter and a small CSS-variable reference adapter; user adapters remain ordinary TypeScript modules. There is no adapter registry or discovery runtime.

The existing `BrandTheme` contract is the output consumed by the Nuxt runtime. Guide content is optional documentation data, not a required adapter input. Runtime assets can be exposed through `id.assets` without shipping the complete guide.

`BrandRuntimeOnlyConfig` describes the normal app surface. `BrandGuideConfig` adds documentation data, and `BrandGuideAppConfig` combines them for an actual guide app. `BrandRuntimeConfig` remains a compatibility alias for the previously combined public shape.

The runtime layer exports `IdLogo`, `IdThemeSelect`, and `IdColorModeButton` with the `Id` prefix. The module accepts a build-time `componentPrefix` option when an app needs the same runtime helpers under another global prefix. Guide-only helpers are registered by the separate `@happydesigns/id/guide` add-on and are never included by the module or runtime layer.

## Runtime Limits

Runtime themes cannot guarantee:

- arbitrary raw Tailwind classes that were not compiled
- hardcoded local colors inside app components
- third-party UI that does not use Nuxt UI or shared CSS variables
- custom Vue components that are not already bundled
- logos or fonts that were not shipped or configured
- server behavior, APIs, credentials, authorization, or domain rules

## Package Boundary

The npm package publishes built JavaScript and declarations from `dist/` for the TypeScript API, theme subpaths, and Nuxt module. The Nuxt layer export stays as `nuxt.layer.config.ts`, matching Docus-style layer packages where Nuxt loads the layer source directly. Runtime layer files are shipped both as source for the layer and copied into `dist/app` for the built module.

`nuxt.config.ts` is intentionally a repository-development config. It imports the public layer config and can add `@nuxt/eslint` and other local tooling because it is not the `./nuxt` package export. Consumers extending `@happydesigns/id/nuxt` inherit only Nuxt UI, runtime `Id` components, identity CSS, and theme behavior. Guide applications opt into `@happydesigns/id/guide`; Docus-specific CSS generation and markdown highlighting remain owned by Docus.

Consuming apps should set their own `compatibilityDate` in their app config. Nuxt merges the app config on top of extended layers, so an explicit app-level date remains the controlling deployment contract. The layer keeps `compatibilityDate: 'latest'` for local development and starters that intentionally follow current Nuxt behavior.

## Dependency Direction

Reusable contract code in `src/` must not import from Nuxt, Vue, Docus, playground code, docs code, or concrete brand layers.

Nuxt runtime code in `app/` may import from `src/`, but not from `docs/`, `playground/`, or templates.

Docs and playground may import from the package to demonstrate real usage.

## Source of Truth

- TypeScript source owns exact runtime behavior and public API shapes.
- Root docs own durable architecture, contribution, security, design, and API rules.
- Docus docs own product usage guidance.
- Templates own recommended starting files, not every possible project shape.

## Optional authoring surface

`studio/` owns the optional Nuxt UI Brand Studio layer and the shared visual scenes. `src/studio.ts` owns its versioned JSON document, boundary validation, source-preserving diff, CSS and project exports. Studio is opt-in and is not imported by the normal runtime or module. The supported design system is Nuxt UI; the existing adapter exports remain compatible utilities.

Original and draft render in separate same-origin frames. Messages require the parent origin and window identity. The editor never changes its own app config while editing. Local draft storage is scoped to the host brand. Replacing a dirty document requires a user choice; export requires no server storage or repository credentials.

`brand.studio.json` is the editable source. Unknown JSON fields and custom component configuration survive a round trip. The importer accepts data only and rejects executable objects, prototype properties, remote assets and CSS injection. Exported projects regenerate CSS and scan their source for custom classes. Custom components, external fonts and app-specific utilities are not inferred from a token document.
