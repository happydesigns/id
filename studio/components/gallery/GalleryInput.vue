<script setup lang="ts">
import { galleryCard as card } from '../../gallery'
import { ref, useTemplateRef } from 'vue'
import { defineShortcuts } from '#imports'
defineProps<{ state: string }>()
const email = ref('')
const search = ref('')
const searchInput = useTemplateRef('searchInput')
defineShortcuts({ '/': () => searchInput.value?.inputRef?.focus() })
</script>

<template>
<UCard :ui="card" class="example-card">
        <UFormField label="Email address" required :error="state === 'error' ? 'Enter a valid email address.' : undefined" help="Use your work email.">
          <UInput v-model="email" icon="i-lucide-mail" placeholder="you@example.com" class="w-full" />
        </UFormField>
        <UFormField label="Search" class="mt-5">
          <UInput ref="searchInput" v-model="search" icon="i-lucide-search" placeholder="Search projects…" class="w-full"><template #trailing><UKbd value="/" /></template></UInput>
        </UFormField>
      </UCard>
</template>
