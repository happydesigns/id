import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['..'],
  devtools: {
    enabled: false
  },
  app: {
    head: {
      title: 'happydesigns id playground'
    }
  },
  compatibilityDate: 'latest'
})
