<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createBlankStudioDocument, createStudioArchive, createStudioProject, diffStudioDocuments, parseStudioDocument, studioRoles, studioBuiltinPalettes } from '../../src/studio'
import { studioTemplates } from '../templates'
import type { StudioDocument } from '../../src/studio'

useHead({ bodyAttrs: { class: 'id-studio-page' } })
const route = useRoute()
const config = useAppConfig() as unknown as { idStudio?: { document?: StudioDocument, sourcePath?: string, home?: string, templates?: unknown } }
const seed = config.idStudio?.document ? parseStudioDocument(config.idStudio.document) : createBlankStudioDocument()
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value))
const baseline = ref(clone(seed))
const draft = ref(clone(seed))
const templates = studioTemplates(config.idStudio?.templates)
const scene = ref(typeof route.query.view === 'string' && templates.some(item => item.id === route.query.view) ? route.query.view : 'components')
const selectedTemplate = computed(() => templates.find(item => item.id === scene.value))
const templatePage = ref(selectedTemplate.value?.pages[0]?.id || 'home')
watch(scene, () => { templatePage.value = selectedTemplate.value?.pages[0]?.id || 'home' }, { flush: 'sync' })
const mode = ref<'light' | 'dark'>('light')
const state = ref('default')
const compare = ref(false)
const mobile = ref(false)
const editing = ref(route.query.browse !== 'true')
const panel = ref('identity')
const error = ref('')
const notice = ref('')
const exportOpen = ref(false)
const exportTab = ref('source')
const busy = ref(false)
const pending = ref<(() => void) | null>(null)
const input = ref<HTMLInputElement>()
const originalFrame = ref<HTMLIFrameElement>()
const draftFrame = ref<HTMLIFrameElement>()
const history = ref<StudioDocument[]>([])
const future = ref<StudioDocument[]>([])
const recovery = ref<{ baseline: StudioDocument, draft: StudioDocument }>()
const newColorName = ref('accent')
const changes = computed(() => diffStudioDocuments(baseline.value, draft.value))
const dirty = computed(() => changes.value.length > 0)
const colors = computed(() => Object.keys(draft.value.brand.colors))
const paletteOptions = computed(() => [...new Set([...colors.value.filter(name => typeof draft.value.brand.colors[name] === 'object'), ...studioBuiltinPalettes])])
const storageKey = `id-studio:1:${seed.brand.packageName || seed.brand.name}`
const sourcePath = computed(() => draft.value.brand.name === seed.brand.name ? config.idStudio?.sourcePath || 'brand.studio.json' : 'brand.studio.json')
const output = computed(() => exportTab.value === 'changes' ? JSON.stringify(changes.value, null, 2) : exportTab.value === 'css' ? createStudioProject(draft.value)['app/assets/css/brand.css'] : JSON.stringify(draft.value, null, 2))
const customComponents = computed(() => Object.keys(draft.value.theme.ui ?? {}).filter(key => !['colors', 'icons'].includes(key)))

