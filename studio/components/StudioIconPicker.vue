<script setup lang="ts">
import { ICON_PACKS, themeIcons, iconSetSamples, type ThemeIcons } from '../icon-sets'
import { computed } from 'vue'

const props = defineProps<{ modelValue?: Record<string, string> }>()
const emit = defineEmits<{ 'update:modelValue': [value: Record<string, string> | undefined] }>()
function selected(value: string, icons?: Record<string, string>) {
  if (!icons) return value === 'lucide'
  return Object.entries(themeIcons[value as ThemeIcons]).every(([key, name]) => icons[key] === name)
}
const selectedPack = computed(() => ICON_PACKS.find(pack => selected(pack.value, props.modelValue))?.value)
function selectPack(value: string | number | undefined) {
  if (typeof value === 'string' && value in themeIcons) emit('update:modelValue', { ...themeIcons[value as ThemeIcons] })
}
</script>

<template>
  <div
    class="flex flex-col gap-1"
    role="group"
    aria-label="Icon set"
  >
    <URadioGroup
      :model-value="selectedPack"
      :items="ICON_PACKS"
      value-key="value"
      variant="table"
      indicator="end"
      aria-label="Icon set"
      @update:model-value="selectPack"
    >
      <template #label="{ item }">
        <span class="flex items-center gap-2"><UIcon
          :name="item.icon"
          class="size-5 shrink-0 text-muted"
        />{{ item.label }}</span>
      </template>
      <template #description="{ item }">
        <span
          class="flex gap-1 ps-7 text-muted"
          aria-hidden="true"
        ><UIcon
          v-for="icon in iconSetSamples(item.value)"
          :key="icon"
          :name="icon"
          class="size-3"
        /></span>
      </template>
    </URadioGroup>
    <UButton
      v-if="modelValue"
      color="neutral"
      variant="link"
      size="xs"
      @click="emit('update:modelValue', undefined)"
    >
      Use default icons
    </UButton>
  </div>
</template>
