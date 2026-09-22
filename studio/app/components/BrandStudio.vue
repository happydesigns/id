<script setup lang="ts">
import { useStudioFrames } from '../composables/useStudioFrames'
import { useStudioProjects } from '../composables/useStudioProjects'
import { download, exportStudioProject } from '../../export'
import { useStudioHistory } from '../composables/useStudioHistory'
import { useStudioIcon } from '../../playground-icons'

import { computed, nextTick, onBeforeUnmount, onMounted, readonly, ref, watch } from 'vue'
import StudioThemeEditor from './StudioThemeEditor.vue'
import StudioTemplatePicker from './StudioTemplatePicker.vue'
import StudioColorMode from './StudioColorMode.vue'
import StudioAskAi from './StudioAskAi.vue'
import StudioEditorPanel from './StudioEditorPanel.vue'
import StudioControlGroup from './StudioControlGroup.vue'
import { editorCategories } from '../../editor-categories'
import { themeIcons, type ThemeIcons } from '../../icon-sets'
import StudioBrandThumbnail from './StudioBrandThumbnail.vue'
import { copyConfig, previewUi, studioShellCss } from '../../preview'
import StudioViewport from './StudioViewport.vue'
import StudioViewportControls from './StudioViewportControls.vue'
import { createBlankStudioDocument, createStudioDocument, createStudioProject, diffStudioDocuments, parseStudioDocument, studioDocumentMaxBytes } from '../../../src/studio'
import { nuxtUiBrandTheme } from '../../../themes/nuxt-ui'
import { parseStudioSession, contrastRatio } from '../../editor'
import type { StudioSession } from '../../editor'
import { studioTemplates, withinStudioRoute } from '../../templates'
import type { StudioDocument } from '../../../src/studio'
import type { StudioHostConfig } from '../../../src/studio-host'

