<script setup lang="ts">
import { computed } from 'vue'

defineProps<{ grouped?: boolean }>()
const model = defineModel<'light' | 'dark' | 'system'>({ required: true })
const appConfig = useAppConfig()
const modes = computed(() => [
  { value: 'light', label: 'Light', icon: appConfig.ui.icons.light },
  { value: 'dark', label: 'Dark', icon: appConfig.ui.icons.dark },
  { value: 'system', label: 'System', icon: appConfig.ui.icons.system },
])
function select(value: string | number) {
  if (value === 'light' || value === 'dark' || value === 'system') model.value = value
}
</script>

<template>
  <!-- Nuxt UI ThemeStudioColorModeTabs pattern; model stays owned by Studio. -->
  <UTabs
    :model-value="model"
    :items="modes"
    :content="false"
    color="neutral"
    size="xs"
    class="shrink-0"
    :ui="{
      label: 'sr-only',
      list: grouped ? 'bg-transparent p-0' : 'studio-control-group',
      indicator: ['rounded-[var(--studio-control-inner-radius)]', grouped ? 'bg-default inset-y-0' : 'bg-default inset-y-0.5'].join(' '),
      trigger: 'rounded-[var(--studio-control-inner-radius)] in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:rounded-[var(--studio-control-inner-radius)] data-[state=active]:text-highlighted w-full in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-default gap-0 p-1.5',
    }"
    aria-label="Color mode"
    @update:model-value="select"
  />
</template>
