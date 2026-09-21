<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <span class="flex h-6 items-center gap-2 text-lg font-semibold leading-5 text-highlighted">
    <span
      class="flex size-5 shrink-0 items-center justify-center"
      aria-hidden="true"
    >
      <UIcon
        name="i-lucide-fingerprint"
        class="size-5 text-primary"
      />
    </span>
    <span class="flex h-5 items-center truncate">
      {{ appConfig.header?.title || 'happydesigns/id' }}
    </span>
  </span>
</template>
