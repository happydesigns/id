<script setup lang="ts">
defineOptions({
  name: 'BrandLogo'
})
</script>

<template>
  <span class="flex h-6 items-center gap-2 text-sm font-semibold leading-5 text-highlighted">
    <span class="flex size-5 shrink-0 items-center justify-center" aria-hidden="true">
      <span class="size-3 rounded-full bg-primary" />
    </span>
    <span class="flex h-5 items-center truncate">
      Example Brand
    </span>
  </span>
</template>
