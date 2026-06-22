<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <span class="inline-flex items-center gap-2 text-sm font-semibold leading-none text-highlighted">
    <UIcon
      name="i-lucide-fingerprint"
      class="size-5 shrink-0 text-primary"
    />
    <span class="truncate">
      {{ appConfig.header?.title || '@happydesigns/id' }}
    </span>
  </span>
</template>
