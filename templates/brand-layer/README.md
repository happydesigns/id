# Brand layer starter

Starter for a Nuxt UI brand layer powered by `@happydesigns/id`.

## Use

```bash
npx giget@latest gh:happydesigns/id/templates/brand-layer my-brand
cd my-brand
pnpm install
pnpm dev
```

## Apply in a Nuxt app

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@example/brand']
})
```

This starter is for full build-time branding: assets, metadata, CSS variables, Nuxt UI defaults, and optional brand primitives. Replace the placeholder `brandIdentity` and `brandAssets` entries in `brand.ts` with stable roles from the real brand system. The neutral definition is mapped through the Nuxt UI adapter; add other adapters as normal TypeScript modules when a second target needs the same brand data.

Runtime app config receives only the theme and runtime assets. The exported `brandGuide` remains available for a dedicated guide application but is not shipped automatically to every consuming app.

The starter includes `app/app.vue` with the standard Nuxt UI `UApp` root so toasts, tooltips, overlays, and runtime identity controls work from the first dev run. The homepage renders `BrandLogo`, which is auto-imported from `app/components/Logo.vue` through the brand component prefix and backed by `IdLogo`.
