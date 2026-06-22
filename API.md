# API

This file describes the public API direction for `@happydesigns/id`.

## TypeScript API

The root package exports:

- `defineBrandGuide(guide)`
- `defineBrandTheme(theme)`
- `validateBrandGuide(guide)`
- `validateBrandTheme(theme)`
- `createThemeCssVars(theme, options?)`
- `createThemeCssDeclarations(theme, mode?)`
- `createNuxtUiAppConfig(theme)`
- `normalizeBrandThemes(themes?)`
- `resolveBrandThemes(config?)`
- `applyBrandTheme(theme, options?)`
- `nuxtUiBrandTheme`
- `idBrandGuide`
- brand-guide and brand-theme types

## Nuxt Layer

Use the layer when a brand repository wants the default identity runtime:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@happydesigns/id/nuxt']
})
```

## Nuxt Module

Use the module when a project wants explicit module options:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@happydesigns/id/module'],
  id: {
    name: 'client'
  }
})
```

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

`id.guide.assets.logos` is an open role map. `logo`, `wordmark`, `symbol`, `mark`, and `appIcon` are useful conventions, not requirements. Concrete brand layers can define roles such as `crest`, `signature`, `seal`, or `partner-lockup` and either render them through `IdLogo role="..."` or provide their own brand-specific component.

## Stability

The TypeScript API is intended to be stable within minor releases. Template file structures may evolve as recommended project structure improves.
