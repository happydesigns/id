import { defineNuxtConfig } from 'nuxt/config'

// `nuxt prepare` also enables dev mode. Isolate the running CLI server explicitly.
const devServer = process.argv.includes('dev')

export default defineNuxtConfig({

  extends: ['..', '../studio'],
  devtools: {
    enabled: false,
  },
  app: {
    head: {
      title: 'happydesigns id playground',
    },
  }, buildDir: devServer ? '.nuxt-dev' : '.nuxt',
  compatibilityDate: 'latest',
  icon: { serverBundle: { collections: ['lucide', 'vscode-icons'] }, clientBundle: { scan: true } },
})
