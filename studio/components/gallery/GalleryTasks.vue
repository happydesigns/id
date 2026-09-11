<script setup lang="ts">
import { galleryCard as card } from '../../gallery'
import { ref } from 'vue'
const task = ref(false)
</script>

<template>
<UCard :ui="card" class="example-card"><h2>Today’s focus</h2><UCheckbox v-model="task" label="Review the new brand direction" class="mt-5" /><UCheckbox label="Share the first draft with the team" class="mt-4" /><UCheckbox label="Check keyboard navigation" class="mt-4" /></UCard>
</template>
