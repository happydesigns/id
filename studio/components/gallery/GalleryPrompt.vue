<script setup lang="ts">
import { ref } from 'vue'
import { galleryCard as card } from '../../gallery'
const prompt = ref('')
const submitted = ref(false)
const tone = ref('Concise')
const tones = ['Concise', 'Detailed']
</script>

<template>
  <UCard :ui="card" class="example-card">
    <h2 class="mb-4">Draft a project brief</h2>
    <UChatPrompt v-model="prompt" :autofocus="false" placeholder="Describe the project…" aria-label="Project brief prompt" @submit="submitted = true">
      <template #footer><UDropdownMenu :items="tones.map(label => ({ label, onSelect: () => { tone = label } }))"><UButton color="neutral" variant="ghost" trailing-icon="i-lucide-chevron-down" size="sm">{{ tone }}</UButton></UDropdownMenu><UChatPromptSubmit :disabled="!prompt.trim()" aria-label="Submit example prompt" /></template>
    </UChatPrompt>
    <p v-if="submitted" role="status" class="mt-3 text-sm text-muted">Prompt captured locally. No AI request was sent.</p>
  </UCard>
</template>
