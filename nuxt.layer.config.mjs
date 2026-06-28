import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

const currentDir = dirname(fileURLToPath(import.meta.url))
const docusTemplateCssModule = resolve(currentDir, './modules/docus-template-css.mjs')

export default defineNuxtConfig({
  $meta: {
    name: '@happydesigns/id'
  },

  modules: [
    '@nuxt/ui',
    docusTemplateCssModule
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

  mdc: {
    highlight: {
      noApiRoute: false
    }
  },

  vite: {
    optimizeDeps: {
      include: []
    }
  },

  compatibilityDate: 'latest'
})
