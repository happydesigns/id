<script setup lang="ts">
import { docsPresetDocuments, docsPresetAvatar } from '../../../presets'
import type { DropdownMenuItem } from '@nuxt/ui'
import { builtinPaletteNames, neutralPalettes, resolvePalette } from '../../../../src/palettes'
import { studioFontPresets, studioRadiusPresets } from '../../../../studio/editor'
import { ICON_PACKS, themeIcons, type ThemeIcons } from '../../../../studio/icon-sets'
import type { StudioDocument } from '../../../../src/studio'
import { useBrandTheme } from '../../../../app/composables/useBrandTheme'

const brand = useBrandTheme()
const editor = useNuxtApp().$docsBrandEditor
const toast = useToast()
function edit(change: (document: StudioDocument) => void) {
  try {
    if (!editor) throw new Error('The theme editor is not ready.')
    editor.edit(change)
  }
  catch (error) { toast.add({ title: 'Could not save theme', description: error instanceof Error ? error.message : 'Browser storage is unavailable.', color: 'error' }) }
}
const keep = (action: () => void) => (event: Event) => {
  event.preventDefault()
  action()
}
function option(label: string, checked: boolean, action: () => void): DropdownMenuItem {
  return { label, type: 'checkbox', checked, onSelect: keep(action) }
}
const customPalettes = computed(() => editor?.document.value.brand.colors || {})
function paletteItems(role: 'primary' | 'neutral') {
  const names = [...new Set([...(role === 'primary' ? builtinPaletteNames : neutralPalettes.filter(name => builtinPaletteNames.includes(name))), ...Object.keys(customPalettes.value)])]
  const choices = names.map((value) => {
    const palette = resolvePalette(value, customPalettes.value)
    return { ...option(value, current.value?.ui?.colors?.[role] === value && (role !== 'primary' || !blackPrimary.value), () => edit((doc) => {
      doc.theme.ui ||= {}
      doc.theme.ui.colors ||= {}
      doc.theme.ui.colors[role] = value
      if (role === 'primary') for (const mode of ['light', 'dark'] as const) {
        const variables = doc.theme.cssVariables?.[mode]
        if (variables && ['black', 'white'].includes(variables['--ui-primary'] || '')) delete variables['--ui-primary']
      }
    })), slot: 'color', dot: typeof palette === 'object' ? palette[500] : palette }
  })
  if (role === 'primary') choices.unshift({ ...option('Black', blackPrimary.value, () => edit((doc) => {
    doc.theme.cssVariables ||= {}
    for (const mode of ['light', 'dark'] as const) {
      doc.theme.cssVariables[mode] ||= {}
      doc.theme.cssVariables[mode]!['--ui-primary'] = mode === 'dark' ? 'white' : 'black'
    }
  })), slot: 'color', dot: 'var(--ui-text-highlighted)' })
  return choices
}
const fonts = computed(() => [...new Set([
  ...Object.values(docsPresetDocuments).map(document => document.theme.typography?.sans),
  ...studioFontPresets.map(item => item.value),
  editor?.baseline.value.theme.typography?.sans,
  current.value?.typography?.sans,
].filter((value): value is string => !!value))])
const iconPack = computed(() => ICON_PACKS.find(pack => !current.value?.ui?.icons ? pack.value === 'lucide' : Object.entries(themeIcons[pack.value as ThemeIcons]).every(([key, value]) => (current.value?.ui?.icons as Record<string, string>)[key] === value)))
const colorMode = useColorMode()
const appConfig = useAppConfig()
const current = brand.currentTheme
const blackPrimary = computed(() => ['black', 'white'].includes(current.value?.cssVariables?.[colorMode.value === 'dark' ? 'dark' : 'light']?.['--ui-primary'] || ''))
const name = computed(() => current.value?.label || 'Theme')
const modes = computed(() => [
  { value: 'light', label: 'Light', icon: appConfig.ui.icons.light },
  { value: 'dark', label: 'Dark', icon: appConfig.ui.icons.dark },
  { value: 'system', label: 'System', icon: appConfig.ui.icons.system },
])
const mode = computed(() => modes.value.find(item => item.value === colorMode.preference) || modes.value[2]!)
const studioLink = (editor?: string) => ({ path: '/studio', query: { mode: colorMode.preference, ...(editor ? { editor } : {}) } })
const font = computed(() => current.value?.typography?.sans?.split(',')[0]?.replace(/["']/g, '') || 'Default')
const radius = computed(() => current.value?.cssVariables?.[colorMode.value === 'dark' ? 'dark' : 'light']?.['--ui-radius'] || 'Default')
const createOpen = ref(false)
const newName = ref('')
const createError = ref('')
function createTheme() {
  try {
    if (!editor) throw new Error('The theme editor is not ready.')
    editor.create(newName.value)
    createOpen.value = false
    newName.value = ''
    createError.value = ''
  }
  catch (error) { createError.value = error instanceof Error ? error.message : 'Could not save theme.' }
}
const items = computed<DropdownMenuItem[][]>(() => [[{
  label: name.value,
  avatar: docsPresetAvatar(current.value),
  children: [...brand.themes.value.map(theme => ({
    label: theme.label,
    avatar: docsPresetAvatar(theme),
    type: 'checkbox',
    checked: theme.name === brand.selectedName.value,
    onSelect(event: Event) {
      event.preventDefault()
      brand.setTheme(theme.name)
    },
  })), { type: 'separator' }, { label: 'Create theme…', icon: 'i-lucide-plus', onSelect: () => { createOpen.value = true } }],
}], [
  { label: 'Primary', icon: 'i-lucide-paintbrush', value: blackPrimary.value ? 'Black' : current.value?.ui?.colors?.primary || 'Default', dot: 'var(--ui-primary)', children: paletteItems('primary'), slot: 'setting' },
  { label: 'Neutral', icon: 'i-lucide-contrast', value: current.value?.ui?.colors?.neutral || 'Default', dot: 'var(--ui-text-muted)', children: paletteItems('neutral'), slot: 'setting' },
  { label: 'Font', icon: 'i-lucide-type', value: font.value, children: fonts.value.map(value => option(value.split(',')[0]!.replace(/["']/g, ''), value === current.value?.typography?.sans, () => edit((doc) => {
    doc.theme.typography ||= {}
    doc.theme.typography.sans = value
  }))), slot: 'setting' },
  { label: 'Icons', icon: 'i-lucide-shapes', value: iconPack.value?.label || 'Custom', children: ICON_PACKS.map(pack => option(pack.label, pack.value === iconPack.value?.value, () => edit((doc) => {
    doc.theme.ui ||= {}
    doc.theme.ui.icons = { ...themeIcons[pack.value as ThemeIcons] }
  }))), slot: 'setting' },
  { label: 'Radius', icon: 'i-lucide-radius', value: radius.value, children: [...new Set([...studioRadiusPresets, radius.value])].filter(value => value !== 'Default').map(value => option(value, value === radius.value, () => edit((doc) => {
    doc.theme.cssVariables ||= {}
    for (const mode of ['light', 'dark'] as const) {
      doc.theme.cssVariables[mode] ||= {}
      doc.theme.cssVariables[mode]!['--ui-radius'] = value
    }
  }))), slot: 'setting' },
], [{ type: 'label', label: mode.value.label, slot: 'color-mode' }], [{
  label: 'Edit theme', icon: 'i-lucide-sliders-horizontal', to: studioLink(), slot: 'setting',
}]])
function setMode(value: string | number) {
  if (value === 'light' || value === 'dark' || value === 'system') colorMode.preference = value
}
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'end' }"
    :ui="{ content: 'w-64' }"
  >
    <UTooltip :text="name + ' appearance'">
      <UButton
        :icon="docsPresetAvatar(current).icon"
        color="neutral"
        variant="ghost"
        :aria-label="'Appearance: ' + name"
        :ui="{ leadingIcon: 'text-primary' }"
      />
    </UTooltip>
    <template #setting-trailing="{ item }">
      <span
        v-if="item.value"
        class="flex min-w-0 items-center gap-2 text-muted"
      >
        <span
          v-if="item.dot"
          class="size-2 shrink-0 rounded-full"
          :style="{ backgroundColor: String(item.dot) }"
        />
        <span class="truncate">{{ item.value }}</span>
      </span>
      <UIcon
        :name="item.children ? 'i-lucide-chevron-right' : 'i-lucide-arrow-right'"
        class="size-4 shrink-0 text-dimmed"
      />
    </template>
    <template #color-leading="{ item }">
      <span class="flex size-5 items-center justify-center"><span
        class="size-2 rounded-full"
        :style="{ backgroundColor: String(item.dot) }"
      /></span>
    </template>
    <template #color-mode>
      <UIcon
        :name="mode.icon"
        class="size-5 shrink-0 text-dimmed"
      />
      <span class="text-sm font-normal">{{ mode.label }}</span>
      <UTabs
        :model-value="colorMode.preference"
        :items="modes"
        :content="false"
        color="neutral"
        size="xs"
        aria-label="Color mode"
        class="ms-auto"
        :ui="{ label: 'sr-only', trigger: 'p-1.5' }"
        @update:model-value="setMode"
      />
    </template>
  </UDropdownMenu>
  <UModal
    v-model:open="createOpen"
    title="Create theme"
    description="Save a named copy of the current appearance in this browser. Continue editing it here or in Studio."
  >
    <template #body>
      <form
        class="space-y-4"
        @submit.prevent="createTheme"
      >
        <UFormField
          label="Theme name"
          :error="createError || undefined"
        >
          <UInput
            v-model="newName"
            autofocus
            required
            :maxlength="80"
            class="w-full"
          />
        </UFormField>
        <UButton type="submit">
          Create theme
        </UButton>
      </form>
    </template>
  </UModal>
</template>
