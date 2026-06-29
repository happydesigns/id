<script setup lang="ts">
import type { ComponentExampleContext } from '../../../src/component-examples'

const props = defineProps<{
  name: string
  context: ComponentExampleContext
}>()
</script>

<template>
  <div
    v-if="props.name === 'action-hierarchy-pattern'"
    class="flex flex-wrap items-center gap-3"
  >
    <UButton
      label="Save changes"
      icon="i-lucide-save"
    />
    <UButton
      label="Review pattern"
      color="neutral"
      variant="outline"
    />
    <UTooltip text="Open component docs">
      <UButton
        aria-label="Open docs"
        icon="i-lucide-arrow-up-right"
        color="neutral"
        variant="ghost"
      />
    </UTooltip>
  </div>

  <div
    v-else-if="props.name === 'compact-metadata-pattern'"
    class="space-y-4"
  >
    <div class="flex flex-wrap items-center gap-3">
      <UButton
        label="Review queue"
        color="neutral"
        variant="outline"
      >
        <template #trailing>
          <UBadge
            color="primary"
            variant="subtle"
            size="sm"
          >
            3
          </UBadge>
        </template>
      </UButton>
      <UBadge color="primary" variant="subtle">
        Active
      </UBadge>
      <UBadge color="secondary" variant="outline">
        Editorial
      </UBadge>
      <UBadge color="success" variant="subtle">
        Ready
      </UBadge>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <span class="text-sm text-muted">Assigned</span>
      <UChip inset color="success">
        <UAvatar
          :src="props.context.assets.symbol"
          :alt="props.context.logoAlt"
          :text="props.context.assets.symbol ? undefined : props.context.copy.brandLabel.slice(0, 2).toUpperCase()"
          size="xs"
        />
      </UChip>
      <span class="text-sm text-muted">Open search</span>
      <UKbd>Ctrl</UKbd>
      <UKbd>K</UKbd>
    </div>
  </div>

  <div
    v-else-if="props.name === 'button'"
    class="flex flex-wrap items-center gap-3"
  >
    <UButton
      label="Save changes"
      icon="i-lucide-save"
    />
    <UButton
      label="Review pattern"
      color="neutral"
      variant="outline"
    />
    <UButton
      aria-label="Open docs"
      icon="i-lucide-arrow-up-right"
      color="neutral"
      variant="ghost"
    />
  </div>

  <div
    v-else-if="props.name === 'badge'"
    class="flex flex-wrap items-center gap-2"
  >
    <UBadge color="primary" variant="subtle">
      Active
    </UBadge>
    <UBadge color="secondary" variant="outline">
      Editorial
    </UBadge>
    <UBadge color="success" variant="subtle">
      Ready
    </UBadge>
    <UBadge color="warning" variant="subtle">
      Check contrast
    </UBadge>
  </div>

  <div
    v-else-if="props.name === 'chip'"
    class="flex flex-wrap items-center gap-4"
  >
    <UChip
      text="3"
      color="primary"
      size="3xl"
      position="top-right"
    >
      <UButton
        aria-label="Review alerts"
        icon="i-lucide-bell"
        color="neutral"
        variant="outline"
        square
      />
    </UChip>
    <UChip inset color="success">
      <UAvatar
        :src="props.context.assets.symbol"
        :alt="props.context.logoAlt"
        :text="props.context.assets.symbol ? undefined : props.context.copy.brandLabel.slice(0, 2).toUpperCase()"
      />
    </UChip>
  </div>

  <UFieldGroup
    v-else-if="props.name === 'field-group'"
    class="max-w-md"
  >
    <UInput
      :model-value="props.context.packageName"
      readonly
    />
    <UButton
      color="neutral"
      variant="outline"
      icon="i-lucide-copy"
      aria-label="Copy package"
    />
  </UFieldGroup>

  <div
    v-else-if="props.name === 'kbd'"
    class="flex flex-wrap items-center gap-2"
  >
    <span class="text-sm text-muted">Open search</span>
    <UKbd>Ctrl</UKbd>
    <UKbd>K</UKbd>
  </div>

  <UTooltip
    v-else-if="props.name === 'tooltip'"
    text="Open component docs"
  >
    <UButton
      icon="i-lucide-arrow-up-right"
      color="neutral"
      variant="outline"
      label="Hover for hint"
    />
  </UTooltip>
</template>
