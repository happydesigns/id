# Brand layer template

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

This template is for full build-time branding: assets, metadata, CSS variables, Nuxt UI defaults, and optional brand primitives.
