<script setup lang="ts">
defineOptions({ name: 'PreviewDemo' })
const count = ref(0)
</script>

<template>
  <main class="p-8">
    <h1>Independent app</h1>
    <UButton @click="count++">
      Count {{ count }}
    </UButton>
    <UButton to="/demo/details">
      Details
    </UButton>
    <UButton to="/outside">
      Outside preview
    </UButton>
  </main>
</template>
