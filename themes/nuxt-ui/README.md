# Nuxt UI Theme

The default `@happydesigns/id` theme intentionally stays close to standard Nuxt UI.

Use it as the neutral baseline when a brand layer has not mapped its own palette yet, or when a docs/playground surface needs to compare brand output against standard Nuxt UI behavior.

Use this package export when a docs app, playground, brand repository, or test wants to import the baseline explicitly:

```ts
import { nuxtUiBrandTheme } from '@happydesigns/id/themes/nuxt-ui'
```

The root package also re-exports the same theme for convenience.
