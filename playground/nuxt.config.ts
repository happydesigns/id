import { defineNuxtConfig } from 'nuxt/config'

// `nuxt prepare` also enables dev mode. Isolate the running CLI server explicitly.
const devServer = process.argv.includes('dev')

export default defineNuxtConfig({
  buildDir: devServer ? '.nuxt-dev' : '.nuxt',
  extends: ['..', '../studio'],
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
