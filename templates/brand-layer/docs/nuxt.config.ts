export default defineNuxtConfig({
  extends: ['..', '@happydesigns/id/nuxt', '@happydesigns/id/guide', 'docus'],
  $meta: { name: '@example/brand-docs' },
  compatibilityDate: 'latest',
  nitro: { output: { dir: '../.output' } },
})
