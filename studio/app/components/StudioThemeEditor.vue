<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { DeepReadonly } from 'vue'
import type { StudioDocument } from '../../../src/studio'
import { studioBuiltinPalettes, studioRoles } from '../../../src/studio'
import { createStudioPalette, studioFontPresets as fontPresets, studioRadiusPresets } from '../../editor'
import { paletteRamp } from '../../palette'
import { useStudioIcon } from '../../playground-icons'
import StudioPaletteSelect from './StudioPaletteSelect.vue'
import StudioIconPicker from './StudioIconPicker.vue'

const props = defineProps<{
  document: DeepReadonly<StudioDocument>
  baseline: DeepReadonly<StudioDocument>
  category: 'colors' | 'type' | 'icons' | 'styles'
  mode: 'light' | 'dark'
  errors: Readonly<Record<string, string>>
  bodyContrast?: number
  change: (document: StudioDocument, field?: string) => boolean
}>()
const emit = defineEmits<{
  invalid: [message: string, field?: string]
  notice: [message: string]
  busy: [value: boolean]
}>()
const draft = computed(() => props.document)
const baseline = computed(() => props.baseline)
const fieldErrors = computed(() => props.errors)
const mode = computed(() => props.mode)
const resolveIcon = useStudioIcon()
function edit(change: (document: StudioDocument) => void, field?: string) {
  try {
    const next: StudioDocument = JSON.parse(JSON.stringify(props.document))
    change(next)
    return props.change(next, field)
  }
  catch (cause) {
    emit('invalid', cause instanceof Error ? cause.message : 'This value could not be applied.', field)
    return false
  }
}
function value(event: Event) {
  return (event.target as HTMLInputElement).value
}
function title(value: string) {
  return value.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ').replace(/^./, letter => letter.toUpperCase())
}
function documentIcons(doc: DeepReadonly<StudioDocument>): Record<string, string> | undefined {
  const icons = doc.theme.ui?.icons
  return icons && typeof icons === 'object' ? icons as Record<string, string> : undefined
}
const newColor = ref('#2563eb')
const scale = computed(() => {
  try {
    return createStudioPalette(newColor.value)
  }
  catch {
    return {}
  }
})
function fontOptions(role: string) {
  const stacks = [...new Set([draft.value.theme.typography?.[role], draft.value.brand.typography?.[role], baseline.value.theme.typography?.[role], baseline.value.brand.typography?.[role]])]
  return [...stacks.filter((stack): stack is string => !!stack && !fontPresets.some(item => item.value === stack)).map(stack => ({ label: stack.split(',')[0]!.replace(/["']/g, ''), value: stack })), ...fontPresets]
}
const newColorName = ref('')
const paletteOpen = ref(false)
const paletteTarget = ref('')
const paletteAction = ref<'create' | 'rename' | 'delete'>('create')
const paletteExpanded = ref<string>()
const replacementPalette = ref('')
const paletteNameError = computed(() => {
  const name = newColorName.value.trim()
  if (!name) return 'Enter a palette name.'
  if (!/^[a-z][a-z0-9-]*$/.test(name)) return 'Use lowercase letters, numbers and hyphens.'
  if (Object.keys(draft.value.brand.colors).some(key => key !== paletteTarget.value && key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase() === name)) return 'This palette name is already in use.'
  return ''
})
function paletteUses(name: string) {
  const tokenName = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
  const cssUse = Object.values(draft.value.theme.cssVariables || {}).some(variables => Object.values(variables || {}).some(value => value.includes(`--color-${tokenName}-`)))
  return [...Object.entries(draft.value.theme.ui?.colors || {}).filter(([, palette]) => palette === name).map(([role]) => title(role)), ...Object.entries(draft.value.brand.roles || {}).filter(([, palette]) => palette === name).map(([role]) => title(role)), ...(cssUse ? ['CSS variables'] : [])]
}
function openPalette(action: 'create' | 'rename' | 'delete', name = '') {
  paletteAction.value = action
  paletteTarget.value = name
  newColorName.value = action === 'rename' ? name : ''
  newColor.value = '#2563eb'
  replacementPalette.value = ''
  emit('invalid', '', 'new-palette')
  paletteOpen.value = true
}
const replacementOptions = computed(() => paletteOptions.value.filter(name => name !== paletteTarget.value && (!Object.values(draft.value.brand.roles || {}).includes(paletteTarget.value) || typeof draft.value.brand.colors[name] === 'object')))

const colors = computed(() => Object.keys(draft.value.brand.colors))
const paletteOptions = computed(() => [...new Set([...colors.value.filter(name => typeof draft.value.brand.colors[name] === 'object'), ...studioBuiltinPalettes])])
const customComponents = computed(() => Object.keys(draft.value.theme.ui ?? {}).filter(key => !['colors', 'icons'].includes(key)))

function token(name: string, next: string) {
  const field = `token:${name}`
  if (next.trim() && !CSS.supports(name === '--ui-radius' ? 'border-radius' : 'color', next)) {
    emit('invalid', 'Enter a valid CSS ' + (name === '--ui-radius' ? 'radius.' : 'color.'), field)
    return
  }
  edit((doc) => {
    doc.theme.cssVariables ??= {}
    doc.theme.cssVariables[mode.value] ??= {}
    if (next.trim()) doc.theme.cssVariables[mode.value]![name] = next.trim()
    else Reflect.deleteProperty(doc.theme.cssVariables[mode.value]!, name)
  }, field)
}
function font(role: string, next: string) {
  edit((doc) => {
    doc.brand.typography ??= {}
    doc.theme.typography ??= {}
    doc.brand.typography[role] = next
    doc.theme.typography[role] = next
  }, `font:${role}`)
}
function defaultVariant(component: string, next: string) {
  edit((doc) => {
    doc.theme.ui ??= {}
    const ui = (doc.theme.ui[component] ?? {}) as Record<string, unknown>
    const defaults = (ui.defaultVariants ?? {}) as Record<string, unknown>
    if (next) defaults.variant = next
    else delete defaults.variant
    doc.theme.ui[component] = { ...ui, defaultVariants: defaults }
  })
}
function componentVariant(component: string) {
  return ((draft.value.theme.ui?.[component] as Record<string, unknown> | undefined)?.defaultVariants as Record<string, string> | undefined)?.variant || ''
}
function addPalette() {
  const name = newColorName.value.trim()
  if (paletteAction.value !== 'delete' && paletteNameError.value) return
  if (paletteAction.value === 'delete' && paletteUses(paletteTarget.value).length && !replacementPalette.value) return
  const accepted = edit((doc) => {
    if (paletteAction.value === 'create') doc.brand.colors[name] = createStudioPalette(newColor.value)
    else {
      const previous = paletteTarget.value
      const next = paletteAction.value === 'rename' ? name : replacementPalette.value
      if (paletteAction.value === 'rename') doc.brand.colors[next] = doc.brand.colors[previous]!
      for (const roles of [doc.theme.ui?.colors, doc.brand.roles]) {
        for (const [role, value] of Object.entries(roles || {})) if (value === previous) Object.assign(roles!, { [role]: next })
      }
      const tokenName = previous.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
      const tokenPattern = new RegExp(`--color-${tokenName}-(?:50|100|200|300|400|500|600|700|800|900|950)(?![\\w-])`, 'g')
      for (const variables of Object.values(doc.theme.cssVariables || {})) {
        for (const [key, value] of Object.entries(variables || {})) {
          if (value.match(tokenPattern)) {
            if (!next) throw new Error('This palette is referenced by CSS variables. Choose a replacement.')
            variables![key] = value.replace(tokenPattern, token => token.replace(`--color-${tokenName}-`, `--color-${next}-`))
          }
        }
      }
      if (previous !== next) Reflect.deleteProperty(doc.brand.colors, previous)
    }
  }, 'new-palette')
  if (!accepted) return
  paletteOpen.value = false
  paletteExpanded.value = paletteAction.value === 'delete' ? undefined : name
  emit('notice', paletteAction.value === 'create' ? 'Palette created. Select it under Primary or Neutral to use it.' : paletteAction.value === 'rename' ? 'Palette renamed.' : 'Palette deleted.')
}

function resetPalette(name: string) {
  edit((doc) => {
    // Brand aliases cannot refer to an upstream-only palette.
    if (Object.values(doc.brand.roles ?? {}).includes(name)) throw new Error('Remove brand role references before resetting this palette.')
    Reflect.deleteProperty(doc.brand.colors, name)
  }, 'new-palette')
}

function paletteColor(name: string, shade: string, color: string) {
  const field = `palette:${name}:${shade}`
  if (!CSS.supports('color', color)) {
    emit('invalid', 'Enter a valid CSS color.', field)
    return
  }
  edit((doc) => {
    if (typeof doc.brand.colors[name] === 'string') doc.brand.colors[name] = color
    else (doc.brand.colors[name] as Record<string, string>)[shade] = color
  }, field)
}

watch(paletteOpen, open => emit('busy', open), { flush: 'sync' })
onBeforeUnmount(() => emit('busy', false))
</script>

<template>
  <div class="studio-form-section">
    <template v-if="category === 'colors'">
      <UAccordion :items="[{ label: 'Surfaces and contrast', value: 'surfaces' }]">
        <template #body>
          <div class="studio-form-section">
            <p class="studio-help">
              Editing {{ mode }} mode. Empty fields use defaults.
            </p>
            <IdStudioColorField
              v-for="entry in [{ name: '--ui-bg', label: 'Page background' }, { name: '--ui-bg-elevated', label: 'Raised surface' }, { name: '--ui-text', label: 'Body text' }, { name: '--ui-border', label: 'Borders' }]"
              :key="entry.name"
              :label="entry.label"
              :model-value="draft.theme.cssVariables?.[mode]?.[entry.name] || ''"
              :error="fieldErrors[`token:${entry.name}`]"
              @change="token(entry.name, $event)"
            />
            <p
              v-if="bodyContrast !== undefined"
              :class="bodyContrast < 4.5 ? 'text-error' : 'text-muted'"
              class="text-xs"
              role="status"
            >
              Body text / page: {{ bodyContrast.toFixed(2) }}:1{{ bodyContrast < 4.5 ? ' — below 4.5:1 for normal text.' : '' }}
            </p>
            <p
              v-else
              class="text-xs text-muted"
            >
              Body contrast cannot be measured for these color values.
            </p>
          </div>
        </template>
      </UAccordion>
      <UFormField
        v-for="role in ['primary', 'neutral', ...studioRoles.filter(role => !['primary', 'neutral'].includes(role))]"
        :key="role"
        :label="title(role)"
      >
        <StudioPaletteSelect
          :model-value="draft.theme.ui?.colors?.[role] || '__default'"
          :label="title(role)"
          :role="role"
          :options="paletteOptions"
          :colors="draft.brand.colors"
          @update:model-value="edit(doc => { doc.theme.ui ??= {}; doc.theme.ui.colors ??= {}; if ($event !== '__default') doc.theme.ui.colors[role] = String($event); else delete doc.theme.ui.colors[role] })"
        />
      </UFormField>
      <div class="flex items-center justify-between gap-2">
        <h3 class="text-sm font-semibold">
          Brand palettes
        </h3><UButton
          color="neutral"
          variant="soft"
          size="xs"
          :icon="resolveIcon('i-lucide-plus')"
          @click="openPalette('create')"
        >
          New palette
        </UButton>
      </div>
      <UAccordion
        v-model="paletteExpanded"
        :items="Object.entries(draft.brand.colors).map(([name, palette]) => ({ label: name, value: name, palette }))"
      >
        <template #leading="{ item }">
          <span
            class="h-3 w-8 shrink-0 rounded ring ring-default"
            :style="{ background: paletteRamp(item.value, draft.brand.colors) }"
          />
        </template>
        <template #trailing="{ item, open }">
          <span
            v-if="paletteUses(item.value).length"
            class="ml-auto max-w-24 truncate text-xs text-muted"
            :title="[...new Set(paletteUses(item.value))].join(', ')"
          >{{ paletteUses(item.value)[0] }}<span v-if="paletteUses(item.value).length > 1"> +{{ paletteUses(item.value).length - 1 }}</span></span><UIcon
            :name="resolveIcon('i-lucide-chevron-down')"
            class="size-4 shrink-0"
            :class="{ 'rotate-180': open }"
          />
        </template>
        <template #body="{ item }">
          <div class="space-y-3">
            <p
              v-if="studioBuiltinPalettes.includes(item.value)"
              class="studio-help"
            >
              Overrides the standard palette. Unspecified shades keep their standard values.
            </p>
            <div class="flex justify-end">
              <UButton
                v-if="studioBuiltinPalettes.includes(item.value)"
                color="neutral"
                variant="ghost"
                :disabled="Object.values(draft.brand.roles || {}).includes(item.value)"
                :title="Object.values(draft.brand.roles || {}).includes(item.value) ? 'Remove brand role references before resetting.' : undefined"
                :aria-label="`Reset palette ${item.value}`"
                @click="resetPalette(item.value)"
              >
                Reset to standard
              </UButton>
              <UDropdownMenu :items="[{ label: 'Rename', icon: resolveIcon('i-lucide-pencil'), onSelect: () => openPalette('rename', item.value) }, { label: 'Delete palette', icon: resolveIcon('i-lucide-trash-2'), color: 'error', onSelect: () => openPalette('delete', item.value) }]">
                <UButton
                  color="neutral"
                  variant="ghost"
                  :icon="resolveIcon('i-lucide-ellipsis')"
                  :aria-label="`Actions for palette ${item.value}`"
                />
              </UDropdownMenu>
            </div>
            <IdStudioColorField
              v-for="(color, shade) in typeof item.palette === 'string' ? { base: item.palette } : item.palette"
              :key="shade"
              :label="`${item.label} ${shade}`"
              :model-value="color || ''"
              :error="fieldErrors[`palette:${item.label}:${shade}`]"
              @change="paletteColor(item.label, String(shade), $event)"
            />
          </div>
        </template>
      </UAccordion>
    </template>
    <template v-if="category === 'icons'">
      <StudioIconPicker
        :model-value="documentIcons(draft)"
        @update:model-value="edit(doc => { doc.theme.ui ??= {}; if ($event) doc.theme.ui.icons = $event; else delete doc.theme.ui.icons })"
      />
    </template>
    <template v-if="category === 'type'">
      <div
        v-for="role in ['sans', 'mono', 'display']"
        :key="role"
        class="space-y-2"
      >
        <UFormField
          :label="{ sans: 'Body', mono: 'Code', display: 'Headings' }[role]"
          :error="fieldErrors[`font:${role}`]"
        >
          <USelect
            :model-value="draft.theme.typography?.[role] || draft.brand.typography?.[role]"
            placeholder="Inherited"
            :items="fontOptions(role)"
            class="w-full"
            @update:model-value="font(role, String($event))"
          />
        </UFormField>
        <p
          class="rounded border border-default p-3 text-xl"
          :style="{ fontFamily: draft.theme.typography?.[role] || draft.brand.typography?.[role] || 'inherit' }"
        >
          The quick brown fox. 0123456789
        </p>
      </div>
      <UAccordion :items="[{ label: 'Advanced', value: 'fonts' }]">
        <template #body>
          <div class="studio-form-section">
            <p class="studio-help">
              Custom fonts must be installed in your project. These fields set CSS font stacks.
            </p>
            <UFormField
              v-for="role in ['sans', 'mono', 'display']"
              :key="role"
              :label="`${title(role)} font stack`"
              :error="fieldErrors[`font:${role}`]"
            >
              <UInput
                :model-value="draft.theme.typography?.[role] || draft.brand.typography?.[role] || ''"
                class="w-full"
                @change="font(role, value($event))"
              />
            </UFormField>
          </div>
        </template>
      </UAccordion>
    </template>
    <template v-if="category === 'styles'">
      <p class="studio-help">
        Editing {{ mode }} mode. Empty fields use defaults.
      </p>
      <UFormField
        label="Corner radius"
        :error="fieldErrors['token:--ui-radius']"
      >
        <UInputMenu
          :model-value="draft.theme.cssVariables?.[mode]?.['--ui-radius'] || ''"
          :items="studioRadiusPresets"
          create-item="always"
          open-on-click
          clear
          placeholder="0.25rem"
          class="w-full"
          @update:model-value="token('--ui-radius', String($event ?? ''))"
          @create="token('--ui-radius', $event)"
        >
          <template #create-item-label="{ item }">
            Use {{ item }}
          </template>
        </UInputMenu>
      </UFormField>
    </template>
    <template v-if="category === 'styles'">
      <p class="studio-help">
        Shared component defaults apply to the preview and Studio.
      </p>
      <p
        v-if="customComponents.length"
        class="text-xs text-muted"
      >
        Component overrides are present. Their classes can take precedence over palette and style controls.
      </p>
      <UFormField label="Button style">
        <USelect
          :model-value="componentVariant('button') || '__default'"
          :items="[{ label: 'Nuxt UI default', value: '__default' }, ...['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'].map(value => ({ label: value, value }))]"
          class="w-full"
          @update:model-value="defaultVariant('button', $event === '__default' ? '' : String($event))"
        />
      </UFormField>
      <UAccordion
        v-if="customComponents.length"
        :items="[{ label: 'Component overrides', value: 'overrides' }]"
      >
        <template #body>
          <p class="studio-help">
            Existing overrides can affect these settings.
          </p><pre class="studio-code studio-source-code leading-relaxed">{{ JSON.stringify(draft.theme.ui, null, 2) }}</pre>
        </template>
      </UAccordion>
    </template>
  </div>
  <UModal
    v-model:open="paletteOpen"
    :title="paletteAction === 'create' ? 'New palette' : paletteAction === 'rename' ? 'Rename palette' : 'Delete palette'"
  >
    <template #body>
      <form
        id="studio-palette-form"
        class="space-y-4"
        @submit.prevent="addPalette"
      >
        <UFormField
          v-if="paletteAction !== 'delete'"
          label="Palette name"
          required
          :error="newColorName ? paletteNameError || fieldErrors['new-palette'] : fieldErrors['new-palette']"
        >
          <UInput
            v-model="newColorName"
            placeholder="e.g. accent"
            autofocus
            class="w-full"
          />
        </UFormField>
        <template v-if="paletteAction === 'create'">
          <IdStudioColorField
            label="Base color"
            :model-value="newColor"
            @change="newColor = $event"
          />
          <UFormField label="Generated shades">
            <div class="flex overflow-hidden rounded">
              <span
                v-for="(color, shade) in scale"
                :key="shade"
                class="h-8 flex-1"
                :style="{ background: color }"
                :title="`${shade}: ${color}`"
              />
            </div>
          </UFormField>
        </template>
        <template v-if="paletteAction === 'delete'">
          <p class="text-sm">
            Delete <strong>{{ paletteTarget }}</strong>?
          </p>
          <p
            v-if="paletteUses(paletteTarget).length"
            class="text-sm text-muted"
          >
            Used by {{ [...new Set(paletteUses(paletteTarget))].join(', ') }}. Choose a replacement.
          </p>
          <UFormField
            v-if="paletteUses(paletteTarget).length"
            label="Replacement palette"
            :required="!!paletteUses(paletteTarget).length"
            :error="fieldErrors['new-palette']"
          >
            <USelect
              v-model="replacementPalette"
              placeholder="Select a replacement"
              :items="replacementOptions"
              class="w-full"
            />
          </UFormField>
        </template>
      </form>
    </template>
    <template #footer>
      <UButton
        color="neutral"
        variant="ghost"
        @click="paletteOpen = false"
      >
        Cancel
      </UButton><UButton
        type="submit"
        form="studio-palette-form"
        :color="paletteAction === 'delete' ? 'error' : 'primary'"
        :disabled="paletteAction === 'delete' ? !!paletteUses(paletteTarget).length && !replacementPalette : !!paletteNameError || (paletteAction === 'create' && !Object.keys(scale).length)"
      >
        {{ paletteAction === 'create' ? 'Create palette' : paletteAction === 'rename' ? 'Save name' : 'Delete palette' }}
      </UButton>
    </template>
  </UModal>
</template>

<style scoped>
.studio-form-section { display: flex; flex-direction: column; gap: 12px; }
.studio-help { font-size: 12px; line-height: 1.6; color: var(--ui-text-muted); }
.studio-code { font-size: 11px; overflow: auto; max-height: 280px; margin-top: 12px; }
</style>
