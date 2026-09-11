<script setup lang="ts">
import { ref } from 'vue'
const selected = ref('')
const users = ['Alex Morgan', 'Sam Taylor', 'Jamie Chen']
const groups = [{ id: 'team', label: 'Your workspace', items: users.map(label => ({ label, avatar: { alt: label }, onSelect: () => { selected.value = label } })) }]
</script>

<template>
  <UCard :ui="{ body: 'p-0 sm:p-0' }" class="example-card">
    <UCommandPalette :groups="groups" placeholder="Find a teammate…" :input="{ autofocus: false, 'aria-label': 'Find a teammate' }" :ui="{ viewport: 'max-h-64' }" />
    <template #footer><p class="text-xs text-muted" role="status">{{ selected ? `${selected} selected` : 'Select a teammate' }}</p></template>
  </UCard>
</template>
