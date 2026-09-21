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

`docs/` is the separate Docus consumer. Docus owns its framework CSS entry; `docs/app/app.css` imports only the brand fragment. `brand.ts` contains guide/authoring data and is not imported by the published runtime. Keep runtime app config and CSS aligned when editing this handwritten starter. For single-source generation use Studio's New project export instead.

Install the reviewed ID package as a development dependency. Run `pnpm dev` for Docus and `pnpm verify` for typecheck/build. Studio is optional: extend `@happydesigns/id/studio` in docs only and provide `appConfig.idStudio`. Use Docus AppHeaderCTA/AppFooterLeft slots to link to `/studio`; retain any individual homepage. No custom header/footer replacement is required.
