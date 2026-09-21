<script setup lang="ts">
import { ref } from 'vue'
import type { ComponentExampleContext } from '../../../src/component-examples'

const props = defineProps<{
  name: string
  context: ComponentExampleContext
}>()

const status = ref('Ready for review')
const sidebarCollapsed = ref(false)

const statusItems = [
  { label: 'Draft', value: 'Draft' },
  { label: 'Ready for review', value: 'Ready for review' },
  { label: 'Published', value: 'Published' },
]

const dashboardItems = [
  { label: 'Projects', icon: 'i-lucide-folder-kanban', active: true },
  { label: 'Components', icon: 'i-lucide-component' },
  { label: 'Settings', icon: 'i-lucide-settings' },
]

const dashboardSearchGroups = [{
  id: 'dashboard',
  label: 'Dashboard',
  items: [
    { label: 'Open projects', icon: 'i-lucide-folder-kanban' },
    { label: 'Review components', icon: 'i-lucide-component' },
  ],
}]

const navigationItems = [
  { label: 'Colors', icon: 'i-lucide-palette', to: props.context.paths.colors },
  { label: 'Typography', icon: 'i-lucide-type', to: props.context.paths.typography },
  { label: 'Components', icon: 'i-lucide-component', to: props.context.paths.components, active: true },
]
</script>

<template>
  <UDashboardGroup
    v-if="props.name === 'dashboard-shell' || props.name === 'dashboard-group'"
    storage="local"
    storage-key="id-component-example-dashboard"
    class="!relative !inset-auto h-[30rem] overflow-hidden rounded-sm border border-default bg-default"
  >
    <UDashboardSidebar
      v-model:collapsed="sidebarCollapsed"
      collapsible
      resizable
      :default-size="34"
      :min-size="24"
      :max-size="42"
      :collapsed-size="8"
      class="!flex min-h-full transition-[width,min-width,max-width,flex-basis] duration-200 ease-out"
    >
      <template #header="{ collapsed }">
        <UDashboardSearchButton
          :collapsed="collapsed"
          :variant="collapsed ? 'outline' : undefined"
          :tooltip="collapsed"
        />
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="dashboardItems"
          orientation="vertical"
        />
      </template>

      <template #footer="{ collapsed }">
        <UButton
          :aria-label="collapsed ? props.context.copy.brandLabel : undefined"
          :label="collapsed ? undefined : props.context.copy.brandLabel"
          :icon="collapsed ? 'i-lucide-component' : undefined"
          color="neutral"
          :variant="collapsed ? 'outline' : 'ghost'"
          :block="!collapsed"
          :square="collapsed"
        />
      </template>
    </UDashboardSidebar>

    <UDashboardResizeHandle />

    <UDashboardPanel :ui="{ root: 'min-h-full', body: 'p-4' }">
      <template #header>
        <UDashboardNavbar>
          <template #left>
            <UDashboardSidebarToggle class="lg:hidden" />
            <UDashboardSidebarCollapse
              class="hidden lg:inline-flex"
              :variant="sidebarCollapsed ? 'outline' : 'ghost'"
            />
            <h3 class="text-base font-semibold text-highlighted">
              Projects
            </h3>
          </template>

          <template #right>
            <UButton
              label="New"
              icon="i-lucide-plus"
              size="sm"
            />
          </template>
        </UDashboardNavbar>

        <UDashboardToolbar>
          <template #left>
            <UInput
              icon="i-lucide-search"
              placeholder="Search projects"
            />
          </template>
          <template #right>
            <USelect
              v-model="status"
              :items="statusItems"
              size="sm"
            />
          </template>
        </UDashboardToolbar>
      </template>

      <template #body>
        <div class="grid gap-3">
          <UCard
            variant="outline"
            :ui="{ body: 'p-4' }"
          >
            <div class="space-y-1">
              <p class="font-semibold text-highlighted">
                {{ props.context.copy.projectTitle }}
              </p>
              <p class="text-sm text-muted">
                {{ props.context.copy.projectDescription }}
              </p>
            </div>
          </UCard>
          <UCard
            variant="outline"
            :ui="{ body: 'p-4' }"
          >
            <div class="space-y-1">
              <p class="font-semibold text-highlighted">
                Brand guide
              </p>
              <p class="text-sm text-muted">
                Keep docs and theme decisions aligned.
              </p>
            </div>
          </UCard>
        </div>
      </template>
    </UDashboardPanel>

    <UDashboardSearch :groups="dashboardSearchGroups" />
  </UDashboardGroup>

  <USidebar
    v-else-if="props.name === 'sidebar'"
    collapsible="none"
    title="Components"
    :description="props.context.copy.brandLabel"
    class="!relative h-80 overflow-hidden rounded-sm border border-default bg-default"
    :ui="{ container: '!absolute !inset-y-0 !left-0 !flex !h-full', gap: 'hidden' }"
  >
    <UNavigationMenu
      :items="navigationItems"
      orientation="vertical"
    />
    <template #footer>
      <UButton
        :label="props.context.copy.brandLabel"
        color="neutral"
        variant="ghost"
        block
      />
    </template>
  </USidebar>
</template>
