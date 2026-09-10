import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['..', '../guide', '../studio', 'docus'],
  icon: { serverBundle: { collections: ['lucide', 'vscode-icons'] }, clientBundle: { scan: true } },
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