useHead({ bodyAttrs: { class: 'id-studio-page' } })
const route = useRoute()
const router = useRouter()
const config = useAppConfig() as unknown as { idStudio?: StudioHostConfig }
const productName = config.idStudio?.host?.name || 'happydesigns/id'
const productSlash = productName.lastIndexOf('/')
const productPrefix = productSlash < 0 ? '' : productName.slice(0, productSlash)
const productSuffix = productSlash < 0 ? productName : productName.slice(productSlash)
const productWordmark = config.idStudio?.host?.logo?.kind === 'wordmark'
const seed = config.idStudio?.document ? parseStudioDocument(config.idStudio.document) : createBlankStudioDocument()
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}
const baseline = ref(clone(seed))
const draft = ref(clone(seed))
const shellConfig = useAppConfig()
const hostUi = copyConfig(shellConfig.ui)
const hostRuntime = useNuxtApp().$brandTheme as { currentTheme?: { value?: { ui?: Record<string, unknown> } } } | undefined
const hostSeedUi = copyConfig(hostRuntime?.currentTheme?.value?.ui ?? seed.theme.ui ?? {})
const shellTheme = ref('')
useHead({ style: [{ key: 'id-studio-shell-theme', textContent: shellTheme }] })
const templates = studioTemplates(config.idStudio?.templates)
const scene = ref(typeof route.query.view === 'string' && templates.some(item => item.id === route.query.view) ? route.query.view : 'components')
const selectedTemplate = computed(() => templates.find(item => item.id === scene.value))
const paths = ref<Record<string, string>>({})
const previewPath = computed(() => selectedTemplate.value?.routePrefix && withinStudioRoute(paths.value[scene.value], selectedTemplate.value.routePrefix) ? paths.value[scene.value] : selectedTemplate.value?.route)
const previewRuntime = computed(() => selectedTemplate.value?.route ? scene.value : '__builtin')
const cachedRuntimes = ref([previewRuntime.value])
watch(previewRuntime, (runtime) => {
  // Reordering live iframe elements reloads their documents in browsers.
  if (!cachedRuntimes.value.includes(runtime)) cachedRuntimes.value = [...cachedRuntimes.value, runtime].slice(-3)
}, { flush: 'sync' })
function frameSrc(frame: string, runtime: string) {
  const template = templates.find(item => item.id === runtime)
  return template?.route ? `${template.route}?idPreview=${runtime}&frame=${frame}` : `/studio/preview?frame=${frame}`
}
const templatePage = ref(selectedTemplate.value?.pages.find(page => page.id === route.query.page)?.id || selectedTemplate.value?.pages[0]?.id || 'home')
watch(scene, () => {
  templatePage.value = selectedTemplate.value?.pages[0]?.id || 'home'
}, { flush: 'sync' })
const colorMode = useColorMode()
const preference = ref<'light' | 'dark' | 'system'>(route.query.mode === 'dark' ? 'dark' : route.query.mode === 'light' ? 'light' : 'system')
const mode = computed<'light' | 'dark'>(() => preference.value === 'system' ? colorMode.value === 'dark' ? 'dark' : 'light' : preference.value)
const previewZoom = ref(1)
const state = ref(route.query.state === 'error' ? 'error' : 'default')
const compare = ref(route.query.compare === 'true')
function viewportDimension(value: unknown, fallback: number) {
  const number = Number(value)
  return Number.isInteger(number) && number >= 240 && number <= 3840 ? number : fallback
}
const viewportWidth = ref(viewportDimension(route.query.width, route.query.mobile === 'true' ? 390 : 0))
const viewportHeight = ref(viewportDimension(route.query.height, 844))
const editing = ref(typeof route.query.editor === 'string' || route.query.browse === 'false')
const editorPinned = ref(route.query.docked === 'true')
type EditorCategory = typeof editorCategories[number]['value']
function editorCategory(value: unknown): EditorCategory {
  return ['details', 'components'].includes(String(value)) ? 'styles' : editorCategories.some(item => item.value === value) ? value as EditorCategory : 'colors'
}
const panel = ref(editorCategory(route.query.editor))
const editorHeading = ref<HTMLElement>()
const editorBusy = ref(false)
let editorTrigger: HTMLElement | undefined
const error = ref('')
const notice = ref('')
const toast = useToast()
watch(notice, (message) => {
  if (!message) return
  toast.add({ id: 'studio-status', description: message, color: 'neutral' })
  notice.value = ''
})
watch(error, (message) => {
  if (message) toast.add({ id: 'studio-error', description: message, color: 'error' })
  else toast.remove('studio-error')
})
const exportOpen = ref(false)
const askAiOpen = ref(false)
const exportTab = ref('changes')
const codeFormat = ref('source')
const busy = ref(false)
const pending = ref<(() => void) | null>(null)
const leaving = ref<((leave: boolean) => void) | null>(null)
function finishLeaving(leave: boolean) {
  const resolve = leaving.value
  leaving.value = null
  resolve?.(leave)
}
onBeforeRouteLeave(() => {
  if (!needsExport.value || storedLocally.value) return true
  return new Promise<boolean>((resolve) => {
    leaving.value = resolve
  })
})
const input = ref<HTMLInputElement>()
const storageReady = ref(false)
const { originalFrame, draftFrame, cacheFrame, loadedFrames, failedFrames, previewAttempt, retryPreview, frameLoaded } = useStudioFrames(previewRuntime, scene, compare, storageReady, send)
const { history, future, record, undo: undoDocument, redo: redoDocument, clear: clearHistory } = useStudioHistory(draft)
const recovery = ref<StudioSession>()
watch(recovery, (session) => {
  if (!session) {
    toast.remove('studio-recovery')
    return
  }
  toast.add({ id: 'studio-recovery', title: 'An older draft is available', description: session.draft.theme.label, duration: 0, actions: [{ label: 'Open draft', onClick: () => restore(session) }] })
})
const { projects, listProjects, saveProject, deleteProject } = useStudioProjects(notice)
const brandPickerOpen = ref(false)
const templatePickerOpen = ref(false)
const brandSearch = ref('')
const brandSearchInput = { 'placeholder': 'Search brands…', 'aria-label': 'Search brands' }
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
      deleteProject(project.id)
      if (localStorage.getItem(lastProjectKey) === project.id) localStorage.removeItem(lastProjectKey)
      if (recovery.value?.id === project.id) recovery.value = undefined
      if (projectId.value === project.id) {
        storedLocally.value = false
        replace(catalog.find(item => item.key === 'nuxt-ui')!.document, 'nuxt-ui')
      }
    }
    else {
      const name = manageName.value.trim()
      if (!name || name.length > 80) {
        manageError.value = 'Enter a name of 1–80 characters.'
        return
      }
      if ([...catalog.map(item => item.document.theme.label), ...projects.value.filter(item => item.id !== project.id).map(item => item.draft.theme.label)].some(label => label.trim().toLocaleLowerCase() === name.toLocaleLowerCase())) {
        manageError.value = 'A brand with this name already exists.'
        return
      }
      const renamed = clone(project)
      renamed.draft.theme.label = name
      renamed.updatedAt = Date.now()
      saveProject(renamed)
      if (recovery.value?.id === project.id) recovery.value = renamed
      if (projectId.value === project.id) edit((doc) => {
        doc.theme.label = name
      })
    }
    listProjects()
    manageTarget.value = undefined
  }
  catch {
    manageError.value = 'Browser storage is unavailable. Please try again.'
  }
}
const exported = ref<StudioDocument>()
const projectId = ref('')
const storedLocally = ref(false)
const fieldErrors = ref<Record<string, string>>({})
const previewOptionsOpen = ref(false)
const bodyContrast = ref<number>()
const writerToken = useRuntimeConfig().public.idStudioWriterToken as string | undefined
const catalogPrefix = `${seed.brand.packageName || seed.brand.name}::`
const isBaselineHost = !writerToken && seed.brand.name === 'nuxt-ui'
const catalog = [
  { key: 'nuxt-ui', document: createStudioDocument({ name: 'nuxt-ui', colors: {} }, nuxtUiBrandTheme) },
  ...isBaselineHost ? [] : [{ key: 'host', document: seed }],
  ...Object.entries(config.idStudio?.brands ?? {}).map(([key, document]) => ({ key: `brand:${key}`, document: parseStudioDocument(document) })),
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
function removeLogo() {
  edit((doc) => {
    if (doc.brand.assets?.logos) Reflect.deleteProperty(doc.brand.assets.logos, logoRole.value)
  })
}
const logoRoles = [{ label: 'Wordmark · light', value: 'wordmark' }, { label: 'Wordmark · dark', value: 'wordmarkInverse' }, { label: 'Symbol · light', value: 'logo' }, { label: 'Symbol · dark', value: 'logoInverse' }]
function brandAction(action: () => void) {
  brandPickerOpen.value = false
  action()
}
const brandActions = computed(() => [
  [{ label: 'Create new brand', icon: resolveIcon('i-lucide-plus'), onSelect: () => brandAction(() => beginCreate()) }, { label: 'Import brand', icon: resolveIcon('i-lucide-folder-open'), onSelect: () => brandAction(() => input.value?.click()) }, { label: 'Duplicate brand', icon: resolveIcon('i-lucide-copy'), onSelect: () => brandAction(() => beginCreate(draft.value)) }, { label: 'Manage brands', icon: resolveIcon('i-lucide-library'), onSelect: () => brandAction(openManager) }],
  [{ label: 'Reset appearance…', icon: resolveIcon('i-lucide-rotate-ccw'), disabled: readOnly.value || !dirty.value, onSelect: () => brandAction(() => {
    resetOpen.value = true
  }) }, { label: 'Open connected project', icon: resolveIcon('i-lucide-folder-sync'), disabled: !writerToken, onSelect: () => brandAction(() => guard(() => loadSource(true))) }],
])
function brandDescription(doc: StudioDocument) {
  return doc.brand.packageName && doc.brand.packageName !== '@example/brand' ? doc.brand.packageName : 'Local brand'
}
const brandGroups = computed(() => [
  { id: 'brands', label: 'Brands', items: catalog.map((item) => {
    const key = catalogPrefix + item.key
    const saved = projects.value.find(project => project.catalogKey === key)
    return { document: key === catalogKey.value ? draft.value : saved?.draft || item.document, label: key === catalogKey.value ? draft.value.theme.label : saved?.draft.theme.label || item.document.theme.label, icon: key === catalogKey.value ? 'i-lucide-check' : 'i-lucide-palette', description: item.key === 'nuxt-ui' ? 'Starting point' : key === catalogKey.value && connected.value ? 'Connected project' : saved ? 'Browser draft · ' + (item.document.brand.packageName || item.document.brand.name) : 'Configured brand · ' + (item.document.brand.packageName || item.document.brand.name), keywords: item.document.brand.packageName, onSelect: () => pickBrand(() => selectCatalog(item.key)) }
  }) },
  { id: 'local', label: 'Saved in this browser', items: projects.value.filter(project => !catalog.some(item => project.catalogKey === catalogPrefix + item.key)).map(project => ({ document: project.id === projectId.value ? draft.value : project.draft, label: project.draft.theme.label, description: brandDescription(project.id === projectId.value ? draft.value : project.draft), icon: project.id === projectId.value ? 'i-lucide-check' : 'i-lucide-palette', keywords: project.draft.brand.packageName, onSelect: () => pickBrand(() => restore(project)) })) },
])
const brandMenuItems = computed(() => {
  const search = brandSearch.value.trim().toLocaleLowerCase()
  const groups = brandGroups.value.map((group) => {
    const items = group.items.filter(item => [item.label, item.description, item.keywords].some(value => value?.toLocaleLowerCase().includes(search)))
    return items.length ? [{ type: 'label' as const, label: group.label }, ...items.map(item => ({ ...item, icon: undefined, slot: 'brand' as const, checked: item.icon === 'i-lucide-check' }))] : []
  }).filter(group => group.length)
  return [...groups, [
    ...(!readOnly.value
      ? [{ label: 'Brand settings', icon: resolveIcon('i-lucide-fingerprint'), onSelect: () => {
          brandPickerOpen.value = false
          openEditor('identity')
        } }]
      : []),
    { label: 'Manage brand', icon: resolveIcon('i-lucide-ellipsis'), children: brandActions.value },
  ]]
})
function beginCreate(base?: StudioDocument) {
  createBase.value = base ? clone(base) : undefined
  createName.value = base ? `${base.theme.label} copy` : ''
  createError.value = ''
  createOpen.value = true
}
function createBrand() {
  const name = createName.value.trim()
  if (!name) {
    createError.value = 'Give your brand a name.'
    return
  }
  if (name.length > 80) {
    createError.value = 'Use 80 characters or fewer.'
    return
  }
  const existing = [...catalog.map(item => item.document.theme.label), ...projects.value.map(project => project.draft.theme.label)]
  if (existing.some(label => label.trim().toLocaleLowerCase() === name.toLocaleLowerCase())) {
    createError.value = 'A brand with this name already exists. Choose a different name.'
    return
  }
  const doc = clone(createBase.value || createBlankStudioDocument())
  doc.theme.label = name
  if (!createBase.value) {
    const identifier = name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'brand'
    doc.brand.name = identifier
    doc.brand.packageName = `@${identifier}/brand`
  }
  createOpen.value = false
  guard(() => {
    persist()
    replace(doc)
    editing.value = true
  })
}
function pickBrand(action: () => void) {
  brandPickerOpen.value = false
  brandSearch.value = ''
  guard(() => {
    persist()
    action()
  })
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
watch([editing, panel, editorPinned], () => {
  if (applyingQuery) return
  if (storageReady.value) router.replace({ query: { ...route.query, browse: editing.value ? undefined : 'true', editor: editing.value ? panel.value : undefined, docked: editorPinned.value ? 'true' : undefined } })
})
function openEditor(category: string, event?: Event) {
  editorTrigger = event?.currentTarget as HTMLElement | undefined
  panel.value = editorCategory(category)
  if (readOnly.value) {
    beginCreate()
    return
  }
  editing.value = true
  nextTick(() => editorHeading.value?.focus())
}
function customize() {
  if (readOnly.value) beginCreate()
  else if (editing.value) closeSettings()
  else openEditor(panel.value)
}
const panels = computed(() => editorCategories.map(item => ({ ...item, icon: resolveIcon(item.icon) })))
function title(value: string) {
  return value.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ').replace(/^./, letter => letter.toUpperCase())
}
function changeLabel(path: string) {
  if (path.startsWith('theme.ui.colors.')) return `${title(path.slice('theme.ui.colors.'.length))} color`
  return ({ 'theme.label': 'Brand name', 'brand.name': 'Identifier', 'brand.packageName': 'Package name', 'brand.claim': 'Brand statement' } as Record<string, string>)[path] || title(path.split('.').slice(-2).join(' · '))
}
function changeValue(value: unknown) {
  return value == null ? 'Inherited' : typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)
}
const changes = computed(() => diffStudioDocuments(baseline.value, draft.value))
const dirty = computed(() => changes.value.length > 0)
const storageKey = `id-studio:1:${seed.brand.packageName || seed.brand.name}`
const lastProjectKey = `${storageKey}:active`
const needsExport = computed(() => diffStudioDocuments(exported.value || baseline.value, draft.value).length > 0)
const sourcePath = computed(() => draft.value.brand.name === seed.brand.name ? config.idStudio?.sourcePath || 'brand.studio.json' : 'brand.studio.json')
const output = computed(() => exportTab.value === 'changes' ? JSON.stringify(changes.value, null, 2) : codeFormat.value === 'css' ? createStudioProject(draft.value)['app/assets/css/brand.css'] : JSON.stringify(draft.value, null, 2))
function setEditorBusy(value: boolean) {
  editorBusy.value = value
}
function notifyEditor(message: string) {
  notice.value = message
}
function reportError(message: string, field?: string) {
  if (field) {
    if (message) fieldErrors.value[field] = message
    else Reflect.deleteProperty(fieldErrors.value, field)
  }
  else error.value = message
}
function edit(change: (doc: StudioDocument) => void, field?: string) {
  if (readOnly.value) return
  try {
    const next = clone(draft.value)
    change(next)
    applyDraft(next, field)
  }
  catch (cause) {
    reportError(cause instanceof Error ? cause.message : 'This value could not be applied.', field)
  }
}
function applyDraft(document: StudioDocument, field?: string): boolean {
  if (readOnly.value) return false
  if (field) Reflect.deleteProperty(fieldErrors.value, field)
  try {
    const next = parseStudioDocument(document)
    if (next.theme.label !== draft.value.theme.label) {
      const name = next.theme.label.trim()
      if (!name || name.length > 80) throw new Error('Enter a name of 1–80 characters.')
      const labels = [...catalog.filter(item => catalogPrefix + item.key !== catalogKey.value).map(item => item.document.theme.label), ...projects.value.filter(item => item.id !== projectId.value).map(item => item.draft.theme.label)]
      if (labels.some(label => label.trim().toLocaleLowerCase() === name.toLocaleLowerCase())) throw new Error('A brand with this name already exists.')
      next.theme.label = name
    }
    if (!diffStudioDocuments(draft.value, next).length) return true
    record()
    draft.value = next
    error.value = ''
    return true
  }
  catch (cause) {
    const message = cause instanceof Error ? cause.message : 'This value could not be applied.'
    reportError(message, field)
    return false
  }
}
function undo() {
  fieldErrors.value = {}
  undoDocument()
}
function redo() {
  fieldErrors.value = {}
  redoDocument()
}
const resetOpen = ref(false)
const randomScope = ref('all')
const randomScopeKey = 'id-studio:randomizer-scope'
function selectRandomScope(value: string) {
  randomScope.value = value
  try {
    localStorage.setItem(randomScopeKey, value)
  }
  catch { /* Optional UI preference; brand saving is independent. */ }
}
const randomScopes = computed(() => [{ label: 'Entire look', value: 'all', icon: resolveIcon('i-lucide-sparkles') }, ...panels.value.filter(item => item.randomScope).map(item => ({ label: item.label, value: item.randomScope!, icon: item.icon }))])
function pick(values: string[], current?: string) {
  const alternatives = values.filter(value => value !== current)
  return alternatives[Math.floor(Math.random() * alternatives.length)] || current || values[0]!
}
function randomize() {
  edit((doc) => {
    if (['colors', 'all'].includes(randomScope.value)) {
      doc.theme.ui ??= {}
      doc.theme.ui.colors ??= {}
      for (const [role, options] of Object.entries({ primary: ['blue', 'violet', 'rose', 'teal', 'orange', 'emerald', 'indigo'], neutral: ['slate', 'gray', 'zinc', 'neutral', 'stone', 'mauve', 'olive', 'mist', 'taupe'] })) {
        doc.theme.ui.colors[role] = pick(options, doc.theme.ui.colors[role])
      }
    }
    if (['typography', 'all'].includes(randomScope.value)) {
      doc.theme.typography ??= {}
      doc.brand.typography ??= {}
      const sans = pick(['system-ui, sans-serif', 'Arial, sans-serif', 'Verdana, sans-serif'], doc.theme.typography.sans || doc.brand.typography.sans)
      const display = pick(['system-ui, sans-serif', 'Georgia, serif', 'Arial, sans-serif'], doc.theme.typography.display || doc.brand.typography.display)
      Object.assign(doc.theme.typography, { sans, display, mono: 'ui-monospace, monospace' })
      Object.assign(doc.brand.typography, doc.theme.typography)
    }
    if (['icons', 'all'].includes(randomScope.value)) {
      doc.theme.ui ??= {}
      const current = Object.keys(themeIcons).find(key => themeIcons[key as ThemeIcons].search === documentIcons(doc)?.search) || 'lucide'
      doc.theme.ui.icons = { ...themeIcons[pick(Object.keys(themeIcons), current) as ThemeIcons] }
    }
    if (['styles', 'all'].includes(randomScope.value)) {
      doc.theme.ui ??= {}
      const button = (doc.theme.ui.button ?? {}) as Record<string, unknown>
      const defaults = (button.defaultVariants ?? {}) as Record<string, unknown>
      doc.theme.ui.button = {
        ...button,
        defaultVariants: { ...defaults, variant: pick(['solid', 'outline', 'soft', 'subtle'], String(defaults.variant || 'solid')) },
      }
      doc.theme.cssVariables ??= {}
      for (const appearanceMode of ['light', 'dark'] as const) {
        doc.theme.cssVariables[appearanceMode] ??= {}
        doc.theme.cssVariables[appearanceMode]['--ui-radius'] = pick(['0rem', '0.25rem', '0.375rem', '0.5rem'], doc.theme.cssVariables[appearanceMode]['--ui-radius'])
      }
    }
  })
}
function reset() {
  edit((doc) => {
    for (const key of ['ui', 'typography', 'cssVariables'] as const) {
      Reflect.deleteProperty(doc.theme, key)
      if (baseline.value.theme[key]) Object.assign(doc.theme, { [key]: clone(baseline.value.theme[key]) })
    }
    delete doc.brand.typography
    if (baseline.value.brand.typography) doc.brand.typography = clone(baseline.value.brand.typography)
  })
  fieldErrors.value = {}
  resetOpen.value = false
}
function replace(doc: StudioDocument, key?: string) {
  persistPristine.value = !key
  connected.value = false
  catalogKey.value = key ? catalogPrefix + key : undefined
  sourceConflict.value = false
  baseline.value = clone(doc)
  draft.value = clone(doc)
  clearHistory()
  error.value = ''
  editing.value = !readOnly.value && (typeof route.query.editor === 'string' || route.query.browse === 'false')
  exported.value = undefined
  fieldErrors.value = {}
  projectId.value = crypto.randomUUID()
  recovery.value = undefined
  persist()
  if (key && storageReady.value) {
    try {
      localStorage.setItem(lastProjectKey, `catalog:${key}`)
    }
    catch {
      notice.value = 'The selected brand could not be remembered in this browser.'
    }
  }
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
    else {
      baseline.value = clone(doc)
      draft.value = clone(doc)
    }
  }
  catch {
    notice.value = 'The local project is unavailable. Your draft can still be downloaded.'
  }
  finally {
    busySource.value = false
  }
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
  }
  catch (cause) {
    sourceConflict.value = (cause as { status?: number }).status === 409 || (cause as { statusCode?: number }).statusCode === 409
    error.value = sourceConflict.value ? 'The project changed outside Studio. Download your draft or reopen the connected project before applying changes.' : 'The source could not be saved. Your draft is still available.'
  }
  finally {
    busySource.value = false
  }
}
function dismissEditor() {
  if (editing.value && !editorPinned.value && !editorBusy.value) editing.value = false
}

