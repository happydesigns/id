<script setup lang="ts">
import type { ComponentExampleContext } from '../../../src/component-examples'

const props = defineProps<{
  name: string
  context: ComponentExampleContext
}>()

const tableData = [
  { name: 'Button', role: 'Action', status: 'Styled' },
  { name: 'Input', role: 'Data entry', status: 'Styled' },
  { name: 'Alert', role: 'Feedback', status: 'Styled' }
]

const tableColumns = [
  { accessorKey: 'name', header: 'Component' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'status', header: 'Status' }
]

const timelineItems = [
  { title: 'Tokens', description: 'Set semantic roles.', icon: 'i-lucide-swatch-book' },
  { title: 'Components', description: 'Apply shared behavior.', icon: 'i-lucide-component' },
  { title: 'Review', description: 'Check contrast and copy.', icon: 'i-lucide-circle-check' }
]

const carouselItems = [
  { title: 'Color', icon: 'i-lucide-palette' },
  { title: 'Type', icon: 'i-lucide-type' },
  { title: 'Logo', icon: 'i-lucide-badge-check' }
]

const listboxItems = [
  { label: 'Colors', value: 'colors' },
  { label: 'Typography', value: 'typography' },
  { label: 'Logos', value: 'logos' },
  { label: 'Components', value: 'components' },
  { label: 'Voice', value: 'voice' }
]
</script>

