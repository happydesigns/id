import type { BrandGuideAppConfig } from '../../src'

declare module 'nuxt/schema' {
  interface AppConfigInput {
    id?: BrandGuideAppConfig
  }

  interface AppConfig {
    id?: BrandGuideAppConfig
  }
}

export {}
