<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, provide, ref } from 'vue'
import { portalTargetInjectionKey } from '@nuxt/ui/composables/usePortal'
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
provide(portalTargetInjectionKey, computed(() => container.value ?? 'body'))
const inlineHeight = ref(0)
let pageScroll = { left: 0, top: 0 }
let returnFocus: HTMLElement | undefined
let previousOverflow = ''
let nestedEscape = false
function captureEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  nestedEscape = !!container.value?.querySelector('[role="listbox"][data-state="open"], [role="menu"][data-state="open"], [data-reka-popper-content-wrapper] [data-state="open"]')
}
function cancel() {
  if (!nestedEscape) void collapse()
  nestedEscape = false
}
function expand(event: MouseEvent) {
  const dialog = container.value
  if (!dialog) return
  inlineHeight.value = dialog.getBoundingClientRect().height
  pageScroll = { left: window.scrollX, top: window.scrollY }
  returnFocus = event.currentTarget as HTMLElement
  previousOverflow = window.document.body.style.overflow
  window.document.body.style.overflow = 'hidden'
  expanded.value = true
  dialog.close()
  dialog.showModal()
}
async function collapse() {
  if (!expanded.value) return
  const closingLayers = Array.from(container.value?.querySelectorAll('[data-reka-popper-content-wrapper]') ?? [])
  const transitions = closingLayers.flatMap(layer => layer.getAnimations({ subtree: true })).filter(animation => animation.effect?.getTiming().iterations !== Infinity)
  expanded.value = false
  container.value?.close()
  container.value?.show()
  window.document.body.style.overflow = previousOverflow
  await nextTick()
  await Promise.allSettled(transitions.map(animation => animation.finished))
  await nextTick()
  // Let nested Reka focus scopes finish restoring their trigger first.
  await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
  if (expanded.value) return
  window.scrollTo({ ...pageScroll, behavior: 'instant' })
  const trigger = container.value?.querySelector<HTMLElement>('[aria-label="Expand preview"]') ?? returnFocus
  trigger?.focus({ preventScroll: true })
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
const previewOptions = computed(() => [{ label: 'Components', value: 'components' }, ...templates.value.map(item => ({ label: item.label, value: item.id }))])

const selectedTemplate = computed(() => templates.value.find(template => template.id === scene.value))
</script>

<template>
  <div
    class="min-w-0 w-full"
    :style="expanded ? { height: `${inlineHeight}px` } : undefined"
  >
    <dialog
      ref="container"
      open
      :role="expanded ? 'dialog' : 'region'"
      :aria-modal="expanded || undefined"
      class="showcase-shell"
      :class="{ 'showcase-expanded': expanded }"
      :aria-label="title"
      data-studio-showcase
      @keydown.capture="captureEscape"
      @cancel.prevent="cancel"
    >
      <div
        class="showcase-toolbar mb-6 flex flex-wrap items-center gap-4 sm:mb-8 sm:gap-6"
      >
        <StudioTemplatePicker
          v-if="!expanded"
          v-model="scene"
          :templates="templates"
          :document="document"
          :mode="mode"
          :portal="container"
          class="showcase-picker"
        />
        <USelect
          v-if="expanded"
          v-model="scene"
          :items="previewOptions"
          aria-label="Preview"
          variant="ghost"
          class="w-36"
        />
        <USeparator
          v-if="!expanded"
          class="hidden min-w-0 flex-1 sm:flex"
        />
        <div
          class="flex shrink-0 items-center gap-2"
          :class="{ 'ms-auto': !expanded }"
        >
          <UButton
            v-if="!expanded"
            to="/studio?browse=true"
            color="neutral"
            variant="soft"
            size="md"
            icon="i-lucide-palette"
            :aria-label="studioLabel"
            :title="studioLabel"
          >
            Studio
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
            :variant="expanded ? 'ghost' : 'soft'"
            size="md"
            @click="expanded ? collapse() : expand($event)"
          />
        </div>
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
  </div>
</template>

<style scoped>
.showcase-shell { position: static; width: 100%; max-width: none; max-height: none; margin: 0; padding: 0; border: 0; color: inherit; background: transparent; overflow: visible; }
.showcase-expanded { position: fixed; inset: 0; display: flex; flex-direction: column; width: 100%; height: 100dvh; overflow: hidden; background: var(--ui-bg); color: var(--ui-text); }
.showcase-expanded > .showcase-toolbar { position: absolute; z-index: 20; bottom: max(12px, env(safe-area-inset-bottom)); left: 50%; transform: translateX(-50%); display: flex; flex-wrap: nowrap; gap: 4px; width: max-content; max-width: calc(100% - 24px); margin: 0; padding: 4px; border: 1px solid var(--ui-border); border-radius: calc(var(--ui-radius) + 8px); background: color-mix(in srgb, var(--ui-bg-elevated) 92%, transparent); backdrop-filter: blur(12px); box-shadow: 0 4px 20px #0002; }
.showcase-expanded > [data-showcase-components] { flex: 1; min-height: 0; overflow: auto; border: 0; border-radius: 0; padding-bottom: 80px; }
.showcase-expanded > [data-preview-state] { flex: 1; min-height: 0; border: 0; border-radius: 0; }
.showcase-expanded :deep(iframe) { height: 100%; min-height: 0; border-radius: 0; }

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
