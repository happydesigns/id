<script setup lang="ts">
import { galleryCard as card } from '../../gallery'
const users = ['Alex Morgan', 'Sam Taylor', 'Jamie Chen']
const period = ref('This week’s goal')
const periods = ['This week’s goal', 'This month’s goal']
</script>

<template>
<UCard :ui="card" class="example-card">
        <div class="flex items-start justify-between gap-3"><div><p class="text-sm text-muted">Tasks completed</p><p class="mt-1 text-3xl font-semibold text-highlighted">92<span class="text-lg text-muted">%</span></p></div><UDropdownMenu :items="periods.map(label => ({ label, onSelect: () => { period = label } }))"><UButton icon="i-lucide-ellipsis" aria-label="Progress period" color="neutral" variant="ghost" size="xs" /></UDropdownMenu></div>
        <div class="my-4 flex justify-between text-xs text-muted"><span>{{ period }}</span><span>Almost there</span></div><UProgress :model-value="92" aria-label="Tasks completed" />
        <USeparator class="my-4" /><div class="flex items-center justify-between"><UAvatarGroup><UAvatar v-for="user in users" :key="user" :alt="user" size="sm" /></UAvatarGroup><span class="text-xs text-muted">3 contributors</span></div>
      </UCard>
</template>
