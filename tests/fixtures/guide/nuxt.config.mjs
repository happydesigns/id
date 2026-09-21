import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['@happydesigns/id/nuxt', '../../../guide', '../../../studio', 'docus'],
  runtimeConfig: { idStudioSource: fileURLToPath(new URL('./brand.json', import.meta.url)) },
  compatibilityDate: '2026-08-01',
  image: { provider: 'none' },
  llms: { domain: 'http://localhost:3428' },
})
