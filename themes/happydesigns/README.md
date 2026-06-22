# happydesigns Theme

Local runtime theme source for the docs app while `@happydesigns/brand` is still being migrated to `@happydesigns/id`.

This folder is intentionally shaped like the future replacement boundary:

- `index.ts` exports the public runtime theme and minimal guide data.
- `tokens.css` ships custom color names at build time.
- Runtime switching stays limited to CSS variables, typography variables, Nuxt UI `ui.colors`, and stable Nuxt UI component defaults.

When `@happydesigns/brand` exposes the same runtime exports, docs should import from that package instead of this local folder.
