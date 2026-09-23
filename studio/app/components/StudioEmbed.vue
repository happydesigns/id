<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

defineProps<{ title?: string }>()
const colorMode = useColorMode()
const baseURL = useRuntimeConfig().app.baseURL
const container = ref<HTMLElement>()
const frame = ref<HTMLIFrameElement>()
const src = ref('')
const ready = ref(false)
const failed = ref(false)
const attempt = ref(0)
let observer: IntersectionObserver | undefined
let timer: ReturnType<typeof setTimeout> | undefined
function sendMode() {
  frame.value?.contentWindow?.postMessage({ type: 'id-studio-embed-mode', mode: colorMode.value === 'dark' ? 'dark' : 'light' }, window.location.origin)
}
function start() {
  clearTimeout(timer)
  ready.value = false
  failed.value = false
  src.value = baseURL.replace(/\/$/, '') + '/studio' + '?embed=true&browse=true&mode=' + (colorMode.value === 'dark' ? 'dark' : 'light')
  timer = setTimeout(() => {
    failed.value = true
  }, 45000)
}
function retry() {
  attempt.value++
  start()
}
function receive(event: MessageEvent) {
  if (event.origin !== window.location.origin || event.source !== frame.value?.contentWindow || event.data?.type !== 'id-studio-embed-ready') return
  clearTimeout(timer)
  ready.value = true
  failed.value = false
  sendMode()
}
watch(() => colorMode.value, () => {
  if (src.value) sendMode()
})
onMounted(() => {
  window.addEventListener('message', receive)
  observer = new IntersectionObserver((entries) => {
    if (entries.some(entry => entry.isIntersecting)) {
      observer?.disconnect()
      start()
    }
  }, { rootMargin: '200px' })
  if (container.value) observer.observe(container.value)
})
onBeforeUnmount(() => {
  observer?.disconnect()
  clearTimeout(timer)
  window.removeEventListener('message', receive)
})
</script>

<template>
  <div
    ref="container"
    class="relative h-[min(85dvh,960px)] min-h-[560px] overflow-hidden rounded-lg border border-default bg-default"
    :data-studio-embed="failed ? 'failed' : ready ? 'ready' : 'loading'"
    :aria-busy="!ready && !failed"
  >
    <iframe
      v-if="src"
      :key="attempt"
      ref="frame"
      :src="src"
      :title="title || 'Brand Studio'"
      class="size-full border-0"
      :class="{ invisible: !ready }"
      @error="failed = true"
    />
    <div
      v-if="!ready"
      class="absolute inset-0 grid place-items-center bg-default p-6"
    >
      <UAlert
        v-if="failed"
        title="Studio unavailable"
        color="error"
        class="max-w-sm"
      >
        <template #actions>
          <UButton
            color="error"
            variant="outline"
            @click="retry"
          >
            Retry
          </UButton>
        </template>
      </UAlert>
      <div
        v-else
        role="status"
        :aria-label="title || 'Loading Studio'"
        class="w-full max-w-4xl space-y-4"
      >
        <USkeleton class="h-9 w-1/3" /><USkeleton class="h-64 w-full" /><USkeleton class="h-10 w-2/3" />
      </div>
    </div>
  </div>
</template>
