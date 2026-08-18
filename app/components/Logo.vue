<script setup lang="ts">
import { useColorMode } from '#imports'
import { computed } from 'vue'
import { useBrandAssets } from '../composables/useBrandAssets'
import type { BrandAsset } from '../../src'

type LogoMedia = BrandAsset['media'] | 'auto'

const props = withDefaults(defineProps<{
  role?: string
  variant?: string
  media?: LogoMedia
  alt?: string
  label?: string
}>(), {
  role: undefined,
  variant: undefined,
  media: 'auto',
  alt: undefined,
  label: undefined
})

const brandAssets = useBrandAssets()
const colorMode = useColorMode() as { value: string }

const resolvedMedia = computed<BrandAsset['media'] | undefined>(() => {
  if (props.media !== 'auto') {
    return props.media
  }

  return colorMode.value === 'dark' ? 'dark' : 'light'
})

const logo = computed(() => {
  return brandAssets.resolveAsset({
    role: props.role,
    variant: props.variant,
    media: resolvedMedia.value
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
