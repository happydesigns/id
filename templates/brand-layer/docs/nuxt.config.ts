export default defineNuxtConfig({
  extends: ['..', 'docus'],
  $meta: { name: '@example/brand-docs' },
  compatibilityDate: 'latest',
  nitro: { output: { dir: '../.output' } }
})
