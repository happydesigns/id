import { expect, it } from 'vitest'
import { createBlankStudioDocument } from '../src/studio'
import { createPreviewBrand, type PreviewAppConfig } from '../studio/preview'

it('replaces successive drafts without losing app overrides or retaining previous assets', () => {
  const first = createBlankStudioDocument()
  first.theme.ui = { colors: { primary: 'violet' }, button: { defaultVariants: { size: 'lg' } } }
  first.brand.assets = { logos: { wordmark: { name: 'Logo', role: 'wordmark', src: '/violet.svg', alt: 'Violet' } } }
  const config: PreviewAppConfig = {
    ui: { colors: { primary: 'blue' }, button: { slots: { base: 'tracking-wide' } } },
    header: { title: 'App', logo: { class: 'h-6' } },
    idStudio: { document: first },
    id: { theme: first.theme, themes: [first.theme] },
  }
  const apply = createPreviewBrand(config, { colors: { primary: 'blue' } })
  apply(first)
  expect(config.header?.logo).toMatchObject({ light: '/violet.svg', class: 'h-6' })
  expect(config.ui.button).toMatchObject({ slots: { base: 'tracking-wide' }, defaultVariants: { size: 'lg' } })
  const next = createBlankStudioDocument()
  apply(next)
  expect(config.ui.button).toEqual({ slots: { base: 'tracking-wide' } })
  expect(config.header?.logo).toMatchObject({ light: '', dark: '', class: 'h-6' })
  expect(config.brand?.assets).toBeUndefined()
  expect(config.id?.themes).toEqual([])
  expect(config.id?.theme).toEqual(next.theme)
  expect(config.idStudio?.document).toEqual(next)
  apply(first)
  expect(config.ui.button).toMatchObject({ slots: { base: 'tracking-wide' }, defaultVariants: { size: 'lg' } })
})

it('does not install optional Guide or identity configuration in a native app', () => {
  const config: PreviewAppConfig = { ui: {} }
  createPreviewBrand(config)(createBlankStudioDocument())
  expect(config).not.toHaveProperty('header')
  expect(config).not.toHaveProperty('id')
  expect(config).not.toHaveProperty('idStudio')
})
