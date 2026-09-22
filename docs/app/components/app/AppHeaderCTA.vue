<template>
  <ClientOnly>
    <AppThemeMenu />
    <template #fallback>
      <UButton
        icon="i-lucide-palette"
        color="neutral"
        variant="ghost"
        aria-label="Appearance"
        disabled
      />
    </template>
  </ClientOnly>
</template>
