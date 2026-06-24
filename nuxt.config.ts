import { defineNuxtConfig } from 'nuxt/config'
import layerConfig from './nuxt.layer.config'

export default defineNuxtConfig({
  ...layerConfig,

  modules: [
    ...(layerConfig.modules ?? []),
    '@nuxt/eslint'
  ],

  compatibilityDate: 'latest'
})
