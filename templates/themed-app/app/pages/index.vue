<script setup lang="ts">
defineOptions({
  name: 'ThemedAppHomePage'
})

const { currentTheme } = useBrandTheme()
</script>

<template>
  <UApp>
    <UMain>
      <UPageHero
        title="Themed Nuxt UI app"
        description="Runtime theme packs keep brand decisions central while the app stays focused on its own content."
      >
        <template #links>
          <IdThemeSelect />
          <UButton
            to="https://id.happydesigns.de"
            target="_blank"
            trailing-icon="i-lucide-arrow-right"
          >
            Read the docs
          </UButton>
        </template>
      </UPageHero>

      <UContainer class="pb-16">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between gap-4">
              <h2 class="text-base font-semibold text-highlighted">
                Active theme
              </h2>
              <UBadge color="primary" variant="subtle">
                {{ currentTheme?.label }}
              </UBadge>
            </div>
          </template>

          <p class="text-sm text-muted">
            Change tokens and Nuxt UI defaults through app config without moving product logic into the brand.
          </p>
        </UCard>
      </UContainer>
    </UMain>
  </UApp>
</template>
