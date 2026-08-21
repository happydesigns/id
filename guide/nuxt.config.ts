import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  $meta: {
    name: '@happydesigns/id-guide'
  },

  components: [
    {
      path: resolve(currentDir, './components'),
      pathPrefix: false,
      prefix: 'Id'
    }
  ]
})
