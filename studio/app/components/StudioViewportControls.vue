<script setup lang="ts">
import { useStudioIcon } from '../../playground-icons'

import { computed, watch } from 'vue'

const width = defineModel<number>('width', { required: true })
const height = defineModel<number>('height', { required: true })
let lastSize = { width: 390, height: 844 }
watch([width, height], ([w, h]) => {
  if (w) lastSize = { width: w, height: h }
}, { immediate: true, flush: 'sync' })
const presets = [
  { label: 'Mobile S', value: 'small', get icon() {
    return resolveIcon('i-lucide-smartphone')
  }, width: 320, height: 568 },
  { label: 'Mobile', value: 'mobile', get icon() {
    return resolveIcon('i-lucide-smartphone')
  }, width: 390, height: 844 },
  { label: 'Tablet', value: 'tablet', get icon() {
    return resolveIcon('i-lucide-tablet')
  }, width: 768, height: 1024 },
  { label: 'Laptop', value: 'laptop', get icon() {
    return resolveIcon('i-lucide-laptop')
  }, width: 1280, height: 800 },
  { label: 'Desktop', value: 'desktop', get icon() {
    return resolveIcon('i-lucide-monitor')
  }, width: 1440, height: 900 },
  { label: 'Custom', value: 'custom', get icon() {
    return resolveIcon('i-lucide-sliders-horizontal')
  }, width: 1024, height: 768 },
]
const selected = computed(() => !width.value ? 'auto' : presets.find(item => item.value !== 'custom' && item.width === width.value && item.height === height.value)?.value || 'custom')
function select(value: string) {
  if (value === 'auto') {
    width.value = 0
    return
  }
  if (value === 'custom' && !width.value) {
    height.value = lastSize.height
    width.value = lastSize.width
    return
  }
  const preset = presets.find(item => item.value === value)
  if (preset && (value !== 'custom' || !width.value)) {
    width.value = preset.width
    height.value = preset.height
  }
}
function dimension(axis: 'width' | 'height', number: number | null | undefined) {
  const current = axis === 'width' ? width : height
  if (typeof number === 'number' && Number.isFinite(number)) current.value = Math.min(3840, Math.max(240, Math.round(number)))
}
function rotate() {
  const previous = width.value
  width.value = height.value
  height.value = previous
}

const resolveIcon = useStudioIcon()
</script>

<template>
  <div class="viewport-controls">
    <UFormField
      label="Viewport"
      class="w-full"
    >
      <USelect
        :model-value="selected"
        :items="[{ label: 'Auto', value: 'auto', icon: resolveIcon('i-lucide-maximize') }, { type: 'separator' }, ...presets]"
        aria-label="Viewport size"
        class="w-full"
        @update:model-value="select(String($event))"
      />
    </UFormField>
    <div
      v-if="width"
      class="flex w-full items-center gap-2"
    >
      <UInputNumber
        :model-value="width"
        :min="240"
        :max="3840"
        :step="1"
        :increment="false"
        :decrement="false"
        aria-label="Viewport width"
        class="min-w-0 flex-1"
        @update:model-value="dimension('width', $event)"
      />
      <span
        class="text-muted"
        aria-hidden="true"
      >×</span>
      <UInputNumber
        :model-value="height"
        :min="240"
        :max="3840"
        :step="1"
        :increment="false"
        :decrement="false"
        aria-label="Viewport height"
        class="min-w-0 flex-1"
        @update:model-value="dimension('height', $event)"
      />
      <span class="text-xs text-muted">px</span>
      <UTooltip text="Rotate viewport">
        <UButton
          :icon="resolveIcon('i-lucide-rotate-cw')"
          aria-label="Rotate viewport"
          color="neutral"
          variant="ghost"
          @click="rotate"
        />
      </UTooltip>
    </div>
  </div>
</template>

<style scoped>
.viewport-controls { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
</style>
