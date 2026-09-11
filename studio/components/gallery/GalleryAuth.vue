<script setup lang="ts">
import { ref } from 'vue'
import type { AuthFormField } from '@nuxt/ui'
import { galleryCard as card } from '../../gallery'
const submitted = ref(false)
const fields: AuthFormField[] = [{ name: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com', required: true }, { name: 'password', type: 'password', label: 'Password', placeholder: 'Enter your password', required: true }]
const validate = (values: Record<string, unknown>) => [
  ...(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.email ?? '')) ? [{ name: 'email', message: 'Enter a valid email.' }] : []),
  ...(String(values.password ?? '').length < 8 ? [{ name: 'password', message: 'Use at least 8 characters.' }] : [])
]
</script>

<template>
  <UCard :ui="card" class="example-card">
    <UAuthForm title="Sign in" description="Preview only. Use example credentials." :fields="fields" :validate="validate" :submit="{ label: 'Sign in' }" @submit="submitted = true" />
    <p v-if="submitted" role="status" class="mt-4 text-sm text-success">Form validated. No sign-in request was sent.</p>
  </UCard>
</template>
