# API

This file describes the public API direction for `@happydesigns/id`, the Nuxt UI brand-guide foundation used by brand layers such as `@happydesigns/brand`.

## TypeScript API

The root package exports:

- `defineBrandGuide(guide)`
- `defineBrandTheme(theme)`
- `validateBrandGuide(guide)`
- `validateBrandTheme(theme)`
- `createThemeCssVars(theme, options?)`
- `createThemeCssDeclarations(theme, mode?)`
- `createNuxtUiAppConfig(theme)`
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
- `nuxtUiBrandTheme`
- `idBrandGuide`
- brand-guide and brand-theme types

Explicit theme package exports:

- `@happydesigns/id/themes/nuxt-ui`
- `@happydesigns/id/themes/happydesigns`
- `@happydesigns/id/themes/happydesigns/tokens.css`

The `nuxt-ui` theme is the standard baseline. The `happydesigns` theme is a demonstration and migration reference for these docs until the `@happydesigns/brand` package exports the canonical happydesigns contract.

## Nuxt Layer

Use the layer when a brand repository wants the default identity runtime:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@happydesigns/id/nuxt']
})
```

The `./nuxt` export points at the public layer config, not the repository's development `nuxt.config.ts`. It intentionally does not include repo-only modules such as `@nuxt/eslint`.

`createLayerInstallSnippets()` returns plain install and `nuxt.config.ts` strings plus an MDC `::code-group` source string for standard Docus/Nuxt UI prose rendering.

The layer also ships small brand-neutral documentation helpers. `IdNuxtUiDocsLink` renders compact links to Nuxt UI documentation from typed link data or the MDC-friendly `Label|url; Label|url` string syntax. `IdExampleFrame` provides the standard example surface for brand-guide demos while keeping the actual example content in the brand layer. `IdLayerInstall` renders a neutral install surface for a brand package and its Nuxt `extends` snippet through the standard MDC prose pipeline. `IdComponentCoverageTable` renders `id.guide.componentCoverage` without owning the actual brand coverage decisions.

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

The runtime reads `id.theme`, applies CSS variables to the document root, and can update Nuxt UI app config with the selected theme. Apps that intentionally ship a runtime picker may also provide `id.themes[]` and `id.defaultTheme`.

`id.guide.assets.logos` is an open role map. `logo`, `wordmark`, `symbol`, `mark`, and `appIcon` are useful conventions, not requirements. Concrete brand layers can define roles such as `crest`, `signature`, `seal`, or `partner-lockup` and either render them through `IdLogo role="..."`, use `useBrandAssets()`, or provide their own brand-specific component.

## Stability

The TypeScript API is intended to be stable within minor releases. Template file structures may evolve as recommended project structure improves.
