<script setup lang="ts">
import { ShikiCachedRenderer } from '@shikijs/stream/vue'
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
const highlighter = useLayerInstallHighlighter()
const codeTheme = computed(() => colorMode.value === 'dark' ? 'material-theme-palenight' : 'material-theme-lighter')
const prosePreUi = {
  copy: 'hidden sm:inline-flex'
}
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
          <ShikiCachedRenderer
            :key="`install-${snippets.packageManager}-${codeTheme}`"
            :highlighter="highlighter"
            :code="snippets.installCommand"
            lang="bash"
            :theme="codeTheme"
          />
        </ProsePre>

        <ProsePre
          :code="snippets.nuxtConfig"
          language="ts"
          filename="nuxt.config.ts"
          :ui="prosePreUi"
        >
          <ShikiCachedRenderer
            :key="`config-${snippets.layer}-${codeTheme}`"
            :highlighter="highlighter"
            :code="snippets.nuxtConfig"
            lang="ts"
            :theme="codeTheme"
          />
        </ProsePre>
      </ProseCodeGroup>
    </slot>
  </div>
</template>
