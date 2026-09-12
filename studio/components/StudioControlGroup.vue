<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <div class="studio-control-group" role="group" :aria-label="label"><slot /></div>
</template>

<style>
.studio-control-group { --studio-control-inner-radius: max(0px, calc(var(--ui-radius) * 4 - 2px)); display: flex; align-items: center; padding: 2px; border-radius: calc(var(--ui-radius) * 4); background: color-mix(in srgb, var(--ui-bg-elevated) 50%, transparent); box-shadow: 0 0 0 1px var(--ui-border); }
.studio-control-group > button { padding: 6px; border-radius: var(--studio-control-inner-radius); }
</style>
