# API

This file describes the public API direction for `@happydesigns/id`, the Nuxt UI brand-guide foundation used by brand layers such as `@happydesigns/brand`.

## TypeScript API

The root package exports:

- `defineBrand`
- `validateBrandDefinition`
- `brandDefinitionSchema`
- `brandAssetsSchema`
- `defineBrandAdapter`
- `nuxtUiAdapter`
- `cssVariablesAdapter`
- `defineBrandGuide`
- `defineBrandIdentity`
- `defineBrandTheme`
- `validateBrandGuide`
- `validateBrandIdentity`
- `validateBrandTheme`
- `BrandValidationError`
- `brandGuideSchema`
- `brandIdentitySchema`
- `brandThemeSchema`
- `createThemeCssVars`
- `createThemeCssDeclarations`
- `applyCssVariables`
- `createNuxtUiAppConfig`
- `createBrandAsset`
- `createBrandLogoSet`
- `createBrandGuideAssets`
- `defaultBrandAssetRoles`
- `collectBrandAssets`
- `selectBrandAsset`
- `normalizeBrandThemes`
- `resolveBrandThemes`
- `resolveBrandThemeName`
- `parseDocsLinks`
- `createLayerInstallSnippets`
- `layerInstallCommands`
- `layerInstallPackageManagers`
- `defineGuideSections`
- `normalizeGuideSections`
- `createGuideDocsSections`
- `createGuideSectionPath`
- `findGuideSection`
- `componentCoverageStatuses`
- `componentCoverageStatusMeta`
- `normalizeComponentCoverage`
- `summarizeComponentCoverage`
- `applyBrandTheme`
- `createBrandThemeCookieName`
- `createBrandThemeStateKey`
- `brandThemeCookiePrefix`
- `brandThemeStatePrefix`
- `brandThemeStyleElementId`
- `nuxtUiBrandTheme`
- `neutralBrandTheme`
- `idBrandGuide`
- brand-guide and brand-theme types

Adapter subpaths make target ownership explicit:

- `@happydesigns/id/adapters/nuxt-ui`
- `@happydesigns/id/adapters/css-variables`

`BrandTheme` remains the runtime output consumed by the Nuxt integration. `BrandDefinition` is the recommended neutral source for named colors, optional structured `BrandAssets`, free color roles, and open typography roles. `sans`, `mono`, and `display` provide editor suggestions; brands may add roles such as `editorial` or `numeric`. An adapter maps the definition to its target output, and custom adapters are normal TypeScript modules that do not require registration. `BrandIdentity` and `defineBrandIdentity()` retain the earlier `logoAssetPaths` shape for compatibility; new definitions should use structured assets instead.

`NuxtUiColorRole` intentionally suggests Nuxt UI's current well-known roles while accepting additional strings. This keeps mappings explicit and forward-compatible when Nuxt UI or an integration adds a role.

Explicit theme package exports:

- `@happydesigns/id/themes/nuxt-ui`
- `@happydesigns/id/themes/sample-brand`
- `@happydesigns/id/themes/sample-brand/tokens.css`

The `nuxt-ui` theme is the standard baseline. The `sample-brand` theme is a neutral local demonstration for these docs; `@happydesigns/brand` owns the canonical happydesigns guide, assets, and doctrine.

## Nuxt Layer

