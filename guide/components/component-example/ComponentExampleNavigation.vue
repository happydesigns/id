<script setup lang="ts">
import { computed } from 'vue'
import { resolveComponentExampleMessage, type ComponentExampleMessageKey, type ComponentExampleContext } from '../../../src/component-examples'

const props = defineProps<{
  name: string
  context: ComponentExampleContext
}>()

const t = (key: ComponentExampleMessageKey) => resolveComponentExampleMessage(props.context.messages, key)

const navigationItems = computed(() => [
  { label: t('navigation.colors'), icon: 'i-lucide-palette', to: props.context.paths.colors },
  { label: t('navigation.typography'), icon: 'i-lucide-type', to: props.context.paths.typography },
  { label: t('navigation.components'), icon: 'i-lucide-component', to: props.context.paths.components, active: true }
])

const breadcrumbItems = computed(() => [
  { label: t('navigation.docs'), to: props.context.paths.docs },
  { label: t('navigation.components'), to: props.context.paths.components },
  { label: t('navigation.navigation') }
])

const tabs = computed(() => [
  { label: t('navigation.overview'), icon: 'i-lucide-layout-grid' },
  { label: t('navigation.usage'), icon: 'i-lucide-list-checks' },
  { label: t('navigation.tokens'), icon: 'i-lucide-code-2' }
])

const stepperItems = computed(() => [
  { title: t('navigation.base'), description: t('navigation.set_spacing_type_and_color_roles') },
  { title: t('navigation.identity'), description: t('navigation.choose_the_right_mark_and_voice') },
  { title: t('navigation.interface'), description: t('navigation.apply_the_system_through_components') }
])

const accordionItems = computed(() => [
  {
    label: t('navigation.where_should_accent_color_appear'),
    icon: 'i-lucide-sparkles',
    content: t('navigation.use_accent_color_for_focus_active_states_and_precise_emphasis_avoid_making_it_the_only_hierarchy_tool')
  },
  {
    label: t('navigation.what_should_stay_neutral'),
    icon: 'i-lucide-square',
    content: t('navigation.panels_forms_tables_and_navigation_surfaces_should_use_semantic_neutral_surfaces_and_visible_borders')
  }
])

const commandGroups = computed(() => [
  {
    id: 'docs',
    label: t('navigation.docs'),
    items: [
      { label: t('navigation.open_colors'), icon: 'i-lucide-palette' },
      { label: t('navigation.open_logos'), icon: 'i-lucide-badge-check' },
      { label: t('navigation.open_components'), icon: 'i-lucide-component' }
    ]
  }
])

const treeItems = computed(() => [
  {
    label: 'brand/',
    icon: 'i-lucide-folder',
    defaultExpanded: true,
    children: [
      { label: 'app.config.ts', icon: 'i-lucide-file-code' },
      {
        label: 'components/',
        icon: 'i-lucide-folder',
        defaultExpanded: true,
        children: [
          { label: 'Button.vue', icon: 'i-lucide-file-code' },
          { label: 'Card.vue', icon: 'i-lucide-file-code' }
        ]
      }
    ]
  }
])
</script>

<template>
  <UNavigationMenu
    v-if="props.name === 'navigation-menu'"
    :items="navigationItems"
    class="w-full"
  />

  <div v-else-if="props.name === 'navigation-primary-pattern'" class="space-y-5">
    <UNavigationMenu :items="navigationItems" class="w-full" />
    <USeparator />
    <ULink
      :to="props.context.paths.components"
      class="inline-flex items-center gap-2 text-primary hover:text-primary"
    >
      {{ t('navigation.open_component_system') }}
      <UIcon name="i-lucide-arrow-right" class="size-4" />
    </ULink>
  </div>

  <ULink
    v-else-if="props.name === 'link'"
    :to="props.context.paths.components"
    class="inline-flex items-center gap-2 text-primary hover:text-primary"
  >
    {{ t('navigation.open_component_system') }}
    <UIcon name="i-lucide-arrow-right" class="size-4" />
  </ULink>

  <UBreadcrumb
    v-else-if="props.name === 'breadcrumb'"
    :items="breadcrumbItems"
  />

  <UTabs
    v-else-if="props.name === 'tabs'"
    :items="tabs"
    class="w-full"
  />

  <div v-else-if="props.name === 'navigation-location-pattern'" class="space-y-5">
    <UBreadcrumb :items="breadcrumbItems" />
    <UTabs :items="tabs" class="w-full" />
  </div>

  <UStepper
    v-else-if="props.name === 'stepper'"
    :items="stepperItems"
    orientation="vertical"
    class="max-w-md"
  />

  <UAccordion
    v-else-if="props.name === 'accordion'"
    :items="accordionItems"
    class="w-full"
  />

  <UPagination
    v-else-if="props.name === 'pagination'"
    :page="2"
    :total="30"
    :items-per-page="10"
  />

  <UCommandPalette
    v-else-if="props.name === 'command-palette'"
    :groups="commandGroups"
    :autofocus="false"
    class="max-h-72"
  />

  <UTree
    v-else-if="props.name === 'tree'"
    :items="treeItems"
    class="max-w-md"
  />

  <div v-else-if="props.name === 'navigation-structure-pattern'" class="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
    <div class="space-y-4">
      <p class="text-sm font-semibold text-highlighted">
        {{ t('navigation.ordered_guidance') }}
      </p>
      <UStepper :items="stepperItems" orientation="vertical" class="max-w-md" />
    </div>
    <div class="space-y-5">
      <div class="space-y-3">
        <p class="text-sm font-semibold text-highlighted">
          {{ t('navigation.optional_detail') }}
        </p>
        <UAccordion :items="accordionItems" />
      </div>
      <div class="grid gap-5">
        <div class="space-y-3">
          <p class="text-sm font-semibold text-highlighted">
            {{ t('navigation.list_position') }}
          </p>
          <div class="overflow-x-auto pb-1">
            <UPagination :page="2" :total="30" :items-per-page="10" />
          </div>
        </div>
        <div class="space-y-3">
          <p class="text-sm font-semibold text-highlighted">
            {{ t('navigation.nested_content') }}
          </p>
          <UTree :items="treeItems" class="max-w-sm" />
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="props.name === 'navigation-fast-pattern'" class="space-y-4">
    <UCommandPalette
      :groups="commandGroups"
      :autofocus="false"
      class="max-h-72"
    />
    <p class="text-sm text-muted">
      {{ t('navigation.command_palettes_are_useful_when_a_product_has_enough_destinations_or_commands_to_justify_fast_search') }}
    </p>
  </div>
</template>