function edit(change: (doc: StudioDocument) => void) {
  try {
    const next = clone(draft.value)
    change(next)
    const valid = parseStudioDocument(next)
    if (!diffStudioDocuments(draft.value, valid).length) return
    history.value.push(clone(draft.value))
    if (history.value.length > 50) history.value.shift()
    future.value = []
    draft.value = valid
    error.value = ''
  } catch (cause) { error.value = cause instanceof Error ? cause.message : 'This value could not be applied.' }
}
function undo() {
  const previous = history.value.pop()
  if (previous) { future.value.push(clone(draft.value)); draft.value = previous }
}
function redo() {
  const next = future.value.pop()
  if (next) { history.value.push(clone(draft.value)); draft.value = next }
}
function reset() {
  history.value.push(clone(draft.value))
  future.value = []
  draft.value = clone(baseline.value)
  error.value = ''
}
function replace(doc: StudioDocument) {
  baseline.value = clone(doc)
  draft.value = clone(doc)
  history.value = []
  future.value = []
  error.value = ''
  editing.value = true
}
function guard(action: () => void) { if (dirty.value) pending.value = action; else action() }
function acceptReplacement() { const action = pending.value; pending.value = null; action?.() }
function value(event: Event) { return (event.target as HTMLInputElement).value }
function token(name: string, next: string) {
  edit((doc) => {
    doc.theme.cssVariables ??= {}
    doc.theme.cssVariables[mode.value] ??= {}
    if (next.trim()) doc.theme.cssVariables[mode.value]![name] = next.trim()
    else Reflect.deleteProperty(doc.theme.cssVariables[mode.value]!, name)
  })
}
function font(role: string, next: string) {
  edit((doc) => { doc.brand.typography ??= {}; doc.theme.typography ??= {}; doc.brand.typography[role] = next; doc.theme.typography[role] = next })
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
function origin(path: string) {
  if (changes.value.some(change => change.path === path || change.path.startsWith(`${path}.`))) return 'Changed in draft'
  return path.split('.').reduce<unknown>((item, key) => item && typeof item === 'object' ? (item as Record<string, unknown>)[key] : undefined, baseline.value) === undefined ? 'Nuxt UI default' : 'Brand value'
}
async function openDocument(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    if (file.size > 8_000_000) throw new Error('Choose a brand document smaller than 8 MB.')
    const doc = parseStudioDocument(await file.text())
    guard(() => replace(doc))
  } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Could not open this document.' }
  finally { if (input.value) input.value.value = '' }
}
async function addLogo(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 2_000_000) { error.value = 'Choose a PNG, JPEG or WebP smaller than 2 MB.'; return }
  const reader = new FileReader()
  reader.onerror = () => { error.value = 'The image could not be read.' }
  reader.onload = () => edit((doc) => {
    doc.brand.assets ??= {}; doc.brand.assets.logos ??= {}
    doc.brand.assets.logos.wordmark = { name: file.name, role: 'wordmark', media: 'any', alt: doc.theme.label, src: String(reader.result) }
  })
  reader.readAsDataURL(file)
}
function send(frame: HTMLIFrameElement | undefined, doc: StudioDocument) {
  frame?.contentWindow?.postMessage({ type: 'id-studio-preview', document: clone(doc), scene: scene.value, page: templatePage.value, mode: mode.value, state: state.value }, window.location.origin)
}
function refresh() { send(originalFrame.value, baseline.value); send(draftFrame.value, draft.value) }
function ready(event: MessageEvent) {
  if (event.origin !== window.location.origin) return
  if (event.source !== originalFrame.value?.contentWindow && event.source !== draftFrame.value?.contentWindow) return
  if (event.data?.type === 'id-studio-navigate') {
    if (event.data.scene === scene.value && selectedTemplate.value?.pages.some(page => page.id === event.data.page)) templatePage.value = event.data.page
    return
  }
  if (event.data?.type !== 'id-studio-ready') return
  if (event.source === originalFrame.value?.contentWindow) send(originalFrame.value, baseline.value)
  if (event.source === draftFrame.value?.contentWindow) send(draftFrame.value, draft.value)
}
function beforeUnload(event: BeforeUnloadEvent) { if (dirty.value) { event.preventDefault(); event.returnValue = '' } }
function download(name: string, data: string | Uint8Array, mime = 'application/json') {
  const payload = typeof data === 'string' ? data : new Uint8Array(data).buffer
  const url = URL.createObjectURL(new Blob([payload], { type: mime }))
  const link = Object.assign(window.document.createElement('a'), { href: url, download: name })
  window.document.body.appendChild(link); link.click(); link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
async function exportProject() {
  busy.value = true; error.value = ''
  try {
    const files: Record<string, string | Uint8Array> = createStudioProject(draft.value)
    const assets = [...Object.values(draft.value.brand.assets?.logos ?? {}), ...(draft.value.brand.assets?.files ?? [])]
    for (const asset of assets) {
      if (!asset || !asset.src.startsWith('/') || files[`public${asset.src}`]) continue
      const response = await fetch(asset.src, { credentials: 'omit', redirect: 'error' })
      if (!response.ok || response.headers.get('content-type')?.includes('text/html')) throw new Error(`Asset unavailable: ${asset.src}. Restore this file before exporting a complete project.`)
      const bytes = new Uint8Array(await response.arrayBuffer())
      if (bytes.length > 5_000_000) throw new Error(`Asset too large: ${asset.src}`)
      files[`public${asset.src}`] = bytes
    }
    download(`${draft.value.brand.name}.zip`, createStudioArchive(files), 'application/zip')
    notice.value = 'Project downloaded.'
  } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Export failed.' }
  finally { busy.value = false }
}
onMounted(() => {
  window.addEventListener('message', ready)
  window.addEventListener('beforeunload', beforeUnload)
  nextTick(refresh)
  try {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      const session = JSON.parse(stored)
      const base = parseStudioDocument(session.baseline)
      const saved = parseStudioDocument(session.draft)
      if (diffStudioDocuments(base, saved).length) recovery.value = { baseline: base, draft: saved }
    }
  } catch { notice.value = 'The previous local draft could not be restored. Your source has not changed.' }
})
watch([draft, baseline], () => {
  if (import.meta.client) {
    try { localStorage.setItem(storageKey, JSON.stringify({ baseline: baseline.value, draft: draft.value })) }
    catch { notice.value = 'Local draft storage is unavailable. Export your source before leaving.' }
  }
}, { deep: true })
watch([draft, baseline, scene, templatePage, mode, state, compare], () => nextTick(refresh), { deep: true })
onBeforeUnmount(() => { window.removeEventListener('message', ready); window.removeEventListener('beforeunload', beforeUnload) })
</script>