function closeSettings() {
  editing.value = false
  restoreEditorFocus()
}
function restoreEditorFocus() {
  nextTick(() => {
    const trigger = editorTrigger?.isConnected && editorTrigger.offsetParent ? editorTrigger : customizeButton.value?.$el
    if (trigger?.offsetParent) trigger.focus()
    else (window.document.querySelector<HTMLButtonElement>(`.studio-categories button[data-editor-category="${panel.value}"]`) || window.document.querySelector<HTMLButtonElement>('[aria-label="Brand picker"]'))?.focus()
  })
}
function guard(action: () => void) {
  if (needsExport.value && !storedLocally.value) pending.value = action
  else action()
}
function acceptReplacement() {
  const action = pending.value
  pending.value = null
  action?.()
}
function value(event: Event) {
  return (event.target as HTMLInputElement).value
}
async function openDocument(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    if (file.size > studioDocumentMaxBytes) throw new Error('Choose a brand document smaller than 8 MB.')
    const doc = parseStudioDocument(await file.text())
    guard(() => replace(doc))
  }
  catch {
    error.value = file.size > studioDocumentMaxBytes ? 'Choose a brand document smaller than 8 MB.' : 'This file is not a valid brand document. Choose a Studio source JSON file.'
  }
  finally {
    if (input.value) input.value.value = ''
  }
}
async function addLogo(file: File | null | undefined) {
  if (!file) return
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 2_000_000) {
    error.value = 'Choose a PNG, JPEG or WebP smaller than 2 MB.'
    return
  }
  const role = logoRole.value
  const reader = new FileReader()
  reader.onerror = () => {
    error.value = 'The image could not be read.'
  }
  reader.onload = () => edit((doc) => {
    doc.brand.assets ??= {}
    doc.brand.assets.logos ??= {}
    doc.brand.assets.logos[role] = { name: file.name, role, media: role.endsWith('Inverse') ? 'dark' : 'light', alt: doc.theme.label, src: String(reader.result) }
  })
  reader.readAsDataURL(file)
}
function send(frame: HTMLIFrameElement | undefined, doc: StudioDocument) {
  if (!frame?.contentDocument) return
  frame.contentWindow?.postMessage({ type: 'id-studio-preview', document: clone(doc), scene: scene.value, page: templatePage.value, path: previewPath.value, mode: mode.value, preference: preference.value, state: state.value }, window.location.origin)
}
function refresh() {
  send(originalFrame.value, baseline.value)
  send(draftFrame.value, draft.value)
}
function ready(event: MessageEvent) {
  if (event.origin !== window.location.origin) return
  if (event.source !== originalFrame.value?.contentWindow && event.source !== draftFrame.value?.contentWindow) return
  if (event.data?.type === 'id-studio-pointer') {
    brandPickerOpen.value = false
    templatePickerOpen.value = false
    previewOptionsOpen.value = false
    dismissEditor()
    return
  }
  if (event.data?.type === 'id-studio-rendered') {
    failedFrames.value[event.source === originalFrame.value?.contentWindow ? 'original' : 'draft'] = false
    loadedFrames.value[event.source === originalFrame.value?.contentWindow ? 'original' : 'draft'] = true
    return
  }
  if (event.data?.type === 'id-studio-colors' && event.source === draftFrame.value?.contentWindow) {
    bodyContrast.value = contrastRatio(String(event.data.foreground), String(event.data.background))
    return
  }
  if (event.data?.type === 'id-studio-navigate') {
    if (event.data.scene === scene.value && selectedTemplate.value?.pages.some(page => page.id === event.data.page)) templatePage.value = event.data.page
    if (event.data.scene === scene.value && selectedTemplate.value?.routePrefix && withinStudioRoute(event.data.path, selectedTemplate.value.routePrefix)) paths.value[scene.value] = event.data.path
    return
  }
  if (event.data?.type === 'id-studio-mode' && ['light', 'dark', 'system'].includes(event.data.mode)) {
    preference.value = event.data.mode
    return
  }
  if (event.data?.type === 'id-studio-preview-error') {
    failedFrames.value[event.source === originalFrame.value?.contentWindow ? 'original' : 'draft'] = true
    loadedFrames.value[event.source === originalFrame.value?.contentWindow ? 'original' : 'draft'] = true
    error.value = 'This preview could not apply the brand. Try reloading it.'
    return
  }
  if (event.data?.type !== 'id-studio-ready') return
  if (event.source === originalFrame.value?.contentWindow) send(originalFrame.value, baseline.value)
  if (event.source === draftFrame.value?.contentWindow) send(draftFrame.value, draft.value)
}
function beforeUnload(event: BeforeUnloadEvent) {
  if (needsExport.value && !storedLocally.value) {
    event.preventDefault()
    event.returnValue = ''
  }
}
const includeGuide = ref(false)
async function exportProject() {
  busy.value = true
  error.value = ''
  try {
    const archive = await exportStudioProject(draft.value, { packageAsset: config.idStudio?.packageAsset, guide: includeGuide.value })
    download(`${draft.value.brand.name}.zip`, archive, 'application/zip')
    exported.value = clone(draft.value)
    persist()
    notice.value = 'Project downloaded. Apply it to your repository to publish the changes.'
  }
  catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Export failed.'
  }
  finally {
    busy.value = false
  }
}
function persist() {
  if (!storageReady.value || !projectId.value || readOnly.value) return
  if (!persistPristine.value && !dirty.value && !exported.value && !projects.value.some(project => project.id === projectId.value)) return
  storedLocally.value = false
  try {
    const session: StudioSession = { id: projectId.value, baseline: clone(baseline.value), draft: clone(draft.value), exported: exported.value ? clone(exported.value) : undefined, updatedAt: Date.now(), catalogKey: catalogKey.value }
    saveProject(session)
    localStorage.setItem(lastProjectKey, projectId.value)
    storedLocally.value = true
    listProjects()
  }
  catch {
    notice.value = 'Local draft storage is unavailable. Export your source before leaving.'
  }
}
function restore(session: StudioSession) {
  persistPristine.value = true
  connected.value = false
  error.value = ''
  notice.value = ''
  catalogKey.value = session.catalogKey
  sourceConflict.value = false
  baseline.value = clone(session.baseline)
  draft.value = clone(session.draft)
  exported.value = session.exported ? clone(session.exported) : undefined
  projectId.value = session.id
  clearHistory()
  fieldErrors.value = {}
  recovery.value = undefined
  brandPickerOpen.value = false
  editing.value = !readOnly.value && (typeof route.query.editor === 'string' || route.query.browse === 'false')
  persist()
  if (catalogKey.value === catalogPrefix + 'host') loadSource()
}
function exportSource() {
  download('brand.studio.json', JSON.stringify(draft.value, null, 2) + '\n')
  exported.value = clone(draft.value)
  persist()
}
async function shareView() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    notice.value = 'View link copied. It uses the recipient’s brand, not your local draft.'
  }
  catch {
    notice.value = 'Copy the current address to share this view. Local brand data is not included.'
  }
}
let applyingQuery = false
watch(() => route.query, (query) => {
  applyingQuery = true
  editing.value = !readOnly.value && (typeof query.editor === 'string' || query.browse === 'false')
  if (typeof query.editor === 'string') panel.value = editorCategory(query.editor)
  editorPinned.value = query.docked === 'true'
  scene.value = templates.some(item => item.id === query.view) ? String(query.view) : 'components'
  templatePage.value = selectedTemplate.value?.pages.find(page => page.id === query.page)?.id || selectedTemplate.value?.pages[0]?.id || 'home'
  preference.value = query.mode === 'dark' ? 'dark' : query.mode === 'light' ? 'light' : 'system'
  if (selectedTemplate.value?.routePrefix && withinStudioRoute(query.path, selectedTemplate.value.routePrefix)) paths.value[scene.value] = query.path
  state.value = query.state === 'error' ? 'error' : 'default'
  compare.value = query.compare === 'true'
  viewportWidth.value = viewportDimension(query.width, query.mobile === 'true' ? 390 : 0)
  viewportHeight.value = viewportDimension(query.height, 844)
  nextTick(() => {
    applyingQuery = false
  })
})
watch([scene, templatePage, preference, previewPath, state, compare, viewportWidth, viewportHeight], () => {
  if (applyingQuery) return
  router.replace({ query: { ...route.query, view: scene.value, page: selectedTemplate.value?.component ? templatePage.value : undefined, path: previewPath.value, mode: preference.value, state: scene.value === 'components' ? state.value : undefined, compare: compare.value ? 'true' : undefined, mobile: undefined, width: viewportWidth.value || undefined, height: viewportWidth.value ? viewportHeight.value : undefined } })
})
onMounted(() => {
  try {
    const savedScope = localStorage.getItem(randomScopeKey)
    if (randomScopes.value.some(item => item.value === savedScope)) randomScope.value = savedScope!
  }
  catch { /* Keep the default when browser storage is unavailable. */ }
  const root = window.document.documentElement
  const hostStyle = root.getAttribute('style')
  root.dataset.idStudioTheme = ''
  root.removeAttribute('style')
  watch(draft, (doc) => {
    shellConfig.ui = previewUi(hostUi, hostSeedUi, doc.theme.ui ?? {}) as typeof shellConfig.ui
    shellTheme.value = studioShellCss(doc)
  }, { immediate: true, deep: true })
  onBeforeUnmount(() => {
    shellConfig.ui = hostUi
    delete root.dataset.idStudioTheme
    if (hostStyle === null) root.removeAttribute('style')
    else root.setAttribute('style', hostStyle)
    // Let the host runtime reapply its theme for the current color mode.
    root.setAttribute('class', root.className)
  })
  // The shell and its teleported controls must follow the same mode as the frames,
  // including when a shared URL overrides a saved or system preference.
  watch([preference, () => colorMode.unknown], ([value, unknown]) => {
    if (!unknown) colorMode.preference = value
  }, { immediate: true })
  window.addEventListener('message', ready)
  window.addEventListener('beforeunload', beforeUnload)
  nextTick(refresh)
  if (selectedTemplate.value?.routePrefix && withinStudioRoute(route.query.path, selectedTemplate.value.routePrefix)) paths.value[scene.value] = route.query.path
  try {
    listProjects()
    const last = localStorage.getItem(lastProjectKey)
    storageReady.value = true
    const active = projects.value.find(item => item.id === last)
    if (active) {
      restore(active)
      return
    }
    if (last?.startsWith('catalog:')) {
      const selected = catalog.find(item => item.key === last.slice(8))
      if (selected) {
        replace(selected.document, selected.key)
        if (selected.key === 'host') loadSource()
        return
      }
    }
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
  }
  catch {
    storageReady.value = true
    projectId.value = crypto.randomUUID()
    notice.value = 'The previous local draft could not be restored. Your source has not changed.'
  }
  if (readOnly.value) editing.value = false
  loadSource()
})
watch([draft, baseline, exported], persist, { deep: true, flush: 'post' })
watch([draft, baseline, scene, templatePage, previewPath, state, compare], () => nextTick(refresh), { deep: true })
watch([mode, preference], ([value, selected]) => {
  if (!import.meta.client) return
  // Same-origin documents change CSS mode in one task, before the next paint.
  for (const frame of [originalFrame.value, draftFrame.value]) {
    const root = frame?.contentDocument?.documentElement
    if (!root) continue
    root.classList.toggle('dark', value === 'dark')
    root.classList.toggle('light', value === 'light')
    frame?.contentWindow?.postMessage({ type: 'id-studio-color-mode', mode: value, preference: selected }, window.location.origin)
  }
}, { flush: 'sync' })
onBeforeUnmount(() => {
  window.removeEventListener('message', ready)
  window.removeEventListener('beforeunload', beforeUnload)
})

