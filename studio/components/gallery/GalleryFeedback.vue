<script setup lang="ts">
import { galleryCard as card } from '../../gallery'
import { ref, reactive } from 'vue'
const attached = ref(false)
const submitted = ref(false)
const feedback = reactive({ title: '', category: 'Design', priority: 'Normal', message: '' })
const validateFeedback = (state: typeof feedback) => [
  ...(!state.title.trim() ? [{ name: 'title', message: 'Enter a title.' }] : []),
  ...(state.message.trim().length < 10 ? [{ name: 'message', message: 'Describe the issue in at least 10 characters.' }] : [])
]

</script>

<template>
<UCard :ui="card" class="example-card">
        <h2>Share feedback</h2>
        <UForm :state="feedback" :validate="validateFeedback" :validate-on="[]" class="mt-5 space-y-4" @submit="submitted = true">
          <UFormField name="title" label="Title" required><UInput v-model="feedback.title" placeholder="Brief summary" class="w-full" /></UFormField>
          <div class="grid grid-cols-2 gap-3"><UFormField label="Category"><USelect :items="['Design', 'Content', 'Interaction']" default-value="Design" class="w-full" /></UFormField><UFormField label="Priority"><USelect :items="['Normal', 'High', 'Low']" default-value="Normal" class="w-full" /></UFormField></div>
          <UFormField name="message" label="Description" required><UTextarea v-model="feedback.message" placeholder="What happened, and what did you expect?" :rows="3" class="w-full" /></UFormField>
          <div class="flex items-center justify-between gap-2"><UButton icon="i-lucide-paperclip" color="neutral" variant="ghost" size="sm" @click="attached = !attached">{{ attached ? 'Example attached' : 'Add example' }}</UButton><UButton type="submit">Send feedback</UButton></div>
          <p v-if="submitted" role="status" class="text-sm text-success">Feedback validated. Nothing was sent.</p>
        </UForm>
      </UCard>
</template>
