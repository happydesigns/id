<script setup lang="ts">
import { usePlaygroundToast } from "../../playground-toast"
import { useStudioIcons } from "../../playground-icons"
import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'
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
        avatar: { src: 'https://github.com/benjamincanac.png', alt: '', loading: 'lazy' }
      },
      {
        label: 'Romain Hamel',
        suffix: 'romhml',
        avatar: { src: 'https://github.com/romhml.png', alt: '', loading: 'lazy' }
      },
      {
        label: 'Neil Richter',
        suffix: 'noook',
        avatar: { src: 'https://github.com/noook.png', alt: '', loading: 'lazy' }
      }
    ]
  },
  {
    id: 'actions',
    items: [
      {
        label: 'Add new file',
        suffix: 'Create a new file in the current workspace.',
        get icon() { return studioIcons.filePlus },
        kbds: ['meta', 'N'],
        onSelect() {
          toast.add({ title: 'Add new file' })
        }
      },
      {
        label: 'Add new folder',
        suffix: 'Create a new folder in the current workspace.',
        get icon() { return studioIcons.folderPlus },
        kbds: ['meta', 'F'],
        onSelect() {
          toast.add({ title: 'Add new folder' })
        }
      },
      {
        label: 'Add label',
        suffix: 'Add a label to the current item.',
        get icon() { return studioIcons.tag },
        kbds: ['meta', 'L'],
        onSelect() {
          toast.add({ title: 'Add label' })
        }
      }
    ]
  }
])
</script>

<template>
  <div ref="palette" class="contents">
    <UCommandPalette :groups="groups" placeholder="Search users and actions..." :autofocus="false" :ui="{ itemLabelSuffix: 'text-muted' }" class="h-80" />
  </div>
</template>
