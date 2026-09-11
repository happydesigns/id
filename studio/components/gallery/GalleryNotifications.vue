<script setup lang="ts">
import { galleryCard as card } from '../../gallery'
import { ref } from 'vue'
const notifications = ref(true)
const security = ref(true)
const marketing = ref(false)
const preferencesSaved = ref(false)
</script>

<template>
<UCard :ui="card" class="example-card">
        <h2>Notifications</h2>
        <div class="mt-4 space-y-4"><USwitch v-model="notifications" label="Project updates" description="Reviews, milestones and next steps." /><USwitch v-model="security" label="Security alerts" description="Account activity worth knowing about." /><USwitch v-model="marketing" label="News and inspiration" description="Fresh ideas, every now and then." /></div>
        <template #footer><div class="flex justify-end"><UButton color="neutral" @click="preferencesSaved = !preferencesSaved">{{ preferencesSaved ? 'Preferences saved' : 'Save preferences' }}</UButton></div></template>
      </UCard>
</template>
