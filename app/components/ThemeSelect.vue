<script setup lang="ts">
import { computed } from 'vue'
import { useBrandTheme } from '../composables/useBrandTheme'

const brandTheme = useBrandTheme()

const items = computed(() => brandTheme.themes.value.map(theme => ({
  label: theme.label,
  value: theme.name
})))

function updateTheme(value: string | number | boolean | Record<string, unknown> | undefined) {
  if (typeof value === 'string') {
    brandTheme.setTheme(value)
  }
}
</script>

<template>
  <USelect
    :model-value="brandTheme.currentName.value"
    :items="items"
    value-key="value"
    label-key="label"
    class="min-w-44"
    @update:model-value="updateTheme"
  />
</template>