Use the layer when a brand repository wants the default identity runtime:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@happydesigns/id/nuxt']
})
```

The `./nuxt` export points at the public layer config, not the repository's development `nuxt.config.ts`. It intentionally does not include repo-only modules such as `@nuxt/eslint`.

`createLayerInstallSnippets()` returns plain install and `nuxt.config.ts` strings. `IdLayerInstall` renders those strings through Nuxt UI's standard prose code-group and pre components.

The layer also ships small brand-neutral documentation helpers. `IdNuxtUiDocsLink` renders compact links to Nuxt UI documentation from typed link data or the MDC-friendly `Label|url; Label|url` string syntax. `IdExampleFrame` provides the standard example surface for brand-guide demos while keeping the actual example content in the brand layer. `IdLayerInstall` renders a neutral install surface for a brand package and its Nuxt `extends` snippet through Nuxt UI prose components. `IdComponentCoverageTable` renders `id.guide.componentCoverage` without owning the actual brand coverage decisions.

Guide-section helpers such as `defineGuideSections()` and `createGuideDocsSections()` keep section metadata in a brand-owned source file while mapping it to the smaller `id.guide.docs.sections` navigation shape.

## Nuxt Module

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

The default component prefix is `Id`. Set `componentPrefix` only when the host app already owns names such as `IdLogo`, `IdThemeSelect`, or `IdColorModeButton`.

## App Config Contract

Brand layers expose their public identity contract through app config:

```ts [app.config.ts]
export default defineAppConfig({
  id: {
    name: 'client',
    theme: clientTheme
  }
})
```

The runtime reads `id.theme`, applies CSS variables to the document root, and can update Nuxt UI app config with the selected theme. Apps that intentionally ship a runtime picker may also provide `id.themes[]` and `id.defaultTheme`. `createBrandThemeStateKey()` and `createBrandThemeCookieName()` expose the scoped Nuxt state and cookie naming conventions used by `IdThemeSelect`.

Use `BrandRuntimeOnlyConfig` for ordinary runtime configuration, `BrandGuideConfig` for guide-only data, and `BrandGuideAppConfig` when an app deliberately combines both. `BrandRuntimeConfig` remains the backward-compatible name for the combined shape.

`BrandAssets` is independent from `BrandGuide` and may live directly on `BrandDefinition.assets` before being passed to `id.assets`. `id.guide.assets` remains a compatibility fallback for guide applications. `logo`, `wordmark`, `symbol`, `mark`, `appIcon`, `wordmarkInverse`, and `symbolInverse` are useful conventions, not requirements. `IdLogo` follows the active color mode by default, and dark-media fallback prefers the inverse roles before the light-surface roles. Concrete brand layers can define roles such as `crest`, `signature`, `seal`, or `partner-lockup` and either render them through `IdLogo role="..."`, use `useBrandAssets()`, or provide their own brand-specific component.

## Stability

The TypeScript API is intended to be stable within minor releases. Template file structures may evolve as recommended project structure improves.

## Optional Studio API

The @happydesigns/id/studio layer adds /studio and /studio/preview to an authoring application. appConfig.idStudio accepts document, sourcePath and home. It is separate from the consumer runtime.

The @happydesigns/id/studio/core export provides StudioDocument, parseStudioDocument, createStudioDocument, createBlankStudioDocument, diffStudioDocuments, createStudioCss, createStudioRuntimeFiles, createStudioProject and createStudioArchive. A version-1 document contains brand and theme plus preserved JSON metadata. Import validates JSON, CSS-value boundaries and local asset paths; it never evaluates source code. Projects export a runtime layer and an optional playground with tested framework versions.

`createStudioRuntimeFiles(document)` returns generated native app config, CSS and asset metadata. `createStudioProject(document, { bundledPackage?, legacyRuntime?, guide? })` adds a native layer and Studio playground, with Docus available through `guide: true`; `legacyRuntime: true` retains the previous id-runtime export. The route catalog accepts `{ label, owner?, route, routePrefix }` for real host previews alongside the async-component contract. Private `runtimeConfig.idStudioSource` explicitly opts a local development host into a fixed JSON source writer. The browser cannot choose the path.

## Guide messages and authoring host

`componentExampleMessages` exposes the English fallback catalog. `resolveComponentExampleMessage` (`messages, key`) resolves optional `ComponentExampleMessages` overrides per key. Pass `messages` through `IdComponentExample` context. Actions, forms, navigation, data and overlays are covered; other families retain their existing copy contracts. Nuxt UI built-in labels use its own locale configuration. Model values, technical component names and routes are never translated.

`ComponentCoverageLabels` overrides headers and per-status label/description; `resolveComponentCoverageStatus` (`status, labels`) retains colors and missing English values. `caption` and `emptyText` stay separate props.

`StudioHostConfig` types the existing `idStudio` host configuration (also exported from studio/core). It contains document, brands, sourcePath, home, documentation, host, templates and optional packageAsset. It is trusted app configuration, not imported brand data.

Use `IdStudioLink` with an optional translated label inside Docus AppHeaderCTA and AppFooterLeft. It renders a native neutral button only when the Studio route is installed. Docus keeps its header, footer and mobile navigation; customers keep their landingpage. Backlinks use idStudio.home and documentation.

## Project generation options

`createStudioProject(document, { bundledPackage?, legacyRuntime?, guide? })` generates a native Nuxt UI layer and a minimal Studio host by default. `guide: true` adds Docus and the source-derived reference documentation to that authoring host. It does not change the published brand runtime. `legacyRuntime: true` preserves the older runtime project format and takes precedence.