const resolveIcon = useStudioIcon()
function documentIcons(doc: StudioDocument): Record<string, string> | undefined {
  const icons = doc.theme.ui?.icons
  return icons && typeof icons === 'object' ? icons as Record<string, string> : undefined
}
</script>

<template>
  <main
    v-if="storageReady"
    class="studio-shell"
    :data-mode="mode"
    aria-label="Brand Studio"
  >
    <header class="studio-header">
      <div class="studio-product inline-flex items-center gap-2.5">
        <NuxtLink
          :to="config.idStudio?.home || '/'"
          class="inline-flex items-center gap-2.5 rounded-md font-semibold tracking-tight text-highlighted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          :aria-label="`${productName} home`"
          :title="`Back to ${productName}`"
        >
          <UColorModeImage
            v-if="config.idStudio?.host?.logo"
            :light="config.idStudio.host.logo.light"
            :dark="config.idStudio.host.logo.dark"
            alt=""
            class="shrink-0 object-contain"
            :class="productWordmark ? 'studio-product-wordmark h-[22px] min-[481px]:h-7 w-auto' : 'size-8'"
          />
          <span
            v-else
            class="flex size-5 shrink-0 items-center justify-center text-primary"
          ><UIcon
            name="i-lucide-fingerprint"
            class="size-5"
          /></span>
          <span v-if="!productWordmark"><span class="studio-product-prefix">{{ productPrefix }}</span><span>{{ productSuffix }}</span></span>
        </NuxtLink>
      </div>
      <h1 class="sr-only">
        {{ draft.theme.label }} — Brand Studio
      </h1>
      <div
        class="studio-scenes"
        aria-label="Preview scene"
      >
        <div
          class="studio-scene-pill"
          role="group"
          aria-label="Brand selection"
        >
          <UDropdownMenu
            v-model:open="brandPickerOpen"
            v-model:search-term="brandSearch"
            :items="brandMenuItems"
            :filter="brandSearchInput"
            ignore-filter
            :modal="false"
            :content="{ align: 'start' }"
            :ui="{ content: 'w-80 max-w-[calc(100vw-2rem)]', viewport: 'max-h-[min(65dvh,28rem)]', item: 'gap-3 px-3 py-2.5', itemDescription: 'truncate' }"
          >
            <UButton
              color="neutral"
              variant="ghost"
              :trailing-icon="resolveIcon('i-lucide-chevron-down')"
              aria-label="Brand picker"
              class="studio-project-name studio-scene-trigger"
              :ui="{ trailingIcon: 'ms-auto shrink-0' }"
            >
              <span class="truncate">{{ draft.theme.label }}</span>
            </UButton>
            <template #brand-leading="{ item }">
              <StudioBrandThumbnail :document="item.document" />
            </template>
            <template #brand-trailing="{ item }">
              <UIcon
                v-if="item.checked"
                :name="resolveIcon('i-lucide-check')"
                class="size-4 shrink-0"
              />
            </template>
            <template #content-bottom="{ sub }">
              <p
                v-if="!sub && !readOnly && needsExport && !storedLocally"
                class="border-t border-default px-4 py-3 text-xs text-warning"
                role="status"
              >
                Changes could not be saved in this browser.
              </p>
            </template>
          </UDropdownMenu>
        </div>
        <StudioTemplatePicker
          v-model="scene"
          v-model:open="templatePickerOpen"
          :templates="templates"
          :document="draft"
          :mode="mode"
        />
      </div>
      <div class="studio-review flex items-center gap-2">
        <UTooltip
          v-if="config.idStudio?.documentation || config.idStudio?.home"
          text="Documentation"
        >
          <UButton
            :to="config.idStudio?.documentation || config.idStudio?.home || '/'"
            target="_blank"
            color="neutral"
            variant="ghost"
            :icon="resolveIcon('i-lucide-book-open')"
            aria-label="Documentation (opens in a new tab)"
          >
            <span class="studio-docs-label">Docs</span>
          </UButton>
        </UTooltip>
        <UButton
          color="neutral"
          variant="outline"
          @click="askAiOpen = true"
        >
          Ask AI
        </UButton>
        <UButton
          color="neutral"
          variant="solid"
          @click="exportTab = 'download'; exportOpen = true"
        >
          Export
        </UButton>
      </div>
      <input
        ref="input"
        type="file"
        accept=".json,application/json"
        class="sr-only"
        aria-label="Open brand document"
        @change="openDocument"
      >
    </header>
    <UModal
      v-model:open="manageOpen"
      :title="manageTarget ? manageAction === 'delete' ? 'Delete brand' : 'Rename brand' : 'Manage brands'"
      description="Local brands saved in this browser."
      :ui="{ content: 'max-w-xl max-h-[min(640px,calc(100dvh-2rem))]', body: 'min-h-0 overflow-auto' }"
    >
      <template #body>
        <form
          v-if="manageTarget"
          id="studio-manage-brand"
          class="space-y-4"
          @submit.prevent="saveManagedProject"
        >
          <template v-if="manageAction === 'delete'">
            <p>Delete the local copy of <strong>{{ manageTarget.draft.theme.label }}</strong>? Its saved draft will be permanently removed.</p>
            <p class="text-sm text-muted break-words">
              {{ manageTarget.draft.brand.packageName || manageTarget.draft.brand.name }} · {{ new Date(manageTarget.updatedAt).toLocaleString() }}
            </p>
          </template>
          <UFormField
            v-else
            label="Brand name"
            required
          >
            <UInput
              v-model="manageName"
              aria-label="Rename brand"
              maxlength="80"
              autofocus
              class="w-full"
            />
          </UFormField>
          <UAlert
            v-if="manageError"
            color="error"
            :description="manageError"
          />
        </form>
        <div
          v-else
          class="space-y-4"
        >
          <UInput
            v-model="manageSearch"
            :icon="resolveIcon('i-lucide-search')"
            placeholder="Search saved brands…"
            aria-label="Search saved brands"
            class="w-full"
          />
          <ul class="divide-y divide-default">
            <li
              v-for="project in managedProjects"
              :key="project.id"
              class="flex items-center gap-3 py-3"
            >
              <StudioBrandThumbnail :document="project.draft" />
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p
                    class="min-w-0 truncate font-medium"
                    :title="project.draft.theme.label"
                  >
                    {{ project.draft.theme.label }}
                  </p><UBadge
                    v-if="project.id === projectId"
                    color="neutral"
                    variant="subtle"
                    size="xs"
                  >
                    Current
                  </UBadge>
                </div><p
                  v-if="project.draft.brand.packageName && project.draft.brand.packageName !== '@example/brand'"
                  class="truncate text-xs text-muted"
                >
                  {{ project.draft.brand.packageName }}
                </p><time
                  class="text-xs text-muted"
                  :datetime="new Date(project.updatedAt).toISOString()"
                  :title="new Date(project.updatedAt).toLocaleString()"
                >{{ new Date(project.updatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) }}</time>
              </div>
              <div class="flex shrink-0 items-center gap-1">
                <UButton
                  v-if="project.id !== projectId"
                  color="neutral"
                  variant="outline"
                  size="sm"
                  :aria-label="`Open ${project.draft.theme.label}`"
                  @click="manageOpen = false; pickBrand(() => restore(project))"
                >
                  Open
                </UButton>
                <UDropdownMenu
                  :content="{ align: 'end' }"
                  :items="[[{ label: 'Rename', icon: resolveIcon('i-lucide-pencil'), onSelect: () => manageProject(project, 'rename') }, { label: 'Duplicate', icon: resolveIcon('i-lucide-copy'), onSelect: () => { manageOpen = false; beginCreate(project.draft) } }], [{ label: 'Delete local copy', icon: resolveIcon('i-lucide-trash-2'), color: 'error', onSelect: () => manageProject(project, 'delete') }]]"
                >
                  <UTooltip text="Brand actions">
                    <UButton
                      color="neutral"
                      variant="ghost"
                      :icon="resolveIcon('i-lucide-ellipsis')"
                      :aria-label="`Actions for ${project.draft.theme.label}`"
                    />
                  </UTooltip>
                </UDropdownMenu>
              </div>
            </li>
          </ul>
          <UEmpty
            v-if="!managedProjects.length"
            :title="manageSearch ? 'No matching brands' : 'No saved brands yet'"
            :icon="resolveIcon(manageSearch ? 'i-lucide-search' : 'i-lucide-library')"
            size="sm"
            variant="naked"
          >
            <template #actions>
              <UButton
                v-if="manageSearch"
                color="neutral"
                variant="outline"
                size="sm"
                @click="manageSearch = ''"
              >
                Clear search
              </UButton>
            </template>
          </UEmpty>
        </div>
      </template>
      <template
        v-if="manageTarget"
        #footer
      >
        <div class="flex w-full justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            @click="manageTarget = undefined; manageError = ''"
          >
            Cancel
          </UButton><UButton
            form="studio-manage-brand"
            type="submit"
            :color="manageAction === 'delete' ? 'error' : 'primary'"
          >
            {{ manageAction === 'delete' ? 'Delete local copy' : 'Save name' }}
          </UButton>
        </div>
      </template>
    </UModal>
    <UModal
      v-model:open="createOpen"
      :title="createBase ? 'Duplicate brand' : 'Create brand'"
      description="Choose a name for your brand."
    >
      <template #body>
        <form
          id="studio-create-brand"
          @submit.prevent="createBrand"
        >
          <UFormField
            label="Name"
            :error="createError"
            required
          >
            <UInput
              v-model="createName"
              aria-label="New brand name"
              autofocus
              maxlength="80"
              class="w-full"
              @update:model-value="createError = ''"
            />
          </UFormField>
        </form>
      </template>
      <template #footer>
        <UButton
          color="neutral"
          variant="ghost"
          @click="createOpen = false"
        >
          Cancel
        </UButton><UButton
          type="submit"
          form="studio-create-brand"
          :disabled="!createName.trim()"
        >
          Create brand
        </UButton>
      </template>
    </UModal>
    <div
      class="studio-workspace"
      :class="{ 'studio-editing': editing && !readOnly, 'studio-pinned': editing && !readOnly && editorPinned }"
    >
      <div
        class="studio-canvas"
        :class="{ 'studio-comparing': compare }"
      >
        <section
          v-if="compare"
          class="studio-frame-wrap"
        >
          <div class="studio-frame-label">
            Original <span>{{ baseline.theme.label }}</span>
          </div>
          <StudioViewport
            v-slot="{ frameStyle }"
            v-model:zoom="previewZoom"
            v-model:width="viewportWidth"
            v-model:height="viewportHeight"
            :loading="!loadedFrames.original"
            :failed="failedFrames.original"
            @retry="retryPreview"
          >
            <iframe
              v-for="runtime in cachedRuntimes"
              v-show="runtime === previewRuntime"
              :key="`${runtime}:${previewAttempt}`"
              :ref="frame => cacheFrame(frame, `original:${runtime}`)"
              :src="frameSrc('original', runtime)"
              :title="runtime === previewRuntime ? 'Original brand preview' : `Cached original ${runtime}`"
              :style="frameStyle"
              @load="runtime === previewRuntime && frameLoaded(originalFrame, baseline, 'original')"
            />
          </StudioViewport>
        </section>
        <section class="studio-frame-wrap">
          <div class="studio-frame-label">
            Draft <span>{{ draft.theme.label }}</span>
          </div>
          <StudioViewport
            v-slot="{ frameStyle }"
            v-model:zoom="previewZoom"
            v-model:width="viewportWidth"
            v-model:height="viewportHeight"
            :loading="!loadedFrames.draft"
            :failed="failedFrames.draft"
            @retry="retryPreview"
          >
            <iframe
              v-for="runtime in cachedRuntimes"
              v-show="runtime === previewRuntime"
              :key="`${runtime}:${previewAttempt}`"
              :ref="frame => cacheFrame(frame, `draft:${runtime}`)"
              :src="frameSrc('draft', runtime)"
              :title="runtime === previewRuntime ? 'Draft brand preview' : `Cached draft ${runtime}`"
              :style="frameStyle"
              @load="runtime === previewRuntime && frameLoaded(draftFrame, draft, 'draft')"
            />
          </StudioViewport>
        </section>
      </div>
      <StudioEditorPanel
        v-if="!readOnly"
        v-model:open="editing"
        :pinned="editorPinned"
        @restore-focus="restoreEditorFocus"
      >
        <aside
          id="studio-editor"
          class="studio-inspector"
          aria-label="Brand editor"
        >
          <div class="studio-inspector-header">
            <h2
              ref="editorHeading"
              tabindex="-1"
              class="outline-none"
            >
              {{ panels.find(item => item.value === panel)?.label }}
            </h2>
            <div class="flex items-center gap-1">
              <UTooltip :text="editorPinned ? 'Unpin editor' : 'Pin editor beside preview'">
                <UButton
                  class="studio-pin-editor"
                  :icon="resolveIcon(editorPinned ? 'i-lucide-pin-off' : 'i-lucide-pin')"
                  :aria-label="editorPinned ? 'Unpin editor' : 'Pin editor'"
                  :aria-pressed="editorPinned"
                  color="neutral"
                  :variant="editorPinned ? 'soft' : 'ghost'"
                  @click="editorPinned = !editorPinned"
                />
              </UTooltip>
              <UButton
                :icon="resolveIcon('i-lucide-x')"
                aria-label="Close settings"
                color="neutral"
                variant="ghost"
                @click="closeSettings"
              />
            </div>
          </div>
          <div class="studio-category-select p-3 border-b border-default">
            <USelect
              v-model="panel"
              :items="panels"
              aria-label="Editor category"
              class="w-full"
            />
          </div>
          <div
            :key="panel"
            class="studio-fields"
          >
            <div
              v-for="section in panels.filter(item => item.value === panel)"
              :key="section.value"
              class="studio-form-section"
            >
              <template v-if="section.value === 'identity'">
                <UFormField
                  :error="fieldErrors['label']"
                  label="Brand name"
                >
                  <UInput
                    :model-value="draft.theme.label"
                    class="w-full"
                    @change="edit(doc => { doc.theme.label = value($event) }, 'label')"
                  />
                </UFormField>
                <UFormField
                  :error="fieldErrors['claim']"
                  label="Brand statement"
                >
                  <UTextarea
                    :model-value="draft.brand.claim"
                    :rows="3"
                    class="w-full"
                    @change="edit(doc => { doc.brand.claim = value($event) }, 'claim')"
                  />
                </UFormField>
                <UFormField label="Logo">
                  <USelect
                    v-model="logoRole"
                    :items="logoRoles"
                    class="w-full"
                  />
                </UFormField>
                <div
                  v-if="currentLogo"
                  class="rounded border border-default p-4"
                  :class="logoRole.endsWith('Inverse') ? 'bg-gray-900' : 'bg-white'"
                >
                  <img
                    :src="currentLogo.src"
                    :alt="currentLogo.alt || 'Brand logo'"
                    class="mx-auto max-h-16 max-w-full"
                  >
                </div>
                <UFileUpload
                  :key="logoRole"
                  accept="image/png,image/jpeg,image/webp"
                  label="Upload image"
                  description="PNG, JPEG or WebP · up to 2 MB"
                  :preview="false"
                  @update:model-value="addLogo"
                />
                <UButton
                  v-if="currentLogo"
                  color="neutral"
                  variant="link"
                  @click="removeLogo"
                >
                  Remove image
                </UButton>
                <UAccordion :items="[{ label: 'Advanced', value: 'metadata' }]">
                  <template #body>
                    <div class="studio-form-section">
                      <UFormField
                        :error="fieldErrors['identifier']"
                        label="Identifier"
                        help="Lowercase letters, numbers and hyphens"
                      >
                        <UInput
                          :model-value="draft.brand.name"
                          class="w-full"
                          @change="edit(doc => { doc.brand.name = value($event); doc.theme.name = value($event) }, 'identifier')"
                        />
                      </UFormField>
                      <UFormField
                        :error="fieldErrors['package']"
                        label="Package name"
                      >
                        <UInput
                          :model-value="draft.brand.packageName"
                          placeholder="@example/brand"
                          class="w-full"
                          @change="edit(doc => { doc.brand.packageName = value($event) }, 'package')"
                        />
                      </UFormField>
                    </div>
                  </template>
                </UAccordion>
              </template>
              <slot
                v-else
                name="editor"
                :document="readonly(draft)"
                :baseline="readonly(baseline)"
                :category="section.value"
                :mode="mode"
                :errors="readonly(fieldErrors)"
                :body-contrast="bodyContrast"
                :change="applyDraft"
                :invalid="reportError"
                :set-busy="setEditorBusy"
                :notify="notifyEditor"
              >
                <StudioThemeEditor
                  :document="draft"
                  :baseline="baseline"
                  :category="section.value"
                  :mode="mode"
                  :errors="fieldErrors"
                  :body-contrast="bodyContrast"
                  :change="applyDraft"
                  @invalid="reportError"
                  @notice="notifyEditor"
                  @busy="setEditorBusy"
                />
              </slot>
            </div>
          </div>
        </aside>
      </StudioEditorPanel>
    </div>
    <div
      class="studio-toolbar"
      role="toolbar"
      aria-label="Brand tools"
    >
      <div class="studio-dock-settings">
        <StudioControlGroup
          class="studio-history"
          label="Edit actions"
        >
          <UTooltip text="Undo">
            <UButton
              size="xs"
              class="studio-desktop p-1.5"
              :icon="resolveIcon('i-lucide-undo-2')"
              aria-label="Undo change"
              color="neutral"
              variant="ghost"
              :disabled="!history.length"
              @click="undo"
            />
          </UTooltip>
          <UTooltip text="Redo">
            <UButton
              size="xs"
              class="studio-desktop p-1.5"
              :icon="resolveIcon('i-lucide-redo-2')"
              aria-label="Redo change"
              color="neutral"
              variant="ghost"
              :disabled="!future.length"
              @click="redo"
            />
          </UTooltip>
          <template v-if="!readOnly">
            <USeparator
              orientation="vertical"
              class="studio-desktop h-5 mx-1"
            />
            <UTooltip :text="`Randomize ${randomScopes.find(item => item.value === randomScope)?.label.toLowerCase()}`">
              <UButton
                size="xs"
                class="p-1.5"
                :icon="resolveIcon('i-lucide-dices')"
                :aria-label="`Randomize ${randomScopes.find(item => item.value === randomScope)?.label.toLowerCase()}`"
                color="neutral"
                variant="ghost"
                @click="randomize"
              />
            </UTooltip>
            <UDropdownMenu :items="[randomScopes.filter(item => item.value === 'all'), randomScopes.filter(item => item.value !== 'all')].map(group => group.map(item => ({ label: item.label, icon: item.icon, type: 'checkbox' as const, checked: randomScope === item.value, onSelect: () => selectRandomScope(item.value) })))">
              <UButton
                class="p-1.5"
                :icon="resolveIcon('i-lucide-chevron-down')"
                aria-label="Randomizer options"
                color="neutral"
                variant="ghost"
                size="xs"
              />
            </UDropdownMenu>
          </template>
        </StudioControlGroup>
        <UButton
          ref="customizeButton"
          :class="{ 'studio-editor-mobile': !readOnly }"
          color="neutral"
          :variant="editing ? 'soft' : 'ghost'"
          :icon="resolveIcon('i-lucide-sliders-horizontal')"
          :aria-expanded="editing && !readOnly"
          aria-controls="studio-editor"
          @click="customize"
        >
          {{ readOnly ? 'Create brand' : 'Editor' }}
        </UButton>
      </div>
      <div
        v-if="!readOnly"
        class="studio-categories"
        role="group"
        aria-label="Edit brand"
      >
        <UButton
          v-for="item in panels.filter(item => item.value !== 'identity')"
          :key="item.value"
          :data-editor-category="item.value"
          :icon="item.icon"
          color="neutral"
          :variant="editing && panel === item.value ? 'soft' : 'ghost'"
          :aria-expanded="editing && panel === item.value"
          aria-controls="studio-editor"
          @click="editing && panel === item.value ? closeSettings() : openEditor(item.value, $event)"
        >
          {{ item.label }}
        </UButton>
      </div>
      <StudioControlGroup
        class="studio-view-tools"
        label="Preview controls"
      >
        <UPopover
          v-model:open="previewOptionsOpen"
          :content="{ align: 'end' }"
        >
          <UTooltip text="Preview settings">
            <UButton
              color="neutral"
              :variant="previewOptionsOpen ? 'soft' : 'ghost'"
              :icon="resolveIcon('i-lucide-sliders-horizontal')"
              aria-label="Preview settings"
              :aria-expanded="previewOptionsOpen"
              size="xs"
              class="p-1.5"
            />
          </UTooltip>
          <template #content>
            <div class="flex w-72 max-w-[calc(100vw-2rem)] flex-col gap-3 p-3">
              <StudioViewportControls
                v-model:width="viewportWidth"
                v-model:height="viewportHeight"
                @update:width="previewZoom = 1"
                @update:height="previewZoom = 1"
              />
              <UFormField
                v-if="scene === 'components'"
                label="Component state"
              >
                <USelect
                  v-model="state"
                  aria-label="Preview state"
                  class="w-full"
                  :items="[{ label: 'Default', value: 'default' }, { label: 'Validation error', value: 'error' }]"
                />
              </UFormField>
              <USwitch
                v-model="compare"
                label="Compare with original"
                :ui="{ root: 'flex-row-reverse justify-between', wrapper: 'ms-0 me-2' }"
              />
              <div class="border-t border-default pt-2">
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  :icon="resolveIcon('i-lucide-link')"
                  class="w-full"
                  @click="shareView"
                >
                  Copy preview link
                </UButton>
              </div>
            </div>
          </template>
        </UPopover>
        <USeparator
          orientation="vertical"
          class="h-5 mx-1"
        />
        <StudioColorMode
          v-model="preference"
          grouped
        />
      </StudioControlGroup>
    </div>
    <UModal
      :open="!!pending"
      title="Replace this draft?"
      description="Export your changes first if you want to keep them."
      @update:open="pending = null"
    >
      <template #footer>
        <UButton
          color="neutral"
          variant="outline"
          @click="pending = null"
        >
          Keep editing
        </UButton><UButton @click="acceptReplacement">
          Replace draft
        </UButton>
      </template>
    </UModal>
    <UModal
      :open="!!leaving"
      title="Leave Studio?"
      description="Your changes could not be saved in this browser. Export them before leaving to keep them."
      @update:open="finishLeaving(false)"
    >
      <template #footer>
        <UButton
          color="neutral"
          variant="outline"
          @click="finishLeaving(false)"
        >
          Keep editing
        </UButton><UButton @click="finishLeaving(true)">
          Leave Studio
        </UButton>
      </template>
    </UModal>
    <UModal
      v-model:open="resetOpen"
      title="Reset appearance?"
      description="Restore this brand’s original colors, typography, icons, component styles and appearance settings. Your name, logos, content and custom palettes are kept. You can undo this reset."
    >
      <template #footer>
        <UButton
          color="neutral"
          variant="ghost"
          @click="resetOpen = false"
        >
          Cancel
        </UButton><UButton
          color="neutral"
          @click="reset"
        >
          Reset appearance
        </UButton>
      </template>
    </UModal>
    <StudioAskAi
      v-model:open="askAiOpen"
      :document="draft"
    />
    <UModal
      v-model:open="exportOpen"
      title="Export brand"
      :ui="{ content: 'max-w-4xl max-h-[min(720px,calc(100dvh-2rem))]', body: 'flex min-h-0 flex-1 flex-col overflow-hidden', header: 'shrink-0', footer: 'shrink-0 flex-wrap' }"
    >
      <template #body>
        <p class="mb-4 text-sm text-muted">
          {{ connected ? 'Apply to the connected project source.' : 'Choose how to use your brand.' }} <code v-if="connected">{{ sourcePath }}</code>
        </p>
        <UAlert
          v-if="sourceConflict"
          color="warning"
          title="Source changed"
          description="Your draft is preserved. Download it before reopening the project to resolve the conflict."
          class="mb-4"
        />
        <UTabs
          v-model="exportTab"
          :items="[{ label: 'Export', value: 'download' }, { label: 'Changes', value: 'changes' }, { label: 'Code', value: 'code' }]"
          variant="link"
          :ui="{ root: 'flex min-h-0 flex-col', list: 'shrink-0 justify-start', trigger: 'flex-none', content: 'min-h-0 overflow-auto p-px' }"
        >
          <template #content="{ item }">
            <div
              v-if="item.value === 'download'"
              class="grid gap-4 py-3 sm:grid-cols-2"
            >
              <UCard>
                <h3 class="font-semibold">
                  Brand file
                </h3><p class="mt-2 mb-4 text-sm text-muted">
                  Reopen and continue editing in Studio, or share your brand with another author.
                </p><UButton
                  color="neutral"
                  variant="outline"
                  :icon="resolveIcon('i-lucide-download')"
                  @click="exportSource"
                >
                  Download JSON
                </UButton>
              </UCard>
              <UCard>
                <h3 class="font-semibold">
                  Nuxt project
                </h3><p class="mt-2 mb-4 text-sm text-muted">
                  A reusable Nuxt UI brand layer with a Studio playground.
                </p><UCheckbox
                  v-model="includeGuide"
                  label="Include Docus guide"
                  class="mb-4"
                /><UButton
                  color="neutral"
                  variant="outline"
                  :icon="resolveIcon('i-lucide-download')"
                  :loading="busy"
                  @click="exportProject"
                >
                  Download ZIP
                </UButton><p class="mt-4 text-xs text-muted">
                  Add custom fonts and capabilities in the generated project. Custom Vue components are not included.
                </p>
              </UCard>
            </div>
            <div
              v-else-if="item.value === 'changes'"
              class="mb-4 divide-y divide-default"
            >
              <p
                v-if="!changes.length"
                class="text-sm text-muted"
              >
                No changes to apply.
              </p>
              <div
                v-for="change in changes"
                :key="change.path"
                class="py-2 text-sm"
              >
                <p class="font-medium">
                  {{ changeLabel(change.path) }}
                </p><div class="mt-1 whitespace-pre-wrap break-words text-muted">
                  {{ changeValue(change.before) }} → {{ changeValue(change.after) }}
                </div><code class="mt-1 block break-all text-xs text-dimmed">{{ change.path }}</code>
              </div>
            </div>
            <div v-else>
              <USelect
                v-model="codeFormat"
                aria-label="Code format"
                :items="[{ label: 'Brand JSON', value: 'source' }, { label: 'CSS', value: 'css' }]"
                class="mb-3 w-40"
              /><pre class="studio-export-code studio-source-code leading-relaxed">{{ output }}</pre>
            </div>
          </template>
        </UTabs>
      </template>
      <template #footer>
        <UButton
          v-if="connected"
          :loading="busySource"
          :disabled="!dirty || sourceConflict || Object.keys(fieldErrors).length > 0"
          @click="applySource"
        >
          Apply changes
        </UButton><UButton
          v-if="exportTab !== 'download'"
          color="neutral"
          variant="outline"
          @click="exportTab = 'download'"
        >
          Export options
        </UButton><UButton
          color="neutral"
          variant="ghost"
          @click="exportOpen = false"
        >
          Close
        </UButton>
      </template>
    </UModal>
  </main>
  <div
    v-else
    class="studio-loading"
    role="status"
  >
    <UIcon
      :name="resolveIcon('i-lucide-loader-circle')"
      class="size-5 animate-spin"
    /><span class="sr-only">Loading Studio</span>
  </div>
