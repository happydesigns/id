# Docus integration fixture

Run pnpm exec nuxt dev tests/fixtures/guide from the ID root. The / route renders shared examples through MDC, /smoke renders the same examples directly in Vue, and /hydration renders only native Nuxt UI FormField/Input/Textarea/Tabs. No ClientOnly boundary or explicit input IDs are used.

For production regression checks, follow the ordered [verification pipeline](../../../docs/content/5.development/2.verification.md), which also prepares the independent consumers used by the browser suite. This fixture checks translation, keyboard scrolling, Studio startup/history, label focus and active tab panels. These are required success checks, not expected failures.

## GUIDE-001: resolved production ID mismatch

The initial Nuxt 4.5.2 / Vue 3.5.41 / Docus 5.12.3 stack produced different SSR/client ID prefixes. Nuxt UI labels then referred to missing inputs; selected tabs referred to missing panels.

Isolation established:
- A plain Nuxt + Nuxt UI form works.
- The identical form in Docus fails with no ID layer present.
- Preserving onServerPrefetch registration in the production client fixes the Docus-only case.
- The ID Guide layer applies that same narrow build configuration; the production suite verifies both direct Vue and MDC examples.

Nuxt removes onServerPrefetch calls in its production composable tree-shaking defaults. Vue uses registered server-prefetch hooks to mark async ID boundaries. Nuxt Icon registers such hooks, including in header siblings before a page. Removing client registration changes the ID sequence even though the hook callback never runs in the browser. The guide excludes only this hook from removal; it keeps the other optimizations and does not replace Nuxt UI or generate its own IDs.

The correction is build-time only and deliberately lives in the optional Guide layer, not in brand data. Plain Nuxt/Docus hosts without the Guide can apply the same module callback from guide/nuxt.config.ts. Remove the correction only after the unmodified upstream stack passes these production tests. Brand portals may remove targeted form ClientOnly wrappers after upgrading and verifying their consuming build; actual tab content slots remain independently necessary.

The workspace also aligns Tiptap's editor peer graph at 3.30.1 after a mixed core/extension graph failed production bundling. A fresh consumer validates its own lockfile.
