<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, ref, nextTick } from 'vue'
import { parseStudioDocument } from '../../src/studio'
import type { StudioDocument, StudioScene } from '../../src/studio'
import { cssVariablesAdapter } from '../../src/adapters/css-variables'
import { createThemeCssVars } from '../../src/css'
import { studioTemplates } from '../templates'
import { previewDefaults } from '../preview-defaults'

definePageMeta({ layout: false, header: false, footer: false })
useSeoMeta({ robots: 'noindex, nofollow' })
const route = useRoute()
const appConfig = useAppConfig()
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
const originalUi = JSON.parse(JSON.stringify(appConfig.ui)) as Record<string, unknown>
const style = ref('')
useHead({ style: [{ key: 'id-studio-preview', textContent: style }] })

function receive(event: MessageEvent) {
  if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.type !== 'id-studio-preview') return
  try {
    const doc = parseStudioDocument(event.data.document)
    if (event.data.scene !== 'components' && !templates.some(item => item.id === event.data.scene)) return
    scene.value = event.data.scene
    page.value = selectedTemplate.value?.pages.find(item => item.id === event.data.page)?.id || selectedTemplate.value?.pages[0]?.id || 'home'
    state.value = event.data.state === 'error' ? 'error' : 'default'
    const ui = appConfig.ui as Record<string, unknown>
    for (const key of Object.keys(ui)) {
      if (key !== 'icons') Reflect.deleteProperty(ui, key)
    }
    Object.assign(ui, { ...doc.theme.ui, colors: { primary: 'green', secondary: 'blue', success: 'green', info: 'blue', warning: 'yellow', error: 'red', neutral: 'slate', ...doc.theme.ui?.colors } })
    if (!ui.icons) ui.icons = originalUi.icons
    // The host runtime follows this source too; it cannot restore an older
    // brand over the frame when color mode changes.
    const identity = appConfig.id as unknown as Record<string, unknown>
    identity.theme = doc.theme
    identity.themes = []
    identity.assets = doc.brand.assets
    mode.value = event.data.mode === 'dark' ? 'dark' : 'light'
    window.document.documentElement.classList.toggle('dark', mode.value === 'dark')
    window.document.documentElement.classList.toggle('light', mode.value === 'light')
    // Remove values the host runtime applied inline; the complete frame CSS
    // below owns the document. No state or styles cross iframe boundaries.
    window.document.documentElement.removeAttribute('style')
    style.value = [
      previewDefaults,
      cssVariablesAdapter.transform(doc.brand, { prefix: '', includeRoles: false, selector: ':root:root' }).css,
      createThemeCssVars({ ...doc.theme, typography: { ...doc.brand.typography, ...doc.theme.typography } }, { lightSelector: ':root:root', darkSelector: ':root:root.dark' }),
      'html, body { margin: 0; min-height: 100%; } html { color-scheme: light; overscroll-behavior: contain; } html.dark { color-scheme: dark; } body { background: var(--ui-bg); color: var(--ui-text); }'
    ].join('\n')
    document.value = doc
    error.value = ''
    nextTick(() => {
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
    })
  } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Preview unavailable.' }
}
onMounted(() => {
  window.addEventListener('message', receive)
  window.parent.postMessage({ type: 'id-studio-ready', frame: route.query.frame }, window.location.origin)
})
onBeforeUnmount(() => window.removeEventListener('message', receive))
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
