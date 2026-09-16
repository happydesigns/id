<script setup lang="ts">
import { UColorModeImage } from '#components'
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
const logo = computed(() => {
  return brandAssets.resolveAsset({
    role: props.role,
    variant: props.variant,
    media: props.media === 'auto' ? 'light' : props.media
  })
})

const darkLogo = computed(() => brandAssets.resolveAsset({
  role: props.role,
  variant: props.variant,
  media: 'dark'
}))

const brandLabel = computed(() => {
  return props.label ?? brandAssets.brandLabel.value
})
</script>

<template>
  <UColorModeImage
    v-if="media === 'auto' && logo && darkLogo"
    :light="logo.src"
    :dark="darkLogo.src"
    :alt="alt ?? logo.alt ?? logo.name"
    class="h-8 w-auto"
  />
  <img
    v-else-if="logo"
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
