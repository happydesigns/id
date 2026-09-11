<script setup lang="ts">
import { computed, ref } from 'vue'
import type { StudioTemplate } from '../templates'
const landingThumbnail = '/id-studio/templates/landing.png'

const props = defineProps<{ templates: StudioTemplate[] }>()
const model = defineModel<string>({ required: true })
const open = ref(false)
const selected = computed(() => props.templates.find(item => item.id === model.value))
function select(id: string) { model.value = id; open.value = false }
function thumbnail(item: StudioTemplate) { return item.thumbnail || (item.id === 'landing' ? landingThumbnail : undefined) }
</script>

<template>
  <div class="template-switcher">
    <UButton color="neutral" :variant="model === 'components' ? 'soft' : 'ghost'" icon="i-lucide-panels-top-left" :aria-pressed="model === 'components'" aria-label="Components" class="components-trigger" @click="select('components')"><span class="components-label">Components</span></UButton>
    <UPopover v-model:open="open" :content="{ align: 'end', sideOffset: 8 }">
      <UButton color="neutral" :variant="model === 'components' ? 'ghost' : 'soft'" trailing-icon="i-lucide-chevron-down" aria-label="Templates" class="templates-trigger" :ui="{ trailingIcon: 'ms-auto shrink-0' }"><span class="truncate">{{ selected?.label || 'Templates' }}</span></UButton>
      <template #content>
        <div class="template-gallery" :class="{ 'template-gallery-wide': templates.length > 2 }" role="group" aria-label="Choose a template">
          <UButton v-for="item in templates" :key="item.id" color="neutral" variant="ghost" :aria-label="item.label" :aria-pressed="model === item.id" class="template-choice" @click="select(item.id)">
            <img v-if="thumbnail(item)" :src="thumbnail(item)" alt="" width="1080" height="654" class="template-thumbnail" loading="lazy">
            <span v-else class="template-thumbnail template-placeholder"><UIcon :name="item.route ? 'i-lucide-book-open' : 'i-lucide-layout-template'" class="size-8 text-muted" /></span>
            <span class="flex w-full items-center justify-between gap-2"><span class="font-medium text-highlighted">{{ item.label }}</span><UIcon v-if="model === item.id" name="i-lucide-check" class="size-4 shrink-0" /></span>
            <span v-if="item.description" class="template-description">{{ item.description }}</span>
          </UButton>
        </div>
      </template>
    </UPopover>
  </div>
</template>

<style scoped>
.template-switcher { display: flex; align-items: center; min-width: 0; gap: 4px; }
.components-trigger { flex: 1; justify-content: center; }
.templates-trigger { width: 8.5rem; min-width: 0; }
.template-gallery { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; padding: 8px; width: 480px; max-width: calc(100vw - 24px); max-height: min(70dvh, 640px); overflow-y: auto; }
.template-gallery-wide { width: 720px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.template-choice { display: flex; flex-direction: column; align-items: start; gap: 6px; padding: 8px; min-width: 0; text-align: left; white-space: normal; }
.template-thumbnail { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; object-position: top; border-radius: 6px; background: var(--ui-bg-muted); border: 1px solid var(--ui-border); }
.template-placeholder { display: grid; place-items: center; }
.template-description { color: var(--ui-text-muted); font-size: 12px; line-height: 1.5; font-weight: 400; }
@media (max-width: 700px) { .components-label { display: none; }.components-trigger { flex: none; }.templates-trigger { flex: 1; width: 0; }.template-gallery-wide { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
