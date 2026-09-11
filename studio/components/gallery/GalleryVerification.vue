<script setup lang="ts">
import { galleryCard as card } from '../../gallery'
import { ref } from 'vue'
const pin = ref(['4', '3', '2', '', '', ''])
</script>

<template>
<UCard :ui="card" class="example-card text-center">
        <UIcon name="i-lucide-shield-check" class="mx-auto mb-3 size-7 text-highlighted" />
        <h2>Verify your email</h2><p class="card-description">Enter the code sent to your email.</p>
        <UPinInput v-model="pin" :length="6" aria-label="Verification code" class="mt-5 justify-center" :ui="{ base: 'w-8' }" />
        <p class="mt-4 text-xs text-muted">Need a new code? <UButton size="xs" variant="link" @click="pin = ['', '', '', '', '', '']">Resend code</UButton></p>
      </UCard>
</template>
