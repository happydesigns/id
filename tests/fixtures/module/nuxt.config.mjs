export default defineNuxtConfig({
  modules: ['@happydesigns/id/module'],
  devtools: { enabled: false },
  ui: { fonts: false },
  appConfig: { id: { name: 'Host identity' } },
  compatibilityDate: '2026-08-01',
  id: { name: 'Module default', componentPrefix: 'TestBrand' },
})
