<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
const props = defineProps<{ width: number, height: number }>()
const surface = ref<HTMLElement>()
const available = ref({ width: 0, height: 0 })
let observer: ResizeObserver | undefined
onMounted(() => {
  observer = new ResizeObserver(([entry]) => {
    if (entry) available.value = { width: entry.contentRect.width, height: entry.contentRect.height }
  })
  if (surface.value) observer.observe(surface.value)
})
onBeforeUnmount(() => observer?.disconnect())
const scale = computed(() => props.width ? Math.min(1, available.value.width / props.width, available.value.height / props.height) : 1)
const frameStyle = computed(() => props.width ? { width: `${props.width}px`, height: `${props.height}px`, flex: 'none', transform: `scale(${scale.value})`, transformOrigin: 'top left' } : { width: '100%', height: '100%' })
</script>

<template>
  <div ref="surface" class="viewport-surface">
    <div class="viewport-frame" :style="width ? { width: `${width * scale}px`, height: `${height * scale}px` } : { width: '100%', height: '100%' }">
      <slot :frame-style="frameStyle" />
    </div>
    <span v-if="width && scale < 0.99" class="viewport-scale">{{ Math.round(scale * 100) }}%</span>
  </div>
</template>

<style scoped>
.viewport-surface { position: relative; flex: 1; width: 100%; min-height: 0; display: flex; justify-content: center; overflow: hidden; }
.viewport-frame { flex: none; }
.viewport-scale { position: absolute; bottom: 4px; right: 8px; font-size: 11px; color: var(--ui-text-muted); background: var(--ui-bg); border-radius: 4px; padding: 2px 4px; pointer-events: none; }
</style>
