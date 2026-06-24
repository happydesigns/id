# happydesigns Demonstration Theme

Local runtime theme source for the `id` docs app while `@happydesigns/brand` is still being migrated to `@happydesigns/id`.

This folder is not the canonical happydesigns brand guide. It demonstrates how a concrete Nuxt UI brand can expose a runtime-safe `defineBrandTheme()` and `defineBrandGuide()` contract through `id`. The public happydesigns doctrine, final logo rules, assets, palette meaning, and voice belong in `@happydesigns/brand`.

This folder is intentionally shaped like the future replacement boundary:

- `index.ts` exports the public runtime theme and minimal guide data.
- `tokens.css` ships custom color names at build time.
- Runtime switching stays limited to CSS variables, typography variables, Nuxt UI `ui.colors`, and stable Nuxt UI component defaults.

When `@happydesigns/brand` exposes the same runtime exports, docs should import from that package instead of this local folder.
