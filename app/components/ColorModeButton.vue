<script setup lang="ts">
import { computed, useColorMode } from '#imports'

const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')
const icon = computed(() => isDark.value ? 'i-lucide-sun' : 'i-lucide-moon')
const label = computed(() => isDark.value ? 'Switch to light mode' : 'Switch to dark mode')

function toggleColorMode() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <ClientOnly>
    <UTooltip :text="label">
      <UButton
        color="neutral"
        variant="ghost"
        :icon="icon"
        :aria-label="label"
        square
        @click="toggleColorMode"
      />
    </UTooltip>

    <template #fallback>
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-sun"
        aria-label="Color mode"
        square
        disabled
      />
    </template>
  </ClientOnly>
</template>
