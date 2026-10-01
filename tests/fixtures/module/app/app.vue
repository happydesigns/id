<script setup>
const { brandLabel } = useBrandAssets()
</script>

<template>
  <main>
    <TestBrandLogo />
    <p data-testid="brand-label">
      {{ brandLabel }}
    </p>
    <UButton>Nuxt UI dependency</UButton>
  </main>
</template>
