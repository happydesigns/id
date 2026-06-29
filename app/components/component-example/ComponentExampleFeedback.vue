<script setup lang="ts">
import { ref, useToast } from '#imports'

const props = defineProps<{
  name: string
}>()

const toast = useToast()
const progress = ref(72)

function showToastPreview() {
  toast.add({
    id: 'id-component-feedback-preview',
    title: 'Changes saved',
    description: 'The pattern is ready for review.',
    icon: 'i-lucide-circle-check',
    color: 'success'
  })
}
</script>

<template>
  <div v-if="props.name === 'alert'" class="grid gap-3">
    <UAlert
      color="success"
      variant="subtle"
      icon="i-lucide-circle-check"
      title="Ready for review"
      description="Feedback states explain what happened and what to do next."
    />
    <UAlert
      color="warning"
      variant="subtle"
      icon="i-lucide-triangle-alert"
      title="Check contrast"
      description="Warning states stay soft until action is required."
    />
    <UAlert
      color="error"
      variant="subtle"
      icon="i-lucide-circle-x"
      title="Upload failed"
      description="Use calm, specific recovery copy for errors."
    />
  </div>

  <UBanner
    v-else-if="props.name === 'banner'"
    color="secondary"
    icon="i-lucide-info"
    title="Brand layer updated"
  />

  <div v-else-if="props.name === 'progress'" class="space-y-3">
    <div class="flex items-center justify-between gap-3">
      <p class="font-semibold text-highlighted">
        Accessibility pass
      </p>
      <UBadge color="neutral" variant="outline">
        {{ progress }}%
      </UBadge>
    </div>
    <UProgress v-model="progress" />
  </div>

  <div v-else-if="props.name === 'skeleton'" class="space-y-3">
    <USkeleton class="h-4 w-2/3" />
    <USkeleton class="h-4 w-5/6" />
    <USkeleton class="h-4 w-1/2" />
  </div>

  <UButton
    v-else-if="props.name === 'toast'"
    label="Show toast"
    icon="i-lucide-circle-check"
    color="neutral"
    variant="outline"
    @click="showToastPreview"
  />

  <UEmpty
    v-else-if="props.name === 'empty'"
    icon="i-lucide-folder-open"
    title="No patterns yet"
    description="Start with a project brief before adding variants."
    :actions="[{ label: 'Create pattern', icon: 'i-lucide-plus' }]"
  />

  <div v-else-if="props.name === 'icon'" class="flex flex-wrap items-center gap-4">
    <UIcon name="i-lucide-palette" class="size-5 text-primary" />
    <UIcon name="i-lucide-component" class="size-5 text-secondary" />
    <UIcon name="i-lucide-circle-check" class="size-5 text-success" />
  </div>

  <div v-else-if="props.name === 'feedback-system-pattern'" class="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
    <div class="space-y-3">
      <UBanner color="secondary" icon="i-lucide-info" title="Brand layer updated" />
      <UAlert
        color="success"
        variant="subtle"
        icon="i-lucide-circle-check"
        title="Ready for review"
        description="Feedback states explain what happened and what to do next."
      />
      <UAlert
        color="warning"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        title="Check contrast"
        description="Warning states stay soft until action is required."
      />
      <UAlert
        color="error"
        variant="subtle"
        icon="i-lucide-circle-x"
        title="Upload failed"
        description="Use calm, specific recovery copy for errors."
      />
    </div>
    <div class="grid gap-4">
      <div class="space-y-3 rounded-sm border border-default bg-muted p-4">
        <div class="flex items-center justify-between gap-3">
          <p class="font-semibold text-highlighted">
            Accessibility pass
          </p>
          <UBadge color="neutral" variant="outline">
            {{ progress }}%
          </UBadge>
        </div>
        <UProgress v-model="progress" />
        <div class="space-y-2 pt-1">
          <USkeleton class="h-3 w-2/3" />
          <USkeleton class="h-3 w-5/6" />
          <USkeleton class="h-3 w-1/2" />
        </div>
      </div>
      <UEmpty
        icon="i-lucide-folder-open"
        title="No patterns yet"
        description="Start with a project brief before adding variants."
      >
        <template #actions>
          <UButton
            label="Show toast"
            icon="i-lucide-circle-check"
            color="neutral"
            variant="outline"
            @click="showToastPreview"
          />
        </template>
      </UEmpty>
    </div>
  </div>
</template>
