import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  modules: ['@nuxt/ui'],

  $meta: {
    name: '@example/brand',
  },

  components: [
    {
      path: resolve(currentDir, './app/components'),
      pathPrefix: false,
      prefix: 'Brand',
    },
  ],

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  compatibilityDate: 'latest',
})
