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
  ],

  hooks: {
    'components:extend'(components) {
      // MDC needs the reference globally; other guide components stay auto-imported.
      const reference = components.find(component =>
        component.pascalName === 'IdBrandReference'
        && resolve(component.filePath) === resolve(currentDir, './components/BrandReference.vue')
      )
      if (reference) reference.global = true
    }
  }
})
