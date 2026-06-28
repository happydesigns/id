<script setup lang="ts">
import { CodeToTokenTransformStream } from '@shikijs/stream'
import { ShikiStreamRenderer } from '@shikijs/stream/vue'
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
const prosePreUi = {
  copy: 'hidden sm:inline-flex'
}

function createCodeStream(code: string, lang: string) {
  return new ReadableStream<string>({
    start(controller) {
      controller.enqueue(code)
      controller.close()
    }
  }).pipeThrough(new CodeToTokenTransformStream({
    highlighter,
    lang,
    theme: codeTheme.value
  }))
}

const installCodeStream = computed(() => createCodeStream(snippets.value.installCommand, 'bash'))
const nuxtConfigCodeStream = computed(() => createCodeStream(snippets.value.nuxtConfig, 'ts'))

async function revealInstallHighlight() {
  await nextTick()
  isInstallHighlighted.value = true
}

async function revealNuxtConfigHighlight() {
  await nextTick()
  isNuxtConfigHighlighted.value = true
}

watch([() => snippets.value.installCommand, codeTheme], () => {
  isInstallHighlighted.value = false
})

watch([() => snippets.value.nuxtConfig, codeTheme], () => {
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
          <ShikiStreamRenderer
            v-show="isInstallHighlighted"
            :key="`install-${snippets.packageManager}-${codeTheme}`"
            :stream="installCodeStream"
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
          <ShikiStreamRenderer
            v-show="isNuxtConfigHighlighted"
            :key="`config-${snippets.layer}-${codeTheme}`"
            :stream="nuxtConfigCodeStream"
            @stream-start="revealNuxtConfigHighlight"
          />
        </ProsePre>
      </ProseCodeGroup>
    </slot>
  </div>
</template>
