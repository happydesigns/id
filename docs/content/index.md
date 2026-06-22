---
title: happydesigns id
description: Build brand layers and typed identity contracts for neutral Nuxt UI applications.
---

::u-page-hero
#headline
Identity system for Nuxt UI

#title
happydesigns id

#description
Create brand guides that become usable Nuxt brand layers. Keep apps focused on content and behavior while identity stays token-driven, documented, and reusable.

#links
  :::u-button
  ---
  size: xl
  to: /getting-started
  trailing-icon: i-lucide-arrow-right
  ---
  Get started
  :::

  :::u-button
  ---
  color: neutral
  size: xl
  to: /guides/nuxt-ui-mapping
  variant: outline
  trailing-icon: i-lucide-palette
  ---
  Nuxt UI mapping
  :::

  :::u-button
  ---
  color: neutral
  icon: i-simple-icons-github
  size: xl
  target: _blank
  to: https://github.com/happydesigns/id
  variant: subtle
  ---
  GitHub
  :::
::

::u-page-section
---
headline: Product model
title: Brand layers first, runtime themes when useful
description: Use a full brand layer when the brand owns assets, app shell, docs styling, or Nuxt UI defaults. Add runtime theme packs only for shipped token and component-default switching.
---
#features
  :::u-page-feature
  ---
  icon: i-lucide-layers-3
  to: /concepts/layer-vs-runtime
  ---
  #title
  Build-time layers

  #description
  Apply full brand expression through Nuxt layers: logos, app shell, metadata, CSS, Nuxt UI defaults, and optional brand primitives.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-refresh-cw
  to: /guides/runtime-themes
  ---
  #title
  Optional runtime themes

  #description
  Switch CSS variables and Nuxt UI app-config defaults quickly when all required classes, components, and assets already ship with the app.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-file-check-2
  to: /guides/brand-guide-contract
  ---
  #title
  Brand guides

  #description
  Store identity decisions as typed metadata, palettes, semantic roles, typography, voice, coverage, and usage limits.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-component
  to: /reference/component-coverage
  ---
  #title
  Component coverage

  #description
  Audit how a brand behaves across actions, forms, feedback, navigation, tables, overlays, docs prose, and app shells.
  :::
::

::u-page-section
---
headline: Developer experience
title: Stay close to Nuxt conventions
description: id should feel like a small layer on top of Nuxt UI, not a competing design system.
---
  :::u-page-grid
    ::::u-page-card{icon="i-lucide-settings-2" to="/guides/nuxt-ui-mapping"}
    #title
    app.config.ts first

    #description
    Use Nuxt UI semantic colors, slots, variants, compound variants, and default variants before adding custom wrappers.
    ::::

    ::::u-page-card{icon="i-lucide-braces" to="/reference/api"}
    #title
    Typed contracts

    #description
    Define brand guides and a primary brand theme with TypeScript helpers and validation at the package boundary.
    ::::

    ::::u-page-card{icon="i-lucide-terminal" to="/guides/templates"}
    #title
    Starter templates

    #description
    Start a brand layer or themed app with giget instead of assembling boilerplate by hand.
    ::::
  :::
::

::u-page-section
---
title: Start with the branding boundary, then choose the smallest runtime surface.
description: Default to a brand layer. Add runtime themes only for preview, tenant picker, or editor workflows that do not need new files at runtime.
---
#links
  :::u-button
  ---
  to: /getting-started/apply-branding
  trailing-icon: i-lucide-arrow-right
  ---
  Apply branding
  :::
::
