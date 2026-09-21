<script setup lang="ts">
defineOptions({
  name: 'BrandLogo'
})
</script>

<template>
  <span class="inline-flex h-6 items-center gap-2 text-sm font-semibold leading-5 text-highlighted">
    <img
      src="/favicon.svg"
      alt=""
      aria-hidden="true"
      class="size-5 shrink-0"
    >
    <span class="truncate">
      Example Brand
    </span>
  </span>
</template>
