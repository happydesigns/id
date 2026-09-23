<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { StudioDocument } from '../../../src/studio'
import { acceptsStudioFrame, studioFrameUrl, type StudioTemplate } from '../../templates'

const props = defineProps<{
  template: StudioTemplate
  document: StudioDocument
  mode: 'light' | 'dark'
}>()

const frame = ref<HTMLIFrameElement>()
const page = ref(props.template.pages[0]?.id || 'home')
const ready = ref(false)
const failed = ref(false)
const attempt = ref(0)
let timer: number | undefined
const session = import.meta.client ? crypto.randomUUID() : ''
const src = computed(() => import.meta.client ? studioFrameUrl(props.template, 'landing', window.location.origin, session) : '')

function stopTimeout() {
  window.clearTimeout(timer)
}

function startTimeout() {
  stopTimeout()
  timer = window.setTimeout(fail, 20000)
}

function fail() {
  stopTimeout()
  failed.value = true
  ready.value = false
}

function send() {
  if (!frame.value?.contentWindow) return
  frame.value.contentWindow.postMessage({
    type: 'id-studio-preview',
    session,
    document: JSON.parse(JSON.stringify(props.document)),
    scene: props.template.id,
    page: page.value,
    path: props.template.route,
    mode: props.mode,
    preference: props.mode,
    state: 'default',
  }, new URL(frame.value.src).origin)
}

function receive(event: MessageEvent) {
  if (!acceptsStudioFrame(event, frame.value)) return
  if (event.data?.type === 'id-studio-navigate' && event.data.scene === props.template.id && props.template.pages.some(item => item.id === event.data.page)) {
    page.value = event.data.page
    send()
  }
  if (event.data?.type === 'id-studio-ready') send()
  if (event.data?.type === 'id-studio-rendered') {
    stopTimeout()
    ready.value = true
    failed.value = false
  }
  if (event.data?.type === 'id-studio-preview-error') fail()
}

function retry() {
  ready.value = false
  failed.value = false
  attempt.value++
  startTimeout()
}

watch(() => props.document, send, { deep: true })
watch(() => props.mode, (mode) => {
  const target = frame.value
  if (!target?.contentWindow) return
  const root = target.contentDocument?.documentElement
  root?.classList.toggle('dark', mode === 'dark')
  root?.classList.toggle('light', mode === 'light')
  target.contentWindow.postMessage({ type: 'id-studio-color-mode', session, mode, preference: mode }, new URL(target.src).origin)
}, { flush: 'sync' })
onMounted(() => {
  window.addEventListener('message', receive)
  startTimeout()
})
onBeforeUnmount(() => {
  window.removeEventListener('message', receive)
  stopTimeout()
})
</script>

<template>
  <div
    class="relative overflow-hidden rounded-lg border border-default bg-default"
    :data-preview-state="failed ? 'failed' : ready ? 'ready' : 'loading'"
  >
    <iframe
      :key="`${template.id}:${attempt}`"
      ref="frame"
      :src="src"
      :title="`${template.label} template preview`"
      class="block h-[min(78vh,850px)] min-h-[520px] w-full border-0"
      :class="{ 'opacity-0': !ready }"
      @load="send"
      @error="fail"
    />
    <div
      v-if="!ready"
      class="absolute inset-0 grid place-items-center bg-default p-6"
    >
      <UAlert
        v-if="failed"
        title="Preview unavailable"
        description="The template could not apply this brand."
        color="error"
        class="max-w-sm"
      >
        <template #actions>
          <UButton
            color="error"
            variant="outline"
            @click="retry"
          >
            Retry preview
          </UButton>
        </template>
      </UAlert>
      <div
        v-else
        class="w-full max-w-4xl space-y-4"
        role="status"
        aria-label="Loading template preview"
      >
        <USkeleton class="h-9 w-1/3" />
        <USkeleton class="h-52 w-full" />
        <USkeleton class="h-24 w-2/3" />
      </div>
    </div>
  </div>
</template>
