import { addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'
import { randomUUID } from 'node:crypto'
import { isAbsolute } from 'node:path'

export default defineNuxtModule({
  meta: { name: '@happydesigns/id-studio-project' },
  setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    nuxt.options.nitro.publicAssets ||= []
    nuxt.options.nitro.publicAssets.push({ dir: resolve('./public') })
    const source = nuxt.options.runtimeConfig.idStudioSource
    if (!nuxt.options.dev || typeof source !== 'string' || !isAbsolute(source) || !source.endsWith('.json')) return
    const token = randomUUID()
    nuxt.options.runtimeConfig.idStudioWriterToken = token
    nuxt.options.runtimeConfig.public.idStudioWriterToken = token
    addServerHandler({ route: '/api/id-studio/source', handler: resolve('./server/source') })
  }
})
