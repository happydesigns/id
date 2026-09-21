<script setup lang="ts">
defineOptions({ name: 'PlaygroundEntry' })
const route = useRoute()
await navigateTo({ path: '/studio', query: { ...route.query, browse: 'true' } }, { redirectCode: 302 })
</script>

<template>
  <div />
</template>
