<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { StudioDocument } from '../../../src/studio'
import { studioFrameUrl, acceptsStudioFrame, type StudioTemplate } from '../../templates'

const props = defineProps<{
  template: StudioTemplate
  document: StudioDocument
  mode: 'light' | 'dark'
  enabled: boolean
}>()
const emit = defineEmits<{ settled: [] }>()
const container = ref<HTMLElement>()
const frame = ref<HTMLIFrameElement>()
const visible = ref(false)
const width = ref(216)
const started = ref(false)
const ready = ref(false)
const failed = ref(false)
const session = import.meta.client ? crypto.randomUUID() : ''
const src = computed(() => import.meta.client ? studioFrameUrl(props.template, 'thumbnail', window.location.origin, session) + '&previewMode=' + props.mode : '')
let observer: IntersectionObserver | undefined
let resize: ResizeObserver | undefined
let timeout: ReturnType<typeof setTimeout> | undefined
let settled = false

function finish() {
  clearTimeout(timeout)
  if (!settled) {
    settled = true
    emit('settled')
  }
}
function send() {
  frame.value?.contentWindow?.postMessage({
    type: 'id-studio-preview',
    session,
    document: JSON.parse(JSON.stringify(props.document)),
    scene: props.template.id,
    page: props.template.pages[0]?.id || 'home',
    path: props.template.route,
    mode: props.mode,
    state: 'default',
  }, props.template.origin || window.location.origin)
}
function receive(event: MessageEvent) {
  if (!acceptsStudioFrame(event, frame.value)) return
  if (event.data?.type === 'id-studio-ready') send()
  if (event.data?.type === 'id-studio-rendered') {
    ready.value = true
    finish()
  }
  if (event.data?.type === 'id-studio-preview-error') {
    failed.value = true
    finish()
  }
  // Navigation, pointer events and mode changes never leave a thumbnail.
}
watch(() => [props.enabled, visible.value], () => {
  if (!props.enabled || !visible.value || started.value) return
  started.value = true
  timeout = setTimeout(() => {
    failed.value = true
    finish()
  }, 15000)
})
watch(() => [props.document, props.mode], send, { deep: true })
onMounted(() => {
  window.addEventListener('message', receive)
  observer = new IntersectionObserver((entries) => {
    visible.value = entries.some(entry => entry.isIntersecting)
  })
  observer.observe(container.value!)
  resize = new ResizeObserver((entries) => {
    width.value = entries[0]!.contentRect.width
  })
  resize.observe(container.value!)
})
onBeforeUnmount(() => {
  clearTimeout(timeout)
  observer?.disconnect()
  resize?.disconnect()
  window.removeEventListener('message', receive)
})
</script>

<template>
  <span
    ref="container"
    class="template-thumbnail"
    aria-hidden="true"
    inert
    :data-preview-state="failed ? 'failed' : ready ? 'ready' : 'loading'"
  >
    <iframe
      v-if="started && !failed"
      ref="frame"
      :src="src"
      :title="`${template.label} thumbnail`"
      tabindex="-1"
      :style="{ transform: `scale(${width / 1280})`, opacity: ready ? 1 : 0 }"
      @load="send"
      @error="failed = true; finish()"
    />
    <img
      v-if="failed && template.thumbnail"
      :src="template.thumbnail"
      alt=""
      class="fallback"
    >
    <span
      v-else-if="failed"
      class="placeholder text-muted"
    ><UIcon
      name="i-lucide-image-off"
      class="size-6"
    /></span>
    <span
      v-else-if="!ready"
      class="placeholder"
    ><USkeleton class="h-full w-full rounded-none" /></span>
  </span>
</template>

<style scoped>
.template-thumbnail { position: relative; display: block; width: 100%; aspect-ratio: 16 / 10; overflow: hidden; border-radius: calc(var(--ui-radius) * 1.5); background: var(--ui-bg); border: 1px solid var(--ui-border); pointer-events: none; }
iframe { position: absolute; top: 0; left: 0; display: block; width: 1280px; height: 800px; border: 0; transform-origin: top left; pointer-events: none; }
.placeholder { position: absolute; inset: 0; display: grid; place-items: center; }
.fallback { width: 100%; height: 100%; object-fit: cover; object-position: top; }
</style>
