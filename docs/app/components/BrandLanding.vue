<script setup lang="ts">
import { useBrandTheme } from '../../../app/composables/useBrandTheme'
import type { StudioDocument } from '../../../src/studio'
import type { StudioHostConfig } from '../../../src/studio-host'
import { studioTemplates } from '../../../studio/templates'
import StudioTemplatePicker from '../../../studio/app/components/StudioTemplatePicker.vue'
import { docsPresetAvatar, docsPresetDocuments } from '../../presets'
import BrandLandingTemplatePreview from './BrandLandingTemplatePreview.vue'
import { computed, ref } from 'vue'

const brandTheme = useBrandTheme()
const appConfig = useAppConfig() as unknown as { idStudio: StudioHostConfig & { document: StudioDocument } }
const editor = useNuxtApp().$docsBrandEditor
const colorMode = useColorMode()
const mode = computed<'light' | 'dark'>(() => colorMode.value === 'dark' ? 'dark' : 'light')
const templates = studioTemplates(appConfig.idStudio.templates)
const scene = ref('components')
const selectedTemplate = computed(() => templates.find(item => item.id === scene.value))
const previewDocument = computed(() => editor?.document.value
  ?? appConfig.idStudio.brands?.[brandTheme.selectedName.value]
  ?? appConfig.idStudio.document)

const presets = computed(() => ['nuxt-ui', ...Object.keys(docsPresetDocuments)].flatMap((name) => {
  const theme = brandTheme.themes.value.find(item => item.name === name)
  if (!theme) return []
  return [{ name, label: theme.label, avatar: docsPresetAvatar(theme) }]
}))
</script>

<template>
  <div>
    <div class="landing-hero relative isolate overflow-hidden">
      <div
        class="landing-hero-dots pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      />
      <UPageHero
        orientation="horizontal"
        headline="Identity for Nuxt UI"
        description="Develop your Nuxt UI apps independently of their visual identity. One native brand layer gives them a shared look, while each app keeps its own features and release cycle."
        :ui="{
          container: 'min-h-[560px] gap-12 py-16 sm:py-20 lg:gap-16 lg:py-20',
          title: '[font-family:var(--font-display,var(--font-sans))] text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.07] tracking-tight',
          description: 'max-w-xl text-lg leading-relaxed sm:text-xl',
          links: 'mt-8 gap-3',
        }"
      >
        <template #title>
          Build your apps.<br>
          <span class="text-primary">Brand them together.</span>
        </template>
        <template #links>
          <UButton
            to="/getting-started/introduction"
            size="lg"
            trailing-icon="i-lucide-arrow-right"
          >
            Read the docs
          </UButton>
          <UButton
            to="/studio"
            size="lg"
            color="neutral"
            variant="outline"
            icon="i-lucide-palette"
          >
            Open Studio
          </UButton>
        </template>

        <UCard
          class="min-w-0 @container"
          :ui="{ root: 'ring-0 divide-y-0 bg-muted/60', body: 'p-2 sm:p-2', footer: 'px-2 pb-2 pt-0 sm:px-2 sm:pb-2 sm:pt-0' }"
        >
          <div class="landing-installation min-w-0 overflow-hidden">
            <BrandCodePreview :document="previewDocument" />
          </div>

          <template #footer>
            <div class="min-w-0">
              <div
                class="flex flex-wrap items-center gap-1"
                role="group"
                aria-label="Brand presets"
              >
                <UTooltip
                  v-for="preset in presets"
                  :key="preset.name"
                  :text="preset.label"
                >
                  <UButton
                    :aria-label="`Apply ${preset.label} preset`"
                    :aria-pressed="brandTheme.selectedName.value === preset.name"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    class="size-8 shrink-0 justify-center rounded-full p-0"
                    :class="brandTheme.selectedName.value === preset.name ? 'ring-1 ring-primary/60 bg-primary/10' : ''"
                    @click="brandTheme.setTheme(preset.name)"
                  >
                    <span
                      class="flex size-6 items-center justify-center rounded-full"
                      :style="preset.avatar.style"
                    >
                      <UIcon
                        :name="preset.avatar.icon"
                        class="size-4"
                      />
                    </span>
                  </UButton>
                </UTooltip>
              </div>
            </div>
          </template>
        </UCard>
      </UPageHero>
    </div>

    <USeparator class="border-primary/25" />

    <section
      class="border-b border-default bg-elevated/30"
      aria-labelledby="landing-showcase-title"
    >
      <UContainer class="pb-10">
        <div class="flex flex-wrap items-center justify-between gap-3 py-5">
          <h2
            id="landing-showcase-title"
            class="sr-only"
          >
            Brand previews
          </h2>
          <StudioTemplatePicker
            v-model="scene"
            :templates="templates"
            :document="previewDocument"
            :mode="mode"
            class="landing-template-picker"
          />
          <UButton
            to="/studio"
            color="neutral"
            variant="link"
            trailing-icon="i-lucide-arrow-up-right"
            size="sm"
          >
            Explore in Studio
          </UButton>
        </div>
        <div
          v-show="scene === 'components'"
          class="rounded-xl border border-default bg-muted/40 p-3 sm:p-5"
        >
          <LazyIdStudioComponents
            state="default"
            embedded
          />
        </div>
        <BrandLandingTemplatePreview
          v-if="selectedTemplate"
          :key="selectedTemplate.id"
          :template="selectedTemplate"
          :document="previewDocument"
          :mode="mode"
        />
      </UContainer>
    </section>
  </div>
</template>

<style scoped>
.landing-hero-dots {
  background-image:
    radial-gradient(ellipse at 80% 35%, color-mix(in srgb, var(--ui-primary) 9%, transparent), transparent 55%),
    radial-gradient(circle, color-mix(in srgb, var(--ui-primary) 16%, transparent) 0.8px, transparent 1px);
  background-size: auto, 22px 22px;
  mask-image: linear-gradient(to right, transparent 4%, black 56%);
}

.landing-installation :deep(.my-5) {
  margin-block: 0;
}

.landing-template-picker {
  width: min(100%, 320px);
  padding: 4px;
  border-radius: calc(var(--ui-radius) + 4px);
  background: var(--ui-bg-elevated);
}

.landing-template-picker :deep(.studio-scene-trigger) {
  min-height: 32px;
  border-radius: var(--ui-radius);
  padding-inline: 12px;
  color: var(--ui-text-muted);
}

.landing-template-picker :deep(.studio-scene-trigger[aria-pressed="true"]) {
  background: var(--ui-bg);
  color: var(--ui-text-highlighted);
}
</style>
