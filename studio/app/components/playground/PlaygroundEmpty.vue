<script setup lang="ts">
import { useStudioIcon } from '../../../playground-icons'

const resolveIcon = useStudioIcon()
</script>

<template>
  <UEmpty
    :icon="resolveIcon('i-lucide-landmark')"
    title="Connect your bank"
    description="Link your account to receive monthly payouts automatically."
    :actions="[{ label: 'Set up payouts', icon: resolveIcon('i-lucide-plug-zap') }]"
    variant="naked"
  />
</template>
