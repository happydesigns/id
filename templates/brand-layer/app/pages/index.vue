<script setup lang="ts">
defineOptions({
  name: 'BrandLayerHomePage'
})

const links = [
  {
    label: 'Nuxt UI',
    to: 'https://ui.nuxt.com',
    target: '_blank',
    rel: 'noopener noreferrer',
    icon: 'i-lucide-external-link'
  }
]
</script>

<template>
  <div>
    <UHeader>
      <template #left>
        <BrandLogo />
      </template>
    </UHeader>

    <UPageHero
      title="Example Brand"
      description="A Nuxt UI brand layer powered by @happydesigns/id."
      :links="links"
    />
  </div>
</template>
