import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['@happydesigns/id/nuxt', '../../../guide', '../../../studio', 'docus'],
  runtimeConfig: { idStudioSource: fileURLToPath(new URL('./brand.json', import.meta.url)) },
  ...(process.env.ID_CAPABILITY_DOCUMENT
    ? {
        appConfig: { idStudio: {
          document: JSON.parse(readFileSync(process.env.ID_CAPABILITY_DOCUMENT, 'utf8')),
          templates: {
            course: { label: 'Course playground', origin: 'http://127.0.0.1:3461', route: '/courses', routePrefix: '/courses' },
            booking: { label: 'Booking playground', origin: 'http://127.0.0.1:3462', route: '/book', routePrefix: '/' },
          },
        } },
      }
    : {}),
  compatibilityDate: '2026-08-01',
  image: { provider: 'none' },
  llms: { domain: 'http://localhost:3428' },
})
