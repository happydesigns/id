<script setup lang="ts">
import { ref } from 'vue'
import { paletteRamp, paletteSwatch } from '../palette'

defineProps<{
  label: string
  options: string[]
  colors: Record<string, string | Record<string, string | undefined>>
}>()
const model = defineModel<string>({ required: true })
const open = ref(false)
function select(value: string) { model.value = value; open.value = false }
</script>

<template>
  <UPopover v-model:open="open" :content="{ align: 'start' }">
    <UButton color="neutral" variant="outline" trailing-icon="i-lucide-chevron-down" :aria-label="label" class="w-full" :ui="{ trailingIcon: 'ms-auto' }">
      <template #leading><span class="size-3 shrink-0 rounded-full ring ring-default" :class="{ 'bg-elevated': model === '__default' }" :style="{ background: paletteSwatch(model, colors) }" /></template>
      <span class="capitalize">{{ model === '__default' ? 'Nuxt UI default' : model }}</span>
    </UButton>
    <template #content>
      <div class="grid w-80 max-w-[calc(100vw-2rem)] grid-cols-3 gap-1 p-2 max-h-[min(65dvh,28rem)] overflow-y-auto" :aria-label="`${label} palettes`">
        <UButton color="neutral" variant="ghost" class="col-span-3" :aria-pressed="model === '__default'" :active="model === '__default'" active-variant="soft" @click="select('__default')">Nuxt UI default</UButton>
        <UButton v-for="name in options" :key="name" color="neutral" variant="ghost" size="sm" :aria-label="name" :aria-pressed="model === name" :active="model === name" active-variant="soft" class="min-w-0" @click="select(name)">
          <template #leading><span class="h-3 w-4 shrink-0 rounded-full ring ring-default" :style="{ background: paletteRamp(name, colors) }" /></template>
          <span class="break-all whitespace-normal capitalize">{{ name }}</span>
        </UButton>
      </div>
    </template>
  </UPopover>
</template>
