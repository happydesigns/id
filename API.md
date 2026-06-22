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
- `applyBrandTheme(theme, options?)`
- brand-guide and theme-pack types

## Nuxt Layer

Use the layer when a project wants the default identity runtime:

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
    defaultTheme: 'client',
    themes: []
  }
})
```

## App Config Contract

Runtime themes are provided through app config:

```ts [app.config.ts]
export default defineAppConfig({
  id: {
    defaultTheme: 'client',
    themes: []
  }
})
```

The runtime reads `id.themes`, applies CSS variables to the document root, and updates Nuxt UI app config with the selected theme.

## Stability

The TypeScript API is intended to be stable within minor releases. Template file structures may evolve as recommended project structure improves.
