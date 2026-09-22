# Architecture

This file defines the technical structure for `@happydesigns/id`: optional brand authoring and verification, native Nuxt layer generation, and the existing compatibility integrations.

## Native branding roadmap

The target workflow is: edit a brand, verify it in applications, generate a native Nuxt layer, then update each consuming application deliberately. Nuxt UI owns components and styling mechanisms; Nuxt owns layer composition. ID provides optional authoring and verification. Its editor should be replaceable by an upstream implementation without changing project storage or generated brands.

Track the agreed six steps here. A release is a baseline, not completion of this roadmap.

| Step | Outcome | Status |
| --- | --- | --- |
| 1. Responsibilities | Identify required authoring, optional extensions and compatibility code. | Complete. Ownership is defined below. |
| 2. Independent native output | Preserve user code and prove deterministic generation and standalone consumption. | Existing two-brand consumer coverage; complete source-ownership audit pending. |
| 3. Replaceable editor | Separate theme controls from project lifecycle and demonstrate an alternative editor. | Complete. Controlled theme editor and alternative-editor browser proof. |
| 4. Independent app preview | Connect separately running apps through an explicit development integration. | Planned. Current bridge is same-origin only. |
| 5. Full workflow proof | Two different apps with two brands, from draft through native builds. | Planned. Current consumer check uses identical app source. |
| 6. Reduction and upstream proposal | Remove proven redundancy and prepare a minimal contribution backed by the workflow. | Planned after the proof. |

The v0.2.1 release is the baseline for this work. Keep one versioned package; split packages only when independent usage justifies it.

### Ownership

| Responsibility | Owner |
| --- | --- |
| Components, semantic styling and native theme configuration | Nuxt UI; ID controls use those existing mechanisms. |
| Theme editing controls | Optional, replaceable Studio editor. Receives state and proposes changes; owns only transient control state. |
| Brand metadata and assets, validation, history, storage, source writes and export | Studio project host. Owns the complete document and accepts or rejects proposed edits. |
| Native output generation | Pure generation functions, shared by export and regeneration. No editor or Guide dependency. |
| App rendering, routes, content and functional states | The consuming app. The preview bridge only applies a temporary draft. |
| Technical references and editorial documentation | Optional Guide/Docus integration. No renderer types in the brand contract. |
| Existing identity runtime, adapter utilities and runtime theme selection | Compatibility surface. Maintain correctness; new workflow features target native output. |
| Built-in galleries, icon presets and copied preview defaults | Current editor support. Reassess in step 6 rather than expanding a parallel design system. |

### Editor boundary

BrandStudio owns the project and the editor panel. Brand metadata and asset controls remain there. StudioThemeEditor receives the current document, baseline, category, mode, field errors and optional measured contrast. It clones the input and emits a proposed document; only the host validates, records history and updates the authoritative draft. The existing version-1 document remains unchanged, including fields unknown to the controls.

The internal editor slot permits a host to supply different theme controls through the same change and error handlers. It is an extraction boundary, not a promised upstream API or a new portable theme schema. Preview, persistence and export observe the accepted draft and do not depend on the concrete editor. Palette dialogs and their transient state belong to the default editor; their open state informs panel dismissal. `tests/browser/editor.spec.ts` exercises a replacement editor through validation, draft/original previews, undo/redo, persistence and JSON export in both color modes, preserving unknown document fields. It also checks default palette editing and focus restoration at mobile and desktop widths.

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
| `guide/app/` | Optional brand-guide components such as example frames, coverage tables, install surfaces, and docs links. | Runtime requirements, brand doctrine, customer copy, or product behavior. |
| `studio/app/` | Optional Studio pages, components, composables and preview plugin, using Nuxt directory conventions. | Separate package versions or a second application runtime. |
| `module.ts` | Optional Nuxt module integration, module options, runtime registration. | Brand-specific visual decisions. |
| `nuxt.layer.config.mjs` | Public runtime layer export for consumers extending `@happydesigns/id/nuxt`. | Guide-only components and repository tooling such as lint modules. |
| `guide/nuxt.config.mjs` | Optional guide add-on for documentation applications extending `@happydesigns/id/guide`. | Theme selection, concrete guide content, or production app behavior. |
| `nuxt.config.ts` | Development config for this repository, importing the public layer and adding local tooling. | Public layer behavior. |
| `themes/` | Shipped reference themes such as the Nuxt UI baseline and a neutral sample brand demonstration theme. | Canonical brand doctrine, product-specific behavior, or private customer configuration. |
| `templates/` | Starter projects for brand layers and themed apps. | Generated project state or private credentials. |
| `playground/` | Visual QA for runtime themes and layer behavior. | Product documentation source of truth. |
| `docs/` | Docus documentation for identity concepts and usage. | Source-derived implementation facts that should be generated or tested. |

