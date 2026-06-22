<script setup lang="ts">
import { computed, useAppConfig } from '#imports'
import type { BrandAsset, BrandRuntimeConfig } from '../../src'

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

const appConfig = useAppConfig() as { id?: BrandRuntimeConfig }

const defaultLogoRoles = ['logo', 'wordmark', 'symbol', 'mark', 'appIcon']

const brandLabel = computed(() => {
  return props.label ?? appConfig.id?.guide?.title ?? appConfig.id?.name ?? 'Brand'
})

function matchesMedia(asset: BrandAsset) {
  return !props.media || !asset.media || asset.media === 'any' || asset.media === props.media
}

function matchesRole(entry: { asset: BrandAsset, role: string }, role: string) {
  return entry.role === role || entry.asset.role === role
}

function selectAsset(entries: { asset: BrandAsset, role: string }[]) {
  const requestedRole = props.role ?? props.variant

  if (requestedRole) {
    return entries.find(entry => matchesRole(entry, requestedRole))?.asset
  }

  return entries.find(entry => defaultLogoRoles.includes(entry.role) || defaultLogoRoles.includes(entry.asset.role))?.asset
    ?? entries[0]?.asset
}

const logo = computed(() => {
  const guide = appConfig.id?.guide
  const logos = Object.entries(guide?.assets?.logos ?? {})
    .map(([role, asset]) => asset ? { role, asset } : undefined)
    .filter((entry): entry is { role: string, asset: BrandAsset } => Boolean(entry))
  const files = (guide?.assets?.files ?? []).map(asset => ({ role: asset.role, asset }))
  const entries = [...logos, ...files]
  const mediaEntries = entries.filter(entry => matchesMedia(entry.asset))

  return selectAsset(mediaEntries) ?? selectAsset(entries)
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
