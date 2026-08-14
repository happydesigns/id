# Brand layer starter

Starter for a Nuxt UI brand layer powered by `@happydesigns/id`.

## Use

```bash
npx giget@latest gh:happydesigns/id/templates/brand-layer my-brand
cd my-brand
pnpm install
pnpm dev
```

Nuxt's CLI accepts the same GitHub template source:

```bash
pnpm create nuxt@latest my-brand --template gh:happydesigns/id/templates/brand-layer
```

## Apply in a Nuxt app

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@example/brand']
})
```

This starter is for full build-time branding: assets, metadata, CSS variables, Nuxt UI defaults, and optional brand primitives. Replace the placeholder `brandIdentity` definition in `brand.ts`; it owns the structured runtime assets alongside the neutral colors and typography. The definition is mapped through the Nuxt UI adapter, and other adapters remain normal TypeScript modules when a second target needs the same brand data.

Runtime app config receives only the theme and runtime assets. The exported `brandGuide` remains available for a dedicated guide application but is not shipped automatically to every consuming app.

The repository root is the public Nuxt layer. It contains only consumer-safe app config, CSS, assets, and reusable brand components. The separate Docus application in `docs/` extends that root, adds `id.guide`, and renders the reference pages. Consumers always extend the package or repository root, never `docs/`.

`pnpm dev` and `pnpm build` target the reference app. `pnpm typecheck` checks the public layer in isolation, and `pnpm verify` checks both boundaries. The reference homepage renders `BrandLogo`, which is inherited from the root layer and backed by `IdLogo`.
