<script setup lang="ts">
import { galleryCard as card } from '../../gallery'

</script>

<template>
<UCard :ui="card" class="example-card">
        <div class="flex items-start justify-between"><div><p class="text-sm text-muted">Visitors</p><p class="mt-1 text-3xl font-semibold text-highlighted">24,680</p></div><UBadge color="success" variant="subtle" size="sm">+18%</UBadge></div>
        <div class="mt-6 flex h-24 items-end gap-2" role="img" aria-label="Weekly visits rise from Monday to a Saturday peak">
          <div v-for="(height, index) in [38, 58, 47, 78, 62, 100, 84]" :key="index" class="flex h-full min-w-0 flex-1 flex-col justify-end gap-2"><div class="rounded-t-md bg-primary" :style="{ height: height + '%' }" /><span class="text-center text-[10px] text-muted">{{ ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index] }}</span></div>
        </div>
      </UCard>
</template>
