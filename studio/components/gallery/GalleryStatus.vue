<script setup lang="ts">
defineProps<{ state: string }>()
</script>

<template>
  <UAlert :color="state === 'error' ? 'error' : 'success'" variant="subtle" :title="state === 'error' ? 'Changes need attention' : 'Everything is up to date'" description="Your latest work is ready to share." />
</template>
