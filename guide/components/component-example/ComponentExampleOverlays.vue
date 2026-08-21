<script setup lang="ts">
const props = defineProps<{
  name: string
}>()

const dropdownItems = [
  [
    { label: 'Copy token', icon: 'i-lucide-copy' },
    { label: 'Open docs', icon: 'i-lucide-arrow-up-right' }
  ],
  [
    { label: 'Archive pattern', icon: 'i-lucide-archive' }
  ]
]
</script>

<template>
  <UModal
    v-if="props.name === 'modal'"
    title="Review pattern"
    description="Use modals for focused decisions."
  >
    <UButton label="Open modal" color="neutral" variant="outline" />
    <template #body>
      <p class="text-sm text-muted">
        Modal content should stay direct and easy to close.
      </p>
    </template>
    <template #footer>
      <UButton label="Save" />
      <UButton label="Cancel" color="neutral" variant="outline" />
    </template>
  </UModal>

  <USlideover
    v-else-if="props.name === 'slideover'"
    title="Pattern notes"
    description="Use slideovers for contextual supporting work."
  >
    <UButton label="Open slideover" color="neutral" variant="outline" />
    <template #body>
      <p class="text-sm text-muted">
        Slideovers support the page instead of replacing it.
      </p>
    </template>
  </USlideover>

  <UDrawer
    v-else-if="props.name === 'drawer'"
    title="Mobile settings"
    description="Use drawers when the interaction starts near a screen edge."
  >
    <UButton label="Open drawer" color="neutral" variant="outline" />
    <template #body>
      <p class="text-sm text-muted">
        Drawer content should stay short and easy to dismiss.
      </p>
    </template>
  </UDrawer>

  <div v-else-if="props.name === 'overlay-focused-pattern'" class="grid gap-3 sm:grid-cols-3">
    <UModal title="Review pattern" description="Use modals for focused decisions.">
      <UButton label="Open modal" color="neutral" variant="outline" block />
      <template #body>
        <p class="text-sm text-muted">
          Modal content should stay direct and easy to close.
        </p>
      </template>
      <template #footer>
        <UButton label="Save" />
        <UButton label="Cancel" color="neutral" variant="outline" />
      </template>
    </UModal>
    <USlideover title="Pattern notes" description="Use slideovers for contextual supporting work.">
      <UButton label="Open slideover" color="neutral" variant="outline" block />
      <template #body>
        <p class="text-sm text-muted">
          Slideovers support the page instead of replacing it.
        </p>
      </template>
    </USlideover>
    <UDrawer title="Mobile settings" description="Use drawers for compact edge-based flows.">
      <UButton label="Open drawer" color="neutral" variant="outline" block />
      <template #body>
        <p class="text-sm text-muted">
          Drawer content should stay short and easy to dismiss.
        </p>
      </template>
    </UDrawer>
  </div>

  <UPopover v-else-if="props.name === 'popover'">
    <UButton label="Open popover" color="neutral" variant="outline" />
    <template #content>
      <div class="w-56 p-4">
        <p class="font-semibold text-highlighted">
          Compact detail
        </p>
        <p class="mt-1 text-sm text-muted">
          Popovers are useful for small supporting choices.
        </p>
      </div>
    </template>
  </UPopover>

  <UDropdownMenu
    v-else-if="props.name === 'dropdown-menu'"
    :items="dropdownItems"
  >
    <UButton
      label="Open menu"
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
      Right-click area
    </div>
  </UContextMenu>

  <div v-else-if="props.name === 'overlay-context-pattern'" class="flex flex-wrap items-center gap-3">
    <UPopover>
      <UButton label="Open popover" color="neutral" variant="outline" />
      <template #content>
        <div class="w-56 p-4">
          <p class="font-semibold text-highlighted">
            Compact detail
          </p>
          <p class="mt-1 text-sm text-muted">
            Popovers are useful for small supporting choices.
          </p>
        </div>
      </template>
    </UPopover>
    <UTooltip text="Clarify compact controls, not required instructions.">
      <UButton
        icon="i-lucide-info"
        label="Hover for hint"
        color="neutral"
        variant="outline"
      />
    </UTooltip>
  </div>

  <div v-else-if="props.name === 'overlay-menu-pattern'" class="grid gap-4 sm:grid-cols-2">
    <div class="space-y-3">
      <p class="text-sm font-semibold text-highlighted">
        Explicit menu
      </p>
      <UDropdownMenu :items="dropdownItems">
        <UButton
          label="Open menu"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-chevron-down"
        />
      </UDropdownMenu>
    </div>
    <div class="space-y-3">
      <p class="text-sm font-semibold text-highlighted">
        Context menu
      </p>
      <UContextMenu :items="dropdownItems">
        <div class="flex min-h-20 items-center justify-center rounded-sm border border-dashed border-default px-3 text-sm text-muted">
          Right-click area
        </div>
      </UContextMenu>
    </div>
  </div>
</template>
