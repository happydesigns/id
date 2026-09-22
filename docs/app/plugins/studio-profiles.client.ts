import { computed, nextTick, ref, watch } from 'vue'
import { useBrandTheme } from '../../../app/composables/useBrandTheme'
import { cssVariablesAdapter } from '../../../src/adapters/css-variables'
import { projectPrefix, useStudioProjects } from '../../../studio/app/composables/useStudioProjects'
import { parseStudioSession, type StudioSession } from '../../../studio/editor'
import { parseStudioDocument, type StudioDocument } from '../../../src/studio'
import { createFirstPaintTheme, firstPaintThemeKey } from '../../../studio/first-paint'
import type { StudioHostConfig } from '../../../src/studio-host'

export default defineNuxtPlugin(() => {
  if (window.parent !== window) return
  const config = useAppConfig().idStudio as StudioHostConfig
  const seed = config.document
  if (!seed) return
  const scope = seed.brand.packageName || seed.brand.name
  const activeKey = 'id-studio:1:' + scope + ':active'
  const firstPaintKey = firstPaintThemeKey(scope)
  const runtime = useBrandTheme()
  const route = useRoute()
  const sessions = ref<StudioSession[]>([])
  const { saveProject } = useStudioProjects(ref(''))
  let syncing = false
  const themeName = (session: StudioSession) => session.catalogKey?.startsWith(scope + '::brand:')
    ? session.catalogKey.slice((scope + '::brand:').length)
    : 'studio-' + Array.from(session.id, character => character.charCodeAt(0).toString(16)).join('')
  const selectedSession = computed(() => sessions.value.find(item => themeName(item) === runtime.selectedName.value))
  const source = computed(() => selectedSession.value?.draft || config.brands?.[runtime.selectedName.value] || seed)
  const baseline = computed(() => selectedSession.value?.baseline || source.value)
  useHead({ style: [{ key: 'id-docs-profile', textContent: computed(() => {
    return cssVariablesAdapter.transform(source.value.brand, { prefix: '', includeRoles: false, selector: ':root:root' }).css
  }) }] })
  function sync() {
    try {
      sessions.value = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (!key?.startsWith(projectPrefix)) continue
        try {
          sessions.value.push(parseStudioSession(JSON.parse(localStorage.getItem(key)!)))
        }
        catch { /* Ignore invalid browser drafts; Studio reports recovery errors. */ }
      }
      syncing = true
      runtime.localThemes.value = sessions.value.map(session => ({
        ...session.draft.theme,
        name: themeName(session),
        typography: { ...session.draft.brand.typography, ...session.draft.theme.typography },
      }))
      if (route.path.startsWith('/studio')) return
      const active = localStorage.getItem(activeKey)
      const session = sessions.value.find(item => item.id === active)
      const selected = session ? themeName(session) : active === 'catalog:nuxt-ui' ? 'nuxt-ui' : active?.startsWith('catalog:brand:') ? active.slice(14) : runtime.selectedName.value
      if (runtime.themes.value.some(theme => theme.name === selected)) runtime.setTheme(selected)
      else runtime.setTheme('nuxt-ui')
      cacheFirstPaint()
    }
    catch { /* Browsing the docs remains available without local storage. */ }
    finally {
      syncing = false
      // Let Nuxt's reactive head styles catch up before releasing the first-paint bridge.
      nextTick(() => requestAnimationFrame(() => document.getElementById('id-theme-first-paint')?.remove()))
    }
  }
  function cacheFirstPaint() {
    const active = localStorage.getItem(activeKey)
    if (active === 'catalog:nuxt-ui') {
      localStorage.removeItem(firstPaintKey)
      return
    }
    const theme = runtime.currentTheme.value
    if (!active || !theme) return
    localStorage.setItem(firstPaintKey, JSON.stringify(createFirstPaintTheme(active, source.value.brand, theme, config.firstPaintRevision)))
  }
  watch(runtime.selectedName, (name) => {
    if (syncing || route.path.startsWith('/studio')) return
    try {
      const session = sessions.value.find(item => themeName(item) === name)
      localStorage.setItem(activeKey, session?.id || (name === 'nuxt-ui' ? 'catalog:nuxt-ui' : 'catalog:brand:' + name))
      cacheFirstPaint()
    }
    catch { /* Theme selection still works for this page. */ }
  }, { flush: 'sync' })
  onNuxtReady(sync)
  watch(() => route.path, () => nextTick(sync))
  window.addEventListener('storage', sync)
  window.addEventListener('id-studio-projects-changed', sync)
  if (import.meta.hot) import.meta.hot.dispose(() => {
    window.removeEventListener('storage', sync)
    window.removeEventListener('id-studio-projects-changed', sync)
  })
  function edit(change: (document: StudioDocument) => void, copyName?: string) {
    const existing = copyName ? undefined : selectedSession.value
    const preset = runtime.selectedName.value === 'nuxt-ui' || runtime.selectedName.value.startsWith('nuxt-ui-')
    const draft = parseStudioDocument(JSON.parse(JSON.stringify(source.value)))
    if (!existing && preset) draft.theme.label += ' (custom)'
    if (copyName) draft.theme.label = copyName
    change(draft)
    const session: StudioSession = {
      ...existing,
      id: existing?.id || crypto.randomUUID(),
      baseline: existing?.baseline || parseStudioDocument(JSON.parse(JSON.stringify(source.value))),
      draft: parseStudioDocument(draft),
      updatedAt: Date.now(),
      catalogKey: existing ? existing.catalogKey : (!preset && !copyName ? scope + '::brand:' + runtime.selectedName.value : undefined),
    }
    saveProject(session)
    localStorage.setItem(activeKey, session.id)
    sync()
  }
  function create(name: string) {
    const label = name.trim()
    if (!label || label.length > 80) throw new Error('Use a name between 1 and 80 characters.')
    if (runtime.themes.value.some(theme => theme.label.toLocaleLowerCase() === label.toLocaleLowerCase())) throw new Error('A theme with this name already exists.')
    edit(() => {}, label)
  }
  return { provide: { docsBrandEditor: { document: source, baseline, edit, create } } }
})
