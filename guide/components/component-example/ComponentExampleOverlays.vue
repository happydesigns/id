<script setup lang="ts">
import { computed } from 'vue'
import { resolveComponentExampleMessage, type ComponentExampleMessageKey, type ComponentExampleContext } from '../../../src/component-examples'
const props = defineProps<{
  context: ComponentExampleContext
  name: string
}>()

const t = (key: ComponentExampleMessageKey) => resolveComponentExampleMessage(props.context.messages, key)

const dropdownItems = computed(() => [
  [
    { label: t('overlays.copyToken'), icon: 'i-lucide-copy' },
    { label: t('overlays.openDocs'), icon: 'i-lucide-arrow-up-right' }
  ],
  [
    { label: t('overlays.archivePattern'), icon: 'i-lucide-archive' }
  ]
])
</script>

<template>
  <UModal
    v-if="props.name === 'modal'"
    :title="t('overlays.reviewPattern')"
    :description="t('overlays.modalDescription')"
  >
    <UButton :label="t('overlays.openModal')" color="neutral" variant="outline" />
    <template #body>
      <p class="text-sm text-muted">
        {{ t('overlays.modalBody') }}
      </p>
    </template>
    <template #footer>
      <UButton :label="t('actions.save')" />
      <UButton :label="t('actions.cancel')" color="neutral" variant="outline" />
    </template>
  </UModal>

  <USlideover
    v-else-if="props.name === 'slideover'"
    :title="t('overlays.patternNotes')"
    :description="t('overlays.slideoverDescription')"
  >
    <UButton :label="t('overlays.openSlideover')" color="neutral" variant="outline" />
    <template #body>
      <p class="text-sm text-muted">
        {{ t('overlays.slideoverBody') }}
      </p>
    </template>
  </USlideover>

  <UDrawer
    v-else-if="props.name === 'drawer'"
    :title="t('overlays.mobileSettings')"
    :description="t('overlays.drawerDescription')"
  >
    <UButton :label="t('overlays.openDrawer')" color="neutral" variant="outline" />
    <template #body>
      <p class="text-sm text-muted">
        {{ t('overlays.drawerBody') }}
      </p>
    </template>
  </UDrawer>

  <div v-else-if="props.name === 'overlay-focused-pattern'" class="grid gap-3 sm:grid-cols-3">
    <UModal :title="t('overlays.reviewPattern')" :description="t('overlays.modalDescription')">
      <UButton :label="t('overlays.openModal')" color="neutral" variant="outline" block />
      <template #body>
        <p class="text-sm text-muted">
          {{ t('overlays.modalBody') }}
        </p>
      </template>
      <template #footer>
        <UButton :label="t('actions.save')" />
        <UButton :label="t('actions.cancel')" color="neutral" variant="outline" />
      </template>
    </UModal>
    <USlideover :title="t('overlays.patternNotes')" :description="t('overlays.slideoverDescription')">
      <UButton :label="t('overlays.openSlideover')" color="neutral" variant="outline" block />
      <template #body>
        <p class="text-sm text-muted">
          {{ t('overlays.slideoverBody') }}
        </p>
      </template>
    </USlideover>
    <UDrawer :title="t('overlays.mobileSettings')" :description="t('overlays.compactDrawerDescription')">
      <UButton :label="t('overlays.openDrawer')" color="neutral" variant="outline" block />
      <template #body>
        <p class="text-sm text-muted">
          {{ t('overlays.drawerBody') }}
        </p>
      </template>
    </UDrawer>
  </div>

  <UPopover v-else-if="props.name === 'popover'">
    <UButton :label="t('overlays.openPopover')" color="neutral" variant="outline" />
    <template #content>
      <div class="w-56 p-4">
        <p class="font-semibold text-highlighted">
          {{ t('overlays.compactDetail') }}
        </p>
        <p class="mt-1 text-sm text-muted">
          {{ t('overlays.popoverBody') }}
        </p>
      </div>
    </template>
  </UPopover>

  <UDropdownMenu
    v-else-if="props.name === 'dropdown-menu'"
    :items="dropdownItems"
  >
    <UButton
      :label="t('overlays.openMenu')"
      color="neutral"
      variant="outline"
      trailing-icon="i-lucide-chevron-down"
    />
  </UDropdownMenu>

  <UContextMenu
    v-else-if="props.name === 'context-menu'"
    :items="dropdownItems"
  >
    <div class="flex min-h-20 items-center justify-center rounded-sm border border-dashed border-default px-3 text-sm text-muted">
      {{ t('overlays.rightClickArea') }}
    </div>
  </UContextMenu>

  <div v-else-if="props.name === 'overlay-context-pattern'" class="flex flex-wrap items-center gap-3">
    <UPopover>
      <UButton :label="t('overlays.openPopover')" color="neutral" variant="outline" />
      <template #content>
        <div class="w-56 p-4">
          <p class="font-semibold text-highlighted">
            {{ t('overlays.compactDetail') }}
          </p>
          <p class="mt-1 text-sm text-muted">
            {{ t('overlays.popoverBody') }}
          </p>
        </div>
      </template>
    </UPopover>
    <UTooltip :text="t('overlays.tooltipDescription')">
      <UButton
        icon="i-lucide-info"
        :label="t('overlays.hoverForHint')"
        color="neutral"
        variant="outline"
      />
    </UTooltip>
  </div>

  <div v-else-if="props.name === 'overlay-menu-pattern'" class="grid gap-4 sm:grid-cols-2">
    <div class="space-y-3">
      <p class="text-sm font-semibold text-highlighted">
        {{ t('overlays.explicitMenu') }}
      </p>
      <UDropdownMenu :items="dropdownItems">
        <UButton
          :label="t('overlays.openMenu')"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-chevron-down"
        />
      </UDropdownMenu>
    </div>
    <div class="space-y-3">
      <p class="text-sm font-semibold text-highlighted">
        {{ t('overlays.contextMenu') }}
      </p>
      <UContextMenu :items="dropdownItems">
        <div class="flex min-h-20 items-center justify-center rounded-sm border border-dashed border-default px-3 text-sm text-muted">
          {{ t('overlays.rightClickArea') }}
        </div>
      </UContextMenu>
    </div>
  </div>
</template>