</template>

<style>
body.id-studio-page { margin: 0; overflow: hidden; }
/* Source inspection must stay readable even when the brand mono token is being edited. */
.studio-source-code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
</style>

<style scoped>
.studio-shell { box-sizing: border-box; height: 100dvh; max-width: 1680px; margin: auto; padding: 0 20px 12px; display: flex; flex-direction: column; gap: 10px; background: transparent; color: var(--ui-text); }
.studio-header { flex: none; margin-bottom: -10px; padding-inline: 24px; min-height: 64px; display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 12px; }.studio-project-name { min-width: 0; max-width: 100%; justify-self: start; }.studio-review { justify-self: end; }
.studio-product { justify-self: start; white-space: nowrap; font-size: 20px; }

.studio-scenes { display: grid; grid-template-columns: minmax(0, 11rem) minmax(0, 19rem); align-items: center; gap: 12px; margin: auto; width: 30.75rem; min-width: 0; max-width: 70vw; --studio-scene-radius: calc(var(--ui-radius) * 3.5); }.studio-scenes > * { width: 100%; min-width: 0; }
.studio-project-menu, .studio-mobile-control, .studio-view-mobile { display: none; }
.studio-scenes :deep(.studio-scene-pill) { padding: 4px; border-radius: var(--studio-scene-radius); background: var(--ui-bg-elevated); }
.studio-scenes :deep(.studio-scene-trigger) { width: 100%; min-height: 32px; padding-inline: 12px; border-radius: max(0px, calc(var(--studio-scene-radius) - 4px)); background: transparent; color: var(--ui-text-muted); cursor: pointer; transition: background-color 150ms, color 150ms; }
.studio-scenes :deep(.studio-scene-trigger:hover) { background: transparent; color: var(--ui-text-highlighted); }
.studio-scenes :deep(.studio-scene-trigger[aria-pressed="true"]) { background: var(--ui-bg); color: var(--ui-text-highlighted); }
.studio-actions { display: flex; align-items: center; gap: 6px; }
.studio-toolbar { flex: none; display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 8px; border: 1px solid var(--ui-border); border-radius: calc(var(--ui-radius) * 4.5); background: var(--ui-bg); }
.studio-toolbar-end, .studio-dock-settings { display: flex; gap: 8px; align-items: center; }
.studio-workspace { position: relative; flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; }.studio-workspace.studio-pinned { grid-template-columns: minmax(0, 1fr) 360px; }
.studio-canvas { display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; min-width: 0; min-height: 0; }.studio-comparing { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.studio-frame-wrap { min-width: 0; min-height: 0; display: flex; flex-direction: column; align-items: center; }.studio-frame-label { display: none; }.studio-comparing .studio-frame-label { display: flex; justify-content: space-between; align-self: stretch; padding: 0 6px 6px; font-size: 11px; }.studio-frame-label span { color: var(--ui-text-muted); }
iframe { display: block; width: 100%; flex: 1; min-height: 0; border: 0; background: var(--ui-bg); }
.studio-inspector { position: relative; inset: auto; transform: none; width: 100%; max-height: 100%; display: flex; flex-direction: column; border-radius: inherit; min-width: 0; min-height: 0; overflow: hidden; background: var(--ui-bg); }
.studio-inspector-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-shrink: 0; padding: 8px 12px; font-size: 14px; font-weight: 600; border-bottom: 1px solid var(--ui-border); }
.studio-fields { flex: 0 1 auto; min-height: 0; padding: 12px; overflow-y: auto; overscroll-behavior: contain; }.studio-form-section { display: flex; flex-direction: column; gap: 12px; padding-bottom: 0; }
.studio-fields :deep(button[data-slot="trigger"]) { font-weight: 500; }
.studio-notice { flex: none; max-height: 100px; overflow: auto; display: flex; gap: 12px; align-items: center; padding: 8px 12px; font-size: 13px; }
.studio-export-code { width: max-content; min-width: 100%; padding: 20px; border-radius: calc(var(--ui-radius) * 2); background: var(--ui-bg-muted); font-size: 12px; }
.studio-pinned .studio-inspector { position: relative; inset: auto; transform: none; width: 100%; box-shadow: none; }
.studio-history { display: flex; align-items: center; gap: 0; }
.studio-categories, .studio-view-tools { display: flex; align-items: center; gap: 4px; }
.studio-pinned .studio-fields { flex: 1; }
.studio-category-select, .studio-editor-mobile { display: none; }
@media (max-width: 1099px) { .studio-categories { display: none; }.studio-editor-mobile { display: inline-flex; }.studio-category-select { display: block; flex-shrink: 0; } }
@media (max-width: 700px) {
  .studio-shell { padding: 0 8px 8px; gap: 8px; }.studio-header { margin-bottom: -8px; min-height: 48px; gap: 8px; }.studio-scenes { flex: 1; justify-content: center; gap: 4px; }.studio-scenes > * { min-width: 0; max-width: 130px; }.studio-project-actions { display: none; }.studio-project-menu { display: inline-flex; flex: none; }
  .studio-dock-settings > * { flex: none; }
  .studio-view-mobile { display: flex; }.studio-mobile-control { display: inline-flex; }.studio-desktop { display: none; }.studio-toolbar { flex-wrap: nowrap; justify-content: space-between; }.studio-dock-settings { width: 100%; }.studio-dock-settings > * { flex: 1; justify-content: center; }.studio-toolbar-end { width: 100%; flex-wrap: wrap; justify-content: space-between; }.studio-comparing { grid-template-columns: minmax(0, 1fr); grid-template-rows: repeat(2, minmax(0, 1fr)); }
}
</style>

