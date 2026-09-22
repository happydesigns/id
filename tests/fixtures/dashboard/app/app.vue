<script setup lang="ts">
const config = useAppConfig() as { appTitle: string, brand?: { assets?: { logos?: Record<string, { src: string, alt: string }> } } }
const mode = useColorMode()
const logo = computed(() => config.brand?.assets?.logos?.[mode.value === 'dark' ? 'wordmarkInverse' : 'wordmark'])
</script>

<template>
  <UApp>
    <header class="flex items-center justify-between gap-4 p-8">
      <img
        v-if="logo"
        :src="logo.src"
        :alt="logo.alt"
        width="24"
        height="24"
      >
      <p>{{ config.appTitle }}</p>
      <UButton
        color="neutral"
        @click="mode.preference = mode.value === 'dark' ? 'light' : 'dark'"
      >
        Toggle mode
      </UButton>
    </header>
    <NuxtPage />
  </UApp>
</template>
