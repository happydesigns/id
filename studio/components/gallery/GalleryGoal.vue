<script setup lang="ts">
import { galleryCard as card } from '../../gallery'

</script>

<template>
<UCard :ui="card" class="example-card">
        <h2>Quarterly goal</h2>
        <div class="goal-ring mx-auto my-6 flex size-32 items-center justify-center rounded-full" role="img" aria-label="80 percent of the quarterly goal achieved"><div class="flex size-26 flex-col items-center justify-center rounded-full bg-default"><span class="text-2xl font-semibold text-highlighted">80%</span><span class="text-xs text-muted">of the way there</span></div></div>
        <div class="flex justify-between text-xs"><span class="text-muted">Next milestone</span><span class="text-highlighted">End of quarter</span></div>
      </UCard>
</template>
