<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import StudioViewport from './StudioViewport.vue'
import StudioViewportControls from './StudioViewportControls.vue'
import { createBlankStudioDocument, createStudioDocument, createStudioArchive, createStudioProject, diffStudioDocuments, parseStudioDocument, studioRoles, studioBuiltinPalettes } from '../../src/studio'
import { nuxtUiBrandTheme } from '../../themes/nuxt-ui'
import { createStudioPalette, parseStudioSession, contrastRatio } from '../editor'
import type { StudioSession } from '../editor'
import { studioTemplates, withinStudioRoute } from '../templates'
import type { StudioDocument } from '../../src/studio'

useHead({ bodyAttrs: { class: 'id-studio-page' } })
const route = useRoute()
const router = useRouter()
const config = useAppConfig() as unknown as { idStudio?: { document?: StudioDocument, brands?: Record<string, StudioDocument>, sourcePath?: string, home?: string, templates?: unknown, packageAsset?: string } }
const seed = config.idStudio?.document ? parseStudioDocument(config.idStudio.document) : createBlankStudioDocument()
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value))
const baseline = ref(clone(seed))
const draft = ref(clone(seed))
const templates = studioTemplates(config.idStudio?.templates)
const scene = ref(typeof route.query.view === 'string' && templates.some(item => item.id === route.query.view) ? route.query.view : 'components')
const selectedTemplate = computed(() => templates.find(item => item.id === scene.value))
const paths = ref<Record<string, string>>({})
const previewPath = computed(() => selectedTemplate.value?.routePrefix && withinStudioRoute(paths.value[scene.value], selectedTemplate.value.routePrefix) ? paths.value[scene.value] : selectedTemplate.value?.route)
function frameSrc(frame: string) {
  return selectedTemplate.value?.route ? `${selectedTemplate.value.route}?idPreview=${scene.value}&frame=${frame}` : `/studio/preview?frame=${frame}`
}
const templatePage = ref(selectedTemplate.value?.pages.find(page => page.id === route.query.page)?.id || selectedTemplate.value?.pages[0]?.id || 'home')
watch(scene, () => { templatePage.value = selectedTemplate.value?.pages[0]?.id || 'home' }, { flush: 'sync' })
const colorMode = useColorMode()
const preference = ref<'light' | 'dark' | 'system'>(route.query.mode === 'dark' ? 'dark' : route.query.mode === 'light' ? 'light' : 'system')
const mode = computed<'light' | 'dark'>(() => preference.value === 'system' ? colorMode.value === 'dark' ? 'dark' : 'light' : preference.value)
const state = ref(route.query.state === 'error' ? 'error' : 'default')
const compare = ref(route.query.compare === 'true')
function viewportDimension(value: unknown, fallback: number) { const number = Number(value); return Number.isInteger(number) && number >= 240 && number <= 3840 ? number : fallback }
const viewportWidth = ref(viewportDimension(route.query.width, route.query.mobile === 'true' ? 390 : 0))
const viewportHeight = ref(viewportDimension(route.query.height, 844))
const editing = ref(route.query.browse !== 'true')
const panel = ref('colors')
const error = ref('')
const notice = ref('')
const exportOpen = ref(false)
const exportTab = ref('changes')
const busy = ref(false)
const pending = ref<(() => void) | null>(null)
const input = ref<HTMLInputElement>()
const originalFrame = ref<HTMLIFrameElement>()
const draftFrame = ref<HTMLIFrameElement>()
const history = ref<StudioDocument[]>([])
const future = ref<StudioDocument[]>([])
const recovery = ref<StudioSession>()
const projects = ref<StudioSession[]>([])
const brandPickerOpen = ref(false)
const brandSearch = ref('')
const brandSearchInput = { placeholder: 'Search brands…', 'aria-label': 'Search brands' }
const createOpen = ref(false)
const createName = ref('')
const createError = ref('')
const createBase = ref<StudioDocument>()
const persistPristine = ref(false)
const manageOpen = ref(false)
const manageSearch = ref('')
const manageError = ref('')
const manageTarget = ref<StudioSession>()
const manageAction = ref<'rename' | 'delete'>('rename')
const manageName = ref('')
const managedProjects = computed(() => projects.value.filter(project => `${project.draft.theme.label} ${project.draft.brand.packageName || project.draft.brand.name}`.toLocaleLowerCase().includes(manageSearch.value.trim().toLocaleLowerCase())))
function openManager() {
  persist()
  manageTarget.value = undefined
  manageError.value = ''
  manageSearch.value = ''
  manageOpen.value = true
}
function manageProject(project: StudioSession, action: 'rename' | 'delete') {
  manageTarget.value = project
  manageAction.value = action
  manageName.value = project.draft.theme.label
  manageError.value = ''
}
function saveManagedProject() {
  const project = manageTarget.value
  if (!project) return
  try {
    if (manageAction.value === 'delete') {
      localStorage.removeItem(projectPrefix + project.id)
      if (localStorage.getItem(lastProjectKey) === project.id) localStorage.removeItem(lastProjectKey)
      if (recovery.value?.id === project.id) recovery.value = undefined
      if (projectId.value === project.id) {
        storedLocally.value = false
        replace(catalog.find(item => item.key === 'nuxt-ui')!.document, 'nuxt-ui')
      }
    } else {
      const name = manageName.value.trim()
      if (!name || name.length > 80) { manageError.value = 'Enter a name of 1–80 characters.'; return }
      if ([...catalog.map(item => item.document.theme.label), ...projects.value.filter(item => item.id !== project.id).map(item => item.draft.theme.label)].some(label => label.trim().toLocaleLowerCase() === name.toLocaleLowerCase())) { manageError.value = 'A brand with this name already exists.'; return }
      const renamed = clone(project)
      renamed.draft.theme.label = name
      renamed.updatedAt = Date.now()
      localStorage.setItem(projectPrefix + project.id, JSON.stringify(renamed))
      if (recovery.value?.id === project.id) recovery.value = renamed
      if (projectId.value === project.id) edit(doc => { doc.theme.label = name })
    }
    listProjects()
    manageTarget.value = undefined
  } catch { manageError.value = 'Browser storage is unavailable. Please try again.' }
}
const exported = ref<StudioDocument>()
const projectId = ref('')
const storageReady = ref(false)
const storedLocally = ref(false)
const fieldErrors = ref<Record<string, string>>({})
const previewOptionsOpen = ref(false)
const newColor = ref('#2563eb')
const scale = computed(() => { try { return createStudioPalette(newColor.value) } catch { return {} } })
const bodyContrast = ref<number>()
const writerToken = useRuntimeConfig().public.idStudioWriterToken as string | undefined
const catalogPrefix = `${seed.brand.packageName || seed.brand.name}::`
const isBaselineHost = !writerToken && seed.brand.name === 'nuxt-ui'
const catalog = [
  { key: 'nuxt-ui', document: createStudioDocument({ name: 'nuxt-ui', colors: {} }, nuxtUiBrandTheme) },
  ...isBaselineHost ? [] : [{ key: 'host', document: seed }],
  ...Object.entries(config.idStudio?.brands ?? {}).map(([key, document]) => ({ key: `brand:${key}`, document: parseStudioDocument(document) }))
]
const catalogKey = ref<string | undefined>(catalogPrefix + (isBaselineHost ? 'nuxt-ui' : 'host'))
const readOnly = computed(() => catalogKey.value === catalogPrefix + 'nuxt-ui')
const sourceRevision = ref('')
const connected = ref(false)
const sourceConflict = ref(false)
const busySource = ref(false)
const customizeButton = ref<{ $el?: HTMLElement }>()
const logoRole = ref('wordmark')
const currentLogo = computed(() => draft.value.brand.assets?.logos?.[logoRole.value])
function removeLogo() { edit(doc => { if (doc.brand.assets?.logos) Reflect.deleteProperty(doc.brand.assets.logos, logoRole.value) }) }
const logoRoles = [{ label: 'Wordmark · light', value: 'wordmark' }, { label: 'Wordmark · dark', value: 'wordmarkInverse' }, { label: 'Symbol · light', value: 'logo' }, { label: 'Symbol · dark', value: 'logoInverse' }]
const projectItems = computed(() => [
  [{ label: 'Create new brand', icon: 'i-lucide-plus', onSelect: () => beginCreate() }, { label: 'Open brand', icon: 'i-lucide-folder-open', onSelect: () => input.value?.click() }, { label: 'Manage brands', icon: 'i-lucide-library', onSelect: openManager }],
  [{ label: 'Duplicate brand', icon: 'i-lucide-copy', onSelect: () => beginCreate(draft.value) }, { label: 'Review changes', icon: 'i-lucide-git-compare-arrows', onSelect: () => { exportOpen.value = true } }, { label: 'Download', icon: 'i-lucide-download', onSelect: () => { exportOpen.value = true; exportTab.value = 'source' } }],
  [{ label: 'Reset draft', icon: 'i-lucide-rotate-ccw', disabled: !dirty.value, onSelect: reset }, { label: 'Open connected project', icon: 'i-lucide-folder-sync', disabled: !writerToken, onSelect: () => guard(() => loadSource(true)) }, { label: 'Documentation', icon: 'i-lucide-book-open', to: config.idStudio?.home || '/' }]
])
const brandGroups = computed(() => [
  { id: 'brands', label: 'Brands', items: catalog.map(item => {
    const key = catalogPrefix + item.key
    const saved = projects.value.find(project => project.catalogKey === key)
    return { label: key === catalogKey.value ? draft.value.theme.label : saved?.draft.theme.label || item.document.theme.label, icon: key === catalogKey.value ? 'i-lucide-check' : 'i-lucide-palette', keywords: item.document.brand.packageName, onSelect: () => pickBrand(() => selectCatalog(item.key)) }
  }) },
  { id: 'local', label: 'Saved in this browser', items: projects.value.filter(project => !catalog.some(item => project.catalogKey === catalogPrefix + item.key)).map(project => ({ label: project.draft.theme.label, description: projects.value.filter(other => other.draft.theme.label === project.draft.theme.label).length > 1 ? `${project.draft.brand.packageName || project.draft.brand.name} · ${new Date(project.updatedAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'medium' })}` : undefined, icon: project.id === projectId.value ? 'i-lucide-check' : 'i-lucide-palette', keywords: project.draft.brand.packageName, onSelect: () => pickBrand(() => restore(project)) })) }
])
function beginCreate(base?: StudioDocument) {
  createBase.value = base ? clone(base) : undefined
  createName.value = base ? `${base.theme.label} copy` : ''
  createError.value = ''
  createOpen.value = true
}
function createBrand() {
  const name = createName.value.trim()
  if (!name) { createError.value = 'Give your brand a name.'; return }
  if (name.length > 80) { createError.value = 'Use 80 characters or fewer.'; return }
  const existing = [...catalog.map(item => item.document.theme.label), ...projects.value.map(project => project.draft.theme.label)]
  if (existing.some(label => label.trim().toLocaleLowerCase() === name.toLocaleLowerCase())) { createError.value = 'A brand with this name already exists. Choose a different name.'; return }
  const doc = clone(createBase.value || createBlankStudioDocument())
  doc.theme.label = name
  createOpen.value = false
  guard(() => { persist(); replace(doc) })
}
function pickBrand(action: () => void) {
  brandPickerOpen.value = false
  brandSearch.value = ''
  guard(() => { persist(); action() })
}
function selectCatalog(key: string) {
  const item = catalog.find(item => item.key === key)
  if (!item || catalogKey.value === catalogPrefix + key) return
  const saved = projects.value.find(project => project.catalogKey === catalogPrefix + key)
  if (saved) restore(saved)
  else {
    replace(item.document, key)
    if (key === 'host') loadSource()
  }
}
function customize() {
  if (readOnly.value) beginCreate()
  else editing.value = !editing.value
}
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
  if (readOnly.value) return
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
function replace(doc: StudioDocument, key?: string) {
  persistPristine.value = !key
  connected.value = false
  catalogKey.value = key ? catalogPrefix + key : undefined
  sourceConflict.value = false
  baseline.value = clone(doc)
  draft.value = clone(doc)
  history.value = []
  future.value = []
  error.value = ''
  editing.value = !readOnly.value
  exported.value = undefined
  fieldErrors.value = {}
  projectId.value = crypto.randomUUID()
  recovery.value = undefined
  persist()
}
async function loadSource(replaceDraft = false) {
  if (!writerToken) return
  const requestedProject = projectId.value
  busySource.value = true
  try {
    const result = await $fetch<{ document: StudioDocument, revision: string }>('/api/id-studio/source', { headers: { 'x-id-studio-token': writerToken } })
    if (projectId.value !== requestedProject) return
    const doc = parseStudioDocument(result.document)
    sourceRevision.value = result.revision
    sourceConflict.value = false
    if (replaceDraft) replace(doc, 'host')
    if (catalogKey.value !== catalogPrefix + 'host') return
    connected.value = true
    if (dirty.value) sourceConflict.value = diffStudioDocuments(baseline.value, doc).length > 0
    else { baseline.value = clone(doc); draft.value = clone(doc) }
  } catch { notice.value = 'The local project is unavailable. Your draft can still be downloaded.' }
  finally { busySource.value = false }
}
async function applySource() {
  if (!connected.value || !writerToken || !sourceRevision.value) return
  const requestedProject = projectId.value
  busySource.value = true
  try {
    const result = await $fetch<{ document: StudioDocument, revision: string }>('/api/id-studio/source', { method: 'POST', headers: { 'x-id-studio-token': writerToken }, body: { revision: sourceRevision.value, document: clone(draft.value) } })
    if (projectId.value !== requestedProject) return
    baseline.value = parseStudioDocument(result.document)
    sourceRevision.value = result.revision
    sourceConflict.value = false
    exportOpen.value = false
    notice.value = 'Changes applied to the project source.'
    persist()
  } catch (cause) {
    sourceConflict.value = (cause as { status?: number }).status === 409 || (cause as { statusCode?: number }).statusCode === 409
    error.value = sourceConflict.value ? 'The project changed outside Studio. Download your draft or reopen the connected project before applying changes.' : 'The source could not be saved. Your draft is still available.'
  } finally { busySource.value = false }
}
function closeSettings() { editing.value = false; nextTick(() => customizeButton.value?.$el?.focus()) }
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
async function addLogo(file: File | null | undefined) {
  if (!file) return
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 2_000_000) { error.value = 'Choose a PNG, JPEG or WebP smaller than 2 MB.'; return }
  const role = logoRole.value
  const reader = new FileReader()
  reader.onerror = () => { error.value = 'The image could not be read.' }
  reader.onload = () => edit((doc) => {
    doc.brand.assets ??= {}; doc.brand.assets.logos ??= {}
    doc.brand.assets.logos[role] = { name: file.name, role, media: role.endsWith('Inverse') ? 'dark' : 'light', alt: doc.theme.label, src: String(reader.result) }
  })
  reader.readAsDataURL(file)
}
function send(frame: HTMLIFrameElement | undefined, doc: StudioDocument) {
  frame?.contentWindow?.postMessage({ type: 'id-studio-preview', document: clone(doc), scene: scene.value, page: templatePage.value, path: previewPath.value, mode: mode.value, state: state.value }, window.location.origin)
}
function refresh() { send(originalFrame.value, baseline.value); send(draftFrame.value, draft.value) }
function ready(event: MessageEvent) {
  if (event.origin !== window.location.origin) return
  if (event.source !== originalFrame.value?.contentWindow && event.source !== draftFrame.value?.contentWindow) return
  if (event.data?.type === 'id-studio-colors' && event.source === draftFrame.value?.contentWindow) { bodyContrast.value = contrastRatio(String(event.data.foreground), String(event.data.background)); return }
  if (event.data?.type === 'id-studio-navigate') {
    if (event.data.scene === scene.value && selectedTemplate.value?.pages.some(page => page.id === event.data.page)) templatePage.value = event.data.page
    if (event.data.scene === scene.value && selectedTemplate.value?.routePrefix && withinStudioRoute(event.data.path, selectedTemplate.value.routePrefix)) paths.value[scene.value] = event.data.path
    return
  }
  if (event.data?.type === 'id-studio-mode' && ['light', 'dark'].includes(event.data.mode)) { preference.value = event.data.mode; return }
  if (event.data?.type === 'id-studio-preview-error') { error.value = 'This preview could not apply the brand. Try reloading it.'; return }
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
  if (!storageReady.value || !projectId.value || readOnly.value) return
  if (!persistPristine.value && !dirty.value && !exported.value && !projects.value.some(project => project.id === projectId.value)) return
  storedLocally.value = false
  try {
    const session: StudioSession = { id: projectId.value, baseline: clone(baseline.value), draft: clone(draft.value), exported: exported.value ? clone(exported.value) : undefined, updatedAt: Date.now(), catalogKey: catalogKey.value }
    localStorage.setItem(projectPrefix + projectId.value, JSON.stringify(session))
    localStorage.setItem(lastProjectKey, projectId.value)
    storedLocally.value = true
    listProjects()
  } catch { notice.value = 'Local draft storage is unavailable. Export your source before leaving.' }
}
function restore(session: StudioSession) {
  persistPristine.value = true
  connected.value = false
  error.value = ''
  notice.value = ''
  catalogKey.value = session.catalogKey
  sourceConflict.value = false
  baseline.value = clone(session.baseline); draft.value = clone(session.draft)
  exported.value = session.exported ? clone(session.exported) : undefined
  projectId.value = session.id; history.value = []; future.value = []; fieldErrors.value = {}
  recovery.value = undefined; brandPickerOpen.value = false; editing.value = !readOnly.value
  persist()
  if (catalogKey.value === catalogPrefix + 'host') loadSource()
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
  preference.value = query.mode === 'dark' ? 'dark' : query.mode === 'light' ? 'light' : 'system'
  if (selectedTemplate.value?.routePrefix && withinStudioRoute(query.path, selectedTemplate.value.routePrefix)) paths.value[scene.value] = query.path
  state.value = query.state === 'error' ? 'error' : 'default'
  compare.value = query.compare === 'true'; viewportWidth.value = viewportDimension(query.width, query.mobile === 'true' ? 390 : 0); viewportHeight.value = viewportDimension(query.height, 844)
  nextTick(() => { applyingQuery = false })
})
watch([scene, templatePage, preference, previewPath, state, compare, viewportWidth, viewportHeight], () => {
  if (applyingQuery) return
  router.replace({ query: { ...route.query, view: scene.value, page: selectedTemplate.value?.component ? templatePage.value : undefined, path: previewPath.value, mode: preference.value, state: scene.value === 'components' ? state.value : undefined, compare: compare.value ? 'true' : undefined, mobile: undefined, width: viewportWidth.value || undefined, height: viewportWidth.value ? viewportHeight.value : undefined } })
})
onMounted(() => {
  // The shell and its teleported controls must follow the same mode as the frames,
  // including when a shared URL overrides a saved or system preference.
  watch([preference, () => colorMode.unknown], ([value, unknown]) => {
    if (!unknown) colorMode.preference = value
  }, { immediate: true })
  window.addEventListener('message', ready); window.addEventListener('beforeunload', beforeUnload)
  nextTick(refresh)
  if (selectedTemplate.value?.routePrefix && withinStudioRoute(route.query.path, selectedTemplate.value.routePrefix)) paths.value[scene.value] = route.query.path
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
    if (recovery.value?.catalogKey === catalogKey.value) catalogKey.value = undefined
    storageReady.value = true
    // Do not overwrite the last project before the author chooses whether to restore it.
  } catch { storageReady.value = true; projectId.value = crypto.randomUUID(); notice.value = 'The previous local draft could not be restored. Your source has not changed.' }
  if (readOnly.value) editing.value = false
  loadSource()
})
watch([draft, baseline, exported], persist, { deep: true, flush: 'post' })
watch([draft, baseline, scene, templatePage, previewPath, mode, state, compare], () => nextTick(refresh), { deep: true })
onBeforeUnmount(() => { window.removeEventListener('message', ready); window.removeEventListener('beforeunload', beforeUnload) })
</script>

