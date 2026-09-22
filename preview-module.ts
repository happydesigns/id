import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import { studioOrigin, isStudioRoute } from './studio/templates.js'

export interface PreviewOptions {
  /** Include the bridge in a dedicated, explicitly opted-in preview deployment. */
  previewBuild?: boolean
  studioOrigin?: string
  id?: string
  routePrefix?: string
  brandUi?: Record<string, unknown>
  /** Explicit app overrides, including values equal to the original brand. */
  appUi?: Record<string, unknown>
}

export default defineNuxtModule<PreviewOptions>({
  meta: { name: '@happydesigns/id-preview' },
  defaults: { studioOrigin: '', id: '', routePrefix: '/', previewBuild: false },
  setup(options, nuxt) {
    if (!nuxt.options.dev && options.previewBuild !== true) return
    const origin = studioOrigin(options.studioOrigin)
    if (!origin) throw new Error('Studio preview requires an exact HTTP(S) studioOrigin.')
    if (!/^[a-z][a-z0-9-]{0,63}$/.test(options.id || '')) throw new Error('Studio preview requires a template id.')
    const prefix = options.routePrefix || '/'
    if (!isStudioRoute(prefix)) throw new Error('Invalid preview route prefix.')
    nuxt.options.runtimeConfig.public.idStudioPreview = { studioOrigin: origin, id: options.id, routePrefix: prefix, brandUi: options.brandUi, appUi: options.appUi }
    addPlugin({ src: createResolver(import.meta.url).resolve('../studio/app/plugins/preview.client'), mode: 'client' })
  },
})
