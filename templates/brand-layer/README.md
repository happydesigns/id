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

This starter is for full build-time branding: assets, metadata, CSS variables, Nuxt UI defaults, and optional brand primitives. Replace the placeholder logo entries in `brand.ts` with stable roles from the real brand system.

The starter includes `app/app.vue` with the standard Nuxt UI `UApp` root so toasts, tooltips, overlays, and runtime identity controls work from the first dev run.
