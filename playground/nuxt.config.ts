import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['..', '../guide'],
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
