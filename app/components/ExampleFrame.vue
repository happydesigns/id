<script setup lang="ts">
import { computed } from '#imports'

const props = withDefaults(defineProps<{
  variant?: 'frame' | 'plain'
}>(), {
  variant: 'frame'
})

const frameClass = computed(() => [
  'not-prose my-5',
  props.variant === 'plain'
    ? 'overflow-visible'
    : 'overflow-hidden rounded-sm border border-default bg-default p-4 sm:p-6'
])
</script>

<template>
  <div :class="frameClass">
    <slot />
  </div>
</template>
