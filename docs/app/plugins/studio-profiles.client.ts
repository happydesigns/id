import { computed, nextTick, ref, watch } from 'vue'
import { useBrandTheme } from '../../../app/composables/useBrandTheme'
import { cssVariablesAdapter } from '../../../src/adapters/css-variables'
import { projectPrefix } from '../../../studio/app/composables/useStudioProjects'
import { parseStudioSession, type StudioSession } from '../../../studio/editor'
import type { StudioHostConfig } from '../../../src/studio-host'

export default defineNuxtPlugin(() => {
  if (window.parent !== window) return
  const config = useAppConfig().idStudio as StudioHostConfig
  const seed = config.document
  if (!seed) return
  const scope = seed.brand.packageName || seed.brand.name
  const activeKey = 'id-studio:1:' + scope + ':active'
  const runtime = useBrandTheme()
  const route = useRoute()
  const sessions = ref<StudioSession[]>([])
  let syncing = false
  const themeName = (session: StudioSession) => session.catalogKey?.startsWith(scope + '::brand:')
    ? session.catalogKey.slice((scope + '::brand:').length)
    : 'studio-' + Array.from(session.id, character => character.charCodeAt(0).toString(16)).join('')
  useHead({ style: [{ key: 'id-docs-profile', textContent: computed(() => {
    const session = sessions.value.find(item => themeName(item) === runtime.selectedName.value)
    return session ? cssVariablesAdapter.transform(session.draft.brand, { prefix: '', includeRoles: false, selector: ':root:root' }).css : ''
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
    }
    catch { /* Browsing the docs remains available without local storage. */ }
    finally { syncing = false }
  }
  watch(runtime.selectedName, (name) => {
    if (syncing || route.path.startsWith('/studio')) return
    try {
      const session = sessions.value.find(item => themeName(item) === name)
      localStorage.setItem(activeKey, session?.id || (name === 'nuxt-ui' ? 'catalog:nuxt-ui' : 'catalog:brand:' + name))
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
})
