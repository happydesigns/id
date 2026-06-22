<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import type { BrandRuntimeConfig } from '../../src'

const props = withDefaults(defineProps<{
  variant?: 'wordmark' | 'symbol' | 'appIcon'
  alt?: string
}>(), {
  variant: 'wordmark',
  alt: undefined
})

const appConfig = useAppConfig() as { id?: BrandRuntimeConfig }

const logo = computed(() => {
  const logos = appConfig.id?.guide?.assets?.logos

  if (props.variant === 'symbol') {
    return logos?.symbol
  }

  if (props.variant === 'appIcon') {
    return logos?.appIcon
  }

  return logos?.wordmark
})
</script>

<template>
  <img
    v-if="logo"
    :src="logo.src"
    :alt="alt ?? logo.alt ?? logo.name"
    class="h-8 w-auto"
  >
  <span
    v-else
    class="inline-flex h-8 items-center rounded-md border border-default bg-muted px-3 text-sm font-semibold text-highlighted"
  >
    {{ appConfig.id?.guide?.title ?? 'Brand' }}
  </span>
</template>
