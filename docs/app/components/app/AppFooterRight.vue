<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <UButton
    v-if="appConfig.github?.url"
    :to="appConfig.github.url"
    target="_blank"
    icon="i-simple-icons-github"
    aria-label="GitHub repository"
    color="neutral"
    variant="ghost"
    size="sm"
  />
</template>
