<script setup lang="ts">
import { computed } from 'vue'
import { parseDocsLinks, type DocsLink } from '../../src/docs-links'

const props = withDefaults(defineProps<{
  links?: string | DocsLink[]
  label?: string
}>(), {
  links: undefined,
  label: 'Docs',
})

const links = computed(() => parseDocsLinks(props.links))

const getLabel = (link: DocsLink) => link.label || props.label
</script>

<template>
  <div
    v-if="links.length"
    class="not-prose -mt-1 mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs"
  >
    <span class="font-mono uppercase tracking-[0.14em] text-dimmed">Nuxt UI reference</span>
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <ULink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 font-medium text-muted hover:text-highlighted"
        :aria-label="`Open ${getLabel(link)} in Nuxt UI docs`"
      >
        <UIcon
          name="i-simple-icons-nuxtdotjs"
          class="size-3.5 text-primary"
        />
        <span>{{ getLabel(link) }}</span>
        <UIcon
          name="i-lucide-arrow-up-right"
          class="size-3"
        />
      </ULink>
    </div>
  </div>
</template>
