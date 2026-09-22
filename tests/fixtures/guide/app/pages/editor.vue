<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { StudioDocument } from '../../../../../src/studio'
import BrandStudio from '../../../../../studio/app/components/BrandStudio.vue'

defineOptions({ name: 'AlternativeEditorPage' })
definePageMeta({ layout: false })
function recolor(document: DeepReadonly<StudioDocument>, change: (document: StudioDocument, field?: string) => void, primary: string) {
  const next: StudioDocument = JSON.parse(JSON.stringify(document))
  next.theme.ui ??= {}
  next.theme.ui.colors ??= {}
  next.theme.ui.colors.primary = primary
  change(next, 'primary')
}
</script>

<template>
  <BrandStudio>
    <template #editor="{ document, change, errors }">
      <div
        data-testid="alternative-editor"
        class="space-y-3"
      >
        <p>Primary: {{ document.theme.ui?.colors?.primary }}</p>
        <UButton @click="recolor(document, change, 'violet')">
          Use violet
        </UButton>
        <UButton @click="recolor(document, change, 'missing-palette')">
          Try invalid palette
        </UButton>
        <p
          v-if="errors.primary"
          role="alert"
        >
          {{ errors.primary }}
        </p>
      </div>
    </template>
  </BrandStudio>
</template>
