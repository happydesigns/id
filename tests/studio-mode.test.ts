import { expect, it } from 'vitest'
import { reactive, ref } from 'vue'
import { syncPreviewMode, syncStudioMode } from '../studio/mode'

it('applies a frame mode after hydration without changing the saved host preference', () => {
  const colorMode = reactive({ value: 'light', preference: 'system', unknown: true })
  const mode = ref<'light' | 'dark'>('dark')
  const stop = syncPreviewMode(mode, colorMode)
  expect(colorMode.value).toBe('light')
  colorMode.unknown = false
  expect(colorMode.value).toBe('dark')
  mode.value = 'light'
  expect(colorMode.value).toBe('light')
  expect(colorMode.preference).toBe('system')
  stop()
})

for (const saved of ['light', 'dark'] as const) it(`retains saved ${saved} when Color Mode resolves after Studio mounts`, () => {
  const colorMode = reactive({ preference: 'system', unknown: true })
  const preference = ref<'light' | 'dark' | 'system'>('system')
  const stop = syncStudioMode(preference, colorMode)
  // Nuxt Color Mode restores the browser preference in app:mounted.
  colorMode.preference = saved
  colorMode.unknown = false
  expect(preference.value).toBe(saved)
  expect(colorMode.preference).toBe(saved)
  preference.value = saved === 'light' ? 'dark' : 'light'
  expect(colorMode.preference).toBe(preference.value)
  stop()
})

it('keeps an explicit URL mode ahead of the restored browser preference', () => {
  const colorMode = reactive({ preference: 'system', unknown: true })
  const preference = ref<'light' | 'dark' | 'system'>('light')
  const stop = syncStudioMode(preference, colorMode, 'light')
  colorMode.preference = 'dark'
  colorMode.unknown = false
  expect(preference.value).toBe('light')
  expect(colorMode.preference).toBe('light')
  stop()
})

it('preserves an explicit system mode and supports an already resolved host', () => {
  const colorMode = reactive({ preference: 'dark', unknown: false })
  const preference = ref<'light' | 'dark' | 'system'>('system')
  const stop = syncStudioMode(preference, colorMode, 'system')
  expect(colorMode.preference).toBe('system')
  preference.value = 'light'
  expect(colorMode.preference).toBe('light')
  stop()
})
