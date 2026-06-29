# Direct themed app starter

Starter for a Nuxt app that uses `@happydesigns/id` directly.

## Use

```bash
npx giget@latest gh:happydesigns/id/templates/themed-app my-app
cd my-app
pnpm install
pnpm dev
```

Use this starter for prototypes or small apps that own their pages and want one local primary theme without creating a separate brand-layer package first. Public reusable apps should normally stay neutral and consume an external brand layer.

The starter includes `app/app.vue` with the standard Nuxt UI `UApp` root so Nuxt UI overlays, tooltips, toasts, and identity runtime controls have their expected app context.
