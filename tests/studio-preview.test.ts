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

it('preserves explicit app overrides even when they equal the original brand', () => {
  const seed = { button: { defaultVariants: { variant: 'outline', size: 'md' } }, icons: { close: 'i-lucide-x' } }
  const appUi = { button: { defaultVariants: { variant: 'outline' } }, icons: { close: 'i-lucide-x' } }
  const config: PreviewAppConfig = { ui: structuredClone(seed) }
  const apply = createPreviewBrand(config, seed, appUi)
  const draft = createBlankStudioDocument()
  draft.theme.ui = { button: { defaultVariants: { variant: 'solid', size: 'lg' } }, icons: { close: 'i-lucide-check' } }
  apply(draft)
  expect(config.ui.button).toEqual({ defaultVariants: { variant: 'outline', size: 'lg' } })
  expect(config.ui.icons).toEqual({ close: 'i-lucide-x' })
  apply(createBlankStudioDocument())
  expect(config.ui.button).toEqual({ defaultVariants: { variant: 'outline' } })
  expect(appUi.button.defaultVariants.variant).toBe('outline')
  expect(seed.button.defaultVariants.size).toBe('md')
})
