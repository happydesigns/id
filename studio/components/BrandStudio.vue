<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createBlankStudioDocument, createStudioArchive, createStudioProject, diffStudioDocuments, parseStudioDocument, studioRoles, studioBuiltinPalettes } from '../../src/studio'
import { createStudioPalette, parseStudioSession, contrastRatio } from '../editor'
import type { StudioSession } from '../editor'
import { studioTemplates } from '../templates'
import type { StudioDocument } from '../../src/studio'

useHead({ bodyAttrs: { class: 'id-studio-page' } })
const route = useRoute()
const router = useRouter()
const config = useAppConfig() as unknown as { idStudio?: { document?: StudioDocument, sourcePath?: string, home?: string, templates?: unknown, packageAsset?: string } }
const seed = config.idStudio?.document ? parseStudioDocument(config.idStudio.document) : createBlankStudioDocument()
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value))
const baseline = ref(clone(seed))
const draft = ref(clone(seed))
const templates = studioTemplates(config.idStudio?.templates)
const scene = ref(typeof route.query.view === 'string' && templates.some(item => item.id === route.query.view) ? route.query.view : 'components')
const selectedTemplate = computed(() => templates.find(item => item.id === scene.value))
const templatePage = ref(selectedTemplate.value?.pages.find(page => page.id === route.query.page)?.id || selectedTemplate.value?.pages[0]?.id || 'home')
watch(scene, () => { templatePage.value = selectedTemplate.value?.pages[0]?.id || 'home' }, { flush: 'sync' })
const mode = ref<'light' | 'dark'>(route.query.mode === 'dark' ? 'dark' : 'light')
const colorMode = useColorMode()
const state = ref(route.query.state === 'error' ? 'error' : 'default')
const compare = ref(route.query.compare === 'true')
const mobile = ref(route.query.mobile === 'true')
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
const recovery = ref<StudioSession>()
const projects = ref<StudioSession[]>([])
const projectsOpen = ref(false)
const exported = ref<StudioDocument>()
const projectId = ref('')
const storageReady = ref(false)
const storedLocally = ref(false)
const fieldErrors = ref<Record<string, string>>({})
const previewOptionsOpen = ref(false)
const newColor = ref('#2563eb')
const scale = computed(() => { try { return createStudioPalette(newColor.value) } catch { return {} } })
const bodyContrast = ref<number>()
const panels = [{ label: 'Brand', value: 'identity' }, { label: 'Palette', value: 'colors' }, { label: 'Typography', value: 'type' }, { label: 'Appearance', value: 'details' }]
const fontPresets = [{ label: 'System sans', value: 'system-ui, sans-serif' }, { label: 'System serif', value: 'Georgia, serif' }, { label: 'System mono', value: 'ui-monospace, monospace' }]
const newColorName = ref('accent')
const changes = computed(() => diffStudioDocuments(baseline.value, draft.value))
const dirty = computed(() => changes.value.length > 0)
const colors = computed(() => Object.keys(draft.value.brand.colors))
const paletteOptions = computed(() => [...new Set([...colors.value.filter(name => typeof draft.value.brand.colors[name] === 'object'), ...studioBuiltinPalettes])])
const storageKey = `id-studio:1:${seed.brand.packageName || seed.brand.name}`
const projectPrefix = 'id-studio:project:2:'
const lastProjectKey = `${storageKey}:active`
const needsExport = computed(() => diffStudioDocuments(exported.value || baseline.value, draft.value).length > 0)
const saveStatus = computed(() => !storedLocally.value ? 'Not saved in this browser' : exported.value && !needsExport.value ? 'Saved locally · Export downloaded' : 'Saved in this browser')
const sourcePath = computed(() => draft.value.brand.name === seed.brand.name ? config.idStudio?.sourcePath || 'brand.studio.json' : 'brand.studio.json')
const output = computed(() => exportTab.value === 'changes' ? JSON.stringify(changes.value, null, 2) : exportTab.value === 'css' ? createStudioProject(draft.value)['app/assets/css/brand.css'] : JSON.stringify(draft.value, null, 2))
const customComponents = computed(() => Object.keys(draft.value.theme.ui ?? {}).filter(key => !['colors', 'icons'].includes(key)))

