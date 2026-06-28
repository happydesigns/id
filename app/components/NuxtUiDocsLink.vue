<script setup lang="ts">
import { computed } from '#imports'
import { parseDocsLinks, type DocsLink } from '../../src/docs-links'

const props = withDefaults(defineProps<{
  links?: string | DocsLink[]
  label?: string
}>(), {
  links: undefined,
  label: 'Docs'
})

const links = computed(() => parseDocsLinks(props.links))

const getLabel = (link: DocsLink) => link.label || props.label
</script>

<template>
  <div v-if="links.length" class="not-prose -mt-1 mb-6 flex flex-wrap items-center gap-1.5">
    <UButton
      v-for="link in links"
      :key="link.to"
      color="neutral"
      variant="subtle"
      size="xs"
      :label="getLabel(link)"
      icon="i-simple-icons-nuxtdotjs"
      trailing-icon="i-lucide-external-link"
      :to="link.to"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`Open ${getLabel(link)} in Nuxt UI docs`"
    />
  </div>
</template>
