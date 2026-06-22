<script setup lang="ts">
import { computed } from 'vue'
import { useBrandTheme } from '../composables/useBrandTheme'

const brandTheme = useBrandTheme()

const items = computed(() => brandTheme.themes.value.map(theme => ({
  label: theme.label,
  value: theme.name
})))

const selectedTheme = computed<string>({
  get: () => brandTheme.currentName.value,
  set: (value) => {
    brandTheme.setTheme(value)
  }
})
</script>

<template>
  <USelect
    v-model="selectedTheme"
    :items="items"
    value-key="value"
    label-key="label"
    class="min-w-44"
  />
</template>
