<script setup lang="ts">
defineProps<{
  name: string
  value: string
}>()
</script>

<template>
  <div class="flex items-center gap-3">
    <span
      class="size-9 shrink-0 rounded-md border border-default"
      :style="{ background: value }"
      aria-hidden="true"
    />
    <span class="min-w-0">
      <span class="block truncate text-sm font-medium text-highlighted">{{ name }}</span>
      <span class="block font-mono text-xs text-muted">{{ value }}</span>
    </span>
  </div>
</template>
