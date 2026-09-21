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
  { title: t('navigation.base'), description: t('navigation.baseDescription') },
  { title: t('navigation.identity'), description: t('navigation.identityDescription') },
  { title: t('navigation.interface'), description: t('navigation.interfaceDescription') }
])

const accordionItems = computed(() => [
  {
    label: t('navigation.accentQuestion'),
    icon: 'i-lucide-sparkles',
    content: t('navigation.accentAnswer')
  },
  {
    label: t('navigation.neutralQuestion'),
    icon: 'i-lucide-square',
    content: t('navigation.neutralAnswer')
  }
])

const commandGroups = computed(() => [
  {
    id: 'docs',
    label: t('navigation.docs'),
    items: [
      { label: t('navigation.openColors'), icon: 'i-lucide-palette' },
      { label: t('navigation.openLogos'), icon: 'i-lucide-badge-check' },
      { label: t('navigation.openComponents'), icon: 'i-lucide-component' }
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
      {{ t('navigation.openComponentSystem') }}
      <UIcon name="i-lucide-arrow-right" class="size-4" />
    </ULink>
  </div>

  <ULink
    v-else-if="props.name === 'link'"
    :to="props.context.paths.components"
    class="inline-flex items-center gap-2 text-primary hover:text-primary"
  >
    {{ t('navigation.openComponentSystem') }}
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
        {{ t('navigation.orderedGuidance') }}
      </p>
      <UStepper :items="stepperItems" orientation="vertical" class="max-w-md" />
    </div>
    <div class="space-y-5">
      <div class="space-y-3">
        <p class="text-sm font-semibold text-highlighted">
          {{ t('navigation.optionalDetail') }}
        </p>
        <UAccordion :items="accordionItems" />
      </div>
      <div class="grid gap-5">
        <div class="space-y-3">
          <p class="text-sm font-semibold text-highlighted">
            {{ t('navigation.listPosition') }}
          </p>
          <div class="overflow-x-auto pb-1">
            <UPagination :page="2" :total="30" :items-per-page="10" />
          </div>
        </div>
        <div class="space-y-3">
          <p class="text-sm font-semibold text-highlighted">
            {{ t('navigation.nestedContent') }}
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
      {{ t('navigation.commandHelp') }}
    </p>
  </div>
</template>