function edit(change: (doc: StudioDocument) => void, field?: string) {
  if (field) Reflect.deleteProperty(fieldErrors.value, field)
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
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : 'This value could not be applied.'
    if (field) fieldErrors.value[field] = message
    else error.value = message
  }
}
function undo() {
  fieldErrors.value = {}
  const previous = history.value.pop()
  if (previous) { future.value.push(clone(draft.value)); draft.value = previous }
}
function redo() {
  fieldErrors.value = {}
  const next = future.value.pop()
  if (next) { history.value.push(clone(draft.value)); draft.value = next }
}
function reset() {
  fieldErrors.value = {}
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
  exported.value = undefined
  fieldErrors.value = {}
  projectId.value = crypto.randomUUID()
  recovery.value = undefined
  persist()
}
function guard(action: () => void) { if (needsExport.value && !storedLocally.value) pending.value = action; else action() }
function acceptReplacement() { const action = pending.value; pending.value = null; action?.() }
function value(event: Event) { return (event.target as HTMLInputElement).value }
function token(name: string, next: string) {
  const field = `token:${name}`
  if (next.trim() && !CSS.supports(name === '--ui-radius' ? 'border-radius' : 'color', next)) { fieldErrors.value[field] = 'Enter a valid CSS ' + (name === '--ui-radius' ? 'radius.' : 'color.'); return }
  edit((doc) => {
    doc.theme.cssVariables ??= {}
    doc.theme.cssVariables[mode.value] ??= {}
    if (next.trim()) doc.theme.cssVariables[mode.value]![name] = next.trim()
    else Reflect.deleteProperty(doc.theme.cssVariables[mode.value]!, name)
  }, field)
}
function font(role: string, next: string) {
  edit((doc) => { doc.brand.typography ??= {}; doc.theme.typography ??= {}; doc.brand.typography[role] = next; doc.theme.typography[role] = next }, `font:${role}`)
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
  if (event.data?.type === 'id-studio-colors' && event.source === draftFrame.value?.contentWindow) { bodyContrast.value = contrastRatio(String(event.data.foreground), String(event.data.background)); return }
  if (event.data?.type === 'id-studio-navigate') {
    if (event.data.scene === scene.value && selectedTemplate.value?.pages.some(page => page.id === event.data.page)) templatePage.value = event.data.page
    return
  }
  if (event.data?.type !== 'id-studio-ready') return
  if (event.source === originalFrame.value?.contentWindow) send(originalFrame.value, baseline.value)
  if (event.source === draftFrame.value?.contentWindow) send(draftFrame.value, draft.value)
}
function beforeUnload(event: BeforeUnloadEvent) { if (needsExport.value && !storedLocally.value) { event.preventDefault(); event.returnValue = '' } }
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
    const packageAsset = config.idStudio?.packageAsset
    if (packageAsset && (!/^\/(?!\/)[\w/.-]+\.tgz$/.test(packageAsset) || packageAsset.split('/').includes('..'))) throw new Error('Invalid host package asset.')
    const files: Record<string, string | Uint8Array> = createStudioProject(draft.value, { bundledPackage: !!packageAsset })
    if (packageAsset) {
      const response = await fetch(packageAsset, { credentials: 'omit', redirect: 'error' })
      if (!response.ok) throw new Error('The editor package is unavailable. Ask the host to rebuild it before exporting.')
      const bytes = new Uint8Array(await response.arrayBuffer())
      if (bytes.length > 20_000_000 || bytes[0] !== 0x1f || bytes[1] !== 0x8b) throw new Error('The editor package is invalid or too large.')
      files['vendor/id.tgz'] = bytes
      files['playground/public/studio-packages/id.tgz'] = bytes
    }
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
    exported.value = clone(draft.value)
    persist()
    notice.value = 'Project downloaded. Apply it to your repository to publish the changes.'
  } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Export failed.' }
  finally { busy.value = false }
}
function listProjects() {
  const saved: StudioSession[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.startsWith(projectPrefix)) continue
    try { saved.push(parseStudioSession(JSON.parse(localStorage.getItem(key)!))) }
    catch { notice.value = 'A saved project could not be read. Other projects are still available.' }
  }
  projects.value = saved.sort((a, b) => b.updatedAt - a.updatedAt)
}
function persist() {
  if (!storageReady.value || !projectId.value) return
  storedLocally.value = false
  try {
    const session: StudioSession = { id: projectId.value, baseline: clone(baseline.value), draft: clone(draft.value), exported: exported.value ? clone(exported.value) : undefined, updatedAt: Date.now() }
    localStorage.setItem(projectPrefix + projectId.value, JSON.stringify(session))
    localStorage.setItem(lastProjectKey, projectId.value)
    storedLocally.value = true
    listProjects()
  } catch { notice.value = 'Local draft storage is unavailable. Export your source before leaving.' }
}
function restore(session: StudioSession) {
  baseline.value = clone(session.baseline); draft.value = clone(session.draft)
  exported.value = session.exported ? clone(session.exported) : undefined
  projectId.value = session.id; history.value = []; future.value = []; fieldErrors.value = {}
  recovery.value = undefined; projectsOpen.value = false; editing.value = true
  persist()
}
function exportSource() {
  download('brand.studio.json', JSON.stringify(draft.value, null, 2) + '\n')
  exported.value = clone(draft.value)
  persist()
}
function addPalette() {
  edit(doc => {
    if (!/^[a-z][a-z0-9-]*$/.test(newColorName.value) || doc.brand.colors[newColorName.value]) throw new Error('Choose a new lowercase palette name.')
    doc.brand.colors[newColorName.value] = createStudioPalette(newColor.value)
  }, 'new-palette')
}
function paletteColor(name: string, shade: string, color: string) {
  const field = `palette:${name}:${shade}`
  if (!CSS.supports('color', color)) { fieldErrors.value[field] = 'Enter a valid CSS color.'; return }
  edit(doc => {
    if (typeof doc.brand.colors[name] === 'string') doc.brand.colors[name] = color
    else (doc.brand.colors[name] as Record<string, string>)[shade] = color
  }, field)
}
async function shareView() {
  try { await navigator.clipboard.writeText(window.location.href); notice.value = 'View link copied. It uses the recipient’s brand, not your local draft.' }
  catch { notice.value = 'Copy the current address to share this view. Local brand data is not included.' }
}
let applyingQuery = false
watch(() => route.query, query => {
  applyingQuery = true
  scene.value = templates.some(item => item.id === query.view) ? String(query.view) : 'components'
  templatePage.value = selectedTemplate.value?.pages.find(page => page.id === query.page)?.id || selectedTemplate.value?.pages[0]?.id || 'home'
  mode.value = query.mode === 'dark' ? 'dark' : 'light'
  state.value = query.state === 'error' ? 'error' : 'default'
  compare.value = query.compare === 'true'; mobile.value = query.mobile === 'true'
  nextTick(() => { applyingQuery = false })
})
watch([scene, templatePage, mode, state, compare, mobile], () => {
  if (applyingQuery) return
  router.replace({ query: { ...route.query, view: scene.value, page: selectedTemplate.value ? templatePage.value : undefined, mode: mode.value, state: scene.value === 'components' ? state.value : undefined, compare: compare.value ? 'true' : undefined, mobile: mobile.value ? 'true' : undefined } })
})
onMounted(() => {
  // The shell and its teleported controls must follow the same mode as the frames,
  // including when a shared URL overrides a saved or system preference.
  watch([mode, () => colorMode.unknown], ([value, unknown]) => {
    if (!unknown) colorMode.preference = value
  }, { immediate: true })
  window.addEventListener('message', ready); window.addEventListener('beforeunload', beforeUnload)
  nextTick(refresh)
  try {
    listProjects()
    const last = localStorage.getItem(lastProjectKey)
    recovery.value = projects.value.find(item => item.id === last)
    if (!recovery.value) {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const legacy = JSON.parse(stored)
        recovery.value = parseStudioSession({ ...legacy, id: crypto.randomUUID(), updatedAt: Date.now() })
      }
    }
    projectId.value = crypto.randomUUID()
    storageReady.value = true
    // Do not overwrite the last project before the author chooses whether to restore it.
  } catch { storageReady.value = true; projectId.value = crypto.randomUUID(); notice.value = 'The previous local draft could not be restored. Your source has not changed.' }
})
watch([draft, baseline, exported], persist, { deep: true, flush: 'post' })
watch([draft, baseline, scene, templatePage, mode, state, compare], () => nextTick(refresh), { deep: true })
onBeforeUnmount(() => { window.removeEventListener('message', ready); window.removeEventListener('beforeunload', beforeUnload) })
</script>

