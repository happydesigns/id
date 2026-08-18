<script setup lang="ts">
import { computed } from 'vue'
import { useBrandTheme } from '../composables/useBrandTheme'

const props = withDefaults(defineProps<{
  appearance?: 'default' | 'header'
}>(), {
  appearance: 'default'
})

const brandTheme = useBrandTheme()

const items = computed(() => brandTheme.themes.value.map(theme => ({
  label: theme.label,
  value: theme.name
})))

const selectUi = computed(() => props.appearance === 'header'
  ? {
      base: 'h-8 rounded-md px-2.5 text-sm font-medium hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary/30',
      trailingIcon: 'size-4 text-muted'
    }
  : undefined)

const selectedTheme = computed<string>({
  get: () => brandTheme.selectedName.value,
  set: (value) => {
    brandTheme.setTheme(value)
  }
})
</script>

<template>
  <USelect
    v-if="items.length > 1"
    v-model="selectedTheme"
    :items="items"
    value-key="value"
    label-key="label"
    :color="appearance === 'header' ? 'neutral' : undefined"
    :variant="appearance === 'header' ? 'none' : undefined"
    :highlight="appearance === 'header' ? false : undefined"
    :ui="selectUi"
    placeholder="Select theme"
    aria-label="Theme"
    class="w-36 sm:w-44"
  />
</template>