<template>
  <main class="studio-shell" :data-mode="mode" aria-label="Brand Studio">
    <header class="studio-header">
      <UDropdownMenu :items="projectItems" :content="{ align: 'start' }">
        <UButton color="neutral" variant="ghost" icon="i-lucide-menu" aria-label="Brand actions" class="studio-main-menu"><span class="studio-menu-label">Studio</span></UButton>
      </UDropdownMenu>
      <h1 class="sr-only">{{ draft.theme.label }} — Brand Studio</h1>
      <div class="studio-scenes" aria-label="Preview scene">
        <UPopover v-model:open="brandPickerOpen" :content="{ align: 'start' }">
          <UButton color="neutral" variant="ghost" trailing-icon="i-lucide-chevron-down" aria-label="Brand picker" class="studio-project-name"><span class="truncate">{{ draft.theme.label }}</span></UButton>
          <template #content><UCommandPalette v-model:search-term="brandSearch" :groups="brandGroups" :fuse="{ fuseOptions: { keys: ['label', 'keywords'] } }" placeholder="Search brands…" :input="brandSearchInput" class="w-80 max-w-[calc(100vw-2rem)]" :ui="{ viewport: 'max-h-[min(65dvh,28rem)]', itemDescription: 'whitespace-normal break-words text-clip overflow-visible' }" /></template>
        </UPopover>
        <USelect v-model="scene" variant="ghost" aria-label="Template" :items="[{ label: 'Components', value: 'components' }, ...templates.map(item => ({ label: item.label, value: item.id }))]" />
      </div>
      <UButton class="studio-review studio-desktop" color="neutral" variant="outline" @click="exportTab = connected ? 'changes' : 'source'; exportOpen = true">{{ connected ? 'Changes' : 'Download' }}<span v-if="dirty" class="text-muted">{{ changes.length }}</span></UButton>
      <input ref="input" type="file" accept=".json,application/json" class="sr-only" aria-label="Open brand document" @change="openDocument">
    </header>
    <UModal v-model:open="manageOpen" title="Manage brands" description="Saved in this browser. Repository files are unchanged." :ui="{ content: 'max-w-2xl' }">
      <template #body>
        <form v-if="manageTarget" class="space-y-4" @submit.prevent="saveManagedProject">
          <template v-if="manageAction === 'delete'">
            <p>Delete the local copy of <strong>{{ manageTarget.draft.theme.label }}</strong>? Its saved draft will be permanently removed.</p>
            <p class="text-sm text-muted break-words">{{ manageTarget.draft.brand.packageName || manageTarget.draft.brand.name }} · {{ new Date(manageTarget.updatedAt).toLocaleString() }}</p>
          </template>
          <UFormField v-else label="Brand name" required><UInput v-model="manageName" aria-label="Rename brand" maxlength="80" autofocus class="w-full" /></UFormField>
          <UAlert v-if="manageError" color="error" :description="manageError" />
          <div class="flex flex-wrap gap-2"><UButton color="neutral" variant="ghost" @click="manageTarget = undefined; manageError = ''">Cancel</UButton><UButton type="submit" :color="manageAction === 'delete' ? 'error' : 'primary'">{{ manageAction === 'delete' ? 'Delete local copy' : 'Save name' }}</UButton></div>
        </form>
        <div v-else class="space-y-4">
          <UInput v-model="manageSearch" icon="i-lucide-search" placeholder="Search saved brands…" aria-label="Search saved brands" class="w-full" />
          <ul class="divide-y divide-default">
            <li v-for="project in managedProjects" :key="project.id" class="py-4 space-y-3">
              <div><p class="font-medium break-words">{{ project.draft.theme.label }}<span v-if="project.id === projectId" class="text-xs text-muted ml-2">Current</span></p><p class="text-sm text-muted break-words">{{ project.draft.brand.packageName || project.draft.brand.name }} · {{ new Date(project.updatedAt).toLocaleString() }}</p></div>
              <div class="flex flex-wrap gap-2">
                <UButton color="neutral" variant="outline" @click="manageOpen = false; pickBrand(() => restore(project))">Open</UButton>
                <UButton color="neutral" variant="ghost" @click="manageProject(project, 'rename')">Rename</UButton>
                <UButton color="neutral" variant="ghost" @click="manageOpen = false; beginCreate(project.draft)">Duplicate</UButton>
                <UButton color="error" variant="ghost" @click="manageProject(project, 'delete')">Delete local copy</UButton>
              </div>
            </li>
          </ul>
          <p v-if="!managedProjects.length" class="text-sm text-muted">{{ manageSearch ? 'No matching brands.' : 'No saved brands yet.' }}</p>
        </div>
      </template>
    </UModal>
    <UModal v-model:open="createOpen" :title="createBase ? 'Duplicate brand' : 'Create brand'" description="Choose a name for your brand.">
      <template #body><form id="studio-create-brand" @submit.prevent="createBrand"><UFormField label="Name" :error="createError" required><UInput v-model="createName" aria-label="New brand name" autofocus maxlength="80" class="w-full" @update:model-value="createError = ''" /></UFormField></form></template>
      <template #footer><UButton color="neutral" variant="ghost" @click="createOpen = false">Cancel</UButton><UButton type="submit" form="studio-create-brand" :disabled="!createName.trim()">Create brand</UButton></template>
    </UModal>
    <div v-if="recovery" class="studio-notice" role="status">
      <span>A saved draft is available.</span><UButton @click="restore(recovery)">Restore draft</UButton><UButton variant="ghost" color="neutral" @click="recovery = undefined">Dismiss</UButton>
    </div>
    <UAlert v-if="error" role="alert" color="error" :description="error" :close="{ onClick: () => error = '' }" />
    <div v-if="notice" class="studio-notice" role="status">{{ notice }}<UButton variant="ghost" color="neutral" @click="notice = ''">Dismiss</UButton></div>
    <div class="studio-workspace" :class="{ 'studio-browsing': !editing, 'studio-editing': editing }">
      <div class="studio-canvas" :class="{ 'studio-comparing': compare }">
        <section v-if="compare" class="studio-frame-wrap">
          <div class="studio-frame-label">Applied <span>{{ baseline.theme.label }}</span></div>
          <StudioViewport v-slot="{ frameStyle }" v-model:width="viewportWidth" v-model:height="viewportHeight"><iframe ref="originalFrame" :key="scene" :src="frameSrc('original')" title="Original brand preview" :style="frameStyle" @load="send(originalFrame, baseline)" /></StudioViewport>
        </section>
        <section class="studio-frame-wrap">
          <div class="studio-frame-label">Draft <span>{{ draft.theme.label }}</span></div>
          <StudioViewport v-slot="{ frameStyle }" v-model:width="viewportWidth" v-model:height="viewportHeight"><iframe ref="draftFrame" :key="scene" :src="frameSrc('draft')" title="Draft brand preview" :style="frameStyle" @load="send(draftFrame, draft)" /></StudioViewport>
        </section>
      </div>
      <aside v-if="editing && !readOnly" class="studio-inspector" aria-label="Brand settings">
        <div class="studio-inspector-header">
          <h2>Customize</h2>
          <UButton icon="i-lucide-x" aria-label="Close settings" color="neutral" variant="ghost" @click="closeSettings" />
        </div>
        <UAccordion v-model="panel" :items="panels" class="studio-fields">
          <template #body="{ item: section }"><div class="studio-form-section">
          <template v-if="section.value === 'identity'">
            <UFormField :error="fieldErrors['label']" label="Brand name" ><UInput :model-value="draft.theme.label" class="w-full" @change="edit(doc => { doc.theme.label = value($event) }, 'label')" /></UFormField>
            <UFormField :error="fieldErrors['identifier']" label="Identifier" help="Lowercase letters, numbers and hyphens"><UInput :model-value="draft.brand.name" class="w-full" @change="edit(doc => { doc.brand.name = value($event); doc.theme.name = value($event) }, 'identifier')" /></UFormField>
            <UFormField :error="fieldErrors['package']" label="Package name"><UInput :model-value="draft.brand.packageName" placeholder="@example/brand" class="w-full" @change="edit(doc => { doc.brand.packageName = value($event) }, 'package')" /></UFormField>
            <UFormField :error="fieldErrors['claim']" label="Brand statement"><UTextarea :model-value="draft.brand.claim" :rows="3" class="w-full" @change="edit(doc => { doc.brand.claim = value($event) }, 'claim')" /></UFormField>
            <UFormField label="Logo"><USelect v-model="logoRole" :items="logoRoles" class="w-full" /></UFormField>
            <div v-if="currentLogo" class="rounded border border-default p-4" :class="logoRole.endsWith('Inverse') ? 'bg-gray-900' : 'bg-white'"><img :src="currentLogo.src" :alt="currentLogo.alt || 'Brand logo'" class="mx-auto max-h-16 max-w-full" ></div>
            <UFileUpload :key="logoRole" accept="image/png,image/jpeg,image/webp" label="Upload image" description="PNG, JPEG or WebP · up to 2 MB" :preview="false" @update:model-value="addLogo" />
            <UButton v-if="currentLogo" color="neutral" variant="link" @click="removeLogo">Remove image</UButton>
          </template>
          <template v-if="section.value === 'colors'">
            <UFormField v-for="role in ['primary', 'neutral']" :key="role" :label="role">
              <USelect :model-value="draft.theme.ui?.colors?.[role] || '__default'" :items="[{ label: 'Nuxt UI default', value: '__default' }, ...paletteOptions.map(value => ({ label: value, value }))]" class="w-full" @update:model-value="edit(doc => { doc.theme.ui ??= {}; doc.theme.ui.colors ??= {}; if ($event !== '__default') doc.theme.ui.colors[role] = String($event); else delete doc.theme.ui.colors[role] })" />
            </UFormField>
            <UAccordion :items="[{ label: 'More color roles', value: 'roles' }]">
              <template #body><div class="studio-form-section">
                <UFormField v-for="role in studioRoles.filter(role => !['primary', 'neutral'].includes(role))" :key="role" :label="role">
                  <USelect :model-value="draft.theme.ui?.colors?.[role] || '__default'" :items="[{ label: 'Nuxt UI default', value: '__default' }, ...paletteOptions.map(value => ({ label: value, value }))]" class="w-full" @update:model-value="edit(doc => { doc.theme.ui ??= {}; doc.theme.ui.colors ??= {}; if ($event !== '__default') doc.theme.ui.colors[role] = String($event); else delete doc.theme.ui.colors[role] })" />
                </UFormField>
              </div></template>
            </UAccordion>
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
          <template v-if="section.value === 'type'">
            <p class="studio-help">Use installed fonts or a system stack. Entering a name does not download a font.</p>
            <div v-for="role in ['sans', 'mono', 'display']" :key="role" class="space-y-2">
              <UFormField :label="role" :error="fieldErrors[`font:${role}`]"><UInput :model-value="draft.theme.typography?.[role] || draft.brand.typography?.[role] || ''" placeholder="system-ui, sans-serif" class="w-full" @change="font(role, value($event))" /></UFormField>
              <USelect :aria-label="`${role} preset`" placeholder="Choose a font preset" :items="fontPresets" class="w-full" @update:model-value="font(role, String($event))" />
              <p class="rounded border border-default p-3 text-xl" :style="{ fontFamily: draft.theme.typography?.[role] || draft.brand.typography?.[role] || 'inherit' }">The quick brown fox. 0123456789</p>
            </div>
          </template>
          <template v-if="section.value === 'details'">
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
      </template></UAccordion>
        <p class="studio-inspector-footer" role="status">{{ saveStatus }}<span v-if="needsExport"> · Not exported</span></p>
      </aside>
    </div>
    <div class="studio-toolbar" role="toolbar" aria-label="Brand tools">
      <div class="studio-dock-settings">
        <UTooltip text="Undo"><UButton class="studio-desktop" icon="i-lucide-undo-2" aria-label="Undo change" color="neutral" variant="ghost" :disabled="!history.length" @click="undo" /></UTooltip>
        <UTooltip text="Redo"><UButton class="studio-desktop" icon="i-lucide-redo-2" aria-label="Redo change" color="neutral" variant="ghost" :disabled="!future.length" @click="redo" /></UTooltip>
        <UButton ref="customizeButton" color="neutral" :variant="editing ? 'soft' : 'ghost'" icon="i-lucide-sliders-horizontal" :aria-pressed="editing" @click="customize">{{ readOnly ? 'Create brand' : editing ? 'Preview' : 'Customize' }}</UButton>
      </div>
      <div class="studio-toolbar-end studio-desktop">
        <UTooltip text="Compare applied and draft"><UButton icon="i-lucide-columns-2" aria-label="Compare applied brand" :aria-pressed="compare" color="neutral" :variant="compare ? 'soft' : 'ghost'" @click="compare = !compare" /></UTooltip>
        <StudioViewportControls v-model:width="viewportWidth" v-model:height="viewportHeight" />
        <USelect v-model="preference" aria-label="Color mode" :items="[{ label: 'System', value: 'system' }, { label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }]" />
      </div>
      <UPopover v-model:open="previewOptionsOpen">
        <UButton color="neutral" variant="ghost" icon="i-lucide-settings-2" label="View" />
        <template #content>
          <div class="flex w-64 flex-col gap-4 p-4">
            <div class="studio-view-mobile flex flex-col gap-4"><UCheckbox v-model="compare" label="Compare applied brand" />
            <StudioViewportControls v-model:width="viewportWidth" v-model:height="viewportHeight" />
            <USelect v-model="preference" aria-label="Color mode" :items="[{ label: 'System', value: 'system' }, { label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }]" />
            </div><USelect v-if="scene === 'components'" v-model="state" aria-label="Preview state" :items="[{ label: 'Default', value: 'default' }, { label: 'Validation error', value: 'error' }]" />
            <UButton color="neutral" variant="outline" icon="i-lucide-link" @click="shareView">Copy view link</UButton>
          </div>
        </template>
      </UPopover>
    </div>
    <UModal :open="!!pending" title="Replace this draft?" description="Export your changes first if you want to keep them." @update:open="pending = null"><template #footer><UButton color="neutral" variant="outline" @click="pending = null">Keep editing</UButton><UButton @click="acceptReplacement">Replace draft</UButton></template></UModal>
    <UModal v-model:open="exportOpen" :title="connected ? 'Review changes' : 'Download brand'" :ui="{ content: 'max-w-4xl' }">
      <template #body>
        <p class="mb-4 text-sm text-muted">{{ connected ? 'Apply to the connected project source.' : 'Download a source document or a new Nuxt brand layer.' }} <code v-if="connected">{{ sourcePath }}</code></p>
        <UAlert v-if="sourceConflict" color="warning" title="Source changed" description="Your draft is preserved. Download it before reopening the project to resolve the conflict." class="mb-4" />
        <div v-if="exportTab === 'changes'" class="mb-4 divide-y divide-default">
          <p v-if="!changes.length" class="text-sm text-muted">No changes to apply.</p>
          <div v-for="change in changes" :key="change.path" class="py-2 text-sm"><code>{{ change.path }}</code><div class="mt-1 break-all text-muted">{{ change.before ?? 'Inherited' }} → {{ change.after ?? 'Inherited' }}</div></div>
        </div>
        <div class="mb-4 flex gap-2"><UButton v-for="item in ['source', 'changes', 'css']" :key="item" color="neutral" :variant="exportTab === item ? 'soft' : 'ghost'" :aria-pressed="exportTab === item" @click="exportTab = item">{{ item === 'css' ? 'CSS' : item === 'source' ? 'Source' : 'Changes' }}</UButton></div>
        <pre v-if="exportTab !== 'changes'" class="studio-export-code">{{ output }}</pre>
        <p class="mt-4 text-sm text-muted">A new project includes a Nuxt brand layer and Studio. Custom fonts, Vue components and capabilities must be added separately.</p>
        <p v-if="error" role="alert" class="mt-4 text-sm text-error">{{ error }}</p>
      </template>
      <template #footer><UButton v-if="connected" :loading="busySource" :disabled="!dirty || sourceConflict || Object.keys(fieldErrors).length > 0" @click="applySource">Apply changes</UButton><UButton color="neutral" variant="outline" @click="exportSource">Download source</UButton><UButton color="neutral" variant="outline" :loading="busy" @click="exportProject">Download new project</UButton></template>
    </UModal>
  </main>