<template>
  <main class="studio-shell" :data-mode="mode" aria-label="Brand Studio">
    <header class="studio-header">
      <a :href="config.idStudio?.home || '/'" class="studio-wordmark" aria-label="id Studio home">id<span class="studio-dot">.</span></a>
      <h1 class="sr-only">{{ draft.theme.label }}</h1>
      <div class="studio-scenes" aria-label="Preview scene">
        <USelect v-model="scene" aria-label="Template" :items="[{ label: 'Components', value: 'components' }, ...templates.map(item => ({ label: item.label, value: item.id }))]" />
        <USelect v-if="selectedTemplate && selectedTemplate.pages.length > 1" v-model="templatePage" aria-label="Template page" :items="selectedTemplate.pages.map(item => ({ label: item.label, value: item.id }))" />
      </div>
      <div class="studio-actions studio-project-actions">
        <UButton color="neutral" variant="outline" @click="guard(() => replace(createBlankStudioDocument()))">New brand</UButton>
        <UButton color="neutral" variant="outline" @click="input?.click()">Open brand</UButton>
        <UButton color="neutral" variant="ghost" @click="projectsOpen = true">Recent</UButton>
        <UButton color="neutral" variant="ghost" @click="exportOpen = true">Export</UButton>
      </div>
      <UDropdownMenu
