import { watch, type Ref } from 'vue'

type Mode = 'light' | 'dark' | 'system'

export function syncPreviewMode(mode: Ref<'light' | 'dark'>, colorMode: { value: string, unknown: boolean }) {
  return watch([mode, () => colorMode.unknown], ([value, unknown]) => {
    if (!unknown) colorMode.value = value
  }, { immediate: true, flush: 'sync' })
}

export function syncStudioMode(preference: Ref<Mode>, colorMode: { preference: string, unknown: boolean }, override?: Mode) {
  let initialized = false
  return watch([preference, () => colorMode.unknown], ([, unknown]) => {
    if (unknown) return
    if (!initialized) {
      initialized = true
      // The SSR default must not overwrite a preference restored at app:mounted.
      const restored = colorMode.preference
      preference.value = override ?? (restored === 'light' || restored === 'dark' || restored === 'system' ? restored : preference.value)
    }
    colorMode.preference = preference.value
  }, { immediate: true, flush: 'sync' })
}
