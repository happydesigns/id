import { expect, it } from 'vitest'
import { createDevtoolsThemeSession } from '../studio/devtools'
import { createBlankStudioDocument } from '../src/studio-document'
import type { PreviewAppConfig } from '../studio/preview'

it('leaves the app untouched until editing, validates drafts and restores original state', () => {
  const document = createBlankStudioDocument()
  const config: PreviewAppConfig = { ui: { colors: { primary: 'blue' } }, idStudio: { document }, header: { title: 'Original' } }
  const original = structuredClone(config)
  let css = ''
  let mode: 'light' | 'dark' | 'system' = 'system'
  const session = createDevtoolsThemeSession(config, (value) => {
    css = value
  }, (value) => {
    if (value) mode = value
    return mode
  })
  expect(config).toEqual(original)
  expect(css).toBe('')
  const next = session.current()
  next.theme.ui = { colors: { primary: 'violet' } }
  session.apply(next)
  expect(config.ui.colors).toMatchObject({ primary: 'blue' })
  expect(css).toContain('--ui-primary')
  expect(session.current()).toEqual(next)
  const currentConfig = structuredClone(config)
  expect(() => session.apply({ version: 99 })).toThrow()
  expect(config).toEqual(currentConfig)
  session.mode('dark')
  session.reset()
  expect(config).toEqual(original)
  expect(css).toBe('')
  expect(mode).toBe('system')
  expect(session.current()).toEqual(document)
})

it('edits an unconfigured Nuxt UI app and removes preview-only metadata on reset', () => {
  const config: PreviewAppConfig = { ui: { colors: { primary: 'blue' } } }
  const session = createDevtoolsThemeSession(config, () => {}, () => 'light')
  const next = session.current()
  next.theme.ui!.colors!.primary = 'amber'
  session.apply(next)
  expect(config.ui.colors).toMatchObject({ primary: 'amber' })
  expect(config.brand).toBeDefined()
  const detached = session.current()
  detached.theme.ui!.colors!.primary = 'red'
  expect(session.current().theme.ui!.colors!.primary).toBe('amber')
  session.reset()
  expect(config).toEqual({ ui: { colors: { primary: 'blue' } } })
})

it('keeps explicit app defaults when their values equal the original brand', () => {
  const document = createBlankStudioDocument()
  document.theme.ui = { button: { defaultVariants: { variant: 'outline', size: 'md' } } }
  const config: PreviewAppConfig = { ui: structuredClone(document.theme.ui) }
  const session = createDevtoolsThemeSession(config, () => {}, () => 'light', { document, appUi: { button: { defaultVariants: { variant: 'outline' } } } })
  const next = session.current()
  next.theme.ui = { button: { defaultVariants: { variant: 'solid', size: 'lg' } } }
  session.apply(next)
  expect(config.ui.button).toEqual({ defaultVariants: { variant: 'outline', size: 'lg' } })
  session.reset()
  expect(config.ui).toEqual(document.theme.ui)
})
