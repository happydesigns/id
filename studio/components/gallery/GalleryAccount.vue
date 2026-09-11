<script setup lang="ts">
import { reactive, ref } from 'vue'
import { galleryCard as card } from '../../gallery'
const account = reactive({ name: 'Alex Morgan', email: 'alex@example.com' })
const weekly = ref(true)
const mentions = ref(true)
</script>

<template>
  <UCard :ui="card" class="example-card">
    <h2 class="mb-4">Account settings</h2>
    <UTabs :items="[{ label: 'Profile', slot: 'profile' }, { label: 'Updates', slot: 'updates' }]" :ui="{ content: 'min-h-44 pt-4' }">
      <template #profile><UForm :state="account" class="space-y-4"><UFormField label="Name"><UInput v-model="account.name" class="w-full" /></UFormField><UFormField label="Email"><UInput v-model="account.email" type="email" class="w-full" /></UFormField></UForm></template>
      <template #updates><div class="space-y-5"><USwitch v-model="weekly" label="Weekly summary" description="A recap of your workspace activity." /><USwitch v-model="mentions" label="Mentions" description="Updates when someone mentions you." /></div></template>
    </UTabs>
  </UCard>
</template>
