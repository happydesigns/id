import type { BrandRuntimeConfig } from '../../src'

declare module 'nuxt/schema' {
  interface AppConfigInput {
    id?: BrandRuntimeConfig
  }

  interface AppConfig {
    id?: BrandRuntimeConfig
  }
}

export {}