<template>
  <main class="studio-shell" :data-mode="mode" aria-label="Brand Studio">
    <header class="studio-header">
      <a :href="config.idStudio?.home || '/'" class="studio-wordmark">id<span class="studio-dot">.</span><span class="studio-product">Brand Studio</span></a>
      <h1 class="studio-brand-name">{{ draft.theme.label }}</h1>
      <div class="studio-scenes" aria-label="Preview scene">
        <UButton color="neutral" :variant="scene === 'components' ? 'soft' : 'ghost'" :aria-pressed="scene === 'components'" @click="scene = 'components'">Components</UButton>
        <USelect aria-label="Template" placeholder="Templates" :ui="{ placeholder: 'text-muted' }" :model-value="scene === 'components' ? undefined : scene" :items="templates.map(item => ({ label: item.label, value: item.id }))" @update:model-value="scene = String($event)" />
        <USelect v-if="selectedTemplate && selectedTemplate.pages.length > 1" v-model="templatePage" aria-label="Template page" :items="selectedTemplate.pages.map(item => ({ label: item.label, value: item.id }))" />
      </div>
      <div class="studio-actions">
        <UButton color="neutral" variant="outline" @click="guard(() => replace(createBlankStudioDocument()))">New brand</UButton>
        <UButton color="neutral" variant="outline" @click="input?.click()">Open brand</UButton>
        <UButton color="neutral" @click="exportOpen = true">Export</UButton>
      </div>
      <input ref="input" type="file" accept=".json,application/json" class="sr-only" aria-label="Open brand document" @change="openDocument">
    </header>
    <div v-if="recovery" class="studio-notice" role="status">
      <span>A saved draft is available.</span><UButton @click="baseline = recovery.baseline; draft = recovery.draft; recovery = undefined; editing = true">Restore draft</UButton><UButton variant="ghost" color="neutral" @click="recovery = undefined">Dismiss</UButton>
    </div>
    <UAlert v-if="error" role="alert" color="error" :description="error" :close="{ onClick: () => error = '' }" />
    <div v-if="notice" class="studio-notice" role="status">{{ notice }}<UButton variant="ghost" color="neutral" @click="notice = ''">Dismiss</UButton></div>
    <div class="studio-workspace" :class="{ 'studio-browsing': !editing }">
      <div class="studio-canvas" :class="{ 'studio-comparing': compare }">
        <section v-if="compare" class="studio-frame-wrap">
          <div class="studio-frame-label">Original <span>{{ baseline.theme.label }}</span></div>
          <iframe ref="originalFrame" src="/studio/preview?frame=original" title="Original brand preview" :class="{ 'studio-mobile': mobile }" @load="send(originalFrame, baseline)" />
        </section>
        <section class="studio-frame-wrap">
          <div class="studio-frame-label">Draft <span>{{ draft.theme.label }}</span></div>
          <iframe ref="draftFrame" src="/studio/preview?frame=draft" title="Draft brand preview" :class="{ 'studio-mobile': mobile }" @load="send(draftFrame, draft)" />
        </section>
      </div>
      <aside v-if="editing" class="studio-inspector" aria-label="Brand settings">
        <div class="studio-inspector-header">
          <h2>{{ panel === 'identity' ? 'Brand' : panel === 'colors' ? 'Palette' : panel === 'type' ? 'Typography' : 'Appearance' }}</h2>
          <div class="studio-actions">
            <UButton icon="i-lucide-undo-2" aria-label="Undo change" color="neutral" variant="ghost" size="xs" :disabled="!history.length" @click="undo" />
            <UButton icon="i-lucide-redo-2" aria-label="Redo change" color="neutral" variant="ghost" size="xs" :disabled="!future.length" @click="redo" />
            <UButton color="neutral" variant="ghost" size="xs" :disabled="!dirty" @click="reset">Reset</UButton>
            <UButton icon="i-lucide-x" aria-label="Close settings" color="neutral" variant="ghost" size="xs" @click="editing = false" />
          </div>
        </div>
        <div class="studio-fields">
          <template v-if="panel === 'identity'">
            <UFormField label="Brand name" :hint="dirty ? undefined : origin('theme.label')"><UInput :model-value="draft.theme.label" class="w-full" @change="edit(doc => { doc.theme.label = value($event) })" /></UFormField>
            <UFormField label="Identifier" help="Lowercase letters, numbers and hyphens"><UInput :model-value="draft.brand.name" class="w-full" @change="edit(doc => { doc.brand.name = value($event); doc.theme.name = value($event) })" /></UFormField>
            <UFormField label="Package name"><UInput :model-value="draft.brand.packageName" placeholder="@example/brand" class="w-full" @change="edit(doc => { doc.brand.packageName = value($event) })" /></UFormField>
            <UFormField label="Brand statement"><UTextarea :model-value="draft.brand.claim" :rows="3" class="w-full" @change="edit(doc => { doc.brand.claim = value($event) })" /></UFormField>
            <UFormField label="Wordmark or logo" help="PNG, JPEG or WebP · up to 2 MB"><UInput type="file" accept="image/png,image/jpeg,image/webp" class="w-full" @change="addLogo" /></UFormField>
          </template>
          <template v-if="panel === 'colors'">
            <p class="studio-help">Map your palettes to Nuxt UI roles.</p>
            <UFormField v-for="role in studioRoles" :key="role" :label="role">
              <USelect :model-value="draft.theme.ui?.colors?.[role] || '__default'" :items="[{ label: 'Nuxt UI default', value: '__default' }, ...paletteOptions.map(value => ({ label: value, value }))]" class="w-full" @update:model-value="edit(doc => { doc.theme.ui ??= {}; doc.theme.ui.colors ??= {}; if ($event !== '__default') doc.theme.ui.colors[role] = String($event); else delete doc.theme.ui.colors[role] })" />
            </UFormField>
            <h3 class="text-sm font-semibold">Brand palettes</h3>
            <UAccordion :items="Object.entries(draft.brand.colors).map(([name, palette]) => ({ label: name, value: name, palette }))">
              <template #body="{ item }">
                <div class="space-y-3">
                  <UFormField v-for="(color, shade) in typeof item.palette === 'string' ? { base: item.palette } : item.palette" :key="shade" :label="String(shade)">
                    <UInput :model-value="color" :aria-label="`${item.label} ${shade}`" class="w-full" @change="edit(doc => { if (typeof doc.brand.colors[item.label] === 'string') doc.brand.colors[item.label] = value($event); else (doc.brand.colors[item.label] as Record<string, string>)[shade] = value($event) })"><template #leading><span class="size-3 rounded-full border border-default" :style="{ backgroundColor: color }" /></template></UInput>
                  </UFormField>
                </div>
              </template>
            </UAccordion>
            <UFormField label="New palette name"><UInput v-model="newColorName" class="w-full" /></UFormField>
            <UButton color="neutral" variant="outline" @click="edit(doc => { if (!/^[a-z][a-z0-9-]*$/.test(newColorName) || doc.brand.colors[newColorName]) throw new Error('Choose a new lowercase palette name.'); doc.brand.colors[newColorName] = { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554' } })">Add palette</UButton>
          </template>
          <template v-if="panel === 'type'">
            <p class="studio-help">Use installed fonts or a system stack. Entering a name does not download a font.</p>
            <UFormField v-for="role in ['sans', 'mono', 'display']" :key="role" :label="role"><UInput :model-value="draft.theme.typography?.[role] || draft.brand.typography?.[role] || ''" placeholder="system-ui, sans-serif" class="w-full" @change="font(role, value($event))" /></UFormField>
            <div class="flex flex-wrap gap-2"><UButton color="neutral" variant="outline" @click="font('sans', 'system-ui, sans-serif')">System sans</UButton><UButton color="neutral" variant="outline" @click="font('sans', 'Georgia, serif')">Georgia</UButton></div>
          </template>
          <template v-if="panel === 'details'">
            <p class="studio-help">Editing {{ mode }} mode. Empty fields use defaults.</p>
            <UFormField v-for="entry in [{ name: '--ui-radius', label: 'Corner radius', placeholder: '0.25rem' }, { name: '--ui-bg', label: 'Page background', placeholder: 'Default' }, { name: '--ui-bg-elevated', label: 'Raised surface', placeholder: 'Default' }, { name: '--ui-text', label: 'Body text', placeholder: 'Default' }, { name: '--ui-border', label: 'Borders', placeholder: 'Default' }]" :key="entry.name" :label="entry.label">
              <UInput :model-value="draft.theme.cssVariables?.[mode]?.[entry.name] || ''" :placeholder="entry.placeholder" class="w-full" @change="token(entry.name, value($event))" />
            </UFormField>
            <UFormField label="Button style"><USelect :model-value="componentVariant('button') || '__default'" :items="[{ label: 'Nuxt UI default', value: '__default' }, ...['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'].map(value => ({ label: value, value }))]" class="w-full" @update:model-value="defaultVariant('button', $event === '__default' ? '' : String($event))" /></UFormField>
            <UAccordion v-if="customComponents.length" :items="[{ label: 'Component overrides', value: 'overrides' }]"><template #body><p class="studio-help">Existing overrides can affect these settings.</p><pre class="studio-code">{{ JSON.stringify(draft.theme.ui, null, 2) }}</pre></template></UAccordion>
          </template>
        </div>
        <p class="studio-inspector-footer">Export to apply changes to your project.</p>
      </aside>
    </div>
    <div class="studio-toolbar">
      <div class="studio-dock-settings">
        <UButton v-for="item in ['identity', 'colors', 'type', 'details']" :key="item" color="neutral" :variant="editing && panel === item ? 'soft' : 'ghost'" :aria-pressed="editing && panel === item" @click="panel = item; editing = true">{{ item === 'identity' ? 'Brand' : item === 'type' ? 'Typography' : item === 'details' ? 'Appearance' : 'Palette' }}</UButton>
      </div>
      <div class="studio-toolbar-end">
        <UCheckbox v-model="compare" label="Compare original" size="sm" />
        <UCheckbox v-model="mobile" label="Mobile" size="sm" />
        <USelect v-if="scene === 'components'" v-model="state" aria-label="Preview state" :items="[{ label: 'Default', value: 'default' }, { label: 'Validation error', value: 'error' }]" size="sm" />
        <UFieldGroup><UButton color="neutral" :variant="mode === 'light' ? 'soft' : 'ghost'" :aria-pressed="mode === 'light'" size="sm" @click="mode = 'light'">Light</UButton><UButton color="neutral" :variant="mode === 'dark' ? 'soft' : 'ghost'" :aria-pressed="mode === 'dark'" size="sm" @click="mode = 'dark'">Dark</UButton></UFieldGroup>
      </div>
    </div>
    <UModal :open="!!pending" title="Replace this draft?" description="Export your changes first if you want to keep them." @update:open="pending = null"><template #footer><UButton color="neutral" variant="outline" @click="pending = null">Keep editing</UButton><UButton @click="acceptReplacement">Replace draft</UButton></template></UModal>
    <UModal v-model:open="exportOpen" title="Export brand" :ui="{ content: 'max-w-4xl' }">
      <template #body>
        <p class="mb-4 text-sm text-muted">{{ changes.length }} changes. To update your project, replace <code>{{ sourcePath }}</code> and run its generation checks.</p>
        <div class="mb-4 flex gap-2"><UButton v-for="item in ['source', 'changes', 'css']" :key="item" color="neutral" :variant="exportTab === item ? 'soft' : 'ghost'" :aria-pressed="exportTab === item" @click="exportTab = item">{{ item === 'css' ? 'CSS' : item === 'source' ? 'Source' : 'Changes' }}</UButton></div>
        <pre class="studio-export-code">{{ output }}</pre>
        <p class="mt-4 text-sm text-muted">A new project includes a Nuxt brand layer and Studio. Custom fonts, Vue components and capabilities must be added separately.</p>
        <p v-if="error" role="alert" class="mt-4 text-sm text-error">{{ error }}</p>
      </template>
      <template #footer><UButton @click="download('brand.studio.json', JSON.stringify(draft, null, 2) + '\n')">Download source</UButton><UButton color="neutral" variant="outline" :loading="busy" @click="exportProject">Download new project</UButton></template>
    </UModal>
  </main>
