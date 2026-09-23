<script setup lang="ts">
import AppGithubLink from './AppGithubLink.vue'

const appConfig = useAppConfig()
</script>

<template>
  <AppNavigationTheme>
    <UHeader
      class="flex flex-col"
    >
      <UNavigationMenu :items="appConfig.header.links" />
      <template #left>
        <AppHeaderLeft />
      </template>
      <template #right>
        <UContentSearchButton />
        <AppHeaderCTA />
        <AppGithubLink />
      </template>
      <template #body>
        <UNavigationMenu
          :items="appConfig.header.links"
          orientation="vertical"
        />
        <USeparator class="my-4" />
        <AppHeaderBody />
      </template>
    </UHeader>
  </AppNavigationTheme>
</template>
