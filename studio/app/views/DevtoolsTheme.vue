<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { useDevtoolsClient } from '@nuxt/devtools-kit/iframe-client'
import StudioThemeEditor from '../components/StudioThemeEditor.vue'
import { useStudioHistory } from '../composables/useStudioHistory'
import { createBlankStudioDocument, parseStudioDocument, type StudioDocument } from '../../../src/studio-document'
import type { DevtoolsThemeSession, ThemeMode } from '../../devtools'

definePageMeta({ layout: false, header: false, footer: false })
const client = useDevtoolsClient()
const session = shallowRef<DevtoolsThemeSession>()
const draft = ref(createBlankStudioDocument())
const baseline = ref(createBlankStudioDocument())
const category = ref<'colors' | 'type' | 'icons' | 'styles'>('colors')
const preference = ref<ThemeMode>('system')
const errors = ref<Record<string, string>>({})
const notice = ref('')
const { history, future, record, undo, redo, clear } = useStudioHistory(draft)
const categories = [{ label: 'Colors', value: 'colors' }, { label: 'Typography', value: 'type' }, { label: 'Icons', value: 'icons' }, { label: 'Styles', value: 'styles' }]
const modes = [{ label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }, { label: 'System', value: 'system' }]
const mode = computed(() => preference.value === 'system' ? (client.value?.host.app.colorMode.value === 'dark' ? 'dark' : 'light') : preference.value)
let stopConnection: (() => void) | undefined
onMounted(() => {
  stopConnection = watch(client, (value) => {
    const connect = value?.host.nuxt.$idDevtoolsTheme as (() => DevtoolsThemeSession) | undefined
    const target = connect?.()
    if (!target || session.value === target) return
    session.value = target
    baseline.value = parseStudioDocument(target.baseline)
    draft.value = target.current()
    preference.value = target.mode()
    clear()
  }, { immediate: true })
})
onBeforeUnmount(() => stopConnection?.())
function invalid(message: string, field = 'general') {
  errors.value = { [field]: message }
}
function change(input: StudioDocument, field = 'general') {
  try {
    if (!session.value) throw new Error('Open Brand theme from the application DevTools.')
    const next = parseStudioDocument(input)
    if (JSON.stringify(next) === JSON.stringify(draft.value)) return true
    session.value.apply(next)
    record()
    draft.value = next
    errors.value = {}
    return true
  }
  catch (error) {
    invalid(error instanceof Error ? error.message : 'Could not apply theme.', field)
    return false
  }
}
function travel(direction: 'undo' | 'redo') {
  if (direction === 'undo') undo()
  else redo()
  session.value?.apply(draft.value)
}
function reset() {
  session.value?.reset()
  draft.value = parseStudioDocument(baseline.value)
  preference.value = session.value?.mode() ?? 'system'
  clear()
  errors.value = {}
}
async function exportDocument() {
  const { download } = await import('../../export')
  download('brand.studio.json', JSON.stringify(draft.value, null, 2))
}
function setMode(value: string | number | undefined) {
  if (value !== 'light' && value !== 'dark' && value !== 'system') return
  preference.value = value
  session.value?.mode(value)
}
async function exportFiles() {
  try {
    const [{ createStudioRuntimeFiles }, { createStudioArchive }, { download }] = await Promise.all([import('../../../src/studio-generation'), import('../../../src/studio-archive'), import('../../export')])
    download('brand-runtime.zip', createStudioArchive(createStudioRuntimeFiles(draft.value)), 'application/zip')
  }
  catch (error) {
    invalid(error instanceof Error ? error.message : 'Could not export theme.')
  }
}
</script>

<template>
  <UApp>
    <main class="fixed inset-0 overflow-y-auto bg-default p-4 space-y-4">
      <h1 class="text-lg font-semibold">
        Brand theme
      </h1>
      <p class="text-sm text-muted">
        Preview changes in your running application. Reset restores its original appearance.
      </p>
      <UAlert
        v-if="!session"
        title="Waiting for Nuxt DevTools"
        description="Open Brand theme from your application's DevTools."
      />
      <template v-else>
        <div class="flex flex-wrap gap-2">
          <UButton
            label="Undo"
            color="neutral"
            variant="outline"
            :disabled="!history.length"
            @click="travel('undo')"
          />
          <UButton
            label="Redo"
            color="neutral"
            variant="outline"
            :disabled="!future.length"
            @click="travel('redo')"
          />
          <UButton
            label="Reset preview"
            color="neutral"
            variant="outline"
            @click="reset"
          />
          <UButton
            label="Export native files"
            color="neutral"
            variant="outline"
            @click="exportFiles"
          />
          <UButton
            label="Export brand JSON"
            color="neutral"
            variant="outline"
            @click="exportDocument"
          />
        </div>
        <UFieldGroup aria-label="Color mode">
          <UButton
            v-for="item in modes"
            :key="item.value"
            :label="item.label"
            color="neutral"
            :variant="preference === item.value ? 'solid' : 'outline'"
            :aria-pressed="preference === item.value"
            @click="setMode(item.value)"
          />
        </UFieldGroup>
        <UTabs
          v-model="category"
          :items="categories"
          :content="false"
        />
        <UAlert
          v-if="Object.keys(errors).length"
          color="error"
          :title="Object.values(errors)[0]"
        />
        <p
          v-if="notice"
          role="status"
        >
          {{ notice }}
        </p>
        <StudioThemeEditor
          :document="draft"
          :baseline="baseline"
          :category="category"
          :mode="mode"
          :errors="errors"
          :change="change"
          @invalid="invalid"
          @notice="notice = $event"
        />
      </template>
    </main>
  </UApp>
</template>
