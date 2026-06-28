<script setup lang="ts">
import { computed, useAppConfig } from '#imports'
import {
  componentCoverageStatusMeta,
  normalizeComponentCoverage,
  type ComponentCoverageStatus
} from '../../src/component-coverage'
import type { BrandComponentCoverage, BrandRuntimeConfig } from '../../src'

const props = withDefaults(defineProps<{
  items?: BrandComponentCoverage[]
  caption?: string
  emptyText?: string
}>(), {
  items: undefined,
  caption: 'Component coverage',
  emptyText: 'No component coverage entries are configured yet.'
})

const appConfig = useAppConfig() as { id?: BrandRuntimeConfig }

const coverageItems = computed(() => normalizeComponentCoverage(
  props.items ?? appConfig.id?.guide?.componentCoverage
))

function statusMeta(status: ComponentCoverageStatus) {
  return componentCoverageStatusMeta[status]
}
</script>

<template>
  <div class="not-prose my-6 overflow-hidden rounded-sm border border-default bg-default">
    <div v-if="coverageItems.length" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-default text-left text-sm">
        <caption class="sr-only">
          {{ caption }}
        </caption>
        <thead class="bg-muted/60 text-xs uppercase text-muted">
          <tr>
            <th scope="col" class="px-4 py-3 font-medium">
              Family
            </th>
            <th scope="col" class="px-4 py-3 font-medium">
              Components
            </th>
            <th scope="col" class="px-4 py-3 font-medium">
              Status
            </th>
            <th scope="col" class="px-4 py-3 font-medium">
              Notes
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-default">
          <tr
            v-for="item in coverageItems"
            :key="item.family"
          >
            <th scope="row" class="whitespace-nowrap px-4 py-4 align-top font-medium text-highlighted">
              {{ item.family }}
            </th>
            <td class="px-4 py-4 align-top">
              <div class="flex max-w-3xl flex-wrap gap-1.5">
                <code
                  v-for="component in item.components"
                  :key="component"
                  class="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs text-toned"
                >
                  {{ component }}
                </code>
              </div>
            </td>
            <td class="px-4 py-4 align-top">
              <UBadge
                :color="statusMeta(item.status).color"
                variant="subtle"
                :label="statusMeta(item.status).label"
              />
            </td>
            <td class="max-w-sm px-4 py-4 align-top text-muted">
              {{ item.notes || statusMeta(item.status).description }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else role="status" class="px-4 py-5 text-sm text-muted">
      {{ emptyText }}
    </p>
  </div>
</template>
