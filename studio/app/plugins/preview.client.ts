import { defineNuxtPlugin, onNuxtReady, useAppConfig, useColorMode, useHead, useRouter, useRuntimeConfig } from '#imports'
import { nextTick, ref, watch } from 'vue'
import { parseStudioDocument } from '../../../src/studio-document'
import { createPreviewBrand, type PreviewAppConfig } from '../../preview'
import { studioTemplates, withinStudioRoute } from '../../templates'

export default defineNuxtPlugin({
  name: 'id-studio-route-preview',
  enforce: 'post',
  setup(nuxtApp) {
    const router = useRouter()
    const initial = router.currentRoute.value
    const thumbnail = initial.query.frame === 'thumbnail'
    if (window.parent === window || typeof initial.query.idPreview !== 'string') return
    const config = useAppConfig() as unknown as PreviewAppConfig
    const remote = useRuntimeConfig().public.idStudioPreview as { studioOrigin: string, id: string, routePrefix: string, brandUi?: Record<string, unknown>, appUi?: Record<string, unknown> } | undefined
    const session = typeof initial.query.idSession === 'string' ? initial.query.idSession : ''
    const external = !!remote && initial.query.idStudioOrigin === remote.studioOrigin && initial.query.idPreview === remote.id && /^[a-f0-9-]{36}$/.test(session) && withinStudioRoute(initial.path, remote.routePrefix)
    const parentOrigin = external ? remote!.studioOrigin : window.location.origin
    const template = external ? { id: remote!.id, routePrefix: remote!.routePrefix } : studioTemplates(config.idStudio?.templates).find(item => item.id === initial.query.idPreview && item.routePrefix && withinStudioRoute(initial.path, item.routePrefix))
    if (!template?.routePrefix) return
    const applyBrand = createPreviewBrand(config, remote?.brandUi, remote?.appUi)
    const style = ref('')
    const status = ref('loading')
    const colorMode = useColorMode()
    let applying = false
    let active = false
    let pendingMessage: MessageEvent | undefined
    useHead({ htmlAttrs: { 'data-id-preview': status }, style: [{ key: 'id-studio-route-preview', textContent: style }], meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
    const post = (message: Record<string, unknown>) => window.parent.postMessage({ ...message, scene: template.id, ...(external ? { session } : {}) }, parentOrigin)
    const stopNavigation = router.beforeEach((to) => {
      if (!withinStudioRoute(to.path, template.routePrefix!)) return false
      if (to.query.idPreview !== template.id || (external && (to.query.idSession !== session || to.query.idStudioOrigin !== parentOrigin))) return { ...to, query: { ...to.query, idPreview: template.id, frame: initial.query.frame, ...(external ? { idStudioOrigin: parentOrigin, idSession: session } : {}) } }
    })
    const stopAfter = router.afterEach((to, _from, failure) => {
      if (failure) return
      // Parent-driven navigation already represents Studio's state. Echoing it
      // can send an older path back while another frame is still catching up.
      if (active && !applying) post({ type: 'id-studio-navigate', path: to.path })
      else if (!active) post({ type: 'id-studio-ready' })
    })
    // Report user preference, not the resolved system appearance. Synchronous
    // observation lets parent updates be suppressed without a feedback loop.
    const stopMode = watch(() => colorMode.preference, (value) => {
      if (!applying && active && ['light', 'dark', 'system'].includes(value)) post({ type: 'id-studio-mode', mode: value })
    }, { flush: 'sync' })
    function applyMode(data: { preference?: string, mode?: string }) {
      const previous = applying
      applying = true
      if (thumbnail) {
        window.document.documentElement.classList.toggle('dark', data.mode === 'dark')
        window.document.documentElement.classList.toggle('light', data.mode !== 'dark')
      }
      else colorMode.preference = ['light', 'dark', 'system'].includes(data.preference || '') ? data.preference! : data.mode === 'dark' ? 'dark' : 'light'
      applying = previous
    }
    async function receive(event: MessageEvent) {
      if (event.source === window.parent && event.origin === parentOrigin && (!external || event.data?.session === session) && event.data?.type === 'id-studio-color-mode') {
        applyMode(event.data)
        return
      }
      if (event.source !== window.parent || event.origin !== parentOrigin || (external && event.data?.session !== session) || event.data?.type !== 'id-studio-preview' || event.data.scene !== template!.id) return
      if (nuxtApp.isHydrating) {
        pendingMessage = event
        return
      }
      try {
        const doc = parseStudioDocument(event.data.document)
        applying = true
        style.value = applyBrand(doc)
        applyMode(event.data)
        active = true
        if (withinStudioRoute(event.data.path, template!.routePrefix!) && router.currentRoute.value.path !== event.data.path) await router.replace({ path: event.data.path, query: initial.query })
        await nextTick()
        status.value = 'ready'
        requestAnimationFrame(() => requestAnimationFrame(() => post({ type: 'id-studio-rendered' })))
      }
      catch {
        post({ type: 'id-studio-preview-error', message: 'The app preview could not apply this brand.' })
      }
      finally {
        applying = false
      }
    }
    const notifyEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) post({ type: 'id-studio-escape' })
    }
    window.addEventListener('keydown', notifyEscape)
    const notifyPointer = () => post({ type: 'id-studio-pointer' })
    window.document.addEventListener('pointerdown', notifyPointer, true)
    window.addEventListener('message', receive)
    onNuxtReady(() => {
      if (pendingMessage) {
        receive(pendingMessage)
        pendingMessage = undefined
      }
      else post({ type: 'id-studio-ready' })
    })
    if (import.meta.hot) import.meta.hot.dispose(() => {
      window.document.removeEventListener('pointerdown', notifyPointer, true)
      window.removeEventListener('message', receive)
      window.removeEventListener('keydown', notifyEscape)
      stopNavigation()
      stopAfter()
      stopMode()
    })
  },
})
