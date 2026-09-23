<script setup lang="ts">
import { computed, ref } from 'vue'
import { createBlankStudioDocument, type StudioDocument } from '../../../src/studio'
import type { StudioHostConfig } from '../../../src/studio-host'
import { studioTemplates } from '../../templates'
import StudioTemplatePicker from './StudioTemplatePicker.vue'
import StudioTemplatePreview from './StudioTemplatePreview.vue'

const props = withDefaults(defineProps<{
  document?: StudioDocument
  title?: string
  studioLabel?: string
}>(), { title: 'Brand previews', studioLabel: 'Open Studio' })
const config = useAppConfig() as unknown as { idStudio?: StudioHostConfig }
const colorMode = useColorMode()
const mode = computed<'light' | 'dark'>(() => colorMode.value === 'dark' ? 'dark' : 'light')
const document = computed(() => props.document ?? config.idStudio?.document ?? createBlankStudioDocument())
const templates = computed(() => studioTemplates(config.idStudio?.templates))
const scene = ref('components')
const selectedTemplate = computed(() => templates.value.find(template => template.id === scene.value))
</script>

<template>
  <section
    :aria-label="title"
    data-studio-showcase
  >
    <div class="mb-6 flex flex-wrap items-center gap-4 sm:mb-8 sm:gap-6">
      <StudioTemplatePicker
        v-model="scene"
        :templates="templates"
        :document="document"
        :mode="mode"
        class="showcase-picker"
      />
      <USeparator class="hidden min-w-0 flex-1 sm:flex" />
      <UButton
        to="/studio?browse=true"
        color="neutral"
        variant="link"
        size="sm"
        trailing-icon="i-lucide-arrow-up-right"
        class="ms-auto shrink-0"
      >
        {{ studioLabel }}
      </UButton>
    </div>
    <div
      v-show="scene === 'components'"
      class="rounded-xl border border-default bg-muted/40 p-4 sm:p-6"
      data-showcase-components
    >
      <LazyIdStudioComponents
        state="default"
        embedded
      />
    </div>
    <StudioTemplatePreview
      v-if="selectedTemplate"
      :key="selectedTemplate.id"
      :template="selectedTemplate"
      :document="document"
      :mode="mode"
    />
  </section>
</template>

<style scoped>
.showcase-picker {
  width: min(100%, 320px);
  padding: 4px;
  border-radius: calc(var(--ui-radius) + 4px);
  background: var(--ui-bg-elevated);
}
.showcase-picker :deep(.studio-scene-trigger) {
  min-height: 32px;
  border-radius: var(--ui-radius);
  padding-inline: 12px;
  color: var(--ui-text-muted);
}
.showcase-picker :deep(.studio-scene-trigger[aria-pressed="true"]) {
  background: var(--ui-bg);
  color: var(--ui-text-highlighted);
}
</style>
