import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [fileURLToPath(new URL('./module.ts', import.meta.url))],
  $meta: { name: '@happydesigns/id-studio' },
  components: [{ path: fileURLToPath(new URL('./app/components', import.meta.url)), pathPrefix: false, prefix: 'Id' }],
  hooks: {
    'components:extend'(components) {
      const showcase = components.find(component => component.pascalName === 'IdStudioShowcase')
      if (showcase) showcase.global = true
    },
  },
})
