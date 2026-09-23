import type { RouterConfig } from 'nuxt/schema'

export default {
  get scrollBehaviorType() {
    return import.meta.client && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'smooth'
      : 'auto'
  },
} satisfies RouterConfig
