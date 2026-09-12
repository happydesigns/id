<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, ref, nextTick } from 'vue'
import { parseStudioDocument } from '../../src/studio'
import type { StudioDocument, StudioScene } from '../../src/studio'
import { studioTemplates } from '../templates'
import { copyConfig, previewUi, studioPreviewCss } from '../preview'

definePageMeta({ layout: false, header: false, footer: false })
useSeoMeta({ robots: 'noindex, nofollow' })
const route = useRoute()
const appConfig = useAppConfig()
const colorMode = useColorMode()
function applyMode(preference: unknown) {
  // Thumbnails must not overwrite the user's persisted System preference.
  if (route.query.frame !== 'thumbnail') colorMode.preference = ['light', 'dark', 'system'].includes(String(preference)) ? String(preference) : mode.value
}
const document = ref<StudioDocument>()
const templates = studioTemplates((appConfig as unknown as { idStudio?: { templates?: unknown } }).idStudio?.templates)
const scene = ref('components')
const page = ref('home')
const builtinScene = computed(() => scene.value as StudioScene)
const selectedTemplate = computed(() => templates.find(item => item.id === scene.value))
function navigate(next: string) {
  if (selectedTemplate.value?.pages.some(item => item.id === next)) window.parent.postMessage({ type: 'id-studio-navigate', scene: scene.value, page: next }, window.location.origin)
}
const state = ref('default')
const mode = ref<'light' | 'dark'>('light')
const error = ref('')
const originalUi = copyConfig(appConfig.ui) as Record<string, unknown>
const seedUi = copyConfig((appConfig as unknown as { idStudio?: { document?: StudioDocument } }).idStudio?.document?.theme.ui ?? appConfig.id?.theme?.ui ?? {})
const style = ref('')
useHead({ style: [{ key: 'id-studio-preview', textContent: style }] })

function receive(event: MessageEvent) {
  if (event.origin === window.location.origin && event.source === window.parent && event.data?.type === 'id-studio-color-mode') {
    mode.value = event.data.mode === 'dark' ? 'dark' : 'light'
    applyMode(event.data.preference)
    return
  }
  if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.type !== 'id-studio-preview') return
  try {
    const doc = parseStudioDocument(event.data.document)
    if (event.data.scene !== 'components' && !templates.some(item => item.id === event.data.scene)) return
    scene.value = event.data.scene
    page.value = selectedTemplate.value?.pages.find(item => item.id === event.data.page)?.id || selectedTemplate.value?.pages[0]?.id || 'home'
    state.value = event.data.state === 'error' ? 'error' : 'default'
    Object.assign(appConfig, { ui: previewUi(originalUi, seedUi, doc.theme.ui ?? {}) })
    // The host runtime follows this source too; it cannot restore an older
    // brand over the frame when color mode changes.
    if (appConfig.id) {
      const identity = appConfig.id as unknown as Record<string, unknown>
      identity.theme = doc.theme
      identity.themes = []
      identity.assets = doc.brand.assets
    }
    mode.value = event.data.mode === 'dark' ? 'dark' : 'light'
    applyMode(event.data.preference)
    window.document.documentElement.classList.toggle('dark', mode.value === 'dark')
    window.document.documentElement.classList.toggle('light', mode.value === 'light')
    // Remove values the host runtime applied inline; the complete frame CSS
    // below owns the document. No state or styles cross iframe boundaries.
    window.document.documentElement.removeAttribute('style')
    style.value = studioPreviewCss(doc)
    document.value = doc
    error.value = ''
    nextTick(() => requestAnimationFrame(() => requestAnimationFrame(() => {
      const styles = getComputedStyle(window.document.body)
      function srgb(value: string) {
        const canvas = window.document.createElement('canvas')
        canvas.width = canvas.height = 1
        const context = canvas.getContext('2d')!
        context.fillStyle = value; context.fillRect(0, 0, 1, 1)
        const [r, g, b, alpha] = context.getImageData(0, 0, 1, 1).data
        return alpha === 255 ? `rgb(${r}, ${g}, ${b})` : ''
      }
      window.parent.postMessage({ type: 'id-studio-colors', foreground: srgb(styles.color), background: srgb(styles.backgroundColor) }, window.location.origin)
      window.parent.postMessage({ type: 'id-studio-rendered' }, window.location.origin)
    })))
  } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Preview unavailable.'; window.parent.postMessage({ type: 'id-studio-preview-error' }, window.location.origin) }
}
function notifyPointer() { window.parent.postMessage({ type: 'id-studio-pointer' }, window.location.origin) }
onMounted(() => {
  window.document.addEventListener('pointerdown', notifyPointer, true)
  window.addEventListener('message', receive)
  window.parent.postMessage({ type: 'id-studio-ready', frame: route.query.frame }, window.location.origin)
})
onBeforeUnmount(() => { window.removeEventListener('message', receive); window.document.removeEventListener('pointerdown', notifyPointer, true) })
</script>

<template>
  <main class="min-h-screen bg-default text-default">
    <UAlert
      v-if="error"
      color="error"
      :description="error"
      title="Preview unavailable"
    />
    <component
      :is="selectedTemplate.component"
      v-else-if="document && selectedTemplate?.component"
      :key="scene"
      :document="document"
      :mode="mode"
      :page="page"
      @navigate="navigate"
    />
    <IdStudioScenes
      v-else-if="document"
      :document="document"
      :scene="builtinScene"
      :state="state"
      :mode="mode"
    />
    <p
      v-else
      class="p-8 text-sm text-muted"
      role="status"
    >
      Preparing preview…
    </p>
  </main>
</template>