## Branding Application

Use the smallest branding mechanism that fits the required change.

Full brand layers are the default for deployable branded products. They can own assets, layout wrappers, app metadata, public files, Nuxt UI defaults, CSS, docs styling, and brand primitives.

New brand layers expose native `ui` app config, assets and an explicit `styles.css` fragment. The root never imports ID helpers at runtime or auto-registers framework CSS. Consumers import the fragment after Tailwind/Nuxt UI; Docus imports it through `app/app.css`. Guide and Studio remain optional authoring dependencies. Existing identity-runtime layers may expose one primary `id.theme` through `app.config.ts`. Runtime theme lists are for switching visual roles without rebuild overhead. They can own CSS variables, Nuxt UI semantic color mappings, typography variables, and component default variants that use stable compiled classes.

Reusable brand repositories should keep identity data in a normal source file such as `brand.ts` and wire that data into Nuxt through `app.config.ts`. This keeps Nuxt's app-config model as the integration point without making Nuxt config the only place where a brand guide can be authored, tested, or exported.

The canonical reusable brand repository exposes its public Nuxt layer from the repository and package root. An optional separate `docs/` Docus app extends that root and owns guide-only app config, pages, prose, and examples. Studio is the minimal authoring host. Downstream apps extend the root, never the documentation app. This topology keeps the reference guide useful as an integration consumer without publishing Docus or guide content as runtime branding.

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

The npm package publishes built JavaScript and declarations from `dist/` for the TypeScript API, theme subpaths, and Nuxt module. The Nuxt layer export stays as `nuxt.layer.config.mjs`, matching Docus-style layer packages where Nuxt loads the layer source directly. Runtime layer files are shipped both as source for the layer and copied into `dist/app` for the built module.

`nuxt.config.ts` is intentionally a repository-development config. It imports the public layer config and can add `@nuxt/eslint` and other local tooling because it is not the `./nuxt` package export. Consumers extending `@happydesigns/id/nuxt` inherit only Nuxt UI, runtime `Id` components, identity CSS, and theme behavior. Guide applications opt into `@happydesigns/id/guide`; Docus-specific CSS generation and markdown highlighting remain owned by Docus.

Consuming apps should set their own `compatibilityDate` in their app config. Nuxt merges the app config on top of extended layers, so an explicit app-level date remains the controlling deployment contract. The layer keeps `compatibilityDate: 'latest'` for local development and starters that intentionally follow current Nuxt behavior.

## Dependency Direction

Reusable contract code in `src/` must not import from Nuxt, Vue, Docus, playground code, docs code, or concrete brand layers.

Nuxt runtime code in `app/` may import from `src/`, but not from `docs/`, `playground/`, or templates.

Docs and playground may import from the package to demonstrate real usage.

## Source of Truth

- TypeScript source owns exact runtime behavior and public API shapes.
- Root docs own durable architecture, contribution, security and design rules. The public API reference lives in docs/content/4.reference/1.api.md; API.md points to it.
- Docus docs own product usage guidance.
- Templates are integration and compatibility examples. Studio project generation owns the recommended new-project shape.

## Optional authoring surface

`studio/` owns the optional Nuxt UI Brand Studio layer and the shared visual scenes. `src/studio.ts` owns its versioned JSON document, boundary validation, source-preserving diff, CSS and project exports. Studio is opt-in and is not imported by the normal runtime or module. The supported design system is Nuxt UI; the existing adapter exports remain compatible utilities.

Original and draft render in separate same-origin frames. Messages require the parent origin and window identity. The editor temporarily previews draft UI defaults in the shell and restores the host configuration when leaving Studio. Local draft storage is scoped to the host brand. Browser-local project recovery preserves drafts during switches; when storage fails, replacing unsaved work requires a user choice. Export requires no server storage or repository credentials.

`brand.studio.json` is the editable source. Unknown JSON fields and custom component configuration survive a round trip. The importer accepts data only and rejects executable objects, prototype properties, remote assets and CSS injection. Exported projects regenerate CSS and scan their source for custom classes. Custom components, external fonts and app-specific utilities are not inferred from a token document.

