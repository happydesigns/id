import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['..', '../guide', '../studio'],
  icon: { serverBundle: { collections: ['lucide'] }, clientBundle: { scan: true } },
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
