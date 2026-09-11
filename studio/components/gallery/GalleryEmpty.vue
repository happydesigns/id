<script setup lang="ts">
import { ref } from 'vue'
import { galleryCard as card } from '../../gallery'
const created = ref(false)
</script>

<template>
  <UCard :ui="card" class="example-card">
    <UEmpty v-if="!created" icon="i-lucide-folder-open" title="No projects yet" description="Create a project for your team." variant="naked" :actions="[{ label: 'Create project', icon: 'i-lucide-plus', onClick: () => { created = true } }]" />
    <div v-else class="space-y-4"><h2>Your projects</h2><UAlert title="Untitled project" description="Ready for your first task." color="neutral" icon="i-lucide-folder" /><UButton color="neutral" variant="ghost" @click="created = false">Reset example</UButton></div>
  </UCard>
</template>
