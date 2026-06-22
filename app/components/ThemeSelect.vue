<script setup lang="ts">
import { computed } from '#imports'
import { useBrandTheme } from '../composables/useBrandTheme'

const brandTheme = useBrandTheme()

const items = computed(() => brandTheme.themes.value.map(theme => ({
  label: theme.label,
  value: theme.name
})))

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
    placeholder="Select theme"
    aria-label="Theme"
    class="w-36 sm:w-44"
  />
</template>
