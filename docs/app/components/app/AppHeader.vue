<template>
  <AppNavigationTheme>
    <UHeader
      :ui="{ center: 'flex-1' }"
      class="flex flex-col"
    >
      <AppHeaderCenter />
      <template #left>
        <AppHeaderLeft />
      </template>
      <template #right>
        <UContentSearchButton class="lg:hidden" />
        <AppHeaderCTA />
      </template>
      <template #body>
        <AppHeaderBody />
      </template>
      <template #bottom>
        <AppHeaderBottom />
      </template>
    </UHeader>
  </AppNavigationTheme>
</template>
