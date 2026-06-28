import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

const currentDir = dirname(fileURLToPath(import.meta.url))
const runtimeCompatModule = resolve(currentDir, './modules/runtime-compat.mjs')

export default defineNuxtConfig({
  $meta: {
    name: '@happydesigns/id'
  },

  modules: [
    '@nuxt/ui',
    runtimeCompatModule
  ],

  components: [
    {
      path: resolve(currentDir, './app/components'),
      pathPrefix: false,
      prefix: 'Id'
    }
  ],

  css: [
    resolve(currentDir, './app/assets/css/id.css')
  ],

  compatibilityDate: 'latest'
})
