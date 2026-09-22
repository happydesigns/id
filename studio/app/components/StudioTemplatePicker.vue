<script setup lang="ts">
import { useStudioIcon } from '../../playground-icons'

import { computed, ref, watch } from 'vue'
import type { StudioTemplate } from '../../templates'
import type { StudioDocument } from '../../../src/studio'
import StudioTemplateThumbnail from './StudioTemplateThumbnail.vue'

const props = withDefaults(defineProps<{ templates: StudioTemplate[], document: StudioDocument, mode: 'light' | 'dark', liveThumbnails?: boolean }>(), { liveThumbnails: true })
const model = defineModel<string>({ required: true })
const open = defineModel<boolean>('open', { default: false })
const items = computed(() => props.templates)
const selected = computed(() => items.value.find(item => item.id === model.value))
function select(id: string) {
  model.value = id
  open.value = false
}
const activeCount = ref(2)
watch(open, () => {
  activeCount.value = 2
})

const resolveIcon = useStudioIcon()
</script>

<template>
  <div
    class="template-switcher studio-scene-pill"
    role="group"
    aria-label="Preview type"
  >
    <UButton
      color="neutral"
      variant="ghost"
      :icon="resolveIcon('i-lucide-monitor')"
      aria-label="Components"
      :aria-pressed="model === 'components'"
      class="components-trigger studio-scene-trigger"
      @click="select('components')"
    >
      <span class="components-label">Components</span>
    </UButton>
    <UPopover
      v-model:open="open"
      :content="{ align: 'center', sideOffset: 8 }"
    >
      <UButton
        color="neutral"
        variant="ghost"
        :icon="resolveIcon('i-lucide-panels-top-left')"
        :trailing-icon="resolveIcon('i-lucide-chevron-down')"
        aria-label="Templates"
        :aria-pressed="model !== 'components'"
        class="templates-trigger studio-scene-trigger"
        :ui="{ trailingIcon: 'ms-auto shrink-0' }"
      >
        <span class="truncate">{{ selected?.label || 'Templates' }}</span>
      </UButton>
      <template #content>
        <div
          class="template-gallery"
          :class="{ 'template-gallery-wide': items.length > 2 }"
          role="group"
          aria-label="Choose a template"
        >
          <UButton
            v-for="(item, index) in items"
            :key="item.id"
            color="neutral"
            variant="ghost"
            :aria-label="item.label"
            :aria-pressed="model === item.id"
            class="template-choice"
            @click="select(item.id)"
          >
            <StudioTemplateThumbnail
              v-if="open && liveThumbnails"
              :template="item"
              :document="document"
              :mode="mode"
              :enabled="index < activeCount"
              @settled="activeCount++"
            />
            <img
              v-else-if="item.thumbnail"
              :src="item.thumbnail"
              alt=""
              loading="lazy"
              class="aspect-[16/10] w-full rounded object-cover object-top"
            >
            <span class="flex w-full items-center justify-between gap-2"><span class="font-medium text-highlighted">{{ item.label }}</span><UIcon
              v-if="model === item.id"
              :name="resolveIcon('i-lucide-check')"
              class="size-4 shrink-0"
            /></span>
            <span
              v-if="item.description"
              class="template-description"
            >{{ item.description }}</span>
          </UButton>
        </div>
      </template>
    </UPopover>
  </div>
</template>

<style scoped>
.template-switcher { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); align-items: center; gap: 4px; min-width: 0; }
.components-trigger { justify-content: center; }
.templates-trigger { width: 100%; min-width: 0; }
.template-gallery { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; padding: 8px; width: 480px; max-width: calc(100vw - 24px); max-height: min(70dvh, 640px); overflow-y: auto; }
.template-gallery-wide { width: 720px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.template-choice { display: flex; flex-direction: column; align-items: start; gap: 6px; padding: 8px; min-width: 0; text-align: left; white-space: normal; }
.template-description { color: var(--ui-text-muted); font-size: 12px; line-height: 1.5; font-weight: 400; }
@media (max-width: 700px) { .template-switcher { grid-template-columns: 32px minmax(0, 1fr); }.components-label { display: none; }.template-gallery-wide { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
