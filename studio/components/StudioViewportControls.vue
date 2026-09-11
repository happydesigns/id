<script setup lang="ts">
import { computed } from 'vue'
const width = defineModel<number>('width', { required: true })
const height = defineModel<number>('height', { required: true })
const presets = [
  { label: 'Auto', value: 'auto', width: 0, height: 844 },
  { label: 'Mobile S · 320 × 568', value: 'small', width: 320, height: 568 },
  { label: 'Mobile · 390 × 844', value: 'mobile', width: 390, height: 844 },
  { label: 'Tablet · 768 × 1024', value: 'tablet', width: 768, height: 1024 },
  { label: 'Laptop · 1280 × 800', value: 'laptop', width: 1280, height: 800 },
  { label: 'Desktop · 1440 × 900', value: 'desktop', width: 1440, height: 900 },
  { label: 'Custom', value: 'custom', width: 1024, height: 768 }
]
const selected = computed(() => !width.value ? 'auto' : presets.find(item => item.value !== 'custom' && item.width === width.value && item.height === height.value)?.value || 'custom')
function select(value: string) {
  const preset = presets.find(item => item.value === value)
  if (preset && (value !== 'custom' || !width.value)) { width.value = preset.width; height.value = preset.height }
}
function dimension(axis: 'width' | 'height', event: Event) {
  const target = event.target as HTMLInputElement
  const number = Number(target.value)
  const current = axis === 'width' ? width : height
  if (Number.isFinite(number) && number >= 240 && number <= 3840) current.value = Math.round(number)
  target.value = String(current.value)
}
function rotate() { const previous = width.value; width.value = height.value; height.value = previous }
</script>

<template>
  <div class="viewport-controls">
    <USelect :model-value="selected" :items="presets" aria-label="Preview width" class="max-w-48" @update:model-value="select(String($event))" />
    <div v-if="width" class="flex items-center gap-1">
      <UInput :model-value="width" type="number" :min="240" :max="3840" aria-label="Viewport width" class="w-20" @change="dimension('width', $event)" />
      <span class="text-muted" aria-hidden="true">×</span>
      <UInput :model-value="height" type="number" :min="240" :max="3840" aria-label="Viewport height" class="w-20" @change="dimension('height', $event)" />
      <UTooltip text="Rotate viewport"><UButton icon="i-lucide-rotate-cw" aria-label="Rotate viewport" color="neutral" variant="ghost" @click="rotate" /></UTooltip>
    </div>
  </div>
</template>

<style scoped>
.viewport-controls { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
</style>
