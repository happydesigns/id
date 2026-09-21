import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
  extends: ['@happydesigns/id/nuxt', '../../../guide', '../../../studio', 'docus'],
  compatibilityDate: '2026-08-01',
  image: { provider: 'none' },
  llms: { domain: 'http://localhost:3428' }
})
