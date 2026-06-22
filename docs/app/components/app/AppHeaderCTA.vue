<template>
  <ClientOnly>
    <IdThemeSelect
      appearance="header"
      class="hidden sm:flex"
    />

    <template #fallback>
      <div class="hidden h-8 w-44 sm:block" />
    </template>
  </ClientOnly>
</template>