class="studio-project-menu" :content="{ align: 'end' }" :items="[
        [{ label: 'New brand', icon: 'i-lucide-plus', onSelect: () => guard(() => replace(createBlankStudioDocument())) }, { label: 'Open brand', icon: 'i-lucide-folder-open', onSelect: () => input?.click() }],
        [{ label: 'Recent projects', icon: 'i-lucide-history', onSelect: () => { projectsOpen = true } }, { label: 'Export', icon: 'i-lucide-download', onSelect: () => { exportOpen = true } }]
      ]">
        <UButton icon="i-lucide-ellipsis" aria-label="Project actions" color="neutral" variant="ghost" class="size-10 justify-center" />
      </UDropdownMenu>
      <input ref="input" type="file" accept=".json,application/json" class="sr-only" aria-label="Open brand document" @change="openDocument">
    </header>
    <div v-if="recovery" class="studio-notice" role="status">
      <span>A saved draft is available.</span><UButton @click="restore(recovery)">Restore draft</UButton><UButton variant="ghost" color="neutral" @click="recovery = undefined">Dismiss</UButton>
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
          <h2 class="studio-desktop">{{ panel === 'identity' ? 'Brand' : panel === 'colors' ? 'Palette' : panel === 'type' ? 'Typography' : 'Appearance' }}</h2>
          <div class="studio-mobile-control min-w-0 max-w-32"><USelect v-model="panel" :items="panels" aria-label="Settings section" class="w-full" /></div>
          <div class="studio-actions">
            <UButton icon="i-lucide-undo-2" aria-label="Undo change" color="neutral" variant="ghost" size="xs" :disabled="!history.length" @click="undo" />
            <UButton icon="i-lucide-redo-2" aria-label="Redo change" color="neutral" variant="ghost" size="xs" :disabled="!future.length" @click="redo" />
            <UButton color="neutral" variant="ghost" size="xs" :disabled="!dirty" @click="reset">Reset</UButton>
            <UButton icon="i-lucide-x" aria-label="Close settings" color="neutral" variant="ghost" size="xs" @click="editing = false" />
          </div>
        </div>
        <div class="studio-fields">
          <template v-if="panel === 'identity'">
            <UFormField :error="fieldErrors['label']" label="Brand name" :hint="dirty ? undefined : origin('theme.label')"><UInput :model-value="draft.theme.label" class="w-full" @change="edit(doc => { doc.theme.label = value($event) }, 'label')" /></UFormField>
            <UFormField :error="fieldErrors['identifier']" label="Identifier" help="Lowercase letters, numbers and hyphens"><UInput :model-value="draft.brand.name" class="w-full" @change="edit(doc => { doc.brand.name = value($event); doc.theme.name = value($event) }, 'identifier')" /></UFormField>
            <UFormField :error="fieldErrors['package']" label="Package name"><UInput :model-value="draft.brand.packageName" placeholder="@example/brand" class="w-full" @change="edit(doc => { doc.brand.packageName = value($event) }, 'package')" /></UFormField>
            <UFormField :error="fieldErrors['claim']" label="Brand statement"><UTextarea :model-value="draft.brand.claim" :rows="3" class="w-full" @change="edit(doc => { doc.brand.claim = value($event) }, 'claim')" /></UFormField>
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
                  <IdStudioColorField v-for="(color, shade) in typeof item.palette === 'string' ? { base: item.palette } : item.palette" :key="shade" :label="`${item.label} ${shade}`" :model-value="color || ''" :error="fieldErrors[`palette:${item.label}:${shade}`]" @change="paletteColor(item.label, String(shade), $event)" />
                </div>
              </template>
            </UAccordion>
            <UFormField label="New palette name" :error="fieldErrors['new-palette']"><UInput v-model="newColorName" class="w-full" /></UFormField>
            <IdStudioColorField label="Base color" :model-value="newColor" @change="newColor = $event" />
            <div class="flex overflow-hidden rounded" aria-label="New palette preview"><span v-for="(color, shade) in scale" :key="shade" class="h-7 flex-1" :style="{ background: color }" :title="`${shade}: ${color}`" /></div>
            <UButton color="neutral" variant="outline" @click="addPalette">Add palette</UButton>
          </template>
          <template v-if="panel === 'type'">
            <p class="studio-help">Use installed fonts or a system stack. Entering a name does not download a font.</p>
            <div v-for="role in ['sans', 'mono', 'display']" :key="role" class="space-y-2">
              <UFormField :label="role" :error="fieldErrors[`font:${role}`]"><UInput :model-value="draft.theme.typography?.[role] || draft.brand.typography?.[role] || ''" placeholder="system-ui, sans-serif" class="w-full" @change="font(role, value($event))" /></UFormField>
              <USelect :aria-label="`${role} preset`" placeholder="Choose a font preset" :items="fontPresets" class="w-full" @update:model-value="font(role, String($event))" />
              <p class="rounded border border-default p-3 text-xl" :style="{ fontFamily: draft.theme.typography?.[role] || draft.brand.typography?.[role] || 'inherit' }">The quick brown fox. 0123456789</p>
            </div>
          </template>
          <template v-if="panel === 'details'">
            <p class="studio-help">Editing {{ mode }} mode. Empty fields use defaults.</p>
            <UFormField label="Corner radius" :error="fieldErrors['token:--ui-radius']">
              <UInput :model-value="draft.theme.cssVariables?.[mode]?.['--ui-radius'] || ''" placeholder="0.25rem" class="w-full" @change="token('--ui-radius', value($event))" />
              <div class="mt-2 flex gap-1"><UButton v-for="preset in [{ label: 'Square', value: '0rem' }, { label: 'Soft', value: '0.25rem' }, { label: 'Round', value: '0.5rem' }]" :key="preset.value" color="neutral" variant="outline" size="xs" @click="token('--ui-radius', preset.value)">{{ preset.label }}</UButton></div>
            </UFormField>
            <IdStudioColorField v-for="entry in [{ name: '--ui-bg', label: 'Page background' }, { name: '--ui-bg-elevated', label: 'Raised surface' }, { name: '--ui-text', label: 'Body text' }, { name: '--ui-border', label: 'Borders' }]" :key="entry.name" :label="entry.label" :model-value="draft.theme.cssVariables?.[mode]?.[entry.name] || ''" :error="fieldErrors[`token:${entry.name}`]" @change="token(entry.name, $event)" />
            <p v-if="bodyContrast !== undefined" :class="bodyContrast < 4.5 ? 'text-error' : 'text-muted'" class="text-xs" role="status">Body text / page: {{ bodyContrast.toFixed(2) }}:1{{ bodyContrast < 4.5 ? ' — below 4.5:1 for normal text.' : '' }}</p>
            <p v-else class="text-xs text-muted">Body contrast cannot be measured for these color values.</p>
            <p v-if="customComponents.length" class="text-xs text-muted">Component overrides are present. Their classes can take precedence over palette and style controls.</p>
            <UFormField label="Button style"><USelect :model-value="componentVariant('button') || '__default'" :items="[{ label: 'Nuxt UI default', value: '__default' }, ...['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'].map(value => ({ label: value, value }))]" class="w-full" @update:model-value="defaultVariant('button', $event === '__default' ? '' : String($event))" /></UFormField>
            <UAccordion v-if="customComponents.length" :items="[{ label: 'Component overrides', value: 'overrides' }]"><template #body><p class="studio-help">Existing overrides can affect these settings.</p><pre class="studio-code">{{ JSON.stringify(draft.theme.ui, null, 2) }}</pre></template></UAccordion>
          </template>
        </div>
        <p class="studio-inspector-footer" role="status">{{ saveStatus }}<span v-if="needsExport"> · Not exported</span></p>
      </aside>
    </div>
    <div class="studio-toolbar">
      <div class="studio-dock-settings studio-desktop">
        <UButton v-for="item in ['identity', 'colors', 'type', 'details']" :key="item" color="neutral" :variant="editing && panel === item ? 'soft' : 'ghost'" :aria-pressed="editing && panel === item" @click="panel = item; editing = true">{{ item === 'identity' ? 'Brand' : item === 'type' ? 'Typography' : item === 'details' ? 'Appearance' : 'Palette' }}</UButton>
      </div>
      <div class="studio-toolbar-end studio-desktop">
        <UCheckbox v-model="compare" label="Compare original" size="sm" />
        <UCheckbox v-model="mobile" label="Mobile" size="sm" />
        <USelect v-if="scene === 'components'" v-model="state" aria-label="Preview state" :items="[{ label: 'Default', value: 'default' }, { label: 'Validation error', value: 'error' }]" size="sm" />
        <UFieldGroup><UButton color="neutral" :variant="mode === 'light' ? 'soft' : 'ghost'" :aria-pressed="mode === 'light'" size="sm" @click="mode = 'light'">Light</UButton><UButton color="neutral" :variant="mode === 'dark' ? 'soft' : 'ghost'" :aria-pressed="mode === 'dark'" size="sm" @click="mode = 'dark'">Dark</UButton></UFieldGroup>
      </div>
      <UButton class="studio-mobile-control" color="neutral" :variant="editing ? 'soft' : 'ghost'" icon="i-lucide-sliders-horizontal" @click="editing = !editing">Customize</UButton>
      <UPopover v-model:open="previewOptionsOpen" class="studio-mobile-control">
        <UButton color="neutral" variant="ghost" icon="i-lucide-monitor" label="Preview" />
        <template #content>
          <div class="flex w-64 flex-col gap-4 p-4">
            <UCheckbox v-model="compare" label="Compare original" />
            <UCheckbox v-model="mobile" label="Mobile" />
            <USelect v-if="scene === 'components'" v-model="state" aria-label="Preview state" :items="[{ label: 'Default', value: 'default' }, { label: 'Validation error', value: 'error' }]" />
            <UFieldGroup><UButton color="neutral" :variant="mode === 'light' ? 'soft' : 'ghost'" @click="mode = 'light'">Light</UButton><UButton color="neutral" :variant="mode === 'dark' ? 'soft' : 'ghost'" @click="mode = 'dark'">Dark</UButton></UFieldGroup>
            <UButton color="neutral" variant="outline" icon="i-lucide-link" @click="shareView">Copy view link</UButton>
          </div>
        </template>
      </UPopover>
      <UButton class="studio-desktop" color="neutral" variant="ghost" icon="i-lucide-link" aria-label="Copy view link" @click="shareView" />
    </div>
    <UModal v-model:open="projectsOpen" title="Recent projects" description="Drafts stored in this browser.">
      <template #body>
        <p v-if="!projects.length" class="text-sm text-muted">No saved projects yet.</p>
        <div v-else class="space-y-2"><UButton v-for="project in projects" :key="project.id" color="neutral" variant="outline" block class="justify-between" @click="guard(() => restore(project))"><span>{{ project.draft.theme.label }}</span><span class="text-xs text-muted">{{ project.id === projectId ? 'Current' : project.draft.brand.packageName }}</span></UButton></div>
      </template>
    </UModal>
    <UModal :open="!!pending" title="Replace this draft?" description="Export your changes first if you want to keep them." @update:open="pending = null"><template #footer><UButton color="neutral" variant="outline" @click="pending = null">Keep editing</UButton><UButton @click="acceptReplacement">Replace draft</UButton></template></UModal>
    <UModal v-model:open="exportOpen" title="Export brand" :ui="{ content: 'max-w-4xl' }">
      <template #body>
        <p class="mb-4 text-sm text-muted" role="status">{{ exported && !needsExport ? 'This version was downloaded. ' : '' }}{{ changes.length }} changes. To update your project, replace <code>{{ sourcePath }}</code> and run its generation checks.</p>
        <div class="mb-4 flex gap-2"><UButton v-for="item in ['source', 'changes', 'css']" :key="item" color="neutral" :variant="exportTab === item ? 'soft' : 'ghost'" :aria-pressed="exportTab === item" @click="exportTab = item">{{ item === 'css' ? 'CSS' : item === 'source' ? 'Source' : 'Changes' }}</UButton></div>
        <pre class="studio-export-code">{{ output }}</pre>
        <p class="mt-4 text-sm text-muted">A new project includes a Nuxt brand layer and Studio. Custom fonts, Vue components and capabilities must be added separately.</p>
        <p v-if="error" role="alert" class="mt-4 text-sm text-error">{{ error }}</p>
      </template>
      <template #footer><UButton @click="exportSource">Download source</UButton><UButton color="neutral" variant="outline" :loading="busy" @click="exportProject">Download new project</UButton></template>
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
.studio-dot { color: var(--ui-primary); }

