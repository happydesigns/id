<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
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
const expanded = ref(false)
const container = ref<HTMLDialogElement>()
let returnFocus: HTMLElement | undefined
let previousOverflow = ''
function expand(event: MouseEvent) {
  const dialog = container.value
  if (!dialog) return
  returnFocus = event.currentTarget as HTMLElement
  previousOverflow = window.document.body.style.overflow
  window.document.body.style.overflow = 'hidden'
  expanded.value = true
  dialog.close()
  dialog.showModal()
}
async function collapse() {
  if (!expanded.value) return
  expanded.value = false
  container.value?.close()
  container.value?.show()
  window.document.body.style.overflow = previousOverflow
  await nextTick()
  returnFocus?.focus({ preventScroll: true })
}
onBeforeUnmount(() => {
  if (expanded.value) window.document.body.style.overflow = previousOverflow
})
const config = useAppConfig() as unknown as { idStudio?: StudioHostConfig }
const colorMode = useColorMode()
const mode = computed<'light' | 'dark'>(() => colorMode.value === 'dark' ? 'dark' : 'light')
const document = computed(() => props.document ?? config.idStudio?.document ?? createBlankStudioDocument())
const templates = computed(() => studioTemplates(config.idStudio?.templates))
const scene = ref('components')
const selectedTemplate = computed(() => templates.value.find(template => template.id === scene.value))
</script>

<template>
  <dialog
    ref="container"
    open
    :role="expanded ? 'dialog' : 'region'"
    :aria-modal="expanded || undefined"
    class="showcase-shell"
    :class="{ 'showcase-expanded': expanded }"
    :aria-label="title"
    data-studio-showcase
    @cancel.prevent="collapse"
  >
    <div class="mb-6 flex flex-wrap items-center gap-4 sm:mb-8 sm:gap-6">
      <StudioTemplatePicker
        v-model="scene"
        :templates="templates"
        :document="document"
        :mode="mode"
        :portal="container"
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
      <UButton
        v-if="expanded"
        :icon="mode === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
        aria-label="Toggle preview color mode"
        color="neutral"
        variant="ghost"
        @click="colorMode.preference = mode === 'dark' ? 'light' : 'dark'"
      />
      <UButton
        :icon="expanded ? 'i-lucide-minimize' : 'i-lucide-maximize'"
        :aria-label="expanded ? 'Close expanded preview' : 'Expand preview'"
        :title="expanded ? 'Close expanded preview' : 'Expand preview'"
        color="neutral"
        variant="ghost"
        @click="expanded ? collapse() : expand($event)"
      />
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
      @escape="collapse"
    />
  </dialog>
</template>

<style scoped>
.showcase-shell { position: static; width: 100%; max-width: none; max-height: none; margin: 0; padding: 0; border: 0; color: inherit; background: transparent; overflow: visible; }
.showcase-expanded { position: fixed; inset: 0; display: flex; flex-direction: column; width: 100%; height: 100dvh; padding: 16px; overflow: hidden; background: var(--ui-bg); color: var(--ui-text); }
.showcase-expanded > :first-child { flex-shrink: 0; margin-bottom: 16px; }
.showcase-expanded > [data-showcase-components] { min-height: 0; overflow: auto; }
.showcase-expanded > [data-preview-state] { flex: 1; min-height: 0; }
.showcase-expanded :deep(iframe) { height: 100%; min-height: 0; }
@media (min-width: 640px) { .showcase-expanded { padding: 24px; } }

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
