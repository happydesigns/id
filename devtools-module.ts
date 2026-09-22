import { addPlugin, createResolver, defineNuxtModule, extendPages } from '@nuxt/kit'
import type { StudioDocument } from './src/studio-document.js'
import { addCustomTab } from '@nuxt/devtools-kit'

export interface DevtoolsOptions {
  document?: StudioDocument
  appUi?: Record<string, unknown>
}

export default defineNuxtModule<DevtoolsOptions>({
  meta: { name: '@happydesigns/id-devtools' },
  setup(options, nuxt) {
    if (!nuxt.options.dev || nuxt.options.devtools === false || (typeof nuxt.options.devtools === 'object' && nuxt.options.devtools.enabled === false)) return
    nuxt.options.runtimeConfig.public.idDevtoolsTheme = options
    const { resolve } = createResolver(import.meta.url)
    nuxt.options.css.push(resolve('../studio/app/assets/devtools.css'))
    const path = '/__id/theme'
    extendPages((pages) => {
      pages.push({ name: 'id-devtools-theme', path, file: resolve('../studio/app/views/DevtoolsTheme.vue') })
    })
    addPlugin({ src: resolve('../studio/app/plugins/devtools.client'), mode: 'client' })
    addCustomTab({ name: 'id-theme', title: 'Brand theme', icon: 'lucide:palette', view: { type: 'iframe', src: nuxt.options.app.baseURL + path.slice(1) } }, nuxt)
  },
})
