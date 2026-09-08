<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createBlankStudioDocument, createStudioArchive, createStudioProject, diffStudioDocuments, parseStudioDocument, studioRoles, studioScenes, studioBuiltinPalettes } from '../../src/studio'
import type { StudioDocument, StudioScene } from '../../src/studio'

const route = useRoute()
const config = useAppConfig() as unknown as { idStudio?: { document?: StudioDocument, sourcePath?: string, home?: string } }
const seed = config.idStudio?.document ? parseStudioDocument(config.idStudio.document) : createBlankStudioDocument()
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value))
const baseline = ref(clone(seed))
const draft = ref(clone(seed))
const scene = ref<StudioScene>(studioScenes.includes(route.query.view as StudioScene) ? route.query.view as StudioScene : 'components')
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
  frame?.contentWindow?.postMessage({ type: 'id-studio-preview', document: clone(doc), scene: scene.value, mode: mode.value, state: state.value }, window.location.origin)
}
function refresh() { send(originalFrame.value, baseline.value); send(draftFrame.value, draft.value) }
function ready(event: MessageEvent) {
  if (event.origin !== window.location.origin || event.data?.type !== 'id-studio-ready') return
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
    notice.value = 'Project exported. Your source remains unchanged until you apply the reviewed files.'
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
watch([draft, baseline, scene, mode, state, compare], () => nextTick(refresh), { deep: true })
onBeforeUnmount(() => { window.removeEventListener('message', ready); window.removeEventListener('beforeunload', beforeUnload) })
</script>

<template>
  <main
    class="studio-shell"
    aria-label="Brand Studio"
  >
    <header class="studio-header">
      <a
        :href="config.idStudio?.home || '/'"
        class="studio-wordmark"
      >id<span class="studio-dot">.</span><span class="studio-product">Brand Studio</span></a>
      <div class="studio-actions">
        <button
          class="studio-button"
          @click="guard(() => replace(createBlankStudioDocument()))"
        >
          New brand
        </button><button
          class="studio-button"
          @click="input?.click()"
        >
          Open brand
        </button><button
          v-if="!editing"
          class="studio-button strong"
          @click="editing = true"
        >
          Customize brand
        </button><button
          v-else
          class="studio-button strong"
          @click="exportOpen = true"
        >
          Review & export <span aria-hidden="true">↗</span>
        </button>
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

    <div
      v-if="recovery"
      class="studio-notice"
      role="status"
    >
      <span>A local draft is available. Restoring it also restores its original comparison source.</span><button
        class="studio-button"
        @click="baseline = recovery.baseline; draft = recovery.draft; recovery = undefined; editing = true"
      >
        Restore draft
      </button><button
        class="studio-button"
        @click="recovery = undefined"
      >
        Dismiss
      </button>
    </div>
    <div
      v-if="error"
      class="studio-notice error"
      role="alert"
    >
      {{ error }}<button
        class="studio-button"
        @click="error = ''"
      >
        Dismiss
      </button>
    </div>
    <div
      v-if="notice"
      class="studio-notice"
      role="status"
    >
      {{ notice }}<button
        class="studio-button"
        @click="notice = ''"
      >
        Dismiss
      </button>
    </div>

    <section class="studio-titlebar">
      <div>
        <p class="studio-eyebrow">
          {{ editing ? 'Your identity, in context' : 'The brand in practice' }}
        </p><h1>
          {{ draft.theme.label }}
        </h1><p class="studio-subtitle">
          {{ editing ? 'Refine the details. See the whole picture.' : 'Explore the components and pages that bring this identity to life.' }}
        </p>
      </div>
      <div class="studio-status">
        <span class="studio-status-dot" />{{ dirty ? `${changes.length} changes in draft` : 'Original brand' }}<span class="studio-status-note">Nuxt UI</span>
      </div>
    </section>

    <div class="studio-toolbar">
      <div
        class="studio-segment"
        aria-label="Preview scene"
      >
        <button
          v-for="item in studioScenes"
          :key="item"
          :aria-pressed="scene === item"
          @click="scene = item"
        >
          {{ item === 'components' ? 'Components' : item === 'landing' ? 'Landing' : 'Docs' }}
        </button>
      </div>
      <div class="studio-toolbar-end">
        <label class="studio-check"><input
          v-model="compare"
          type="checkbox"
        >Compare original</label><label class="studio-check"><input
          v-model="mobile"
          type="checkbox"
        >Mobile</label><label class="studio-select-label">State<select
          v-model="state"
          aria-label="Preview state"
        ><option value="default">Default</option><option value="error">Validation error</option></select></label><div class="studio-segment">
          <button
            :aria-pressed="mode === 'light'"
            @click="mode = 'light'"
          >
            Light
          </button><button
            :aria-pressed="mode === 'dark'"
            @click="mode = 'dark'"
          >
            Dark
          </button>
        </div>
      </div>
    </div>

    <div
      class="studio-workspace"
      :class="{ 'studio-browsing': !editing }"
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
          </div><iframe
            ref="originalFrame"
            src="/studio/preview?frame=original"
            title="Original brand preview"
            :class="{ 'studio-mobile': mobile }"
            @load="send(originalFrame, baseline)"
          />
        </section>
        <section class="studio-frame-wrap">
          <div class="studio-frame-label">
            {{ editing ? 'Draft' : 'Preview' }}<span>{{ scene }} · {{ mode }}</span>
          </div><iframe
            ref="draftFrame"
            src="/studio/preview?frame=draft"
            title="Draft brand preview"
            :class="{ 'studio-mobile': mobile }"
            @load="send(draftFrame, draft)"
          />
        </section>
      </div>

      <aside
        v-if="editing"
        class="studio-inspector"
        aria-label="Brand settings"
      >
        <div class="studio-inspector-header">
          <span>Make it yours</span><div class="studio-actions">
            <button
              class="studio-icon-button"
              :disabled="!history.length"
              aria-label="Undo change"
              @click="undo"
            >
              ↶
            </button><button
              class="studio-icon-button"
              :disabled="!future.length"
              aria-label="Redo change"
              @click="redo"
            >
              ↷
            </button><button
              class="studio-button small"
              :disabled="!dirty"
              @click="reset"
            >
              Reset
            </button>
          </div>
        </div>
        <nav
          class="studio-panel-tabs"
          aria-label="Settings section"
        >
          <button
            v-for="item in ['identity', 'colors', 'type', 'details']"
            :key="item"
            :aria-pressed="panel === item"
            @click="panel = item"
          >
            {{ item }}
          </button>
        </nav>
        <div class="studio-fields">
          <template v-if="panel === 'identity'">
            <p class="studio-help">
              The name, words and assets that make this brand yours.
            </p>
            <label>Brand name<input
              :value="draft.theme.label"
              @change="edit(doc => { doc.theme.label = value($event) })"
            ><small>{{ origin('theme.label') }}</small></label>
            <label>Identifier<input
              :value="draft.brand.name"
              @change="edit(doc => { doc.brand.name = value($event); doc.theme.name = value($event) })"
            ><small>Lowercase letters, numbers and hyphens</small></label>
            <label>Package name<input
              :value="draft.brand.packageName"
              placeholder="@example/brand"
              @change="edit(doc => { doc.brand.packageName = value($event) })"
            ></label>
            <label>Brand statement<textarea
              :value="draft.brand.claim"
              rows="3"
              @change="edit(doc => { doc.brand.claim = value($event) })"
            /></label>
            <label class="studio-upload">Wordmark or logo<input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              @change="addLogo"
            ><small>PNG, JPEG or WebP · up to 2 MB · stored in your document</small></label>
            <div
              v-if="draft.brand.assets?.logos"
              class="studio-assets"
            >
              <div
                v-for="(asset, role) in draft.brand.assets.logos"
                :key="role"
              >
                <span>{{ role }}</span><small>{{ asset?.name }}</small>
              </div>
            </div>
            <p class="studio-help">
              Other existing asset roles are preserved. Fonts and custom Vue components remain part of their owning project.
            </p>
          </template>

          <template v-if="panel === 'colors'">
            <p class="studio-help">
              Map your palettes to Nuxt UI roles. Named brand colors stay intact.
            </p>
            <label
              v-for="role in studioRoles"
              :key="role"
            >{{ role }}<select
              :value="draft.theme.ui?.colors?.[role] || ''"
              @change="edit(doc => { doc.theme.ui ??= {}; doc.theme.ui.colors ??= {}; if (value($event)) doc.theme.ui.colors[role] = value($event); else delete doc.theme.ui.colors[role] })"
            ><option value="">Nuxt UI default</option><option
              v-for="palette in paletteOptions"
              :key="palette"
            >{{ palette }}</option></select><small>{{ origin(`theme.ui.colors.${role}`) }}</small></label>
            <h2>
              Brand palettes
            </h2>
            <details
              v-for="(palette, name) in draft.brand.colors"
              :key="name"
              class="studio-palette"
            >
              <summary>
                {{ name }}<span class="studio-swatches"><i
                  v-for="(color, shade) in typeof palette === 'string' ? { base: palette } : palette"
                  :key="shade"
                  :style="{ backgroundColor: color }"
                /></span>
              </summary><label
                v-for="(color, shade) in typeof palette === 'string' ? { base: palette } : palette"
                :key="shade"
              >{{ shade }}<input
                :value="color"
                :aria-label="`${name} ${shade}`"
                @change="edit(doc => { if (typeof doc.brand.colors[name] === 'string') doc.brand.colors[name] = value($event); else (doc.brand.colors[name] as Record<string, string>)[shade] = value($event) })"
              ></label>
            </details>
            <label>New palette name<input v-model="newColorName"></label><button
              class="studio-button"
              @click="edit(doc => { if (!/^[a-z][a-z0-9-]*$/.test(newColorName) || doc.brand.colors[newColorName]) throw new Error('Choose a new lowercase palette name.'); doc.brand.colors[newColorName] = { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554' } })"
            >
              Add palette
            </button>
            <a
              href="https://ui.nuxt.com/theme"
              target="_blank"
              rel="noopener noreferrer"
              class="studio-help"
            >Explore advanced palette curves in Nuxt UI ↗</a>
          </template>

          <template v-if="panel === 'type'">
            <p class="studio-help">
              Use fonts available in your project, or a system stack. Selecting a name does not download a font.
            </p>
            <label
              v-for="role in ['sans', 'mono', 'display']"
              :key="role"
            >{{ role }}<input
              :value="draft.theme.typography?.[role] || draft.brand.typography?.[role] || ''"
              placeholder="system-ui, sans-serif"
              @change="font(role, value($event))"
            ><small>{{ origin(`brand.typography.${role}`) }}</small></label>
            <button
              class="studio-button"
              @click="font('sans', 'system-ui, sans-serif')"
            >
              Use system sans
            </button><button
              class="studio-button"
              @click="font('sans', 'Georgia, serif')"
            >
              Use editorial serif
            </button>
          </template>

          <template v-if="panel === 'details'">
            <p class="studio-help">
              Surface values apply to {{ mode }} mode. Empty fields inherit the framework. Other overrides are preserved.
            </p>
            <label
              v-for="entry in [{ name: '--ui-radius', label: 'Corner radius', placeholder: '0.25rem' }, { name: '--ui-bg', label: 'Page background', placeholder: 'var(--ui-bg)' }, { name: '--ui-bg-elevated', label: 'Raised surface', placeholder: 'Framework default' }, { name: '--ui-text', label: 'Body text', placeholder: 'Framework default' }, { name: '--ui-border', label: 'Borders', placeholder: 'Framework default' }]"
              :key="entry.name"
            >{{ entry.label }}<input
              :value="draft.theme.cssVariables?.[mode]?.[entry.name] || ''"
              :placeholder="entry.placeholder"
              @change="token(entry.name, value($event))"
            ><small>{{ origin(`theme.cssVariables.${mode}.${entry.name}`) }}</small></label>
            <label>Button style<select
              :value="componentVariant('button')"
              @change="defaultVariant('button', value($event))"
            ><option value="">Nuxt UI default</option><option
              v-for="variant in ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link']"
              :key="variant"
            >{{ variant }}</option></select></label>
            <p
              v-if="customComponents.length"
              class="studio-help"
            >
              {{ customComponents.length }} component configurations are preserved. Custom slot and compound-variant rules can override these controls. Review the result in the preview.
            </p>
            <details>
              <summary>
                Preserved component configuration
              </summary><pre class="studio-code">{{ JSON.stringify(draft.theme.ui, null, 2) }}</pre>
            </details>
          </template>
        </div>
        <div class="studio-inspector-footer">
          Drafts stay in this browser. Export to update your source.
        </div>
      </aside>
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
      v-model:open="exportOpen"
      title="Review & export"
      description="Your original project is never overwritten by the browser."
      :ui="{ content: 'max-w-4xl' }"
    >
      <template #body>
        <p class="mb-4 text-sm text-muted">
          {{ changes.length }} changes. For an existing project, replace <code>{{ sourcePath }}</code> with the reviewed source and run its normal generation checks. A new project archive includes the Nuxt layer and a Studio playground.
        </p><div class="studio-segment mb-4">
          <button
            v-for="item in ['source', 'changes', 'css']"
            :key="item"
            :aria-pressed="exportTab === item"
            @click="exportTab = item"
          >
            {{ item }}
          </button>
        </div><pre class="studio-export-code">{{ output }}</pre><p class="mt-4 text-sm text-muted">
          The preview uses compiled Nuxt UI components. Existing custom classes, fonts and brand primitives must also be available in the consuming project.
        </p><p
          v-if="error"
          role="alert"
          class="mt-4 text-sm text-error"
        >
          {{ error }}
        </p>
      </template>
      <template #footer>
        <UButton @click="download('brand.studio.json', JSON.stringify(draft, null, 2) + '\n')">
          Download source
        </UButton><UButton
          color="neutral"
          variant="outline"
          :loading="busy"
          @click="exportProject"
        >
          Download new project
        </UButton><UButton
          color="neutral"
          variant="ghost"
          @click="exportOpen = false"
        >
          Keep editing
        </UButton>
      </template>
    </UModal>
  </main>
</template>

<style scoped>
.studio-shell { min-height: 100dvh; background: var(--ui-bg); color: var(--ui-text); font-family: var(--font-sans); }
.studio-header { min-height: 76px; border-bottom: 1px solid var(--ui-border); display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 16px 28px; }
.studio-wordmark { display: flex; align-items: baseline; font-size: 30px; font-weight: 750; letter-spacing: -.06em; color: var(--ui-text-highlighted); }
.studio-dot { color: var(--ui-primary); }.studio-product { margin-left: 18px; font-size: 14px; font-weight: 500; letter-spacing: -.01em; }
.studio-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }.studio-button { cursor: pointer; border: 1px solid var(--ui-border); border-radius: 8px; padding: 8px 12px; font-size: 12px; font-weight: 550; background: var(--ui-bg); color: var(--ui-text-highlighted); }.studio-button:hover { background: var(--ui-bg-muted); }.studio-button.strong { background: var(--ui-bg-inverted); color: var(--ui-text-inverted); border-color: transparent; }.studio-button.small { padding: 5px 8px; font-size: 11px; }button:disabled { opacity: .4; cursor: not-allowed; }button:focus-visible, a:focus-visible, summary:focus-visible { outline: 2px solid var(--ui-primary); outline-offset: 3px; }
.studio-titlebar { display: flex; justify-content: space-between; align-items: end; gap: 20px; padding: 32px 28px 28px; }.studio-eyebrow { text-transform: uppercase; letter-spacing: .13em; font-size: 10px; font-weight: 600; color: var(--ui-text-muted); margin-bottom: 10px; }h1 { font-size: 30px; line-height: 1.15; font-weight: 600; letter-spacing: -.035em; color: var(--ui-text-highlighted); }.studio-subtitle { margin-top: 8px; font-size: 13px; color: var(--ui-text-muted); }.studio-status { display: flex; align-items: center; gap: 7px; font-size: 11px; white-space: nowrap; }.studio-status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ui-primary); }.studio-status-note { margin-left: 8px; padding-left: 14px; border-left: 1px solid var(--ui-border); color: var(--ui-text-muted); }
.studio-toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; padding: 0 28px 18px; }.studio-toolbar-end { display: flex; gap: 18px; align-items: center; flex-wrap: wrap; }.studio-segment { display: flex; gap: 3px; padding: 3px; border: 1px solid var(--ui-border); border-radius: 9px; background: var(--ui-bg-muted); }.studio-segment button { cursor: pointer; padding: 6px 12px; border-radius: 6px; font-size: 12px; color: var(--ui-text-muted); text-transform: capitalize; }.studio-segment button[aria-pressed=true] { background: var(--ui-bg); color: var(--ui-text-highlighted); box-shadow: 0 1px 3px #0000000a; }.studio-check { display: flex; gap: 7px; align-items: center; font-size: 11px; }.studio-check input { accent-color: var(--ui-primary); }.studio-select-label { display: flex; align-items: center; gap: 6px; font-size: 11px; }.studio-select-label select { max-width: 140px; background: var(--ui-bg); }
.studio-workspace { display: grid; grid-template-columns: minmax(0, 1fr) 290px; border-top: 1px solid var(--ui-border); min-height: 650px; }.studio-browsing { grid-template-columns: minmax(0, 1fr); }.studio-canvas { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; align-items: start; padding: 24px; background: var(--ui-bg-muted); min-width: 0; }.studio-comparing { grid-template-columns: repeat(2, minmax(0, 1fr)); }.studio-frame-wrap { min-width: 0; display: flex; flex-direction: column; align-items: center; }.studio-frame-label { display: flex; justify-content: space-between; align-self: stretch; margin-bottom: 9px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; }.studio-frame-label span { font-weight: 400; text-transform: capitalize; color: var(--ui-text-muted); letter-spacing: 0; }iframe { display: block; width: 100%; height: max(650px, calc(100dvh - 290px)); border: 1px solid var(--ui-border); border-radius: 12px; background: var(--ui-bg); box-shadow: 0 8px 30px #00000005; }iframe.studio-mobile { max-width: 390px; }
.studio-inspector { border-left: 1px solid var(--ui-border); min-width: 0; }.studio-inspector-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 18px 16px; font-size: 12px; font-weight: 600; }.studio-icon-button { font-size: 20px; cursor: pointer; }.studio-panel-tabs { display: flex; border-top: 1px solid var(--ui-border); border-bottom: 1px solid var(--ui-border); padding: 0 12px; }.studio-panel-tabs button { padding: 12px 8px; font-size: 11px; text-transform: capitalize; cursor: pointer; border-bottom: 2px solid transparent; color: var(--ui-text-muted); }.studio-panel-tabs button[aria-pressed=true] { color: var(--ui-text-highlighted); border-bottom-color: var(--ui-primary); }.studio-fields { padding: 20px 18px; display: flex; flex-direction: column; gap: 18px; max-height: 650px; overflow-y: auto; }.studio-fields label { display: flex; flex-direction: column; gap: 7px; font-size: 11px; font-weight: 600; text-transform: capitalize; }.studio-fields input, .studio-fields select, .studio-fields textarea { width: 100%; min-width: 0; border: 1px solid var(--ui-border); padding: 8px 10px; border-radius: 6px; background: var(--ui-bg); color: var(--ui-text-highlighted); font-size: 12px; font-weight: 400; text-transform: none; }.studio-fields input:focus, .studio-fields select:focus, .studio-fields textarea:focus { outline: 2px solid var(--ui-primary); outline-offset: 1px; }.studio-fields small, .studio-help { font-size: 11px; line-height: 1.65; color: var(--ui-text-muted); font-weight: 400; text-transform: none; }.studio-fields h2 { font-size: 12px; font-weight: 600; margin-top: 8px; }.studio-inspector-footer { border-top: 1px solid var(--ui-border); padding: 15px 18px; font-size: 10px; color: var(--ui-text-muted); line-height: 1.6; }.studio-palette summary { cursor: pointer; font-size: 12px; padding: 8px 0; }.studio-swatches { display: flex; margin-top: 8px; border-radius: 5px; overflow: hidden; }.studio-swatches i { flex: 1; height: 18px; }.studio-palette label { margin: 10px 0; }.studio-assets { display: flex; flex-direction: column; gap: 8px; }.studio-assets div { display: flex; flex-direction: column; gap: 3px; font-size: 11px; }.studio-code { font-size: 10px; overflow: auto; max-height: 280px; margin-top: 12px; }.studio-notice { padding: 12px 28px; display: flex; align-items: center; flex-wrap: wrap; gap: 12px; font-size: 12px; background: var(--ui-bg-elevated); border-bottom: 1px solid var(--ui-border); }.studio-notice.error { color: var(--ui-error); }.studio-export-code { max-height: 45vh; overflow: auto; padding: 20px; border-radius: 8px; background: var(--ui-bg-muted); border: 1px solid var(--ui-border); font-size: 11px; }
@media (max-width: 1000px) { .studio-comparing { grid-template-columns: minmax(0, 1fr); }.studio-workspace { grid-template-columns: minmax(0, 1fr) 260px; }.studio-browsing { grid-template-columns: minmax(0, 1fr); }.studio-status { display: none; } }
@media (max-width: 700px) { .studio-header { padding: 14px 16px; flex-wrap: wrap; }.studio-titlebar { padding: 24px 16px; }.studio-toolbar { padding: 0 16px 16px; }.studio-workspace { display: flex; flex-direction: column; }.studio-inspector { order: -1; border-left: 0; border-bottom: 1px solid var(--ui-border); }.studio-fields { max-height: 260px; }.studio-canvas { padding: 16px; }.studio-inspector-footer { display: none; }h1 { font-size: 26px; }.studio-toolbar-end { gap: 12px; }.studio-product { margin-left: 12px; } }
</style>
