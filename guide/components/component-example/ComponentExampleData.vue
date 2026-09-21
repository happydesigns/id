<script setup lang="ts">
import { computed } from 'vue'
import { resolveComponentExampleMessage, type ComponentExampleMessageKey, type ComponentExampleContext } from '../../../src/component-examples'

const props = defineProps<{
  name: string
  context: ComponentExampleContext
}>()

const t = (key: ComponentExampleMessageKey) => resolveComponentExampleMessage(props.context.messages, key)

const tableData = computed(() => [
  { name: 'Button', role: t('data.action'), status: t('data.styled') },
  { name: 'Input', role: t('data.data_entry'), status: t('data.styled') },
  { name: 'Alert', role: t('data.feedback'), status: t('data.styled') }
])

const tableColumns = computed(() => [
  { accessorKey: 'name', header: t('data.component') },
  { accessorKey: 'role', header: t('data.role') },
  { accessorKey: 'status', header: t('forms.reviewStatus') }
])

const timelineItems = computed(() => [
  { title: t('data.tokens'), description: t('data.set_semantic_roles'), icon: 'i-lucide-swatch-book' },
  { title: t('data.components'), description: t('data.apply_shared_behavior'), icon: 'i-lucide-component' },
  { title: t('data.review'), description: t('data.check_contrast_and_copy'), icon: 'i-lucide-circle-check' }
])

const carouselItems = computed(() => [
  { title: t('data.color'), icon: 'i-lucide-palette' },
  { title: t('data.type'), icon: 'i-lucide-type' },
  { title: t('data.logo'), icon: 'i-lucide-badge-check' }
])

const listboxItems = computed(() => [
  { label: t('data.colors'), value: 'colors' },
  { label: t('data.typography'), value: 'typography' },
  { label: t('data.logos'), value: 'logos' },
  { label: t('data.components'), value: 'components' },
  { label: t('data.voice'), value: 'voice' }
])
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
      {{ t('data.tables_should_make_comparison_easier_before_color_or_badges_are_added') }}
    </div>
  </div>

  <UCard
    v-else-if="props.name === 'card'"
    variant="outline"
    :ui="{ body: 'p-4' }"
  >
    <p class="font-semibold text-highlighted">
      {{ t('data.reusable_pattern') }}
    </p>
    <p class="mt-1 text-sm text-muted">
      {{ t('data.cards_contain_one_object_decision_or_tool') }}
    </p>
  </UCard>

  <UPageCard
    v-else-if="props.name === 'page-card'"
    :title="t('data.reusable_pattern')"
    :description="t('data.use_page_cards_for_repeated_navigation_or_documentation_entries')"
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
            {{ t('data.reusable_pattern') }}
          </p>
          <p class="mt-1 text-sm text-muted">
            {{ t('data.a_card_contains_one_object_decision_or_tool') }}
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
      :title="t('data.component_family')"
      :description="t('data.page_cards_work_for_linked_or_repeated_page_level_entries')"
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
    <USeparator :label="t('data.token')" />
    <div class="rounded-sm bg-muted px-4 py-3 font-mono text-sm text-toned">
      --ui-primary: primary
    </div>
  </div>

  <div v-else-if="props.name === 'collapsible'" class="space-y-3">
    <UCollapsible>
      <UButton
        :label="t('data.show_token_detail')"
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
          {{ t('data.overflow_remains_reachable_without_stretching_the_page') }}
        </p>
      </UCard>
    </div>
  </UScrollArea>

  <div v-else-if="props.name === 'structure-sequence-pattern'" class="grid gap-7 md:grid-cols-2">
    <div class="space-y-3">
      <p class="font-semibold text-highlighted">
        {{ t('data.optional_detail') }}
      </p>
      <p class="text-sm text-muted">
        {{ t('data.keep_supporting_notes_close_without_making_the_first_read_heavier') }}
      </p>
      <UCollapsible>
        <UButton
          :label="t('data.show_token_detail')"
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
        {{ t('data.ordered_history') }}
      </p>
      <p class="text-sm text-muted">
        {{ t('data.use_timelines_when_sequence_explains_the_decision') }}
      </p>
      <UTimeline :items="timelineItems" size="sm" />
    </div>
    <div class="space-y-3">
      <p class="font-semibold text-highlighted">
        {{ t('data.comparable_previews') }}
      </p>
      <p class="text-sm text-muted">
        {{ t('data.use_carousels_when_nearby_items_are_useful_to_compare') }}
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
        {{ t('data.overflow_reference') }}
      </p>
      <p class="text-sm text-muted">
        {{ t('data.scroll_long_reference_lists_without_stretching_the_page') }}
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
              {{ t('data.reference_content_stays_reachable') }}
            </p>
          </div>
        </div>
      </UScrollArea>
    </div>
  </div>
</template>