.studio-scenes { display: flex; align-items: center; gap: 4px; margin: auto; min-width: 0; }.studio-scenes > * { max-width: 155px; }
.studio-project-menu, .studio-mobile-control { display: none; }
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
@media (max-width: 1100px) { .studio-toolbar { flex-wrap: wrap; }.studio-workspace { grid-template-columns: minmax(0, 1fr) 280px; }.studio-browsing { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 700px) {
  .studio-shell { padding: 0 8px 8px; gap: 8px; }.studio-header { min-height: 48px; gap: 8px; }.studio-wordmark { font-size: 26px; }.studio-scenes { flex: 1; justify-content: center; gap: 4px; }.studio-scenes > * { min-width: 0; max-width: 130px; }.studio-project-actions { display: none; }.studio-project-menu { display: inline-flex; flex: none; }
  .studio-workspace { position: relative; display: flex; }.studio-canvas { flex: 1; }.studio-inspector { position: absolute; z-index: 2; inset: 0 0 0 auto; width: min(320px, 100%); box-shadow: -12px 0 36px #0002; }
  .studio-mobile-control { display: inline-flex; }.studio-desktop { display: none; }.studio-toolbar { flex-wrap: nowrap; justify-content: space-between; }.studio-dock-settings { width: 100%; }.studio-dock-settings > * { flex: 1; justify-content: center; }.studio-toolbar-end { width: 100%; flex-wrap: wrap; justify-content: space-between; }.studio-comparing { grid-template-columns: minmax(0, 1fr); grid-template-rows: repeat(2, minmax(0, 1fr)); }
}
</style>
