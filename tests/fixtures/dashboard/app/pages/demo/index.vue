<script setup lang="ts">
import type { FormError } from '@nuxt/ui'

defineOptions({ name: 'DashboardPreview' })
const state = reactive({ email: '' })
const saved = ref('')
const validate = (value: typeof state): FormError[] => value.email.includes('@') ? [] : [{ name: 'email', message: 'Enter a valid email' }]
</script>

<template>
  <main class="mx-auto max-w-3xl space-y-6 p-8 font-sans">
    <h1 class="text-3xl font-bold">
      Operations dashboard
    </h1>
    <UCard>
      <p>Open requests</p><p class="text-3xl font-bold text-primary">
        12
      </p>
    </UCard>
    <UForm
      :state="state"
      :validate="validate"
      class="space-y-4"
      @submit="saved = state.email"
    >
      <UFormField
        name="email"
        label="Notification email"
      >
        <UInput v-model="state.email" />
      </UFormField>
      <UButton
        data-testid="primary-action"
        type="submit"
      >
        Save preferences
      </UButton>
    </UForm>
    <UAlert
      v-if="saved"
      title="Preferences saved"
      :description="saved"
    />
  </main>
</template>
