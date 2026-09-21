import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({

  modules: [fileURLToPath(new URL('./module.ts', import.meta.url))],
  plugins: [fileURLToPath(new URL('./plugins/preview.client.ts', import.meta.url))], $meta: { name: '@happydesigns/id-studio' },
  components: [{ path: fileURLToPath(new URL('./components', import.meta.url)), pathPrefix: false, prefix: 'Id' }],
  hooks: {
    'pages:extend'(pages) {
      for (const name of ['studio', 'studio-preview']) {
        const path = name === 'studio' ? '/studio' : '/studio/preview'
        const file = fileURLToPath(new URL(`./pages/${name}.vue`, import.meta.url))
        // Nuxt may discover this layer's pages automatically. Keep one public
        // route per page and avoid a second /studio-preview entry point.
        const discovered = pages.find(page => page.file?.replaceAll('\\', '/') === file.replaceAll('\\', '/'))
        if (discovered) discovered.path = path
        else if (!pages.some(page => page.path === path)) pages.push({ name: `id-${name}`, path, file })
      }
    },
  },
})
