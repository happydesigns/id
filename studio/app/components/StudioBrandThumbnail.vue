<script setup lang="ts">
import { computed } from 'vue'
import type { StudioDocument } from '../../../src/studio'
import { paletteSwatch } from '../../palette'

const props = defineProps<{ document: StudioDocument }>()
const colors = computed(() => {
  const palettes = props.document.brand.colors
  const primary = props.document.theme.ui?.colors?.primary || 'green'
  const neutral = props.document.theme.ui?.colors?.neutral || 'slate'
  return {
    primary: paletteSwatch(primary, palettes),
    light: paletteSwatch(neutral, palettes, '100'),
    dark: paletteSwatch(neutral, palettes, '900'),
    muted: paletteSwatch(neutral, palettes, '400'),
  }
})
</script>

<template>
  <span
    aria-hidden="true"
    class="brand-thumbnail"
    :style="{ background: colors.light, color: colors.dark }"
  >
    <span
      class="brand-thumbnail-surface"
      :style="{ background: colors.dark }"
    >
      <span
        class="brand-thumbnail-line"
        :style="{ background: colors.light }"
      />
      <span
        class="brand-thumbnail-line brand-thumbnail-short"
        :style="{ background: colors.muted }"
      />
      <span
        class="brand-thumbnail-button"
        :style="{ background: colors.primary }"
      />
    </span>
    <span class="brand-thumbnail-colors"><span :style="{ background: colors.primary }" /><span :style="{ background: colors.muted }" /><span :style="{ background: colors.dark }" /></span>
  </span>
</template>

<style scoped>
.brand-thumbnail { display: flex; flex-direction: column; gap: 5px; width: 68px; padding: 5px; border-radius: calc(var(--ui-radius) * 2); flex-shrink: 0; }
.brand-thumbnail-surface { display: flex; flex-direction: column; align-items: start; gap: 4px; padding: 7px; border-radius: calc(var(--ui-radius) * 1); }
.brand-thumbnail-line { height: 3px; width: 32px; border-radius: calc(var(--ui-radius) * 0.5); }
.brand-thumbnail-short { width: 23px; }
.brand-thumbnail-button { width: 20px; height: 7px; margin-top: 2px; border-radius: calc(var(--ui-radius) * 0.75); }
.brand-thumbnail-colors { display: flex; gap: 3px; }
.brand-thumbnail-colors > span { flex: 1; height: 5px; border-radius: calc(var(--ui-radius) * 0.5); }
</style>
