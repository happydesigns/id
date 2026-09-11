<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
const width = defineModel<number>('width', { required: true })
const height = defineModel<number>('height', { required: true })
const dragging = ref(false)
let origin = { x: 0, y: 0, width: 0, height: 0, scale: 1 }
const clamp = (value: number) => Math.min(3840, Math.max(240, Math.round(value)))
function start(event: PointerEvent) {
  if (event.button !== 0) return
  const currentScale = scale.value
  if (!width.value) { width.value = clamp(available.value.width); height.value = clamp(available.value.height) }
  origin = { x: event.clientX, y: event.clientY, width: width.value, height: height.value, scale: currentScale || 1 }
  dragging.value = true
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  event.preventDefault()
}
function move(event: PointerEvent, axis: string) {
  if (!dragging.value) return
  if (axis !== 'height') width.value = clamp(origin.width + 2 * (event.clientX - origin.x) / origin.scale)
  if (axis !== 'width') height.value = clamp(origin.height + (event.clientY - origin.y) / origin.scale)
}
function keyboard(event: KeyboardEvent, axis: string) {
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
const scale = computed(() => dragging.value ? origin.scale : width.value ? Math.min(1, available.value.width / width.value, available.value.height / height.value) : 1)
const frameStyle = computed(() => width.value ? { width: `${width.value}px`, height: `${height.value}px`, flex: 'none', transform: `scale(${scale.value})`, transformOrigin: 'top left' } : { width: '100%', height: '100%' })
</script>

<template>
  <div ref="surface" class="viewport-surface">
    <div class="viewport-frame" :style="width ? { width: `${width * scale}px`, height: `${height * scale}px` } : { width: '100%', height: '100%' }">
      <slot :frame-style="frameStyle" />
      <button v-for="axis in ['width', 'height', 'both']" :key="axis" type="button" :class="['viewport-handle', `handle-${axis}`]" :aria-label="`Resize viewport ${axis}`" :title="axis === 'both' ? 'Drag to resize' : `Drag to resize ${axis}`" @pointerdown="start" @pointermove="move($event, axis)" @pointerup="dragging = false" @pointercancel="dragging = false" @lostpointercapture="dragging = false" @keydown="keyboard($event, axis)"><UIcon :name="axis === 'both' ? 'i-lucide-move-diagonal-2' : axis === 'width' ? 'i-lucide-grip-vertical' : 'i-lucide-grip-horizontal'" /></button>
    </div>
    <span v-if="width && scale < 0.99" class="viewport-scale">{{ Math.round(scale * 100) }}%</span>
  </div>
</template>

<style scoped>
.viewport-surface { position: relative; flex: 1; width: 100%; min-height: 0; display: flex; justify-content: center; overflow: hidden; }
.viewport-frame { position: relative; flex: none; }
.viewport-handle { position: absolute; display: flex; align-items: center; justify-content: center; background: var(--ui-bg-elevated); color: var(--ui-text-muted); border: 1px solid var(--ui-border); border-radius: 6px; touch-action: none; z-index: 1; }
.viewport-handle:hover, .viewport-handle:focus-visible { color: var(--ui-primary); outline: 2px solid var(--ui-primary); }
.handle-width { right: 0; top: calc(50% - 18px); width: 16px; height: 36px; cursor: ew-resize; }
.handle-height { bottom: 0; left: calc(50% - 18px); width: 36px; height: 16px; cursor: ns-resize; }
.handle-both { bottom: 0; right: 0; width: 22px; height: 22px; cursor: nwse-resize; }
.viewport-scale { position: absolute; bottom: 4px; right: 8px; font-size: 11px; color: var(--ui-text-muted); background: var(--ui-bg); border-radius: 4px; padding: 2px 4px; pointer-events: none; }
</style>