</template>

<style>
body.id-studio-page { margin: 0; overflow: hidden; }
</style>
<style scoped>
.studio-shell { box-sizing: border-box; height: 100dvh; max-width: 1680px; margin: auto; padding: 0 20px 12px; display: flex; flex-direction: column; gap: 10px; background: var(--ui-bg); color: var(--ui-text); }
.studio-header { flex: none; min-height: 56px; display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 12px; }.studio-project-name { min-width: 0; max-width: 100%; justify-self: start; }.studio-review { justify-self: end; }
.studio-main-menu { justify-self: start; }
.studio-wordmark { display: flex; align-items: baseline; font-size: 30px; font-weight: 750; letter-spacing: -.06em; color: var(--ui-text-highlighted); }
.studio-dot { color: var(--ui-primary); }

.studio-scenes { display: flex; align-items: center; gap: 8px; margin: auto; min-width: 0; max-width: 60vw; }.studio-scenes > * { max-width: 240px; min-width: 0; }
.studio-project-menu, .studio-mobile-control, .studio-view-mobile { display: none; }
.studio-actions { display: flex; align-items: center; gap: 6px; }
.studio-toolbar { flex: none; display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 8px; border: 1px solid var(--ui-border); border-radius: 16px; }
.studio-toolbar-end, .studio-dock-settings { display: flex; gap: 8px; align-items: center; }
.studio-workspace { flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 12px; }.studio-browsing { grid-template-columns: minmax(0, 1fr); }
.studio-canvas { display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; min-width: 0; min-height: 0; }.studio-comparing { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.studio-frame-wrap { min-width: 0; min-height: 0; display: flex; flex-direction: column; align-items: center; }.studio-frame-label { display: none; }.studio-comparing .studio-frame-label { display: flex; justify-content: space-between; align-self: stretch; padding: 0 6px 6px; font-size: 11px; }.studio-frame-label span { color: var(--ui-text-muted); }
iframe { display: block; width: 100%; flex: 1; min-height: 0; border: 0; border-radius: 18px; background: var(--ui-bg); box-shadow: inset 0 0 0 1px var(--ui-border); }
.studio-inspector { display: flex; flex-direction: column; border: 1px solid var(--ui-border); border-radius: 16px; min-width: 0; min-height: 0; overflow: hidden; background: var(--ui-bg); }
.studio-inspector-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 12px; font-size: 14px; font-weight: 600; border-bottom: 1px solid var(--ui-border); }
.studio-fields { flex: 1; min-height: 0; padding: 0 16px; overflow-y: auto; overscroll-behavior: contain; }.studio-form-section { display: flex; flex-direction: column; gap: 16px; padding-bottom: 16px; }
.studio-help { font-size: 12px; line-height: 1.6; color: var(--ui-text-muted); }.studio-inspector-footer { border-top: 1px solid var(--ui-border); padding: 12px 16px; font-size: 11px; color: var(--ui-text-muted); }
.studio-code { font-size: 11px; overflow: auto; max-height: 280px; margin-top: 12px; }.studio-notice { flex: none; max-height: 100px; overflow: auto; display: flex; gap: 12px; align-items: center; padding: 8px 12px; font-size: 13px; }
.studio-export-code { max-height: 45vh; overflow: auto; padding: 20px; border-radius: 8px; background: var(--ui-bg-muted); font-size: 12px; }
@media (max-width: 1100px) { .studio-toolbar { flex-wrap: wrap; }.studio-workspace { grid-template-columns: minmax(0, 1fr) 280px; }.studio-browsing { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 700px) {
  .studio-shell { padding: 0 8px 8px; gap: 8px; }.studio-header { min-height: 48px; gap: 8px; }.studio-wordmark { font-size: 26px; }.studio-scenes { flex: 1; justify-content: center; gap: 4px; }.studio-scenes > * { min-width: 0; max-width: 130px; }.studio-project-actions { display: none; }.studio-project-menu { display: inline-flex; flex: none; }
  .studio-workspace { position: relative; display: flex; }.studio-canvas { flex: 1; }.studio-inspector { position: absolute; z-index: 2; inset: 0 0 0 auto; width: min(320px, 100%); box-shadow: -12px 0 36px #0002; }
  .studio-view-mobile { display: flex; }.studio-mobile-control { display: inline-flex; }.studio-desktop { display: none; }.studio-toolbar { flex-wrap: nowrap; justify-content: space-between; }.studio-dock-settings { width: 100%; }.studio-dock-settings > * { flex: 1; justify-content: center; }.studio-toolbar-end { width: 100%; flex-wrap: wrap; justify-content: space-between; }.studio-comparing { grid-template-columns: minmax(0, 1fr); grid-template-rows: repeat(2, minmax(0, 1fr)); }
}
</style>

<style scoped>
@media (max-width: 900px) {
  .studio-workspace.studio-editing { display: flex; }
  .studio-editing .studio-canvas { display: none; }
  .studio-inspector { position: static; width: 100%; flex: 1; box-shadow: none; }
}
@media (max-width: 700px) {
  .studio-header { grid-template-columns: auto minmax(0, 1fr); }
  .studio-scenes { margin: 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); max-width: none; }
  .studio-scenes > * { width: 100%; max-width: none; }
  .studio-dock-settings { width: auto; }
}
@media (max-width: 480px) { .studio-menu-label { display: none; } }
</style>
