<script setup lang="ts">
import brand from '../brand.assets.json'

type Logo = { src: string, alt?: string }
const config = useAppConfig() as unknown as {
  brand?: { name: string, assets?: { logos?: Record<string, Logo> } }
}
const assets = computed(() => config.brand?.assets?.logos ?? brand.logos as Record<string, Logo>)
const light = computed(() => assets.value.wordmark ?? assets.value.logo)
const dark = computed(() => assets.value.wordmarkInverse ?? assets.value.logoInverse ?? light.value)
</script>

<template>
  <UColorModeImage
    v-if="light"
    :light="light.src"
    :dark="dark?.src || light.src"
    :alt="light.alt || config.brand?.name || brand.name"
    class="h-6 w-auto"
  />
  <span v-else>{{ config.brand?.name || brand.name }}</span>
</template>
