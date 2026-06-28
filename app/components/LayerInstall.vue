<script setup lang="ts">
import { ShikiCachedRenderer } from '@shikijs/stream/vue'
import { computed, nextTick, ref, useColorMode, watch } from '#imports'
import {
  createLayerInstallSnippets,
  type LayerInstallPackageManager
} from '../../src/layer-install'
import { useLayerInstallHighlighter } from '../composables/useLayerInstallHighlighter'

const props = withDefaults(defineProps<{
  packageName: string
  layer?: string
  packageManager?: LayerInstallPackageManager
  eyebrow?: string
  title?: string
  badge?: string
}>(), {
  layer: undefined,
  packageManager: 'pnpm',
  eyebrow: 'Installation',
  title: 'Install the Nuxt layer.',
  badge: undefined
})

const snippets = computed(() => createLayerInstallSnippets({
  packageName: props.packageName,
  layer: props.layer,
  packageManager: props.packageManager
}))

const colorMode = useColorMode() as { value: string }
const highlighter = await useLayerInstallHighlighter()
const codeTheme = computed(() => colorMode.value === 'dark' ? 'material-theme-palenight' : 'material-theme-lighter')
const isInstallHighlighted = ref(false)
const isNuxtConfigHighlighted = ref(false)
const installHighlight = ref()
const nuxtConfigHighlight = ref()
let installRevealRun = 0
let nuxtConfigRevealRun = 0
const prosePreUi = {
  copy: 'hidden sm:inline-flex'
}

function queueFrame(callback: () => void) {
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(callback)
    return
  }

  setTimeout(callback, 0)
}

async function revealInstallHighlight(run = ++installRevealRun) {
  await nextTick()

  if (run !== installRevealRun) {
    return
  }

  if (installHighlight.value?.$el?.textContent?.trim()) {
    isInstallHighlighted.value = true
    return
  }

  queueFrame(() => revealInstallHighlight(run))
}

async function revealNuxtConfigHighlight(run = ++nuxtConfigRevealRun) {
  await nextTick()

  if (run !== nuxtConfigRevealRun) {
    return
  }

  if (nuxtConfigHighlight.value?.$el?.textContent?.trim()) {
    isNuxtConfigHighlighted.value = true
    return
  }

  queueFrame(() => revealNuxtConfigHighlight(run))
}

watch([() => snippets.value.installCommand, codeTheme], () => {
  installRevealRun += 1
  isInstallHighlighted.value = false
})

watch([() => snippets.value.nuxtConfig, codeTheme], () => {
  nuxtConfigRevealRun += 1
  isNuxtConfigHighlighted.value = false
})
</script>

<template>
  <div class="not-prose rounded-sm border border-default bg-elevated p-5 sm:p-6">
    <div class="mb-5 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="font-mono text-xs uppercase text-primary">
          {{ eyebrow }}
        </p>
        <h3 class="mt-3 text-xl font-semibold leading-tight text-highlighted">
          {{ title }}
        </h3>
      </div>
      <UBadge
        :label="badge || snippets.packageName"
        color="neutral"
        variant="subtle"
        class="font-mono"
      />
    </div>

    <slot :snippets="snippets">
      <ProseCodeGroup>
        <ProsePre
          :code="snippets.installCommand"
          language="bash"
          :filename="snippets.packageManager"
          :ui="prosePreUi"
        >
          <code v-if="!isInstallHighlighted">{{ snippets.installCommand }}</code>
          <ShikiCachedRenderer
            v-show="isInstallHighlighted"
            ref="installHighlight"
            :key="`install-${snippets.packageManager}-${codeTheme}`"
            :highlighter="highlighter"
            :code="snippets.installCommand"
            lang="bash"
            :theme="codeTheme"
            @stream-start="revealInstallHighlight"
          />
        </ProsePre>

        <ProsePre
          :code="snippets.nuxtConfig"
          language="ts"
          filename="nuxt.config.ts"
          :ui="prosePreUi"
        >
          <code v-if="!isNuxtConfigHighlighted">{{ snippets.nuxtConfig }}</code>
          <ShikiCachedRenderer
            v-show="isNuxtConfigHighlighted"
            ref="nuxtConfigHighlight"
            :key="`config-${snippets.layer}-${codeTheme}`"
            :highlighter="highlighter"
            :code="snippets.nuxtConfig"
            lang="ts"
            :theme="codeTheme"
            @stream-start="revealNuxtConfigHighlight"
          />
        </ProsePre>
      </ProseCodeGroup>
    </slot>
  </div>
</template>
