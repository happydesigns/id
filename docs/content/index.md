---
title: happydesigns/id
description: Develop applications independently of their branding with native Nuxt UI brand layers.
---

::brand-landing
#installation
:::code-group
```ts [nuxt.config.ts]
export default defineNuxtConfig({
  extends: ['@acme/brand']
})
```

```css [main.css]
@import "tailwindcss";
@import "@nuxt/ui";
@import "@acme/brand/styles.css";
```
:::
::
