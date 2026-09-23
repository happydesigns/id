<script setup lang="ts">
defineOptions({ name: 'EmbeddedStudioPage' })
definePageMeta({ layout: false })
const mode = useColorMode()
</script>

<template>
  <UContainer class="py-8 space-y-6">
    <UButton @click="mode.preference = mode.value === 'dark' ? 'light' : 'dark'">
      Toggle host mode
    </UButton>
    <IdStudioLink />
    <IdStudioEmbed title="Embedded brand editor" />
  </UContainer>
</template>
