<script setup lang="ts">
import { galleryCard as card } from '../../gallery'
import { ref } from 'vue'
const amount = ref(1200)
const planSaved = ref(false)
</script>

<template>
<UCard :ui="card" class="example-card">
        <h2>Project budget</h2>
        <div class="mt-5 space-y-4">
          <UFormField label="Amount"><UInputNumber v-model="amount" :min="0" :step="100" :format-options="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }" class="w-full" /></UFormField>
          <UFormField label="Workspace"><USelect :items="['Design team', 'Marketing', 'Product']" default-value="Design team" class="w-full" /></UFormField>
          <UFormField label="Priority"><USelect :items="['Normal', 'High', 'Low']" default-value="Normal" class="w-full" /></UFormField>
          <div class="flex justify-between text-sm"><span class="text-muted">Next check-in</span><span class="text-highlighted">Tomorrow</span></div>
        </div>
        <template #footer><div class="flex justify-end"><UButton @click="planSaved = !planSaved">{{ planSaved ? 'Plan saved' : 'Save plan' }}</UButton></div></template>
      </UCard>
</template>
