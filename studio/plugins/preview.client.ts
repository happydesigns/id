import { defineNuxtPlugin, onNuxtReady, useAppConfig, useColorMode, useHead, useRouter } from '#imports'
import { nextTick, ref, watch } from 'vue'
import { parseStudioDocument } from '../../src/studio'
import type { StudioDocument } from '../../src/studio'
import { copyConfig, docusBrandHeader, previewUi, studioPreviewCss } from '../preview'
import { studioTemplates, withinStudioRoute } from '../templates'

export default defineNuxtPlugin({
  name: 'id-studio-route-preview',
  enforce: 'post',
  setup(nuxtApp) {
    const router = useRouter()
    const initial = router.currentRoute.value
    if (window.parent === window || typeof initial.query.idPreview !== 'string') return
    const config = useAppConfig() as unknown as {
      ui: Record<string, unknown>
      idStudio?: { templates?: unknown, document?: StudioDocument }
      id?: { theme: StudioDocument['theme'], themes: StudioDocument['theme'][], assets?: StudioDocument['brand']['assets'] }
      header?: Record<string, unknown>
      brand?: { name: string, assets?: StudioDocument['brand']['assets'] }
    }
    const template = studioTemplates(config.idStudio?.templates).find(item => item.id === initial.query.idPreview && item.routePrefix && withinStudioRoute(initial.path, item.routePrefix))
    if (!template?.routePrefix) return
    const hostUi = copyConfig(config.ui ?? {})
    const seedUi = copyConfig(config.idStudio?.document?.theme?.ui ?? config.id?.theme?.ui ?? {})
    const header = copyConfig(config.header ?? {})
    const style = ref('')
    const status = ref('loading')
    const colorMode = useColorMode()
    let applying = false
    let active = false
    let pendingMessage: MessageEvent | undefined
    useHead({ htmlAttrs: { 'data-id-preview': status }, style: [{ key: 'id-studio-route-preview', textContent: style }], meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
    const post = (message: Record<string, unknown>) => window.parent.postMessage({ ...message, scene: template.id }, window.location.origin)
    const stopNavigation = router.beforeEach(to => {
      if (!withinStudioRoute(to.path, template.routePrefix!)) return false
      if (to.query.idPreview !== template.id) return { ...to, query: { ...to.query, idPreview: template.id, frame: initial.query.frame } }
    })
    const stopAfter = router.afterEach((to, _from, failure) => {
      if (failure) return
      if (active) post({ type: 'id-studio-navigate', path: to.path })
      else post({ type: 'id-studio-ready' })
    })
    const stopMode = watch(() => colorMode.value, value => {
      if (!applying && active && ['light', 'dark'].includes(value)) post({ type: 'id-studio-mode', mode: value })
    })
    async function receive(event: MessageEvent) {
      if (event.source !== window.parent || event.origin !== window.location.origin || event.data?.type !== 'id-studio-preview' || event.data.scene !== template!.id) return
      if (nuxtApp.isHydrating) { pendingMessage = event; return }
      try {
        const doc = parseStudioDocument(event.data.document)
        applying = true
        config.ui = previewUi(hostUi, seedUi, doc.theme.ui ?? {})
        config.header = docusBrandHeader(doc, header)
        config.brand = { name: doc.theme.label ?? doc.brand.name, assets: doc.brand.assets }
        if (config.id) { config.id.theme = doc.theme; config.id.themes = []; config.id.assets = doc.brand.assets }
        style.value = studioPreviewCss(doc)
        colorMode.preference = event.data.mode === 'dark' ? 'dark' : 'light'
        active = true
        if (withinStudioRoute(event.data.path, template!.routePrefix!) && router.currentRoute.value.path !== event.data.path) await router.replace({ path: event.data.path, query: initial.query })
        await nextTick()
        status.value = 'ready'
        requestAnimationFrame(() => requestAnimationFrame(() => post({ type: 'id-studio-rendered' })))
      } catch { post({ type: 'id-studio-preview-error', message: 'The documentation preview could not apply this brand.' }) }
      finally { applying = false }
    }
    window.addEventListener('message', receive)
    onNuxtReady(() => {
      if (pendingMessage) { receive(pendingMessage); pendingMessage = undefined }
      else post({ type: 'id-studio-ready' })
    })
    if (import.meta.hot) import.meta.hot.dispose(() => { window.removeEventListener('message', receive); stopNavigation(); stopAfter(); stopMode() })
  }
})
