# Sample Brand Reference Theme

Neutral runtime theme source for the `id` docs app.

This folder demonstrates how a concrete Nuxt UI brand can expose a runtime-safe `defineBrandTheme()` and `defineBrandGuide()` contract through `id` without carrying doctrine from a real brand. Public brand packages should replace this sample with their own guide, assets, palette meaning, logo rules, and voice.

This folder is intentionally shaped like a package boundary:

- `index.ts` exports the public runtime theme and minimal guide data.
- `tokens.css` ships one custom color scale at build time.
- Runtime switching stays limited to CSS variables, typography variables, Nuxt UI `ui.colors`, and stable Nuxt UI component defaults.
