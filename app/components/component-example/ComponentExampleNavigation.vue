<script setup lang="ts">
import type { ComponentExampleContext } from '../../../src/component-examples'

const props = defineProps<{
  name: string
  context: ComponentExampleContext
}>()

const navigationItems = [
  { label: 'Colors', icon: 'i-lucide-palette', to: props.context.paths.colors },
  { label: 'Typography', icon: 'i-lucide-type', to: props.context.paths.typography },
  { label: 'Components', icon: 'i-lucide-component', to: props.context.paths.components, active: true }
]

const breadcrumbItems = [
  { label: 'Docs', to: props.context.paths.docs },
  { label: 'Components', to: props.context.paths.components },
  { label: 'Navigation' }
]

const tabs = [
  { label: 'Overview', icon: 'i-lucide-layout-grid' },
  { label: 'Usage', icon: 'i-lucide-list-checks' },
  { label: 'Tokens', icon: 'i-lucide-code-2' }
]

const stepperItems = [
  { title: 'Base', description: 'Set spacing, type, and color roles.' },
  { title: 'Identity', description: 'Choose the right mark and voice.' },
  { title: 'Interface', description: 'Apply the system through components.' }
]

const accordionItems = [
  {
    label: 'Where should accent color appear?',
    icon: 'i-lucide-sparkles',
    content: 'Use accent color for focus, active states, and precise emphasis. Avoid making it the only hierarchy tool.'
  },
  {
    label: 'What should stay neutral?',
    icon: 'i-lucide-square',
    content: 'Panels, forms, tables, and navigation surfaces should use semantic neutral surfaces and visible borders.'
  }
]

const commandGroups = [
  {
    id: 'docs',
    label: 'Docs',
    items: [
      { label: 'Open colors', icon: 'i-lucide-palette' },
      { label: 'Open logos', icon: 'i-lucide-badge-check' },
      { label: 'Open components', icon: 'i-lucide-component' }
    ]
  }
]

const treeItems = [
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
]
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
      Open component system
      <UIcon name="i-lucide-arrow-right" class="size-4" />
    </ULink>
  </div>

  <ULink
    v-else-if="props.name === 'link'"
    :to="props.context.paths.components"
    class="inline-flex items-center gap-2 text-primary hover:text-primary"
  >
    Open component system
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
        Ordered guidance
      </p>
      <UStepper :items="stepperItems" orientation="vertical" class="max-w-md" />
    </div>
    <div class="space-y-5">
      <div class="space-y-3">
        <p class="text-sm font-semibold text-highlighted">
          Optional detail
        </p>
        <UAccordion :items="accordionItems" />
      </div>
      <div class="grid gap-5">
        <div class="space-y-3">
          <p class="text-sm font-semibold text-highlighted">
            List position
          </p>
          <div class="overflow-x-auto pb-1">
            <UPagination :page="2" :total="30" :items-per-page="10" />
          </div>
        </div>
        <div class="space-y-3">
          <p class="text-sm font-semibold text-highlighted">
            Nested content
          </p>
          <UTree :items="treeItems" class="max-w-sm" />
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="props.name === 'navigation-fast-pattern'" class="space-y-4">
    <UCommandPalette
      :groups="commandGroups"
      class="max-h-72"
    />
    <p class="text-sm text-muted">
      Command palettes are useful when a product has enough destinations or commands to justify fast search.
    </p>
  </div>
</template>
