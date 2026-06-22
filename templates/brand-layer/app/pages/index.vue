<script setup lang="ts">
defineOptions({
  name: 'BrandLayerHomePage'
})

const links = [
  {
    label: 'Nuxt UI',
    to: 'https://ui.nuxt.com',
    target: '_blank',
    icon: 'i-lucide-external-link'
  }
]
</script>

<template>
  <UApp>
    <UMain>
      <UPageHero
        title="Example Brand"
        description="A Nuxt UI brand layer powered by @happydesigns/id."
        :links="links"
      />
    </UMain>
  </UApp>
</template>
