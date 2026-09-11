<script setup lang="ts">
import { galleryCard as card } from '../../gallery'

</script>

<template>
<UCard :ui="card" class="example-card">
        <h2>Your milestones</h2>
        <div v-for="goal in [{ name: 'Design system', value: 80, count: '24 / 30' }, { name: 'Website launch', value: 45, count: '9 / 20' }]" :key="goal.name" class="mt-5">
          <div class="mb-2 flex justify-between text-xs text-muted"><span>{{ goal.name }}</span><span>{{ goal.value }}%</span></div><p class="mb-3 text-2xl font-semibold text-highlighted">{{ goal.count }}<span class="ml-2 text-xs font-normal text-muted">tasks</span></p><UProgress :model-value="goal.value" :aria-label="goal.name" size="sm" />
        </div>
      </UCard>
</template>
