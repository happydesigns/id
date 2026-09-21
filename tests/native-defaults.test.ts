import { describe, expect, it } from 'vitest'
import { nuxtUiBrandTheme } from '../themes/nuxt-ui'
import { createNuxtUiAppConfig } from '../src'

describe('native baseline defaults', () => {
  it('does not override specialized Nuxt UI button defaults', () => {
    expect(createNuxtUiAppConfig(nuxtUiBrandTheme).ui).not.toHaveProperty('button')
  })
  it('resolves neutral roles through the selected palette in both modes', () => {
    for (const mode of ['light', 'dark'] as const) {
      const roles = nuxtUiBrandTheme.cssVariables?.[mode] ?? {}
      expect(roles['--ui-bg-muted']).toMatch(/^var\(--ui-color-neutral-/)
      expect(roles['--ui-border']).toMatch(/^var\(--ui-color-neutral-/)
      expect(Object.values(roles).some(value => /^#[0-9a-f]+$/i.test(value))).toBe(false)
    }
  })
})
