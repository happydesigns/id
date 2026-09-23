<script setup lang="ts">
defineOptions({ name: 'BrandShowcasePage' })
definePageMeta({ layout: false })
const mode = useColorMode()
const hydrated = ref(false)
onMounted(() => {
  hydrated.value = true
})
</script>

<template>
  <UContainer class="py-8">
    <UButton
      class="mb-8"
      :disabled="!hydrated"
      @click="mode.preference = mode.value === 'dark' ? 'light' : 'dark'"
    >
      Toggle host mode
    </UButton>
    <div
      class="grid"
      data-showcase-grid
    >
      <IdStudioShowcase />
    </div>
  </UContainer>
</template>
