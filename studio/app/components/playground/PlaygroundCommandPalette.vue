<script setup lang="ts">
import { usePlaygroundKbd } from '../../../playground-kbd'
import { usePlaygroundToast } from '../../../playground-toast'
import { useStudioIcons } from '../../../playground-icons'
import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'

const kbd = usePlaygroundKbd()

const studioIcons = useStudioIcons()

const toast = usePlaygroundToast()
const palette = ref<HTMLElement>()

onMounted(() => {
  // Nuxt UI forwards attributes to the root, but exposes no content props for
  // the inner listbox. Name that persistent element without replacing its UI.
  palette.value?.querySelector('[role="listbox"]')?.setAttribute('aria-label', 'Users and actions')
})

const groups = ref<CommandPaletteGroup<CommandPaletteItem>[]>([
  {
    id: 'users',
    label: 'Users',
    items: [
      {
        label: 'Benjamin Canac',
        suffix: 'benjamincanac',
        avatar: { alt: 'Benjamin Canac' },
      },
      {
        label: 'Romain Hamel',
        suffix: 'romhml',
        avatar: { alt: 'Romain Hamel' },
      },
      {
        label: 'Neil Richter',
        suffix: 'noook',
        avatar: { alt: 'Neil Richter' },
      },
    ],
  },
  {
    id: 'actions',
    items: [
      {
        label: 'Add new file',
        suffix: 'Create a new file in the current workspace.',
        get icon() {
          return studioIcons.filePlus
        },
        get kbds() { return [kbd('meta'), 'N'] },
        onSelect() {
          toast.add({ title: 'Add new file' })
        },
      },
      {
        label: 'Add new folder',
        suffix: 'Create a new folder in the current workspace.',
        get icon() {
          return studioIcons.folderPlus
        },
        get kbds() { return [kbd('meta'), 'F'] },
        onSelect() {
          toast.add({ title: 'Add new folder' })
        },
      },
      {
        label: 'Add label',
        suffix: 'Add a label to the current item.',
        get icon() {
          return studioIcons.tag
        },
        get kbds() { return [kbd('meta'), 'L'] },
        onSelect() {
          toast.add({ title: 'Add label' })
        },
      },
    ],
  },
])
</script>

<template>
  <div
    ref="palette"
    class="contents"
  >
    <UCommandPalette
      :groups="groups"
      placeholder="Search users and actions..."
      :autofocus="false"
      :ui="{ itemLabelSuffix: 'text-muted' }"
      class="h-80"
    />
  </div>
</template>
