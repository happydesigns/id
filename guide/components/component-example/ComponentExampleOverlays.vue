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
    { label: t('overlays.copy_token'), icon: 'i-lucide-copy' },
    { label: t('overlays.open_docs'), icon: 'i-lucide-arrow-up-right' }
  ],
  [
    { label: t('overlays.archive_pattern'), icon: 'i-lucide-archive' }
  ]
])
</script>

<template>
  <UModal
    v-if="props.name === 'modal'"
    :title="t('overlays.review_pattern')"
    :description="t('overlays.use_modals_for_focused_decisions')"
  >
    <UButton :label="t('overlays.open_modal')" color="neutral" variant="outline" />
    <template #body>
      <p class="text-sm text-muted">
        {{ t('overlays.modal_content_should_stay_direct_and_easy_to_close') }}
      </p>
    </template>
    <template #footer>
      <UButton :label="t('actions.save')" />
      <UButton :label="t('actions.cancel')" color="neutral" variant="outline" />
    </template>
  </UModal>

  <USlideover
    v-else-if="props.name === 'slideover'"
    :title="t('overlays.pattern_notes')"
    :description="t('overlays.use_slideovers_for_contextual_supporting_work')"
  >
    <UButton :label="t('overlays.open_slideover')" color="neutral" variant="outline" />
    <template #body>
      <p class="text-sm text-muted">
        {{ t('overlays.slideovers_support_the_page_instead_of_replacing_it') }}
      </p>
    </template>
  </USlideover>

  <UDrawer
    v-else-if="props.name === 'drawer'"
    :title="t('overlays.mobile_settings')"
    :description="t('overlays.use_drawers_when_the_interaction_starts_near_a_screen_edge')"
  >
    <UButton :label="t('overlays.open_drawer')" color="neutral" variant="outline" />
    <template #body>
      <p class="text-sm text-muted">
        {{ t('overlays.drawer_content_should_stay_short_and_easy_to_dismiss') }}
      </p>
    </template>
  </UDrawer>

  <div v-else-if="props.name === 'overlay-focused-pattern'" class="grid gap-3 sm:grid-cols-3">
    <UModal :title="t('overlays.review_pattern')" :description="t('overlays.use_modals_for_focused_decisions')">
      <UButton :label="t('overlays.open_modal')" color="neutral" variant="outline" block />
      <template #body>
        <p class="text-sm text-muted">
          {{ t('overlays.modal_content_should_stay_direct_and_easy_to_close') }}
        </p>
      </template>
      <template #footer>
        <UButton :label="t('actions.save')" />
        <UButton :label="t('actions.cancel')" color="neutral" variant="outline" />
      </template>
    </UModal>
    <USlideover :title="t('overlays.pattern_notes')" :description="t('overlays.use_slideovers_for_contextual_supporting_work')">
      <UButton :label="t('overlays.open_slideover')" color="neutral" variant="outline" block />
      <template #body>
        <p class="text-sm text-muted">
          {{ t('overlays.slideovers_support_the_page_instead_of_replacing_it') }}
        </p>
      </template>
    </USlideover>
    <UDrawer :title="t('overlays.mobile_settings')" :description="t('overlays.use_drawers_for_compact_edge_based_flows')">
      <UButton :label="t('overlays.open_drawer')" color="neutral" variant="outline" block />
      <template #body>
        <p class="text-sm text-muted">
          {{ t('overlays.drawer_content_should_stay_short_and_easy_to_dismiss') }}
        </p>
      </template>
    </UDrawer>
  </div>

  <UPopover v-else-if="props.name === 'popover'">
    <UButton :label="t('overlays.open_popover')" color="neutral" variant="outline" />
    <template #content>
      <div class="w-56 p-4">
        <p class="font-semibold text-highlighted">
          {{ t('overlays.compact_detail') }}
        </p>
        <p class="mt-1 text-sm text-muted">
          {{ t('overlays.popovers_are_useful_for_small_supporting_choices') }}
        </p>
      </div>
    </template>
  </UPopover>

  <UDropdownMenu
    v-else-if="props.name === 'dropdown-menu'"
    :items="dropdownItems"
  >
    <UButton
      :label="t('overlays.open_menu')"
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
      {{ t('overlays.right_click_area') }}
    </div>
  </UContextMenu>

  <div v-else-if="props.name === 'overlay-context-pattern'" class="flex flex-wrap items-center gap-3">
    <UPopover>
      <UButton :label="t('overlays.open_popover')" color="neutral" variant="outline" />
      <template #content>
        <div class="w-56 p-4">
          <p class="font-semibold text-highlighted">
            {{ t('overlays.compact_detail') }}
          </p>
          <p class="mt-1 text-sm text-muted">
            {{ t('overlays.popovers_are_useful_for_small_supporting_choices') }}
          </p>
        </div>
      </template>
    </UPopover>
    <UTooltip :text="t('overlays.clarify_compact_controls_not_required_instructions')">
      <UButton
        icon="i-lucide-info"
        :label="t('overlays.hover_for_hint')"
        color="neutral"
        variant="outline"
      />
    </UTooltip>
  </div>

  <div v-else-if="props.name === 'overlay-menu-pattern'" class="grid gap-4 sm:grid-cols-2">
    <div class="space-y-3">
      <p class="text-sm font-semibold text-highlighted">
        {{ t('overlays.explicit_menu') }}
      </p>
      <UDropdownMenu :items="dropdownItems">
        <UButton
          :label="t('overlays.open_menu')"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-chevron-down"
        />
      </UDropdownMenu>
    </div>
    <div class="space-y-3">
      <p class="text-sm font-semibold text-highlighted">
        {{ t('overlays.context_menu') }}
      </p>
      <UContextMenu :items="dropdownItems">
        <div class="flex min-h-20 items-center justify-center rounded-sm border border-dashed border-default px-3 text-sm text-muted">
          {{ t('overlays.right_click_area') }}
        </div>
      </UContextMenu>
    </div>
  </div>
</template>
