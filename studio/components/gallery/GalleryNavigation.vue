<script setup lang="ts">
import { computed, ref } from 'vue'
import { galleryCard as card } from '../../gallery'
const selected = ref('Overview')
const items = computed(() => [{ label: 'Overview', icon: 'i-lucide-layout-dashboard' }, { label: 'Projects', icon: 'i-lucide-folder', badge: '4' }, { label: 'Team', icon: 'i-lucide-users' }, { label: 'Settings', icon: 'i-lucide-settings' }].map(item => ({ ...item, active: selected.value === item.label, onSelect: () => { selected.value = item.label } })))
</script>

<template>
  <UCard :ui="card" class="example-card">
    <h2 class="mb-4">Workspace navigation</h2>
    <UNavigationMenu :items="items" orientation="vertical" aria-label="Example workspace navigation" class="w-full" />
    <template #footer><p class="text-xs text-muted" role="status">{{ selected }}</p></template>
  </UCard>
</template>
