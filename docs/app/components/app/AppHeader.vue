<script setup lang="ts">
import DocusHeader from 'docus/app/components/app/AppHeader.vue'
</script>

<template>
  <UTheme :props="{ button: { color: 'neutral', variant: 'ghost' } }">
    <DocusHeader />
  </UTheme>
</template>
