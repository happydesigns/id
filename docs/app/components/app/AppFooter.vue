<script setup lang="ts">
const appConfig = useAppConfig()
const licenseUrl = computed(() => appConfig.github?.url ? appConfig.github.url + '/blob/' + appConfig.github.branch + '/LICENSE' : undefined)
</script>

<template>
  <AppNavigationTheme>
    <UFooter class="border-t border-default">
      <template #left>
        <p class="text-sm text-muted">
          Published under
          <ULink
            :to="licenseUrl"
            target="_blank"
            class="text-highlighted"
          >MIT License</ULink>
        </p>
      </template>
      <template #right>
        <AppFooterRight />
      </template>
    </UFooter>
  </AppNavigationTheme>
</template>