</template>

<style>
body.id-studio-page { margin: 0; overflow: hidden; }
</style>
<style scoped>
.studio-shell { box-sizing: border-box; height: 100dvh; max-width: 1680px; margin: auto; padding: 0 20px 12px; display: flex; flex-direction: column; gap: 10px; background: var(--ui-bg); color: var(--ui-text); }
.studio-header { flex: none; min-height: 62px; display: flex; align-items: center; gap: 16px; }
.studio-wordmark { display: flex; align-items: baseline; font-size: 30px; font-weight: 750; letter-spacing: -.06em; color: var(--ui-text-highlighted); }
.studio-dot { color: var(--ui-primary); }.studio-product { margin-left: 10px; font-size: 12px; font-weight: 500; letter-spacing: normal; }
.studio-brand-name { font-size: 12px; max-width: 160px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.studio-scenes { display: flex; align-items: center; gap: 4px; margin: auto; min-width: 0; }.studio-scenes > * { max-width: 155px; }
.studio-actions { display: flex; align-items: center; gap: 6px; }
.studio-toolbar { flex: none; display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 8px; border: 1px solid var(--ui-border); border-radius: 16px; }
.studio-toolbar-end, .studio-dock-settings { display: flex; gap: 8px; align-items: center; }
.studio-workspace { flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 12px; }.studio-browsing { grid-template-columns: minmax(0, 1fr); }
.studio-canvas { display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; min-width: 0; min-height: 0; }.studio-comparing { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.studio-frame-wrap { min-width: 0; min-height: 0; display: flex; flex-direction: column; align-items: center; }.studio-frame-label { display: none; }.studio-comparing .studio-frame-label { display: flex; justify-content: space-between; align-self: stretch; padding: 0 6px 6px; font-size: 11px; }.studio-frame-label span { color: var(--ui-text-muted); }
iframe { display: block; width: 100%; flex: 1; min-height: 0; border: 1px solid var(--ui-border); border-radius: 18px; background: var(--ui-bg); }iframe.studio-mobile { max-width: 390px; }
.studio-inspector { display: flex; flex-direction: column; border: 1px solid var(--ui-border); border-radius: 16px; min-width: 0; min-height: 0; overflow: hidden; background: var(--ui-bg); }
.studio-inspector-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 12px; font-size: 14px; font-weight: 600; border-bottom: 1px solid var(--ui-border); }
.studio-fields { flex: 1; min-height: 0; padding: 16px; display: flex; flex-direction: column; gap: 18px; overflow-y: auto; overscroll-behavior: contain; }
.studio-help { font-size: 12px; line-height: 1.6; color: var(--ui-text-muted); }.studio-inspector-footer { border-top: 1px solid var(--ui-border); padding: 12px 16px; font-size: 11px; color: var(--ui-text-muted); }
.studio-code { font-size: 11px; overflow: auto; max-height: 280px; margin-top: 12px; }.studio-notice { flex: none; max-height: 100px; overflow: auto; display: flex; gap: 12px; align-items: center; padding: 8px 12px; font-size: 13px; }
.studio-export-code { max-height: 45vh; overflow: auto; padding: 20px; border-radius: 8px; background: var(--ui-bg-muted); font-size: 12px; }
@media (max-width: 1100px) { .studio-product, .studio-brand-name { display: none; }.studio-toolbar { flex-wrap: wrap; }.studio-workspace { grid-template-columns: minmax(0, 1fr) 280px; }.studio-browsing { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 700px) {
  .studio-shell { padding: 0 8px 8px; gap: 8px; }.studio-header { min-height: 0; padding-top: 8px; gap: 8px; flex-wrap: wrap; }.studio-scenes { order: 3; width: 100%; justify-content: center; }.studio-scenes > * { max-width: 135px; }.studio-header > .studio-actions { margin-left: auto; }
  .studio-workspace { position: relative; display: flex; }.studio-canvas { flex: 1; }.studio-inspector { position: absolute; z-index: 2; inset: 0 0 0 auto; width: min(320px, 100%); box-shadow: -12px 0 36px #0002; }
  .studio-dock-settings { width: 100%; }.studio-dock-settings > * { flex: 1; justify-content: center; }.studio-toolbar-end { width: 100%; flex-wrap: wrap; justify-content: space-between; }.studio-comparing { grid-template-columns: minmax(0, 1fr); grid-template-rows: repeat(2, minmax(0, 1fr)); }
}
</style>
