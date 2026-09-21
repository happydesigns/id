import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import type { StudioDocument } from '../../src/studio'

export function useStudioFrames(
  previewRuntime: Ref<string>, scene: Ref<string>, compare: Ref<boolean>, storageReady: Ref<boolean>,
  send: (frame: HTMLIFrameElement | undefined, document: StudioDocument) => void,
) {
  const frameCache = ref<Record<string, HTMLIFrameElement | undefined>>({})
  const originalFrame = computed(() => frameCache.value[`original:${previewRuntime.value}`])
  const draftFrame = computed(() => frameCache.value[`draft:${previewRuntime.value}`])
  function cacheFrame(frame: unknown, key: string) {
    frameCache.value[key] = frame instanceof HTMLIFrameElement ? frame : undefined
  }
  const loadedFrames = ref({ original: false, draft: false })
  const failedFrames = ref({ original: false, draft: false })
  const previewAttempt = ref(0)
  function retryPreview() {
    failedFrames.value = { original: false, draft: false }
    loadedFrames.value = { original: false, draft: false }
    previewAttempt.value++
  }
  function frameLoaded(frame: HTMLIFrameElement | undefined, doc: StudioDocument, key: 'original' | 'draft') {
    if (!frame?.contentDocument) {
      failedFrames.value[key] = true
      return
    }
    send(frame, doc)
  }
  watch(scene, () => {
    failedFrames.value = { original: false, draft: false }
    loadedFrames.value = { original: false, draft: false }
  }, { flush: 'sync' })
  watch(compare, () => {
    loadedFrames.value.original = false
  })
  watch([loadedFrames, storageReady, compare, previewAttempt], (_value, _previous, cleanup) => {
    if (!storageReady.value || (loadedFrames.value.draft && (!compare.value || loadedFrames.value.original))) return
    const timer = setTimeout(() => {
      if (!loadedFrames.value.draft) failedFrames.value.draft = true
      if (compare.value && !loadedFrames.value.original) failedFrames.value.original = true
    }, 30000)
    cleanup(() => clearTimeout(timer))
  }, { deep: true })
  onMounted(() => {
    // A failed iframe has no live Vite client. Recover it when the host receives
    // a successful update or reconnects after a dev-server restart.
    if (import.meta.hot) {
      const hot = import.meta.hot
      let timer: ReturnType<typeof setTimeout> | undefined
      const recover = () => {
        clearTimeout(timer)
        timer = setTimeout(() => {
          if (failedFrames.value.draft || (compare.value && failedFrames.value.original)) retryPreview()
        }, 250)
      }
      hot.on('vite:afterUpdate', recover)
      hot.on('vite:ws:connect', recover)
      onBeforeUnmount(() => {
        clearTimeout(timer)
        hot.off('vite:afterUpdate', recover)
        hot.off('vite:ws:connect', recover)
      })
    }
  })
  return { originalFrame, draftFrame, cacheFrame, loadedFrames, failedFrames, previewAttempt, retryPreview, frameLoaded }
}
