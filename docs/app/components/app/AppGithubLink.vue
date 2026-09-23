<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <UButton
    v-if="appConfig.github?.url"
    :to="appConfig.github.url"
    target="_blank"
    icon="i-simple-icons-github"
    aria-label="Open on GitHub"
    color="neutral"
    variant="ghost"
  />
</template>
