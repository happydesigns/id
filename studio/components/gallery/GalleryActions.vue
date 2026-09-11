<script setup lang="ts">
import { galleryCard as card } from '../../gallery'
import { ref } from 'vue'
const saved = ref(false)
const open = ref(false)
</script>

<template>
<UCard :ui="card" class="example-card">
        <h2>Actions</h2>
        <div class="mt-4 flex flex-wrap gap-2"><UButton @click="saved = !saved">{{ saved ? 'Changes saved' : 'Save changes' }}</UButton><UButton color="neutral" variant="outline" @click="open = true">Preview dialog</UButton><UButton color="neutral" variant="soft" disabled>Unavailable</UButton></div>
        <div class="mt-4 flex flex-wrap gap-2"><UBadge variant="subtle">New</UBadge><UBadge color="success" variant="subtle">Approved</UBadge><UBadge color="warning" variant="subtle">In review</UBadge></div>
      </UCard>
<UModal v-model:open="open" title="Review your changes" description="Save the updated project settings?"><template #body><p class="text-sm text-muted">The new settings will apply to this project.</p></template><template #footer><UButton @click="open = false">Done</UButton><UButton color="neutral" variant="outline" @click="open = false">Cancel</UButton></template></UModal>
</template>
