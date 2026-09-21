<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from '#imports'

withDefaults(defineProps<{ label?: string }>(), { label: 'Open Studio' })
const router = useRouter()
// A catch-all documentation route is not evidence that Studio is installed.
const available = computed(() => router.getRoutes().some(route => route.path === '/studio'))
</script>

<template>
  <UButton
    v-if="available"
    to="/studio?browse=true"
    :label="label"
    icon="i-lucide-palette"
    color="neutral"
    variant="ghost"
  />
</template>
