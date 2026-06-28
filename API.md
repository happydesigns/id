# API

This file describes the public API direction for `@happydesigns/id`, the Nuxt UI brand-guide foundation used by brand layers such as `@happydesigns/brand`.

## TypeScript API

The root package exports:

- `defineBrandGuide(guide)`
- `defineBrandIdentity(identity)`
- `defineBrandTheme(theme)`
- `validateBrandGuide(guide)`
- `validateBrandIdentity(identity)`
- `validateBrandTheme(theme)`
- `createThemeCssVars(theme, options?)`
- `createThemeCssDeclarations(theme, mode?)`
- `createNuxtUiAppConfig(theme)`
- `createBrandAsset(entry)`
- `createBrandLogoSet(entries)`
- `createBrandGuideAssets(entries)`
- `collectBrandAssets(guide)`
- `selectBrandAsset(entries, selection?)`
- `normalizeBrandThemes(themes?)`
- `resolveBrandThemes(config?)`
- `parseDocsLinks(input?)`
- `createLayerInstallSnippets(options)`
- `defineGuideSections(sections)`
- `normalizeGuideSections(sections?)`
- `createGuideDocsSections(sections?, options?)`
- `createGuideSectionPath(section, options?)`
- `findGuideSection(sections?, slug)`
- `normalizeComponentCoverage(items?)`
- `summarizeComponentCoverage(items?)`
- `applyBrandTheme(theme, options?)`
- `createBrandThemeCookieName(appName?)`
- `createBrandThemeStateKey(appName?)`
- `brandThemeCookiePrefix`
- `brandThemeStatePrefix`
- `brandThemeStyleElementId`
- `nuxtUiBrandTheme`
- `idBrandGuide`
- brand-guide and brand-theme types

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

`id.guide.assets.logos` is an open role map. `logo`, `wordmark`, `symbol`, `mark`, `appIcon`, `wordmarkInverse`, and `symbolInverse` are useful conventions, not requirements. `IdLogo` follows the active color mode by default, and dark-media fallback prefers the inverse roles before the light-surface roles. Concrete brand layers can define roles such as `crest`, `signature`, `seal`, or `partner-lockup` and either render them through `IdLogo role="..."`, use `useBrandAssets()`, or provide their own brand-specific component.

## Stability

The TypeScript API is intended to be stable within minor releases. Template file structures may evolve as recommended project structure improves.
