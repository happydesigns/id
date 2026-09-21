<script setup lang="ts">
import { resolveComponentExampleMessage, type ComponentExampleMessageKey, type ComponentExampleContext } from '../../../src/component-examples'

const props = defineProps<{
  name: string
  context: ComponentExampleContext
}>()

const t = (key: ComponentExampleMessageKey) => resolveComponentExampleMessage(props.context.messages, key)
</script>

<template>
  <div
    v-if="props.name === 'action-hierarchy-pattern'"
    class="flex flex-wrap items-center gap-3"
  >
    <UButton
      :label="t('actions.saveChanges')"
      icon="i-lucide-save"
    />
    <UButton
      :label="t('actions.reviewPattern')"
      color="neutral"
      variant="outline"
    />
    <UTooltip :text="t('actions.openComponentDocs')">
      <UButton
        :aria-label="t('actions.openDocs')"
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
        :label="t('actions.reviewQueue')"
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
        {{ t('actions.active') }}
      </UBadge>
      <UBadge color="secondary" variant="outline">
        {{ t('actions.editorial') }}
      </UBadge>
      <UBadge color="success" variant="subtle">
        {{ t('actions.ready') }}
      </UBadge>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <span class="text-sm text-muted">{{ t('actions.assigned') }}</span>
      <UChip inset color="success">
        <UAvatar
          :src="props.context.assets.symbol"
          :alt="props.context.logoAlt"
          :text="props.context.assets.symbol ? undefined : props.context.copy.brandLabel.slice(0, 2).toUpperCase()"
          size="xs"
        />
      </UChip>
      <span class="text-sm text-muted">{{ t('actions.openSearch') }}</span>
      <UKbd>{{ t('actions.ctrl') }}</UKbd>
      <UKbd>{{ t('actions.k') }}</UKbd>
    </div>
  </div>

  <div
    v-else-if="props.name === 'button'"
    class="flex flex-wrap items-center gap-3"
  >
    <UButton
      :label="t('actions.saveChanges')"
      icon="i-lucide-save"
    />
    <UButton
      :label="t('actions.reviewPattern')"
      color="neutral"
      variant="outline"
    />
    <UButton
      :aria-label="t('actions.openDocs')"
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
      {{ t('actions.active') }}
    </UBadge>
    <UBadge color="secondary" variant="outline">
      {{ t('actions.editorial') }}
    </UBadge>
    <UBadge color="success" variant="subtle">
      {{ t('actions.ready') }}
    </UBadge>
    <UBadge color="warning" variant="subtle">
      {{ t('actions.checkContrast') }}
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
        :aria-label="t('actions.reviewAlerts')"
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
      :aria-label="t('actions.copyPackage')"
    />
  </UFieldGroup>

  <div
    v-else-if="props.name === 'kbd'"
    class="flex flex-wrap items-center gap-2"
  >
    <span class="text-sm text-muted">{{ t('actions.openSearch') }}</span>
    <UKbd>{{ t('actions.ctrl') }}</UKbd>
    <UKbd>{{ t('actions.k') }}</UKbd>
  </div>

  <UTooltip
    v-else-if="props.name === 'tooltip'"
    :text="t('actions.openComponentDocs')"
  >
    <UButton
      icon="i-lucide-arrow-up-right"
      color="neutral"
      variant="outline"
      :label="t('actions.hoverForHint')"
    />
  </UTooltip>
</template>