Studio now generates native runtime CSS, app config and assets through `createStudioRuntimeFiles`. The exported playground contains Studio as a development dependency. Docus, guide components and documentation routes are generated only with the explicit `guide: true` option. Existing runtime consumers and `{ legacyRuntime: true }` exports remain supported. `studio/module.ts` registers the fixed-source writer only during local development; `studio/source.ts` validates and replaces the source after a revision check. Hosts own regeneration of derived artifacts. `studio/app/plugins/preview.client.ts` applies drafts after hydration to real, bounded host routes and preserves consumer UI overrides.

## Validated framework baseline

Generated projects pin shared dependencies to the versions installed for the package build. Their ID dependency follows the package release version. Scaffold manifests use catalog and workspace references, resolved during bundling. Shared ranges belong in the pnpm catalog; the package build derives Nuxt module compatibility from those same declarations. The workspace lockfile is the tested dependency graph; declared compatible ranges are not evidence that every newer combination has passed visual or hydration checks. Guide/Studio integration is tested independently from a native packed-brand consumer. Customer upgrades need their own consuming-app checks. Keep the package together; native runtime output does not require physically splitting the authoring package.

The workspace pins Tiptap's editor family together at 3.30.1 after a mixed core/extension graph failed production bundling. This is an authoring test-workspace constraint, not a new dependency of native brand consumers. The Guide layer preserves Vue's onServerPrefetch registration in production client builds because it delimits useId ranges. The production fixture verifies form and tab associations without ClientOnly, through both MDC and direct Vue.

## Evolution policy

New branding features target the native generation path. The existing identity runtime remains supported for current consumers with correctness and security fixes; it is not a second place to independently develop the editor. The brand-layer example derives its runtime and Studio document from brand.ts through the public generator during package build. Studio-generated projects keep brand.studio.json as their editable source. Both paths use createStudioRuntimeFiles; generated runtime files are never edited separately.

Guide components accept ordinary typed props and slots. Markdown parser trees and renderer lifecycle details must not enter the public brand/document contracts. A future Comark migration belongs to the Guide/Docus integration boundary and must pass the same production hydration, slots, code rendering and accessibility checks. Do not prebuild a generic renderer framework or assume a new parser fixes existing hydration defects.

Studio history is isolated in useStudioHistory. Validation and user-visible errors stay in the editor, and history owns bounded snapshots, undo/redo and project reset. Further extraction should follow tested behavior boundaries rather than file-size targets.

## Build and editor ownership

Published `.mjs` layer entries own their configuration. Local `.ts` entries re-export them so Nuxt discovery and package consumption cannot drift. The package builder compiles portable TypeScript and copies runtime files; source and built runtime copies serve the layer and module entry points respectively.

File-based scaffolds under templates/project own project boilerplate. Package build bundles these files for portable browser/Node use; native generation adds brand runtime data and either a minimal Studio host or the optional Docus overlay. Legacy output has a separate compatibility scaffold under templates/project/legacy. Do not construct new native output by modifying a legacy project.

The Studio component coordinates user actions. `useStudioHistory` owns undo/redo, `useStudioProjects` owns browser project storage, `useStudioFrames` owns iframe identity/loading/recovery, and `studio/export.ts` owns downloading complete projects and assets. Confirmation and user-visible error handling remain at the UI boundary.

`.nuxt`, `.output`, `dist`, caches, logs and browser reports are ignored local artifacts. They are not architecture layers. `scripts/check-native.mjs` validates packed generated brands and a standalone Studio; Playwright owns production browser checks. There is no separate manual guide runner.

## Remaining verification work

The earlier brand-system research is reflected in the native brand exports, source-derived brand references and the two-brand consumer checks. Remaining improvements, in priority order:

- Extend generator regression coverage across complete light/dark outputs and component defaults. Prefer focused assertions; use snapshots where reviewing the whole artifact adds value.
- Add a small visual regression matrix for representative component states. Existing browser checks verify behavior and layout, not screenshot equivalence.
- Derive field-level contract documentation from the schemas if maintaining the API reference starts to drift. Brand-value references already derive from the authoring source.
- Evaluate targeted checks for hardcoded brand colors in reusable examples, with explicit exceptions for palette displays and intentional demonstrations.

DTCG or Style Dictionary integration remains demand-driven, for a concrete design-tool interchange use case. It is not a runtime requirement or a prerequisite for the current product.
