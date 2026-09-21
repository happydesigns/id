# Native brand layer

Consumers extend `@example/brand` and import `@example/brand/styles.css` after Tailwind and Nuxt UI in their own CSS entry. The root supplies native app config, components and assets, without the ID runtime, Guide or Studio. It does not register CSS automatically.

```ts
export default defineNuxtConfig({ extends: ['@example/brand'] })
```

```css
@import "tailwindcss";
@import "@nuxt/ui";
@import "@example/brand/styles.css";
```

`docs/` is the separate Docus consumer. Docus owns its framework CSS entry; `docs/app/app.css` imports only the brand fragment. `brand.ts` contains guide/authoring data and is not imported by the published runtime. The repository package build derives app config, CSS, asset metadata and brand.studio.json from brand.ts through the same public generator used by Studio. Do not edit those generated files. This directory is an integration example; use Studio's New project export for a standalone brand with its own generation script.

Install the reviewed ID package as a development dependency. Run `pnpm dev` for the minimal Studio playground and `pnpm verify` for typecheck/build. Add configured templates through `appConfig.idStudio.templates`.

The `docs/` directory is an optional extension. Install its dependencies with `pnpm --dir docs install`, then run `pnpm --dir docs dev` when you want the Docus guide. It does not participate in the default Studio build. Existing guide hosts can also extend `@happydesigns/id/studio` and provide their brand document.
