# Architecture

This file defines the technical structure for `@happydesigns/id`: contracts, runtime theming, Nuxt integration, templates, and documentation.

## Principles

- Keep identity contracts portable TypeScript.
- Keep brand expression separate from the reusable identity mechanism.
- Use Nuxt UI semantic roles and CSS variables as the default theming surface.
- Use Nuxt layers for complete brand transformation.
- Treat one primary brand theme as the public app-config contract for a brand layer.
- Use runtime theme lists only for values that can change without recompiling UI.
- Keep domain behavior outside identity layers.

## Layer Model

| Layer | Owns | Avoid putting here |
| --- | --- | --- |
| `src/` | Brand-guide types, validation, CSS variable generation, app-config helpers, brand-theme utilities. | Vue component state, routing, assets, app-specific copy. |
| `app/` | Reusable Nuxt layer runtime, composables, plugin, neutral CSS defaults, identity UI helpers. | Concrete customer assets, domain behavior, server APIs. |
| `module.ts` | Optional Nuxt module integration, module options, runtime registration. | Brand-specific visual decisions. |
| `templates/` | Starter projects for brand layers and themed apps. | Generated project state or private credentials. |
| `playground/` | Visual QA for runtime themes and layer behavior. | Product documentation source of truth. |
| `docs/` | Docus documentation for identity concepts and usage. | Source-derived implementation facts that should be generated or tested. |

## Branding Application

Use the smallest branding mechanism that fits the required change.

Full brand layers are the default for deployable branded products. They can own assets, layout wrappers, app metadata, public files, Nuxt UI defaults, CSS, docs styling, and brand primitives.

Each brand layer should expose one primary `id.theme` through `app.config.ts`. Runtime theme lists are for switching visual roles without rebuild overhead. They can own CSS variables, Nuxt UI semantic color mappings, typography variables, and component default variants that use stable compiled classes.

## Runtime Limits

Runtime themes cannot guarantee:

- arbitrary raw Tailwind classes that were not compiled
- hardcoded local colors inside app components
- third-party UI that does not use Nuxt UI or shared CSS variables
- custom Vue components that are not already bundled
- logos or fonts that were not shipped or configured
- server behavior, APIs, credentials, authorization, or domain rules

## Dependency Direction

Reusable contract code in `src/` must not import from Nuxt, Vue, Docus, playground code, docs code, or concrete brand layers.

Nuxt runtime code in `app/` may import from `src/`, but not from `docs/`, `playground/`, or templates.

Docs and playground may import from the package to demonstrate real usage.

## Source of Truth

- TypeScript source owns exact runtime behavior and public API shapes.
- Root docs own durable architecture, contribution, security, design, and API rules.
- Docus docs own product usage guidance.
- Templates own recommended starting files, not every possible project shape.