<template>
  <UTable
    v-if="props.name === 'table'"
    :data="tableData"
    :columns="tableColumns"
  />

  <div v-else-if="props.name === 'data-comparison-pattern'" class="space-y-4">
    <UTable
      :data="tableData"
      :columns="tableColumns"
    />
    <div class="flex flex-wrap items-center gap-2 text-sm text-muted">
      <UIcon name="i-lucide-circle-check" class="size-4 text-success" />
      Tables should make comparison easier before color or badges are added.
    </div>
  </div>

  <UCard
    v-else-if="props.name === 'card'"
    variant="outline"
    :ui="{ body: 'p-4' }"
  >
    <p class="font-semibold text-highlighted">
      Reusable pattern
    </p>
    <p class="mt-1 text-sm text-muted">
      Cards contain one object, decision, or tool.
    </p>
  </UCard>

  <UPageCard
    v-else-if="props.name === 'page-card'"
    title="Reusable pattern"
    description="Use page cards for repeated navigation or documentation entries."
    icon="i-lucide-layout-grid"
    :to="props.context.paths.components"
  />

  <UAvatar
    v-else-if="props.name === 'avatar'"
    :src="props.context.assets.symbol"
    :text="props.context.assets.symbol ? undefined : props.context.copy.brandLabel.slice(0, 2).toUpperCase()"
    :alt="props.context.logoAlt"
    size="xl"
  />

  <UAvatarGroup v-else-if="props.name === 'avatar-group'">
    <UAvatar
      :src="props.context.assets.symbol"
      :text="props.context.assets.symbol ? undefined : props.context.copy.brandLabel.slice(0, 2).toUpperCase()"
      :alt="props.context.logoAlt"
    />
    <UAvatar icon="i-lucide-code-2" />
    <UAvatar icon="i-lucide-palette" />
  </UAvatarGroup>

  <UUser
    v-else-if="props.name === 'user'"
    :name="props.context.copy.brandLabel"
    :description="props.context.copy.packageDescription"
    :avatar="{ src: props.context.assets.symbol, text: props.context.assets.symbol ? undefined : props.context.copy.brandLabel.slice(0, 2).toUpperCase(), alt: props.context.logoAlt }"
  />

  <div v-else-if="props.name === 'data-object-pattern'" class="grid gap-4 md:grid-cols-[1fr_1fr]">
    <UCard variant="outline" :ui="{ body: 'p-4' }">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="font-semibold text-highlighted">
            Reusable pattern
          </p>
          <p class="mt-1 text-sm text-muted">
            A card contains one object, decision, or tool.
          </p>
        </div>
        <UAvatarGroup>
          <UAvatar
            :src="props.context.assets.symbol"
            :text="props.context.assets.symbol ? undefined : props.context.copy.brandLabel.slice(0, 2).toUpperCase()"
            :alt="props.context.logoAlt"
          />
          <UAvatar icon="i-lucide-code-2" />
          <UAvatar icon="i-lucide-palette" />
        </UAvatarGroup>
      </div>
    </UCard>
    <UPageCard
      title="Component family"
      description="Page cards work for linked or repeated page-level entries."
      icon="i-lucide-layout-grid"
      :to="props.context.paths.components"
    />
    <div class="md:col-span-2">
      <UUser
        :name="props.context.copy.brandLabel"
        :description="props.context.copy.packageDescription"
        :avatar="{ src: props.context.assets.symbol, text: props.context.assets.symbol ? undefined : props.context.copy.brandLabel.slice(0, 2).toUpperCase(), alt: props.context.logoAlt }"
      />
    </div>
  </div>

  <div v-else-if="props.name === 'separator'" class="space-y-4">
    <USeparator label="Token" />
    <div class="rounded-sm bg-muted px-4 py-3 font-mono text-sm text-toned">
      --ui-primary: primary
    </div>
  </div>

  <div v-else-if="props.name === 'collapsible'" class="space-y-3">
    <UCollapsible>
      <UButton
        label="Show token detail"
        color="neutral"
        variant="outline"
        trailing-icon="i-lucide-chevron-down"
      />
      <template #content>
        <div class="mt-3 rounded-sm bg-muted p-4 font-mono text-sm text-toned">
          --ui-bg-muted: semantic surface
        </div>
      </template>
    </UCollapsible>
  </div>

  <div v-else-if="props.name === 'carousel'" class="overflow-hidden rounded-sm bg-muted">
    <UCarousel
      v-slot="{ item }"
      :items="carouselItems"
      :ui="{ item: 'basis-full' }"
    >
      <div class="flex h-28 items-center justify-center gap-3 px-4">
        <UIcon :name="item.icon" class="size-5 text-primary" />
        <span class="font-semibold text-highlighted">{{ item.title }}</span>
      </div>
    </UCarousel>
  </div>

  <div v-else-if="props.name === 'timeline'" class="rounded-sm border border-default bg-default p-5">
    <UTimeline :items="timelineItems" size="sm" />
  </div>

  <UScrollArea
    v-else-if="props.name === 'scroll-area'"
    class="h-72 rounded-sm border border-default bg-default p-4"
  >
    <div class="grid gap-3">
      <UCard
        v-for="item in listboxItems"
        :key="item.value"
        variant="outline"
        :ui="{ body: 'p-3' }"
      >
        <p class="font-medium text-highlighted">
          {{ item.label }}
        </p>
        <p class="mt-1 text-sm text-muted">
          Overflow remains reachable without stretching the page.
        </p>
      </UCard>
    </div>
  </UScrollArea>

  <div v-else-if="props.name === 'structure-sequence-pattern'" class="grid gap-7 md:grid-cols-2">
    <div class="space-y-3">
      <p class="font-semibold text-highlighted">
        Optional detail
      </p>
      <p class="text-sm text-muted">
        Keep supporting notes close without making the first read heavier.
      </p>
      <UCollapsible>
        <UButton
          label="Show token detail"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-chevron-down"
        />
        <template #content>
          <div class="mt-3 rounded-sm bg-muted px-4 py-3 font-mono text-sm text-toned">
            --ui-primary: primary
          </div>
        </template>
      </UCollapsible>
    </div>
    <div class="space-y-3">
      <p class="font-semibold text-highlighted">
        Ordered history
      </p>
      <p class="text-sm text-muted">
        Use timelines when sequence explains the decision.
      </p>
      <UTimeline :items="timelineItems" size="sm" />
    </div>
    <div class="space-y-3">
      <p class="font-semibold text-highlighted">
        Comparable previews
      </p>
      <p class="text-sm text-muted">
        Use carousels when nearby items are useful to compare.
      </p>
      <UCarousel
        v-slot="{ item }"
        :items="carouselItems"
        class="overflow-hidden rounded-sm border border-default bg-default"
        :ui="{ item: 'basis-full' }"
      >
        <div class="flex h-24 items-center justify-center gap-3 px-4">
          <UIcon :name="item.icon" class="size-5 text-primary" />
          <span class="font-semibold text-highlighted">{{ item.title }}</span>
        </div>
      </UCarousel>
    </div>
    <div class="space-y-3">
      <p class="font-semibold text-highlighted">
        Overflow reference
      </p>
      <p class="text-sm text-muted">
        Scroll long reference lists without stretching the page.
      </p>
      <UScrollArea class="h-32 rounded-sm border border-default bg-default">
        <div class="divide-y divide-default">
          <div
            v-for="item in listboxItems"
            :key="item.value"
            class="px-3 py-2"
          >
            <p class="font-medium text-highlighted">
              {{ item.label }}
            </p>
            <p class="mt-0.5 text-sm text-muted">
              Reference content stays reachable.
            </p>
          </div>
        </div>
      </UScrollArea>
    </div>
  </div>
</template>
