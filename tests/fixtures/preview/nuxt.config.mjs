import { appUi } from './app/ui.ts'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxt/ui', ['@happydesigns/id/preview', { studioOrigin: 'http://127.0.0.1:3439', id: 'external', routePrefix: '/demo', brandUi: { colors: { primary: 'blue' }, button: { defaultVariants: { variant: 'outline' } } }, appUi }]],
  devtools: { enabled: false },
  css: ['~/main.css'],
  ui: { fonts: false },
  appConfig: { ui: { colors: { primary: 'blue' } } },
  compatibilityDate: '2026-08-01',
})
