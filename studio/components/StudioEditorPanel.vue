<script setup lang="ts">
import { computed } from 'vue'
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'

const props = defineProps<{ pinned: boolean }>()
const open = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ restoreFocus: [] }>()
const wide = useMediaQuery('(min-width: 1100px)')
const docked = computed(() => props.pinned && wide.value)
const [DefineContent, Content] = createReusableTemplate()
let outside = false
function interactOutside(event: CustomEvent<{ originalEvent: Event }>) {
  const target = event.detail.originalEvent.target
  // Category buttons operate this same shared panel rather than dismissing it.
  if (target instanceof Element && target.closest('.studio-categories, [aria-controls="studio-editor"]')) event.preventDefault()
  else outside = true
}
function closeAutoFocus(event: Event) {
  event.preventDefault()
  if (!outside && !(document.activeElement instanceof HTMLIFrameElement)) emit('restoreFocus')
  outside = false
}
</script>

<template>
  <DefineContent><slot /></DefineContent>
  <div v-if="docked && open" class="studio-editor-docked" @keydown.esc="if (!$event.defaultPrevented) { open = false; emit('restoreFocus') }"><Content /></div>
  <UPopover v-else-if="!docked" v-model:open="open" :portal="false" :content="{ 'aria-label': 'Brand editor', side: 'top', align: 'center', sideOffset: 0, collisionPadding: 12, onInteractOutside: interactOutside, onCloseAutoFocus: closeAutoFocus }" :ui="{ content: 'studio-editor-overlay flex flex-col w-80 max-w-[calc(100vw-2rem)] max-h-[min(80dvh,var(--reka-popover-content-available-height))] overflow-hidden' }">
    <template #anchor><span class="studio-editor-anchor" aria-hidden="true" /></template>
    <template #content><Content /></template>
  </UPopover>
</template>

<style>
.studio-editor-anchor { position: absolute; bottom: 0; left: 50%; width: 0; height: 0; }
.studio-editor-docked { min-width: 0; min-height: 0; display: flex; }
.studio-editor-overlay .studio-inspector, .studio-editor-docked .studio-inspector { position: relative; inset: auto; transform: none; width: 100%; max-height: 100%; min-height: 0; box-shadow: none; border: 0; }
.studio-editor-docked .studio-inspector { border: 1px solid var(--ui-border); border-radius: calc(var(--ui-radius) * 2); }
</style>
