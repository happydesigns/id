<script setup lang="ts">
import { CodeToTokenTransformStream } from '@shikijs/stream'
import { ShikiStreamRenderer } from '@shikijs/stream/vue'
import { computed, useColorMode } from '#imports'
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
          <ShikiStreamRenderer
            :key="`install-${snippets.packageManager}-${codeTheme}`"
            :stream="installCodeStream"
          />
        </ProsePre>

        <ProsePre
          :code="snippets.nuxtConfig"
          language="ts"
          filename="nuxt.config.ts"
          :ui="prosePreUi"
        >
          <ShikiStreamRenderer
            :key="`config-${snippets.layer}-${codeTheme}`"
            :stream="nuxtConfigCodeStream"
          />
        </ProsePre>
      </ProseCodeGroup>
    </slot>
  </div>
</template>
