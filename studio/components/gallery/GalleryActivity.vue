<script setup lang="ts">
import { galleryCard as card } from '../../gallery'

</script>

<template>
<UCard :ui="card" class="example-card">
        <template #header><h2>Recent activity</h2></template>
        <div class="divide-y divide-default">
          <div v-for="(item, index) in [{ name: 'Brand library', detail: 'Published a new version', icon: 'i-lucide-library', time: '2m' }, { name: 'Website refresh', detail: 'Ready for your review', icon: 'i-lucide-panels-top-left', time: '18m' }, { name: 'Product launch', detail: 'Added three new assets', icon: 'i-lucide-sparkles', time: '1h' }, { name: 'Team workspace', detail: 'Jamie joined the team', icon: 'i-lucide-users', time: '2h' }]" :key="item.name" class="flex items-center gap-3 py-3" :class="{ 'pt-0': index === 0 }">
            <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-elevated"><UIcon :name="item.icon" class="size-4 text-muted" /></span>
            <div class="min-w-0 flex-1"><p class="text-sm font-medium text-highlighted">{{ item.name }}</p><p class="text-xs text-muted">{{ item.detail }}</p></div><span class="text-xs text-muted">{{ item.time }}</span>
          </div>
        </div>
      </UCard>
</template>
