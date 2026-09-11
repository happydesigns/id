<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
defineProps<{ loading?: boolean, failed?: boolean }>()
defineEmits<{ retry: [] }>()
const width = defineModel<number>('width', { required: true })
const height = defineModel<number>('height', { required: true })
const zoom = defineModel<number>('zoom', { default: 1 })
const dragging = ref(false)
let origin = { x: 0, y: 0, width: 0, height: 0, scale: 1 }
const clamp = (value: number) => Math.min(3840, Math.max(240, Math.round(value)))
function start(event: PointerEvent) {
  if (event.button !== 0) return
  const currentScale = scale.value
  if (!width.value) { width.value = clamp(available.value.width); height.value = clamp(available.value.height) }
  origin = { x: event.clientX, y: event.clientY, width: width.value, height: height.value, scale: currentScale || 1 }
  dragging.value = true
  zoom.value = currentScale
  ;(event.currentTarget as HTMLElement).focus()
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  event.preventDefault()
}
function move(event: PointerEvent, axis: string) {
  if (!dragging.value) return
  if (axis !== 'height') width.value = clamp(Math.min(available.value.width / origin.scale, origin.width + 2 * (event.clientX - origin.x) / origin.scale))
  if (axis !== 'width') height.value = clamp(Math.min(available.value.height / origin.scale, origin.height + (event.clientY - origin.y) / origin.scale))
}
function cancel() { if (dragging.value) { width.value = origin.width; height.value = origin.height; dragging.value = false } }
function keyboard(event: KeyboardEvent, axis: string) {
  if (event.key === 'Escape') { event.preventDefault(); cancel(); return }
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
  event.preventDefault()
  if (!width.value) { width.value = clamp(available.value.width); height.value = clamp(available.value.height) }
  const step = event.shiftKey ? 10 : 1
  if (axis !== 'height' && event.key.startsWith('Arrow') && ['ArrowLeft', 'ArrowRight'].includes(event.key)) width.value = clamp(width.value + (event.key === 'ArrowRight' ? step : -step))
  if (axis !== 'width' && ['ArrowUp', 'ArrowDown'].includes(event.key)) height.value = clamp(height.value + (event.key === 'ArrowDown' ? step : -step))
}
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
const scale = computed(() => dragging.value ? origin.scale : width.value ? Math.min(zoom.value, available.value.width / width.value, available.value.height / height.value) : 1)
const frameStyle = computed(() => width.value ? { width: `${width.value}px`, height: `${height.value}px`, flex: 'none', transform: `scale(${scale.value})`, transformOrigin: 'top left' } : { width: '100%', height: '100%' })
</script>

<template>
  <div ref="surface" class="viewport-surface" :class="{ 'viewport-responsive': width }">
    <div class="viewport-frame" :style="width ? { width: `${width * scale}px`, height: `${height * scale}px` } : { width: '100%', height: '100%' }">
      <div class="viewport-clip">
      <slot :frame-style="frameStyle" />
      <div v-if="failed" class="viewport-loading">
        <div class="space-y-3 p-6 text-center">
          <p role="alert" class="text-sm">Preview could not load.</p>
          <UButton color="neutral" variant="outline" icon="i-lucide-refresh-cw" @click="$emit('retry')">Retry preview</UButton>
        </div>
      </div>
      <div v-else-if="loading" class="viewport-loading" role="status"><UIcon name="i-lucide-loader-circle" class="size-5 animate-spin" /><span class="sr-only">Loading preview</span></div>
      </div>
      <button v-for="axis in width ? ['width', 'height', 'both'] : []" :key="axis" type="button" :class="['viewport-handle', `handle-${axis}`]" :aria-label="`Resize viewport ${axis}`" :title="axis === 'both' ? 'Drag to resize' : `Drag to resize ${axis}`" @pointerdown="start" @pointermove="move($event, axis)" @pointerup="dragging = false" @pointercancel="cancel" @lostpointercapture="dragging = false" @keydown="keyboard($event, axis)"><span aria-hidden="true" /></button>
    </div>
    <span v-if="width && scale < 0.99" class="viewport-scale">{{ Math.round(scale * 100) }}%</span>
  </div>
</template>

<style scoped>
.viewport-surface { position: relative; flex: 1; width: 100%; min-height: 0; display: flex; justify-content: center; overflow: hidden; }
.viewport-responsive { box-sizing: border-box; padding: 20px; background: var(--ui-bg-muted); border-radius: 18px; }
.viewport-frame { position: relative; flex: none; }
.viewport-clip { position: absolute; inset: 0; overflow: hidden; border-radius: 18px; isolation: isolate; }
.viewport-loading { position: absolute; inset: 0; display: grid; place-items: center; background: var(--ui-bg-muted); color: var(--ui-text-muted); border-radius: 18px; z-index: 2; }
.viewport-handle { position: absolute; display: flex; align-items: center; justify-content: center; color: var(--ui-text-dimmed); border: 0; background: transparent; touch-action: none; z-index: 1; }
.viewport-handle:hover, .viewport-handle:focus-visible { color: var(--ui-primary); background: var(--ui-bg-accented); border-radius: 6px; outline: none; }
.viewport-handle:focus-visible { box-shadow: inset 0 0 0 2px var(--ui-primary); }
.handle-width { right: -20px; top: 0; width: 20px; height: 100%; cursor: ew-resize; }
.handle-height { bottom: -20px; left: 0; width: 100%; height: 20px; cursor: ns-resize; }
.handle-width span { width: 4px; height: 36px; border-radius: 4px; background: currentColor; }
.handle-height span { height: 4px; width: 36px; border-radius: 4px; background: currentColor; }
.handle-both { bottom: -20px; right: -20px; width: 20px; height: 20px; cursor: nwse-resize; }
.handle-both span { width: 8px; height: 8px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; border-bottom-right-radius: 3px; }
.viewport-scale { position: absolute; bottom: 2px; right: 26px; font-size: 11px; color: var(--ui-text-muted); background: var(--ui-bg); border-radius: 4px; padding: 2px 4px; pointer-events: none; }
@media (pointer: coarse) {
  .viewport-responsive { padding: 28px; }
  .handle-width { width: 28px; right: -28px; }
  .handle-height { height: 28px; bottom: -28px; }
  .handle-both { width: 28px; height: 28px; right: -28px; bottom: -28px; }
}
</style>
