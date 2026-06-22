import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['docus'],
  modules: ['./modules/docus-css-dev'],
  compatibilityDate: 'latest',
  vite: {
    optimizeDeps: {
      include: []
    }
  },
  llms: {
    domain: 'https://id.happydesigns.de',
    title: 'happydesigns id',
    description: 'Reusable identity contracts, Nuxt UI theme runtime, and brand-layer tooling for happydesigns projects.'
  }
})
