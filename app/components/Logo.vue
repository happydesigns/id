<script setup lang="ts">
import { computed } from '#imports'
import { useBrandAssets } from '../composables/useBrandAssets'
import type { BrandAsset } from '../../src'

const props = withDefaults(defineProps<{
  role?: string
  variant?: string
  media?: BrandAsset['media']
  alt?: string
  label?: string
}>(), {
  role: undefined,
  variant: undefined,
  media: undefined,
  alt: undefined,
  label: undefined
})

const brandAssets = useBrandAssets()

const logo = computed(() => {
  return brandAssets.resolveAsset({
    role: props.role,
    variant: props.variant,
    media: props.media
  })
})

const brandLabel = computed(() => {
  return props.label ?? brandAssets.brandLabel.value
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
    {{ brandLabel }}
  </span>
</template>
