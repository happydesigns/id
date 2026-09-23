<script setup lang="ts">
import { computed } from 'vue'
import { toHtml } from 'hast-util-to-html'
import highlighter from '#mdc-highlighter'
import type { StudioDocument } from '../../../src/studio'
import { createStudioRuntimeFiles } from '../../../src/studio-generation'

const props = defineProps<{ document: StudioDocument }>()
const files = computed(() => {
  const generated = createStudioRuntimeFiles(props.document)
  return [
    { language: 'css', filename: 'brand.css', code: generated['app/assets/css/brand.css']! },
    { language: 'ts', filename: 'app.config.ts', code: generated['app/app.config.ts']! },
  ]
})
const highlighting = useRuntimeConfig().public.mdc.highlight
const { data: examples } = await useAsyncData('brand-hero-code', () => Promise.all(files.value.map(async (file) => {
  const result = await highlighter(file.code, file.language, highlighting && highlighting.theme)
  // ProsePre renders each line as a block; discard Shiki's newline separators.
  // Serialize the syntax tree, escaping all authored text.
  return { ...file, html: toHtml({ type: 'root', children: result.tree.filter(node => node.type !== 'text' || node.value.trim()) }), style: result.style }
})), { watch: [files] })
useHead({ style: computed(() => [{ key: 'brand-hero-highlighting', textContent: examples.value?.[0]?.style || '' }]) })
</script>

<template>
  <UTheme
    :ui="{ prose: {
      codeGroup: { root: 'my-0', list: 'border-0 bg-transparent rounded-none', indicator: 'shadow-none' },
      pre: { base: 'h-72 sm:h-80 overflow-auto border-0 bg-default/60 rounded-lg whitespace-pre px-4 py-4 text-xs/6' },
    } }"
  >
    <ProseCodeGroup>
      <ProsePre
        v-for="example in examples"
        :key="example.filename"
        :filename="example.filename"
        :language="example.language"
        :code="example.code"
        class="shiki"
      >
        <!-- Shiki syntax tree serialized with HTML escaping above. -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <code v-html="example.html" />
      </ProsePre>
    </ProseCodeGroup>
  </UTheme>
</template>