<style scoped>
.studio-loading { height: 100dvh; display: grid; place-items: center; color: var(--ui-text-muted); background: var(--ui-bg); }
@media (max-width: 900px) {
  .studio-workspace.studio-pinned { grid-template-columns: minmax(0, 1fr); }
  .studio-pin-editor { display: none; }
}
@media (max-width: 1099px) {
  .studio-header { grid-template-columns: minmax(0, 1fr) auto; row-gap: 8px; padding: 8px; }
  .studio-review { grid-column: 2; grid-row: 1; }
  .studio-product { font-size: 16px; }
  .studio-review { gap: 4px; }
  .studio-docs-label { display: none; }
  .studio-scenes { grid-column: 1 / -1; grid-row: 2; }
  .studio-scenes :deep(.components-trigger) { padding-inline: 6px; }
  .studio-scenes :deep(.templates-trigger [data-slot="leadingIcon"]) { display: none; }
  .studio-scenes { margin: 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 19rem); width: 100%; max-width: none; gap: 8px; }
  .studio-scenes > * { width: 100%; max-width: none; }
  .studio-dock-settings { width: auto; }
}
@media (max-width: 700px) { .studio-header { padding-inline: 0; }.studio-scenes { grid-template-columns: minmax(0, 1fr) 11rem; } }
@media (max-width: 480px) { .studio-product-prefix { display: none; } }
</style>

<style>
body.id-studio-page { background: color-mix(in srgb, var(--ui-bg) 45%, var(--ui-bg-muted)); }
html.dark body.id-studio-page { background: color-mix(in srgb, var(--ui-bg) 64%, black); }
</style>
