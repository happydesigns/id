<script setup lang="ts">
import { computed } from '#imports'
import {
  createLayerInstallSnippets,
  layerInstallCommands,
  type LayerInstallPackageManager
} from '../../src/layer-install'

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

const managerCommand = computed(() => layerInstallCommands[snippets.value.packageManager])
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

    <div class="overflow-hidden rounded-sm border border-default bg-inverted text-inverted">
      <div class="border-b border-default bg-default/10 px-4 py-2 font-mono text-xs text-dimmed">
        {{ snippets.packageManager }}
      </div>
      <pre class="overflow-x-auto p-4 text-sm leading-6"><code><span class="text-warning">{{ managerCommand }}</span> <span class="text-success">{{ snippets.packageName }}</span></code></pre>
      <div class="border-y border-default bg-default/10 px-4 py-2 font-mono text-xs text-dimmed">
        nuxt.config.ts
      </div>
      <pre class="overflow-x-auto p-4 text-sm leading-6"><code><span class="line block"><span class="text-info">export</span> default <span class="text-primary">defineNuxtConfig</span>({</span><span class="line block">  extends: [<span class="text-success">'{{ snippets.layer }}'</span>]</span><span class="line block">})</span></code></pre>
    </div>
  </div>
</template>
